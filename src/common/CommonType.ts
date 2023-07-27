export type Image = {
  blob: Blob,
  isSensitive: boolean
}



export type Scope = 'public' | 'home' | 'followers'

export type PostOptions = {
  cw: boolean,
  token: string,
  server: string,
  sensitive: boolean,
  scope: Scope
}

export type PostMessage = {
  type: 'post',
  text: string,
  images: Image[],
  options: PostOptions
}

export type PostResponse = {
  type: 'postResponse',
  success: boolean,
  errorMessage: string
}

export type Notification = {
  type: 'notification',
  message: string,
  level: 'success' | 'error'
}