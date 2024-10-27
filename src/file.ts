import { Readable } from "stream"
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

export interface FileOptions {
  Key: string | undefined,
  Bucket?: string | undefined
  Body: string | Uint8Array | Buffer | Readable
  Expires?: Date
  Metadata?: Record<string, string>
  ContentType?: string
}

async function readableToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any = [];

    stream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  })
}

export class File {
  key: string | undefined
  bucket: string | undefined
  body: Buffer | undefined
  expires?: Date
  metadata?: any
  contentType?: string
  contentLength?: number
  eTag?: string
  versionId?: string

  parent?: string | undefined
  path?: string | undefined

  constructor(options: FileOptions, diskDirectory?: string) {
    this.key = options?.Key
    this.bucket = options?.Bucket
    this.expires = options?.Expires
    this.metadata = options?.Metadata
    this.contentType = options?.ContentType
    this.eTag = crypto.randomBytes(16).toString('hex')
    this.versionId = crypto.randomUUID()

    if (typeof options.Body === 'string' || options.Body instanceof Uint8Array) {
      this.body = Buffer.from(options.Body)
      this._seed(diskDirectory)
    }
    if (Buffer.isBuffer(options.Body)) {
      this.body = options.Body
      this._seed(diskDirectory)
    }
    if (options.Body instanceof Readable) {
      readableToBuffer(options.Body).then((res) => {
        this.body = res
        this.contentLength = Buffer.byteLength(this.body)
        this._seed(diskDirectory)
      })
    }

    if (this.body) {
      this.contentLength = Buffer.byteLength(this.body)
    }
  }

  _seed(diskDirectory: string | undefined) {
    if (diskDirectory && this.body) {
      this.parent = path.resolve(diskDirectory, this.bucket ?? '')
      fs.mkdirSync(this.parent, { recursive: true })


      this.path = path.resolve(this.parent, this.key ?? '')
      fs.writeFileSync(this.path, this.body)
    }
  }

  deleteObject() {
    if (this.path) {
      fs.unlinkSync(this.path)
    }
  }

}