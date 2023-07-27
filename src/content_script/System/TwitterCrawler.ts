import { postToMisskey, Image } from '../UI/MisskeyAPI'
import { showNotification } from '../UI/Notification'
import { Scope } from '../UI/ScopeModal';
import { misskeyFlagAttribute, misskeyFlagClassName } from '../UI/ImageFlagButton';
import { getCW, getScope, getSensitive, getServer, getToken } from "./StorageReader"

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
    const flagButton = imageRoot?.querySelector(`.${misskeyFlagClassName}`)
    const isFlagged = flagButton?.getAttribute(misskeyFlagAttribute) === "true" ?? false
    const url = image.getAttribute('src')
    if (!url) continue;
    res.push({ url: url, isSensitive: isFlagged })
  }

  return res;
}

export const tweetToMisskey = async () => {
  const text = getTweetText();
  const images = getTweetImages();

  if (!text && images.length == 0) {
    showNotification('Misskeyへの投稿内容がありません', 'error')
    return;
  }

  const [token, server, cw, sensitive, scope] = await Promise.all([
    getToken(), getServer(), getCW(), getSensitive(), getScope(),
  ])

  const options = { cw, token, server, sensitive, scope: scope as Scope }
  await postToMisskey(text ?? "", images, options);
}
