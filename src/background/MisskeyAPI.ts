import { Image, ImageData, PostOptions } from "../common/CommonType"

const getBlob = async (imageData: Blob | string) => {
  if (typeof imageData == 'string') {
    const res = await fetch(imageData)
    return await res.blob()
  } else {
    return imageData
  }
}

const uploadImage = async (image: ImageData, options: PostOptions) => {
  const blob = await getBlob(image.imageData)
  const formData  = new FormData();
  // create UUID
  const filename = `${Date.now()}.png`
  formData.append('file', blob, filename);
  // formData.append('file', blob, `${filename}.png`);
  formData.append('i', options.token);
  formData.append('name', filename);

  if (options.sensitive || image.isSensitive) {
    formData.append('isSensitive', "true");
  }

  const res = await fetch(`${options.server}/api/drive/files/create`, {
    method: 'POST',
    body: formData,
  })

  const resJson = await res.json()
  const fileID = resJson["id"]

  return fileID
}

export const postToMisskey = async (text: string, images: ImageData[], options: PostOptions) => {
  let fileIDs: string[] = []
  if (images.length != 0) {
    fileIDs = await Promise.all(images.map(image => uploadImage(image, options) ))   
  }

  const body: any = { "i": options.token }
  if (text) { body["text"] = text }
  if (fileIDs.length > 0) { body["fileIds"] = fileIDs }
  if (options.cw) { body["cw"] = "" }
  if (options.sensitive) { body["isSensitive"] = true }
  if (options.scope) { body["visibility"] = options.scope }

  const res = await fetch(`${options.server}/api/notes/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', },
    body: JSON.stringify(body),
  })
  if (res.status != 200) {
    const errorRes = await res.json()
    const message = errorRes["error"]["message"]
    throw new Error(message)
  }
}