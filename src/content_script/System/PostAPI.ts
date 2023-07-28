import browser from 'webextension-polyfill';
import { showNotification } from '../UI/Notification';
import { Image, PostOptions, PostMessage, Notification } from "../../common/CommonType"

browser.runtime.onMessage.addListener((message: Notification) => {
  if (message.type != 'notification') return;
  showNotification(message.message, message.level)
})

export const postToMisskey = async (text: string, images: Image[], options: PostOptions) => {
  const postMessage: PostMessage = {
    type: 'post',
    text: text,
    images: images,
    options: options,
  }

  browser.runtime.sendMessage(postMessage)
  .catch((error) => {
    showNotification(error.message, 'error')
  })
  .then(() => {
    showNotification('Misskeyへの投稿に成功しました', 'success')
  })
}