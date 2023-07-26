import { tweetToMisskey } from './tweetToMisskey';
import { createScopeModal, Scope } from './createScopeModal';
import { public_scope_icon, lock_scope_icon, home_scope_icon } from './svg_icons';

const gifButtonSelector = 'div[data-testid="gifSearchButton"]'
const buttonSelector = 'div[data-testid="tweetButton"], div[data-testid="tweetButtonInline"]'

const scopeModelHandler = (scope: Scope) => {
  chrome.storage.sync.set({ misskey_scope: scope });
  updateScopeButton(document.querySelector('.misskey-scope-button') as HTMLDivElement, scope);
}

const scopeModel = createScopeModal(scopeModelHandler);

const isShowingScopeModal = () => {
  return document.body.contains(scopeModel);
}

const showScopeModal = (scopeButton: HTMLDivElement) => {
  if (isShowingScopeModal()) return;
  document.body.appendChild(scopeModel);

  // set position of modal
  const rect = scopeButton.getBoundingClientRect();
  scopeModel.style.top = `${rect.top + window.scrollY + 40}px`;
  scopeModel.style.left = `${rect.left + window.scrollX - 83}px`;

  // close modal when click outside
  window.addEventListener('click', (e) => {
    let target: any = e.target;
    while (target) {
      if (target === scopeButton) return;
      target = target.parentNode;
    }
    closeScopeModal();
  });
}

const closeScopeModal = () => {
  if (!isShowingScopeModal()) return;

  // animation
  scopeModel.style.opacity = '0';
  setTimeout(() => {
    scopeModel.style.opacity = '1';
    // remove modal
    scopeModel.remove();
  }, 200);
}

const updateScopeButton = (scopeButton: HTMLDivElement, scope: Scope) => {
  if (scope === 'public') {
    scopeButton.innerHTML = public_scope_icon;
  } else if (scope === 'home') {
    scopeButton.innerHTML = home_scope_icon;
  } else {
    scopeButton.innerHTML = lock_scope_icon;
  }
  (scopeButton.children[0] as any).style.fill = 'rgb(134, 179, 0)';
}

const createScopeButton = () => {
  const scopeButton = document.createElement('div');

  chrome.storage.sync.get(['misskey_scope'], (result) => {
    const scope = result.misskey_scope;
    updateScopeButton(scopeButton, scope);
  });
  
  scopeButton.innerHTML = public_scope_icon;
  (scopeButton.children[0] as any).style.fill = 'rgb(134, 179, 0)';
  scopeButton.className = 'misskey-scope-button';
  scopeButton.style.width = '34px';
  scopeButton.style.height = '34px';
  scopeButton.style.backgroundColor = 'transparent';
  scopeButton.style.display = 'flex'
  scopeButton.style.alignItems = 'center'
  scopeButton.style.justifyContent = 'center'
  scopeButton.style.borderRadius = '9999px';
  scopeButton.style.cursor = 'pointer';
  // animation settings
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


// リプライボタンの文字列一覧
const replyButtonLabels = [
  "返信",
  "Reply",
  "답글",
  "回复",
  "回覆",
  "Répondre",
  "Responder",
  "Antworten",
  "Rispondi",
  "Responder",
  "Responder",
  "Antwoorden",
  "Svara",
  "Svar",
];

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
      if (mutation.type !== 'childList') return;
      mutation.addedNodes.forEach((node: any) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tweetBox = node.querySelector(buttonSelector);
            if (!tweetBox) return;

            // リプライボタンの場合は後続の処理を行わない
            const isReplyButton = replyButtonLabels.indexOf(tweetBox.innerText) !== -1;
            if (isReplyButton) return;

            addMisskeyPostButton(tweetBox);
          }
      });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
