
export type NotificationType = 'success' | 'error' 

export class Notification {
  text: string;
  type: NotificationType;
  duration: number;

  close() {
    console.log('close', this)
    this._close();
  }

  _close!: () => void;
  _closePromise: Promise<void>;
  
  constructor(text: string, type: NotificationType, duration: number) {
    this.text = text;
    this.type = type;
    this.duration = duration;
    this._closePromise = new Promise((resolve) => {
      this._close = resolve;
    })
  }
}

const notificationStack: Notification[] = [];

let currentNotification: Notification | null = null;

const _showNotification = (notification: Notification) => {
  if (currentNotification) {
    notificationStack.push(notification);
    return;
  }

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

  notification._closePromise.then(() => {
    notificationBar.style.opacity = '0';

    setTimeout(() => {
      document.body.removeChild(notificationBar);
    }, 2000);

    currentNotification = null;
    const nextNotification = notificationStack.shift();

    if (nextNotification) { _showNotification(nextNotification); }
  });

  setTimeout(() => { notification.close(); }, notification.duration);

}

export const showNotification = (text: string, type: NotificationType, duration: number = 2000) => {
  const notification = new Notification(text, type, duration);
  
  _showNotification(notification);

  return notification;
}