import browser from 'webextension-polyfill';
import { global_icon, local_only_icon } from "./Icons";

export const localOnlyButtonClassName = 'misskey-local-only-button'

export const createLocalOnlyButton = () => {
    const localOnlyButton = document.createElement('div');

    const updateLocalOnlyIcon = () => browser.storage.sync.get(['misskey_local_only']).then((result) => {
        const localOnly = result?.misskey_local_only ?? false;
        updateLocalOnlyButton(localOnlyButton, localOnly);
    });

    setInterval(() => {
        updateLocalOnlyIcon();
    }, 2000);

    updateLocalOnlyIcon();

    browser.storage.sync.get(['misskey_show_local_only'])
        .then((result) => {
            const showLocalOnly = result?.misskey_show_local_only ?? true;
            if (!showLocalOnly) {
                localOnlyButton.style.display = 'none';
            }
        });
    localOnlyButton.className = localOnlyButtonClassName;
    
    localOnlyButton.style.minWidth = '34px';
    localOnlyButton.style.width = '34px';
    localOnlyButton.style.maxWidth = '34px';

    localOnlyButton.style.minHeight = '34px';
    localOnlyButton.style.height = '34px';
    localOnlyButton.style.maxHeight = '34px';

    localOnlyButton.style.backgroundColor = 'transparent';
    localOnlyButton.style.display = 'flex'
    localOnlyButton.style.alignItems = 'center'
    localOnlyButton.style.justifyContent = 'center'
    localOnlyButton.style.borderRadius = '9999px';
    localOnlyButton.style.cursor = 'pointer';
    localOnlyButton.style.transition = 'background-color 0.2s ease-in-out';
    localOnlyButton.onmouseover = () => {
        localOnlyButton.style.backgroundColor = 'rgba(134, 179, 0, 0.1)';
    }
    localOnlyButton.onmouseout = () => {
        localOnlyButton.style.backgroundColor = 'transparent';
    }

    localOnlyButton.onclick = () => {
        browser.storage.sync.get(['misskey_local_only'])
            .then((result) => {
                const localOnly = result?.misskey_local_only ?? false;
                browser.storage.sync.set({ misskey_local_only: !localOnly });
                updateLocalOnlyIcon();
            });
    }

    return localOnlyButton;
}

export const updateLocalOnlyButton = (localOnlyButton: HTMLDivElement, localOnly: boolean) => {
    if (localOnly) {
        localOnlyButton.innerHTML = local_only_icon
    }
    else {
        localOnlyButton.innerHTML = global_icon
    }
}