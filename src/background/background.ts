import browser from 'webextension-polyfill';
import { Image, PostOptions, PostMessage } from "../common/CommonType"
import { postToMisskey } from "./MisskeyAPI"

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == 'post') {
    const postMessage = message as PostMessage
    console.log(postMessage)
    postToMisskey(postMessage.text, postMessage.images, postMessage.options)
  }
});