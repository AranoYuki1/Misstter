export const getBrowserName = () => {
  const ua = navigator.userAgent;
  const isIE = ua.indexOf('MSIE ') > -1 || ua.indexOf('Trident/') > -1;
  const isEdge = ua.indexOf('Edge/') > -1;
  const isChrome = ua.indexOf('Chrome/') > -1;
  const isFirefox = ua.indexOf('Firefox/') > -1;
  const isSafari = ua.indexOf('Safari/') > -1 && !isChrome;
  const isOpera = ua.indexOf('Opera/') > -1 || ua.indexOf('OPR/') > -1;
  const isBlink = isChrome && !!(window as any).chrome;
  if (isIE) {
    return 'IE';
  } else if (isEdge) {
    return 'Edge';
  } else if (isChrome) {
    return 'Chrome';
  } else if (isFirefox) {
    return 'Firefox';
  } else if (isSafari) {
    return 'Safari';
  } else if (isOpera) {
    return 'Opera';
  } else if (isBlink) {
    return 'Blink';
  } else {
    return 'Unknown';
  }
}
