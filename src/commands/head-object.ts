import { HeadObjectCommand, HeadObjectCommandOutput, NotFound } from "@aws-sdk/client-s3";
import { InMemoryS3 } from "..";

export async function headObject(client: InMemoryS3, { input }: HeadObjectCommand): Promise<HeadObjectCommandOutput> {
  const file = client.files.find((f) => {
    if (input.Bucket && f.bucket !== input.Bucket) return false
    if (input.Key && f.key !== input.Key) return false
    return true
  })

  if (!file) throw new NotFound({ $metadata: {}, message: 'NotFound' })

  return {
    Expiration: file?.expires?.toISOString() ?? undefined,
    ETag: file.eTag,
    VersionId: file.versionId,
    ContentLength: file?.contentLength,
    ContentType: file?.contentType
  } as HeadObjectCommandOutput
}