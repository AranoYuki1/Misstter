export type Attachment = {
  blob: Blob,
  isSensitive: boolean
}

export type AttachmentData = {
  data: string,
  isSensitive: boolean
}

export type Scope = 'public' | 'home' | 'followers'

export type PostOptions = {
  cw: boolean,
  token: string,
  server: string,
  sensitive: boolean,
  scope: Scope,
  localOnly: boolean
}

export type PostMessage = {
  type: 'post',
  text: string,
  attachments: AttachmentData[],
  options: PostOptions
}

