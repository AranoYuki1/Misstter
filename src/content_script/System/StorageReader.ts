import { DEFAULT_INSTANCE_URL } from '../../common/Constants';
import { showNotification } from '../UI/Notification'

export const getToken = async () => {
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

export const getServer = async () => {
  return await new Promise<string>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_server'], (result) => {
      let server = result.misskey_server ?? DEFAULT_INSTANCE_URL;
      if (server.endsWith('/')) {
        server = server.slice(0, -1)
      }
      resolve(server)
    })
  })
}

export const getCW = async () => {
  return await new Promise<boolean>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_cw'], (result) => {
      resolve(result.misskey_cw ?? false)
    })
  })
}

export const getSensitive = async () => {
  return await new Promise<boolean>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_sensitive'], (result) => {
      resolve(result.misskey_sensitive ?? false)
    })
  })
}

export const getScope = async () => {
  return await new Promise<string>((resolve, reject) => {
    chrome.storage.sync.get(['misskey_scope'], (result) => {
      resolve(result.misskey_scope ?? "public")
    })
  })
}
