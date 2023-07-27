if (location.hostname === 'twitter.com') {
  // is current location is twitter.com load twitter content script
  import('./Clients/twitter');

} else if (location.hostname === "tweetdeck.twitter.com") {
  // is current location is tweetdeck.twitter.com load tweetdeck content script
  import('./Clients/tweetdeck');

}
