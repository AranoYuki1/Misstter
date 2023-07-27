import { DEFAULT_INSTANCE_URL } from '../common/constants';
import { postToMisskey } from './MisskeyAPI'
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

const getTweetImages = () => {
  const images = document.querySelectorAll("div[data-testid='attachments'] img");
  const urls = Array.from(images).map((image) => {
    return image.getAttribute('src');
  })
  // filter null
  .filter((url) => {
    return url != null && url.startsWith("blob://")
  })
  return urls as string[];
}

export const tweetToMisskey = async () => {
  const text = getTweetText();
  const images = getTweetImages();

  if (!text && images.length == 0) {
    showNotification('Misskeyへの投稿内容がありません', 'error')
    return;
  }

  const token = await new Promise<string>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_token'], (result) => {
      const token = result.misskey_token as string;
      if (!token) { 
        showNotification('Tokenが設定されていません。', 'error')
        reject()
      } else { resolve(token) }
    })
  })

  let server = await new Promise<string>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_server'], (result) => {
      resolve(result.misskey_server ?? DEFAULT_INSTANCE_URL);
    })
  })

  if (server.endsWith('/')) {
    server = server.slice(0, -1)
  }

  const cw = await new Promise<boolean>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_cw'], (result) => {
      resolve(result.misskey_cw ?? false)
    })
  });

  const scope = await new Promise<string>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_scope'], (result) => {
      resolve(result.misskey_scope ?? "public")
    })
  });

  const options = { cw, token, server, scope: scope as Scope }
  await postToMisskey(text ?? "", images, options);
}
