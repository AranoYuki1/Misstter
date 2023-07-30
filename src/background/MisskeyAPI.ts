import { AttachmentData, PostOptions } from "../common/CommonType"

const uploadAttachment = async (attachment: AttachmentData, options: PostOptions) => {
  const blob = await (await fetch(attachment.data)).blob()
  if (blob instanceof Blob == false) {
    console.error('blob is not Blob')
    return;
  }
  const formData  = new FormData();
  // create UUID
  const filename = `${Date.now()}.png`
  formData.append('file', blob, filename);
  formData.append('i', options.token);
  formData.append('name', filename);

  if (options.sensitive || attachment.isSensitive) {
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

export const postToMisskey = async (text: string, attachments: AttachmentData[], options: PostOptions) => {
  let fileIDs: string[] = []
  if (attachments.length != 0) {
    fileIDs = await Promise.all(attachments.map(attachment => uploadAttachment(attachment, options) ))   
  }

  const body: any = { "i": options.token }
  if (text) { body["text"] = text }
  if (fileIDs.length > 0) { body["fileIds"] = fileIDs }
  if (options.cw) { body["cw"] = "" }
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