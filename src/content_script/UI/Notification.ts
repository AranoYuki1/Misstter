
export type NotificationType = 'success' | 'error' 

export const showNotification = (text: string, type: NotificationType) => {
  const notification = document.createElement('div');
  notification.textContent = text;
  notification.style.position = 'fixed';
  notification.style.top = '0';
  notification.style.left = '0';
  notification.style.right = '0';
  if (type === 'success') {
    notification.style.backgroundColor = 'rgb(134, 179, 0)';
  } else if (type === 'error') {
    notification.style.backgroundColor = 'rgb(211, 30, 30)';
  } 

  notification.style.color = 'white';
  notification.style.padding = '8px';
  notification.style.zIndex = '9999';
  notification.style.fontSize = '16px';
  notification.style.textAlign = 'center';
  notification.style.fontFamily = 'sans-serif';
  notification.style.userSelect = 'none';
  notification.style.pointerEvents = 'none';

  // show animation
  notification.style.transition = 'opacity 0.2s ease-in-out';
  notification.style.opacity = '0';
  setTimeout(() => {
      notification.style.opacity = '1';
  }, 0);

  document.body.appendChild(notification);
  setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 2000);
  }, 2000);
}