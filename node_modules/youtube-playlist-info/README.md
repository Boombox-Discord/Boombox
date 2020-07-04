# Youtube Playlist Info

Youtube Playlist Info is a library that fetches all the information for the songs within a playlist then returns them as one big array. This abstracts away the annoying paging of requests that have to be done when handling the API manually.

The library does not currently emit progress events, however pull requests are welcome.

# Usage
```js
const ypi = require('youtube-playlist-info');
ypi("YouTube API Key", "Playlist ID").then(items => {
  console.log(items);
}).catch(console.error);
```

# Options

- `maxResults` - The maxmimum amount of results to return from the playlist, starting from 0.

### Options Example
```js
const ypi = require('youtube-playlist-info');
const options = {
  maxResults: 25
};
ypi("YouTube API Key", "Playlist ID", options).then(items => {
  console.log(items);
}).catch(console.error);
```

# Installation
```sh
npm install --save youtube-playlist-info
```

# Testing

```sh
set API_KEY=YouTube API Key
npm test
```

This should just spit out a bunch of items in the playlist followed by the length of the playlist.
