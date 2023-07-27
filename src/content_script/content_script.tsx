import { tweetToMisskey } from './TwitterCrawler';
import { isShowingScopeModal, showScopeModal, closeScopeModal, updateScopeButton } from './ScopeModal';
import { REPLY_BUTTON_LABELS } from '../common/constants';

const gifButtonSelector = 'div[data-testid="gifSearchButton"]'
const buttonSelector = 'div[data-testid="tweetButton"], div[data-testid="tweetButtonInline"]'

// スコープボタンを作成する
const createScopeButton = () => {
  const scopeButton = document.createElement('div');

  chrome.storage.sync.get(['misskey_scope'], (result) => {
    const scope = result.misskey_scope;
    updateScopeButton(scopeButton, scope);
  });
  scopeButton.className = 'misskey-scope-button';
  scopeButton.style.width = '34px';
  scopeButton.style.height = '34px';
  scopeButton.style.backgroundColor = 'transparent';
  scopeButton.style.display = 'flex'
  scopeButton.style.alignItems = 'center'
  scopeButton.style.justifyContent = 'center'
  scopeButton.style.borderRadius = '9999px';
  scopeButton.style.cursor = 'pointer';
  scopeButton.style.transition = 'background-color 0.2s ease-in-out';
  scopeButton.onmouseover = () => {
    scopeButton.style.backgroundColor = 'rgba(134, 179, 0, 0.1)';
  }
  scopeButton.onmouseout = () => {
    scopeButton.style.backgroundColor = 'transparent';
  }

  scopeButton.onclick = () => {
    if (isShowingScopeModal()) {
      closeScopeModal();
    } else {
      showScopeModal(scopeButton);
    }
  }

  return scopeButton;
}

// ミスキーへの投稿ボタンを追加する
const addMisskeyPostButton = (tweetBox: Node) => {
  const misskeyIcon = document.createElement('img')
  misskeyIcon.src = chrome.runtime.getURL('misskey_icon.png');
  misskeyIcon.style.width = '24px';
  misskeyIcon.style.height = '24px';
  misskeyIcon.style.verticalAlign = 'middle';
  misskeyIcon.style.display = 'inline-block';
  misskeyIcon.style.userSelect = 'none';
  
  const misskeybutton = document.createElement('button');
  misskeybutton.appendChild(misskeyIcon);
  misskeybutton.className = 'misskey-button';
  misskeybutton.style.backgroundColor = 'rgb(134, 179, 0)';
  misskeybutton.style.borderRadius = '9999px';
  misskeybutton.style.cursor = 'pointer';
  misskeybutton.style.height = '36px';
  misskeybutton.style.width = '36px';
  misskeybutton.style.marginLeft = '8px';
  misskeybutton.style.marginRight = '8px';
  misskeybutton.style.outline = 'none';
  misskeybutton.style.display = 'flex'
  misskeybutton.style.alignItems = 'center'
  misskeybutton.style.justifyContent = 'center'
  misskeybutton.style.border = 'none'
  misskeybutton.onclick = () => {
    misskeybutton.disabled = true;
    misskeybutton.style.opacity = '0.5';
    tweetToMisskey()
      .then(() => {
        misskeybutton.style.opacity = '1';
        misskeybutton.disabled = false;
      })
  }
  misskeybutton.onmouseover = () => {
    misskeybutton.style.backgroundColor = 'rgb(100, 134, 0)';
  }
  misskeybutton.onmouseout = () => {
    misskeybutton.style.backgroundColor = 'rgb(134, 179, 0)';
  }
  misskeybutton.style.transition = 'background-color 0.2s ease-in-out';
  
  tweetBox.parentElement!.insertBefore(misskeybutton, tweetBox.nextSibling);

  // add post filter button
  const iconsBlock = document.querySelector(gifButtonSelector)?.parentElement
  if (!iconsBlock) return;
  iconsBlock.appendChild(createScopeButton())
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
      if (mutation.type !== 'childList') return;
      mutation.addedNodes.forEach((node: any) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tweetBox = node.querySelector(buttonSelector);
            if (!tweetBox) return;

            // リプライボタンの場合は後続の処理を行わない
            const isReplyButton = REPLY_BUTTON_LABELS.indexOf(tweetBox.innerText) !== -1;
            if (isReplyButton) return;

            addMisskeyPostButton(tweetBox);
          }
      });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
