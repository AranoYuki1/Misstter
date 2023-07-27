import { tweetToMisskey } from './TwitterCrawler';
import { flag_icon } from './Icons'
import { isShowingScopeModal, showScopeModal, closeScopeModal, updateScopeButton } from './ScopeModal';

const gifButtonSelector = 'div[data-testid="gifSearchButton"]'
const buttonSelector = 'div[data-testid="tweetButton"], div[data-testid="tweetButtonInline"]'
const attachmentsImageSelector = 'div[data-testid="attachments"] div[role="group"]'
const misskeyButtonClassName = 'misskey-button'
const scopeButtonClassName = 'misskey-scope-button'
const misskeyFlagClassName = 'misskey-flag'

// スコープボタンを作成する
const addScopeButton = (iconBox: HTMLElement) => {
  // すでにボタンがある場合は何もしない
  if (iconBox.querySelector(`.${scopeButtonClassName}`)) return;

  const scopeButton = document.createElement('div');
  
  const updateScopeIcon = () => chrome.storage.sync.get(['misskey_scope'], (result) => {
    const scope = result.misskey_scope ?? 'public';
    updateScopeButton(scopeButton, scope);
  });

  setInterval(() => {
    updateScopeIcon();
  }, 2000);
  
  updateScopeIcon();

  chrome.storage.sync.get(['misskey_access'], (result) => {
    const access = result.misskey_access ?? true;
    if (!access) {
      scopeButton.style.display = 'none';
    }
  });
  scopeButton.className = scopeButtonClassName;
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

  iconBox.appendChild(scopeButton);
}

// ミスキーへの投稿ボタンを追加する
const addMisskeyPostButton = (tweetButton: HTMLElement, tweetBox: HTMLElement) => {
  // すでにボタンがある場合は何もしない
  if (tweetBox.querySelector(`.${misskeyButtonClassName}`)) return;

  const misskeyIcon = document.createElement('img')
  misskeyIcon.src = chrome.runtime.getURL('misskey_icon.png');
  misskeyIcon.style.width = '24px';
  misskeyIcon.style.height = '24px';
  misskeyIcon.style.verticalAlign = 'middle';
  misskeyIcon.style.display = 'inline-block';
  misskeyIcon.style.userSelect = 'none';
  
  const misskeybutton = document.createElement('button');
  misskeybutton.appendChild(misskeyIcon);
  misskeybutton.className = misskeyButtonClassName;
  misskeybutton.style.backgroundColor = 'rgb(134, 179, 0)';
  misskeybutton.style.borderRadius = '9999px';
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
  
  tweetBox.appendChild(misskeybutton);

  const syncOpacity = () => {
    const isDisabled = parseFloat(window.getComputedStyle(tweetButton).opacity) != 1;
    if (isDisabled) {
      misskeybutton.disabled = true;
      misskeybutton.style.opacity = '0.5';
      misskeybutton.style.cursor = "default";
    } else {
      misskeybutton.disabled = false;
      misskeybutton.style.opacity = '1';
      misskeybutton.style.cursor = 'pointer';
    }
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type !== 'attributes') return;
        if (mutation.attributeName !== 'class') return;
        syncOpacity();
    });
  })

  syncOpacity();

  observer.observe(tweetButton, { attributes: true });
}

const addMisskeyImageOptionButton = (editButton: HTMLElement, attachmentsImage: HTMLElement) => {
  const misskeybutton = document.createElement('button');
  misskeybutton.innerHTML = flag_icon;
  misskeybutton.style.fill = 'rgb(255, 255, 255)';
  misskeybutton.className = misskeyFlagClassName;
  misskeybutton.style.backgroundColor = "rgba(15, 20, 25, 0.75)"
  misskeybutton.style.backdropFilter = "blur(4px)"
  misskeybutton.style.borderRadius = '9999px';
  misskeybutton.style.height = '32px';
  misskeybutton.style.width = '32px';
  misskeybutton.style.marginLeft = '8px';
  misskeybutton.style.marginRight = '8px';
  misskeybutton.style.outline = 'none';
  misskeybutton.style.display = 'flex'
  misskeybutton.style.alignItems = 'center'
  misskeybutton.style.justifyContent = 'center'
  misskeybutton.style.cursor = 'pointer';
  misskeybutton.style.border = "solid 1px rgb(167, 217, 18)";

  misskeybutton.onclick = () => {
    console.log('click');
    if (misskeybutton.getAttribute('data-misskey-flag') === 'true') {
      misskeybutton.setAttribute('data-misskey-flag', 'false');
      misskeybutton.style.backgroundColor = 'rgba(15, 20, 25, 0.75)';
    } else {
      misskeybutton.setAttribute('data-misskey-flag', 'true');
      misskeybutton.style.backgroundColor = 'rgb(167, 217, 18)';
    }
  }

  misskeybutton.style.transition = 'background-color 0.2s ease-in-out';

  misskeybutton.onmouseover = () => {
    if (misskeybutton.getAttribute('data-misskey-flag') === 'true') return;
    misskeybutton.style.backgroundColor = 'rgba(39, 44, 48, 0.75)';
  }

  misskeybutton.onmouseout = () => {
    if (misskeybutton.getAttribute('data-misskey-flag') === 'true') return;
    misskeybutton.style.backgroundColor = 'rgba(15, 20, 25, 0.75)';
  }

  editButton.parentElement!.insertBefore(misskeybutton, editButton);

}


// リプライボタンの文字列一覧
const replyButtonLabels = [ "返信", "Reply", "답글", "回复", "回覆", "Répondre", "Responder", "Antworten", "Rispondi", "Responder", "Responder", "Antwoorden", "Svara", "Svar" ];

const foundTweetButtonHandler = (tweetButton: HTMLElement) => {
  if (!tweetButton) return;

  // リプライボタンの場合は後続の処理を行わない
  const isReplyButton = replyButtonLabels.indexOf(tweetButton.innerText) !== -1;
  if (isReplyButton) return;

  // add misskey post button
  const tweetBox = tweetButton.parentElement as HTMLElement;
  if (tweetBox) { addMisskeyPostButton(tweetButton, tweetBox); }

  // add scope button
  const iconsBlock = document.querySelector(gifButtonSelector)?.parentElement as HTMLElement
  if (iconsBlock) { addScopeButton(iconsBlock); }
}

const foundAttachmentsImageHandler = (attachmentsImage: HTMLElement) => {
  if (attachmentsImage.attributes.getNamedItem('data-misskey-attachments-image')) return;
  attachmentsImage.attributes.setNamedItem(document.createAttribute('data-misskey-attachments-image'));
  const editButton = Array.from(attachmentsImage.querySelectorAll("div[role='button']"))[1] as HTMLElement;
  if (!editButton) return;

  addMisskeyImageOptionButton(editButton, attachmentsImage);
}

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
      if (mutation.type !== 'childList') return;
      mutation.addedNodes.forEach((node: any) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        
        const tweetButton = node.querySelector(buttonSelector);
        if (tweetButton) { foundTweetButtonHandler(tweetButton); }

        const attachmentsImages = document.querySelectorAll(attachmentsImageSelector);
        if (attachmentsImages) { 
          attachmentsImages.forEach((attachmentsImage: any) => {
            foundAttachmentsImageHandler(attachmentsImage); 
          })
        }
      });
  });
});

observer.observe(document.body, { childList: true, subtree: true });
