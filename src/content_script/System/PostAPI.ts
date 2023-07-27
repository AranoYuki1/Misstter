import browser from 'webextension-polyfill';
import { Image, PostOptions, PostMessage } from "../../common/CommonType"

export const postToMisskey = async (text: string, images: Image[], options: PostOptions) => {
  const postMessage: PostMessage = {
    type: 'post',
    text: text,
    images: images,
    options: options,
  }
  browser.runtime.sendMessage(postMessage)
}