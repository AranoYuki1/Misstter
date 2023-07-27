import { flag_icon } from '../UI/Icons'

export const misskeyFlagClassName = 'misskey-flag'
export const misskeyFlagAttribute = 'data-misskey-flag'

export const createMisskeyImageOptionButton = () => {
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
    if (misskeybutton.getAttribute(misskeyFlagAttribute) === 'true') {
      misskeybutton.setAttribute(misskeyFlagAttribute, 'false');
      misskeybutton.style.backgroundColor = 'rgba(15, 20, 25, 0.75)';
    } else {
      misskeybutton.setAttribute(misskeyFlagAttribute, 'true');
      misskeybutton.style.backgroundColor = 'rgb(167, 217, 18)';
    }
  }

  misskeybutton.style.transition = 'background-color 0.2s ease-in-out';

  misskeybutton.onmouseover = () => {
    if (misskeybutton.getAttribute(misskeyFlagAttribute) === 'true') return;
    misskeybutton.style.backgroundColor = 'rgba(39, 44, 48, 0.75)';
  }

  misskeybutton.onmouseout = () => {
    if (misskeybutton.getAttribute(misskeyFlagAttribute) === 'true') return;
    misskeybutton.style.backgroundColor = 'rgba(15, 20, 25, 0.75)';
  }

  return misskeybutton;
}