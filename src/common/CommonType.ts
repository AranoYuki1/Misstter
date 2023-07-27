export type Image = {
  url: string,
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

