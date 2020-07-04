const playlistInfo = require('../src/index.js');

// playlist has 93 items, should force 2 pages of 50 each
// Full playlst link: https://www.youtube.com/playlist?list=PLV34fyAxhmQPnz2obH3cDPjY-whXGBKRp
playlistInfo(process.env.API_KEY, 'PLV34fyAxhmQPnz2obH3cDPjY-whXGBKRp').then(playlistItems => {
  console.log(playlistItems);
  console.log(playlistItems.length);
}).catch(console.error);