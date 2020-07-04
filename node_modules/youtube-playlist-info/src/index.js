const youtube = require('youtube-api');
const fs = require('fs');

function playlistInfoRecursive(playlistId, callStackSize, pageToken, currentItems, customRequestAmount, callback) {
  youtube.playlistItems.list({
    part: 'snippet',
    pageToken: pageToken,
    maxResults: (customRequestAmount > 50 || !customRequestAmount ? 50 : customRequestAmount),
    playlistId: playlistId,
  }, function(err, data) {
    if (err) return callback(err);
    for (const x in data.items) {
      currentItems.push(data.items[x].snippet);
    }
    if (data.nextPageToken && (customRequestAmount > 50 || !customRequestAmount)) {
      playlistInfoRecursive(playlistId, callStackSize + 1, data.nextPageToken, currentItems, (customRequestAmount > 50 ? customRequestAmount - 50 : customRequestAmount), callback);
    } else {
      callback(null, currentItems);
    }
  });
}

module.exports = function playlistInfo(apiKey, playlistId, options) {
  return new Promise((resolve, reject) => {
    if (!apiKey) return reject(new Error('No API Key Provided'));
    if (!playlistId) return reject(new Error('No Playlist ID Provided'));
    if (!options) options = {};
    youtube.authenticate({
      type: 'key',
      key: apiKey
    });
    playlistInfoRecursive(playlistId, 0, null, [], options.maxResults || null, (err, list) => {
      if (err) return reject(err);
      return resolve(list);
    });
  });
};