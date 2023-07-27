// is current location is twitter.com load twitter content script

if (location.hostname === 'twitter.com') {
  import('./Clients/twitter');
} else if (location.hostname === "tweetdeck.twitter.com") {
  import('./Clients/tweetdeck');
}
