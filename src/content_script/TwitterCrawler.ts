import { postToMisskey, Image } from './MisskeyAPI'
import { showNotification } from './Notification'
import { Scope } from './ScopeModal'; 

const getTweetText = () => {
  const textContents = document.querySelectorAll('div[data-testid="tweetTextarea_0"] div[data-block="true"]');
  if (!textContents) return;
  const text = Array.from(textContents).map((textContent) => {
    return textContent.textContent;
  }).join('\n');

  return text;
}

const getTweetImages: () => Image[] = () => {
  const images = document.querySelectorAll("div[data-testid='attachments'] img");

  const res: Image[] = []

  for (const image of images) {
    const imageRoot = image.parentElement?.parentElement?.parentElement?.parentElement
    const flagButton = imageRoot?.querySelector(".misskey-flag")
    const isFlagged = flagButton?.getAttribute("data-misskey-flag") === "true" ?? false
    const url = image.getAttribute('src')
    if (!url) continue;
    res.push({ url: url, isSensitive: isFlagged })
  }

  return res;
}

const getToken = async () => {
  return await new Promise<string>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_token'], (result) => {
      const token = result.misskey_token as string;
      if (!token) {
        showNotification('Tokenが設定されていません。', 'error')
        reject()
      } else { resolve(token) }
    })
  })
}

const getServer = async () => {
  return await new Promise<string>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_server'], (result) => {
      let server = result.misskey_server ?? "https://misskey.io";
      if (server.endsWith('/')) {
        server = server.slice(0, -1)
      }
      resolve(server)
    })
  })
}

const getCW = async () => {
  return await new Promise<boolean>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_cw'], (result) => {
      resolve(result.misskey_cw ?? false)
    })
  })
}

const getSensitive = async () => {
  return await new Promise<boolean>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_sensitive'], (result) => {
      resolve(result.misskey_sensitive ?? false)
    })
  })
}

const getScope = async () => {
  return await new Promise<string>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_scope'], (result) => {
      resolve(result.misskey_scope ?? "public")
    })
  })
}

export const tweetToMisskey = async () => {
  const text = getTweetText();
  const images = getTweetImages();

  if (!text && images.length == 0) {
    showNotification('Misskeyへの投稿内容がありません', 'error')
    return;
  }

  const [token, server, cw, sensitive, scope] = await Promise.all([
    getToken(),
    getServer(),
    getCW(),
    getSensitive(),
    getScope(),
  ])

  const options = { cw, token, server, sensitive, scope: scope as Scope }
  await postToMisskey(text ?? "", images, options);
}
