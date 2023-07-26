import { showNotification } from "./notification"
import { Scope } from "./createScopeModal"

const uploadImage = async (server: string, token: string, image: string) => {
  console.log(image)
  if (!image.startsWith("blob:")) return;
  // get bolb from image
  const blob = await (await fetch(image)).blob()

  const formData  = new FormData();
  // create UUID
  const filename = `${Date.now()}.png`
  formData.append('file', blob, `${filename}.png`);
  formData.append('i', token);
  formData.append('name', filename);

  console.log(blob)

  const res = await fetch(`${server}/api/drive/files/create`, {
    method: 'POST',
    body: formData,
  })

  const resJson = await res.json()
  const fileID = resJson["id"]

  return fileID
}

export type PostOptions = {
  cw: boolean,
  token: string,
  server: string,
  scope: Scope
}

export const postToMisskey = async (text: string, images: string[], options: PostOptions) => {
  let fileIDs: string[] = []
  if (images.length != 0) {
    showNotification('Misskeyにファイルをアップロードしています...', 'success')
    fileIDs = await Promise.all(images.map(image => uploadImage(options.server, options.token, image) ))   
  }

  console.log(options.scope)

  const body: any = { "i": options.token }
  if (text) { body["text"] = text }
  if (fileIDs.length > 0) { body["fileIds"] = fileIDs }
  if (options.cw) { body["cw"] = "" }
  if (options.scope) { body["visibility"] = options.scope }

  console.log("SEND: ", body)

  try {
    const res = await fetch(`${options.server}/api/notes/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify(body),
    })
    if (res.status != 200) {
      const errorRes = await res.json()
      const message = errorRes["error"]["message"]
      showNotification(`Misskeyへの投稿に失敗しました。${message}`, 'error')
      return;
    }
    const resJson = await res.json()
    console.log(resJson)

    showNotification('Misskeyへの投稿に成功しました。', 'success')
  } catch (e) {
    showNotification('Misskeyへの投稿に失敗しました。', 'error')
    return
  }
}