'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const { YTSearch } = require('./YTSearch');

/////////////////////////////////////////////////////
// Private constants to hold sensitive information //
/////////////////////////////////////////////////////

const _key = new WeakMap();
const _protectkey = Symbol('_protectkey');

//////////////////////
// YTSearcher class //
//////////////////////

/**
 * YTSearcher
 * A utiliy class that allows searching for videos, channels, or playlists on YouTube.
 *
 * @type {YTSearcher}
 */

const YTSearcher = class YTSearcher {
  /**
   * constructor - Creates a YouTube Searcher object
   *
   * @param  {stringOrObject} apiKey    - A string representing the Api key, or an object with the keys: 'key' and an optional 'revealkey'.
   * If 'revealkey' is given a value of true access to the api key will not be protected.
   * @param  {Object=} [defaultoptions] - Optional default options to be used in every search.
   */
  constructor(apiKey, defaultoptions = {}) {
    let keyObj = false;

    if (typeof apiKey === 'object' && apiKey !== null && apiKey !== undefined) {
      if (!apiKey.hasOwnProperty('key')) {
        throw new SyntaxError(['Invalid Key',
          'The object you provide to create a YTSearcher must contain a property called key'].join('|'));
      }

      if (apiKey.hasOwnProperty('revealkey')) {
        Object.defineProperty(this, _protectkey, {
          value: typeof apiKey.revealkey === 'boolean' ? !apiKey.revealkey : true,
        });
      }

      keyObj = true;
    }

    _key.set(this, keyObj ? apiKey.key : apiKey);


    this.defaultoptions = defaultoptions;
  }

  set key(newKey) {
    _key.set(this, newKey);
  }

  get key() {
    return this[_protectkey] ? undefined : _key.get(this);
  }

  /**
   * search - searches a query with arbitrary options.
   *
   * @method search
   * @memberof YTSearcher
   * @instance
   * @param  {string} query     - The search query
   * @param  {Object} [options] - Custom options that override defaultoptions for this specific search.
   * @return {YTSearch}         - The YTSearch object
   */
  search(query, options) {
    return new YTSearch(query)
      .search(Object.assign({}, this.defaultoptions || {}, options || {}), { key: _key.get(this) });
  }
};

exports.YTSearcher = YTSearcher;
