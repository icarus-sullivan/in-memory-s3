import { DeleteBucketCommand, GetObjectCommand, HeadObjectCommand, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";


import { InMemoryS3 } from './src/index';

const s3 = new InMemoryS3({
  diskDirectory: '.s3',
  seed: {
    files: [
      {
        Key: 'assessments-10-26.csv',
        Body: 'id, name\n123, hello',
        ContentType: 'text/csv',
      },
      {
        Key: 'networks_2024-10-26.csv',
        Bucket: 'reports',
        Body: 'id, name\n123, hello',
        ContentType: 'text/csv',
      }
    ]
  }
})

;(async () => {
  await s3.send(new PutObjectCommand({
    Key: 'foo.txt',
    Body: Buffer.from('hello world'),
    Bucket: 'notes',
    ContentType: 'text/plain'
  })).then(console.log).catch(console.error)

  await s3.send(new HeadObjectCommand({
    Key: 'networks_2024-10-26.csv',
        Bucket: 'reports',
  })).then(console.log).catch(console.error)

  await s3.send(new HeadObjectCommand({
    Key: 'balloon.txt',
        Bucket: 'notes',
  })).then(console.log).catch(console.error)

  await s3.send(new ListBucketsCommand({
    MaxBuckets: 2
  })).then(console.log).catch(console.error)

  await s3.send(new GetObjectCommand({
    Key: 'networks_2024-10-26.csv',
    Bucket: 'reports',
  })).then(console.log).catch(console.error)

  await s3.send(new DeleteBucketCommand({
    Bucket: 'reports',
  })).then(console.log).catch(console.error)

  await s3.send(new DeleteBucketCommand({
    Bucket: 'banana',
  })).then(console.log).catch(console.error)

  await s3.send(new ListBucketsCommand({
    MaxBuckets: 2
  })).then(console.log).catch(console.error)
})()

