'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

////////////////////////
// YTSearchPage Class //
////////////////////////

/**
 * YTSearchPage extends Array
 * Class to represent a youtube search result page.
 *
 * @type {YTSearchPage}
 */
const YTSearchPage = class YTSearchPage extends Array {
  /**
   * constructor - Creates a YTSearchPage
   *
   * @param  {Array} items  - A list of youtube#searchResult
   */
  constructor(items) {
    super(0);

    if (!Array.isArray(items)) return;
    for (const item of items) {
      const currentEntry = {};
      (() => {
        currentEntry.kind = item.id.kind;
        switch (item.id.kind) {
          case 'youtube#channel': {
            currentEntry.url = `https://www.youtube.com/channel/${item.id.channelId}`;
            currentEntry.id = item.id.channelId;
            return; }
          case 'youtube#playlist': {
            currentEntry.url = `https://www.youtube.com/playlist?list=${item.id.playlistId}`;
            currentEntry.id = item.id.playlistId;
            return; }
          case 'youtube#video': {
            currentEntry.url = `https://www.youtube.com/watch?v=${item.id.videoId}`;
            currentEntry.id = item.id.videoId;
          }
        }
      })();
      const snip = item.snippet;

      Object.assign(currentEntry, {
        publishedAt: new Date(snip.publishedAt),
        channelId: snip.channelId,
        title: snip.title,
        description: snip.description,
        thumbnails: snip.thumbnails,
        channelTitle: snip.channelTitle,
        liveBroadcastContent: snip.liveBroadcastContent,
      });

      this.push(currentEntry);
    }
  }

  /**
   * Gets the first item in this array of search results.
   *
   * @method first
   * @memberof YTSearchPage
   * @instance
   * @return {Object} A Search Result element.
   */
  first() {
    return this[0] || null;
  }

  /**
   * Gets the last item in this array of search results.
   *
   * @method last
   * @memberof YTSearchPage
   * @instance
   * @return {Object} A Search Result element.
   */
  last() {
    return this[this.length - 1] || null;
  }
};

exports.YTSearchPage = YTSearchPage;
