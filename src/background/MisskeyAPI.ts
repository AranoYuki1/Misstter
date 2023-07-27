import { Image, PostOptions } from "../common/CommonType"

const uploadImage = async (image: Image, options: PostOptions) => {
  const blob = image.blob
  const formData  = new FormData();
  // create UUID
  const filename = `${Date.now()}.png`
  formData.append('file', blob, `${filename}.png`);
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

export const postToMisskey = async (text: string, images: Image[], options: PostOptions) => {
  let fileIDs: string[] = []
  if (images.length != 0) {
    // showNotification('Misskeyにファイルをアップロードしています...', 'success')
    fileIDs = await Promise.all(images.map(image => uploadImage(image, options) ))   
  }

  const body: any = { "i": options.token }
  if (text) { body["text"] = text }
  if (fileIDs.length > 0) { body["fileIds"] = fileIDs }
  if (options.cw) { body["cw"] = "" }
  if (options.sensitive) { body["isSensitive"] = true }
  if (options.scope) { body["visibility"] = options.scope }

  try {
    const res = await fetch(`${options.server}/api/notes/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(body),
    })
    if (res.status != 200) {
      const errorRes = await res.json()
      const message = errorRes["error"]["message"]
      // showNotification(`Misskeyへの投稿に失敗しました。${message}`, 'error')
      return;
    }
    // showNotification('Misskeyへの投稿に成功しました。', 'success')
  } catch (e) {
    // showNotification('Misskeyへの投稿に失敗しました。', 'error')
    return
  }
}