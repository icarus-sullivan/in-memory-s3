

import { DeleteBucketCommand, DeleteBucketCommandOutput, GetObjectCommand, GetObjectCommandOutput, HeadObjectCommand, HeadObjectCommandOutput, ListBucketsCommand, ListBucketsCommandOutput, PutObjectCommand, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { deleteBucket } from "./commands/delete-bucket";
import { getObject } from './commands/get-object';
import { headObject } from './commands/head-object';
import { ListBucket, listBuckets } from "./commands/list-buckets";
import { putObject } from "./commands/put-object";
import { File, FileOptions } from "./file";

export interface InMemoryS3Options {
  diskDirectory?: string
  seed?: {
    files: FileOptions[]
  }
}

export class InMemoryS3 implements ListBucket {
  diskDirectory?: string
  files: File[] = []

  constructor(options?: InMemoryS3Options) {
    if (options?.diskDirectory) {
      this.diskDirectory = path.resolve(process.cwd(), options.diskDirectory)
      fs.mkdirSync(this.diskDirectory, { recursive: true })
    }

    if (options?.seed) {
      for (const fileOption of options.seed.files) {
        this.files.push(new File(fileOption, this.diskDirectory))
      }
    }
  }

  send(command: ListBucketsCommand): Promise<ListBucketsCommandOutput>;
  send(command: GetObjectCommand): Promise<GetObjectCommandOutput>;
  send(command: PutObjectCommand): Promise<PutObjectCommandOutput>;
  send(command: HeadObjectCommand): Promise<HeadObjectCommandOutput>;
  send(command: DeleteBucketCommand): Promise<DeleteBucketCommandOutput>;

  async send(command: any): Promise<any> {
    if (command instanceof ListBucketsCommand) {
      return listBuckets(this, command)
    }
    if (command instanceof DeleteBucketCommand) {
      return deleteBucket(this, command)
    }
    if (command instanceof PutObjectCommand) {
      return putObject(this, command)
    }
    if (command instanceof HeadObjectCommand) {
      return headObject(this, command)
    }
    if (command instanceof GetObjectCommand) {
      return getObject(this, command)
    }
    return undefined
  }

}