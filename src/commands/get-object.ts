import { GetObjectCommand, GetObjectCommandOutput, NotFound } from "@aws-sdk/client-s3";
import { InMemoryS3 } from "..";

export async function getObject(client: InMemoryS3, { input }: GetObjectCommand): Promise<GetObjectCommandOutput> {
  const file = client.files.find((f) => {
    if (input.Bucket && f.bucket !== input.Bucket) return false
    if (input.Key && f.key !== input.Key) return false
    return true
  })

  if (!file) throw new NotFound({ $metadata: {}, message: 'NotFound' })

  return {
    Body: Buffer.from(file.body as any) as any,
    ETag: file.eTag,
    VersionId: file.versionId,
    Expiration: file?.expires?.toISOString() ?? undefined,
    ContentLength: file?.contentLength,
    ContentType: file?.contentType,
    Metadata: file.metadata,
    $metadata: {},
  } as GetObjectCommandOutput
}