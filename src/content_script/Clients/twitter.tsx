import { tweetToMisskey } from '../System/TwitterCrawler';
import { REPLY_BUTTON_LABELS } from '../../common/constants';
import { createScopeButton, scopeButtonClassName } from "../UI/ScopeButton"
import { createMisskeyPostButton, misskeyButtonClassName, syncDisableState } from "../UI/MisskeyPostButton"
import { createMisskeyImageOptionButton } from "../UI/ImageFlagButton"
import { createLocalOnlyButton, localOnlyButtonClassName } from "../UI/LocalOnlyButton";

const gifButtonSelector = 'div[data-testid="gifSearchButton"]'
const buttonSelector = 'div[data-testid="tweetButton"], div[data-testid="tweetButtonInline"]'
const attachmentsImageSelector = 'div[data-testid="attachments"] div[role="group"]'

// スコープボタンを作成する
const addScopeButton = (iconBox: HTMLElement) => {
  // すでにボタンがある場合は何もしない
  if (iconBox.querySelector(`.${scopeButtonClassName}`)) return;
  const scopeButton = createScopeButton();
  iconBox.appendChild(scopeButton);
}

// 連合なしボタンを作成する
const addLocalOnlyButton = (iconBox: HTMLElement) => {
  if (iconBox.querySelector(`.${localOnlyButtonClassName}`)) return;
  const localOnlyButton = createLocalOnlyButton();
  iconBox.appendChild(localOnlyButton);
}

// ミスキーへの投稿ボタンを追加する
const addMisskeyPostButton = (tweetButton: HTMLElement, tweetBox: HTMLElement) => {
  // すでにボタンがある場合は何もしない
  if (tweetBox.querySelector(`.${misskeyButtonClassName}`)) return;

  const misskeybutton = createMisskeyPostButton(tweetToMisskey, tweetButton);
  
  tweetBox.appendChild(misskeybutton);
  syncDisableState(tweetButton, misskeybutton);
}

// ミスキーへのセンシティブ設定ボタンを追加する
const addMisskeyImageOptionButton = (editButton: HTMLElement, attachmentsImage: HTMLElement) => {
  const misskeybutton = createMisskeyImageOptionButton();
  editButton.parentElement!.insertBefore(misskeybutton, editButton);
}

const foundTweetButtonHandler = (tweetButton: HTMLElement) => {
  if (!tweetButton) return;

  const buttonText = tweetButton.innerText.trim();

  // リプライボタンの場合は後続の処理を行わない
  const isReplyButton = REPLY_BUTTON_LABELS.indexOf(buttonText) !== -1;
  if (isReplyButton) return;

  // add misskey post button
  const tweetBox = tweetButton.parentElement as HTMLElement;
  if (tweetBox) { addMisskeyPostButton(tweetButton, tweetBox); }

  // add scope button and local only button
  const iconsBlock = document.querySelector(gifButtonSelector)?.parentElement?.parentElement as HTMLElement
  if (iconsBlock) {
    addScopeButton(iconsBlock);
    addLocalOnlyButton(iconsBlock);
  }
}

const foundAttachmentsImageHandler = (attachmentsImage: HTMLElement) => {
  // すでにボタンがある場合は何もしない
  if (attachmentsImage.getAttribute('data-has-flag-button')) return;
  attachmentsImage.setAttribute('data-has-flag-button', 'true');
  
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
