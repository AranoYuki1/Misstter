export const misskeyButtonClassName = 'misskey-button'

export const createMisskeyPostButton = (tweetToMisskeyFunc: () => Promise<void>) => {
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

  misskeybutton.onmouseover = () => {
    misskeybutton.style.backgroundColor = 'rgb(100, 134, 0)';
  }
  misskeybutton.onmouseout = () => {
    misskeybutton.style.backgroundColor = 'rgb(134, 179, 0)';
  }
  misskeybutton.style.transition = 'background-color 0.2s ease-in-out';

  misskeybutton.onclick = () => {
    misskeybutton.disabled = true;
    misskeybutton.style.opacity = '0.5';
    tweetToMisskeyFunc()
      .then(() => {
        misskeybutton.style.opacity = '1';
        misskeybutton.disabled = false;
      })
  }

  return misskeybutton;
}

export const syncDisableState = (tweetButton: HTMLElement, misskeybutton: HTMLButtonElement) => {
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