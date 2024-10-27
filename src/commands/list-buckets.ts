import { ListBucketsCommand, ListBucketsCommandOutput } from "@aws-sdk/client-s3";
import { InMemoryS3 } from "..";

export interface ListBucket {
  send(command: ListBucketsCommand): Promise<ListBucketsCommandOutput>
}

export async function listBuckets(client: InMemoryS3, command: ListBucketsCommand): Promise<ListBucketsCommandOutput> {
  return {
    Buckets: client.files.map((f) => f.bucket).filter((v, i, s) => s.indexOf(v) === i).filter(Boolean).map((name) => ({
      Name: name,
    }))
  } as ListBucketsCommandOutput
}