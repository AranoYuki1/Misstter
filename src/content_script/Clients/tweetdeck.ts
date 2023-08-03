import { REPLY_BUTTON_LABELS } from '../../common/constants';
import { createScopeButton, scopeButtonClassName } from "../UI/ScopeButton"
import { createMisskeyPostButton, misskeyButtonClassName, syncDisableState } from "../UI/MisskeyPostButton"
import { createMisskeyImageOptionButton } from "../UI/ImageFlagButton"
// DeckではTwitterCrawlerがそのまま使用可能
import { tweetToMisskey } from '../System/TwitterCrawler';
import {createLocalOnlyButton, localOnlyButtonClassName} from "../UI/LocalOnlyButton";

// ミスキーへの投稿ボタンを追加する
const addMisskeyPostButton = (tweetButton: HTMLElement, tweetBox: HTMLElement) => {
  // すでにボタンがある場合は何もしない
  if (tweetBox.querySelector(`.${misskeyButtonClassName}`)) return;

  const misskeybutton = createMisskeyPostButton(tweetToMisskey, tweetButton);
  misskeybutton.style.width = "40px"
  misskeybutton.style.height = "30px"
  misskeybutton.style.marginLeft = "8px"
  tweetBox.appendChild(misskeybutton);
  syncDisableState(tweetButton, misskeybutton);
}

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

// ミスキーへのセンシティブ設定ボタンを追加する
const addMisskeyImageOptionButton = (editButton: HTMLElement, attachmentsImage: HTMLElement) => {
  const misskeybutton = createMisskeyImageOptionButton();
  editButton.parentElement!.insertBefore(misskeybutton, editButton);
}

const foundTweetButtonHandler = (tweetButton: HTMLElement) => {
  if (!tweetButton) return;

  // リプライボタンの場合は後続の処理を行わない
  const isReplyButton = REPLY_BUTTON_LABELS.indexOf(tweetButton.innerText) !== -1;
  if (isReplyButton) return;

  // add misskey post button
  const tweetBox = tweetButton.parentElement?.parentElement as HTMLElement;
  if (tweetBox) { addMisskeyPostButton(tweetButton, tweetBox); }


  // // add scope button and local only button
  const iconsBlock = document.querySelector(gifButtonSelector)?.parentElement as HTMLElement
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

const gifButtonSelector = 'div[data-testid="gifSearchButton"]'
const buttonSelector = '//*[@id="react-root"]/div/div/div[3]/div/div[2]/div/div/div[1]/div/div/div/div[3]/div'
const attachmentsImageSelector = 'div[data-testid="attachments"] div[role="group"]'

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
      if (mutation.type !== 'childList') return;
      mutation.addedNodes.forEach((node: any) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        
        // select with xpath
        const tweetButton = node.ownerDocument.evaluate(buttonSelector, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as HTMLElement;
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
