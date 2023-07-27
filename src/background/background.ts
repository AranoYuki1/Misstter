import browser from 'webextension-polyfill';

console.log('background!!!')

setInterval(() => {
  console.log('background')
}, 1000)
// handle message from content script

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == 'post') {
    console.log(message)
  }
});