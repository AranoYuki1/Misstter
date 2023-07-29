import browser from 'webextension-polyfill';
import { showNotification } from '../UI/Notification';
import { Image, PostOptions, PostMessage, Notification } from "../../common/CommonType"
import { getBrowserName } from "../../common/browser"

browser.runtime.onMessage.addListener((message: Notification) => {
  if (message.type != 'notification') return;
  showNotification(message.message, message.level)
})

const blobToBase64 = (blob: Blob) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      if (base64) {
        resolve(base64.toString());
      } else {
        reject(new Error('Failed to convert blob to base64'));
      }
    };
    reader.readAsDataURL(blob);
  });
};

const makeImageData = async (image: Image) => {
  if (getBrowserName() == 'Safari') {
    const base64 = await blobToBase64(image.blob);
    return {
      imageData: base64,
      isSensitive: image.isSensitive
    }
  } else {
    return {
      imageData: image.blob,
      isSensitive: image.isSensitive
    }
  }
}

export const postToMisskey = async (text: string, images: Image[], options: PostOptions) => {
  
  const imageData = await Promise.all(images.map(async (image) => {
    return await makeImageData(image)
  }))

  const postMessage: PostMessage = {
    type: 'post',
    text: text,
    images: imageData,
    options: options,
  }

  if (imageData.length != 0) {
    showNotification('画像をアップロードしています...', 'success')
  }

  try {
    await browser.runtime.sendMessage(postMessage)
    showNotification('Misskeyへの投稿に成功しました', 'success')
  } catch (error: any) {
    showNotification(error.message, 'error')
  }
}