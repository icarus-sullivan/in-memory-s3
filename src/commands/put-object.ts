import { PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import { InMemoryS3 } from "..";
import { File } from "../file";

export async function putObject(client: InMemoryS3, { input }: PutObjectCommand): Promise<PutObjectCommandOutput> {
  const file = new File({
    Key: input.Key,
    Bucket: input.Bucket,
    Body: input.Body as any,
    ContentType: input.ContentType,
    Metadata: input.Metadata,
    Expires: input.Expires,
  }, client.diskDirectory)

  client.files.push(file)
  return {
    Expiration: file.expires?.toISOString() ?? undefined,
    ETag: file.eTag,
    VersionId: file.versionId,
  } as PutObjectCommandOutput
}