import browser from 'webextension-polyfill';

import { DEFAULT_INSTANCE_URL } from '../../common/Constants';
import { showNotification } from '../UI/Notification'

export const getToken = async () => {
  return await new Promise<string>((resolve, reject) => {
    browser.storage.sync.get(['misskey_token']).then((result) => {
      const token = result?.misskey_token as string;
      if (!token) {
        showNotification('Tokenが設定されていません。', 'error')
        reject()
      } else { resolve(token) }
    })
  })
}

export const getServer = async () => {
  return await new Promise<string>((resolve, reject) => {
    browser.storage.sync.get(['misskey_server']).then((result) => {
      let server = result?.misskey_server ?? DEFAULT_INSTANCE_URL;
      if (server.endsWith('/')) {
        server = server.slice(0, -1)
      }
      resolve(server)
    })
  })
}

export const getCW = async () => {
  return await new Promise<boolean>((resolve, reject) => {
    browser.storage.sync.get(['misskey_cw']).then((result) => {
      resolve(result?.misskey_cw ?? false)
    })
  })
}

export const getSensitive = async () => {
  return await new Promise<boolean>((resolve, reject) => {
    browser.storage.sync.get(['misskey_sensitive']).then((result) => {
      resolve(result?.misskey_sensitive ?? false)
    })
  })
}

export const getScope = async () => {
  return await new Promise<string>((resolve, reject) => {
    browser.storage.sync.get(['misskey_scope']).then((result) => {
      resolve(result?.misskey_scope ?? "public")
    })
  })
}
