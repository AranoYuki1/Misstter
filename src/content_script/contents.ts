if (location.hostname === 'x.com') {
  // is current location is twitter.com load twitter content script
  import('./Clients/twitter');

} else if (location.hostname === "pro.twitter.com") {
  // is current location is tweetdeck.twitter.com load tweetdeck content script
  import('./Clients/tweetdeck');
} 