
export type NotificationType = 'success' | 'error' 
export type Notification = {
  text: string;
  type: NotificationType;
}

const notificationStack: Notification[] = [];

let currentNotification: Notification | null = null;

const createNotification = (notification: Notification) => {
  currentNotification = notification;
  const notificationBar = document.createElement('div');
  notificationBar.textContent = notification.text;
  notificationBar.style.position = 'fixed';
  notificationBar.style.top = '0';
  notificationBar.style.left = '0';
  notificationBar.style.right = '0';
  if (notification.type === 'success') {
    notificationBar.style.backgroundColor = 'rgb(134, 179, 0)';
  } else if (notification.type === 'error') {
    notificationBar.style.backgroundColor = 'rgb(211, 30, 30)';
  } 

  notificationBar.style.color = 'white';
  notificationBar.style.padding = '8px';
  notificationBar.style.zIndex = '9999';
  notificationBar.style.fontSize = '16px';
  notificationBar.style.textAlign = 'center';
  notificationBar.style.fontFamily = 'sans-serif';
  notificationBar.style.userSelect = 'none';
  notificationBar.style.pointerEvents = 'none';

  // show animation
  notificationBar.style.transition = 'opacity 0.2s ease-in-out';
  notificationBar.style.opacity = '0';
  setTimeout(() => {
      notificationBar.style.opacity = '1';
  }, 0);

  document.body.appendChild(notificationBar);
  setTimeout(() => {
      notificationBar.style.opacity = '0';
      setTimeout(() => {
        document.body.removeChild(notificationBar);
        
        if (notificationStack.length == 0) return;

        const nextNotification = notificationStack.shift();
        if (nextNotification) {
          createNotification(nextNotification);
        }
      }, 2000);
  }, 2000);
}

export const showNotification = (text: string, type: NotificationType) => {
  if (currentNotification) {
    notificationStack.push({ text, type });
    return;
  }

  createNotification({ text, type });
}