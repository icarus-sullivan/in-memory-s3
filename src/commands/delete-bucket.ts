import { DeleteBucketCommand, DeleteBucketCommandOutput, S3ServiceException } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from "path";
import { InMemoryS3 } from "..";

export async function deleteBucket(client: InMemoryS3, { input }: DeleteBucketCommand): Promise<DeleteBucketCommandOutput> {
  let pre = client.files.length
  client.files = client.files.filter((file) => file.bucket !== input.Bucket)
  
  if (client.files?.length === pre) {
    throw new S3ServiceException({
      name: 'MissingBucket',
      $fault: 'client',
      $metadata: {},
      message: 'Bucket does not exist'
    })
  }

  // @TODO - if using disk, check if directory exists, if not throw same error as above

  if (client.diskDirectory && input.Bucket) {
    fs.rmSync(path.resolve(client.diskDirectory, input.Bucket), { recursive: true, force: true });
  }

  return {
    $metadata: {}
  }
}