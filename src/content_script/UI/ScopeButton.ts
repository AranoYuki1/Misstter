import browser from 'webextension-polyfill';

import { isShowingScopeModal, showScopeModal, closeScopeModal, updateScopeButton } from '../UI/ScopeModal';

export const scopeButtonClassName = 'misskey-scope-button'

export const createScopeButton = () => {
  const scopeButton = document.createElement('div');
  
  const updateScopeIcon = () => browser.storage.sync.get(['misskey_scope']).then((result) => {
    const scope = result?.misskey_scope ?? 'public';
    updateScopeButton(scopeButton, scope);
  });

  setInterval(() => {
    updateScopeIcon();
  }, 2000);
  
  updateScopeIcon();

  browser.storage.sync.get(['misskey_access'])
    .then((result) => {
      const access = result?.misskey_access ?? true;
      if (!access) {
        scopeButton.style.display = 'none';
      }
    });
  scopeButton.className = scopeButtonClassName;
  
  scopeButton.style.minWidth = '34px';
  scopeButton.style.width = '34px';
  scopeButton.style.maxWidth = '34px';
  
  scopeButton.style.minHeight = '34px';
  scopeButton.style.height = '34px';
  scopeButton.style.maxHeight = '34px';

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
