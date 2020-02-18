'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

////////////////////////////////////
// Private keystore for searches  //
////////////////////////////////////
const _keystore = new WeakMap();

///////////////////////
// Utility constants //
///////////////////////
const querystring = require('querystring');
const { get } = require('https');
const Constants = require('../deps/Constants');
const { YTSearchPage } = require('./YTSearchPage');
const { determineType } = require('../deps/determineType');
/**
 * validOptions
 * An Array containing the valid keys search options may have
 *
 * @type {Array}
 */
const validOptions = Constants.validOptions;

/**
 * apiurl
 * A string representing Google's YouTube api url.
 *
 * @type {string}
 */
const apiurl = Constants.apiurl;

////////////////////
// YTSearch Class //
////////////////////

/**
 *  YTSearch class
 *  Represents a YouTube search result object that is returned by the YT Searcher
 *
 *  @type {YTSearch}
 */
const YTSearch = class YTSearch {
  /**
   * constructor - Creates a search object with a given query (but does not perform the actual search).
   *
   * @param  {string}   query - The Search query
   */
  constructor(query) {
    Object.defineProperties(this, {
      query: { value: query },
      timestamp: { value: Date.now() },
    });
  }

  /**
   * search - Performs a search with given options.
   *
   * @memberof YTSearch
   * @instance
   * @param {Object=}  [options={}] - Optional search options
   * @param {string=}  [apikey]     - The api key to use for this search.
   * If none is specified the last used apikey will be used in the search.
   * If this is the first time search() is invoked on this YTSearch apikey must be given.
   * @return {YTSearch}             - The YTSearch object populated with search results.
   */
  search(options, { key: apikey } = {}) {
    return new Promise((res, rej) => {
      this.options = Object.assign({}, options);

      if (!apikey && !_keystore.get(this)) rej(new Error('No token'));
      const theKey = apikey || _keystore.get(this);
      _keystore.set(this, theKey);

      const searchParams = {
        key: _keystore.get(this),
        maxResults: this.options.maxResults || 10,
        part: 'snippet',
        q: this.query,
        regionCode: this.options.regionCode || 'US',
        type: determineType(this.options.type),
      };

      for (const option of Object.keys(this.options)) {
        if (validOptions.includes(option)) searchParams[option] = options[option];
      }

      const queryUrl = `${apiurl}${querystring.stringify(searchParams)}`;
      const promise = new Promise((_res, _rej) => get(queryUrl, response => {
        let error = false;
        if (response.statusCode !== 200) {
          response.resume();
          error = true;
          // return _rej(new Error(`Error code: ${response.statusCode}`));
        }
        let chunks = [];
        response.on('error', _rej);
        response.on('data', chunk => chunks.push(chunk));
        response.on('close', () => _rej(new Error(`Response closed, code: ${response.statusCode}`)));
        return response.on('end', () => {
          try {
            const buf = Buffer.concat(chunks);
            if (error) return _rej(new Error(`Error code: ${response.statusCode} | Response from Google: ${buf.toString('utf-8')}`));
            return _res({ body: JSON.parse(buf) });
          } catch (err) {
            return _rej(err);
          }
        });
      }));

      promise.then(response => {
        const body = response.body;
        if (body.error) return rej(new Error(body.error.message));

        this.totalResults = body.pageInfo ? body.pageInfo.totalResults : null;
        this.pages = this.totalResults && body.pageInfo.resultsPerPage ? ~~(this.totalResults / body.pageInfo.resultsPerPage) + 1 : null;

        this.nextPageToken = body.nextPageToken;
        this.prevPageToken = body.prevPageToken;

        this.currentPage = new YTSearchPage(body.items);
        this.first = this.currentPage.first();

        return res(this);
      }).catch(error => rej(error));
    });
  }

  /**
   * nextPage - Updates the search object, populating it with data from the next page
   *
   * @memberof YTSearch
   * @instance
   * @method nextPage
   * @param  {Object=} [newOptions=this.options] - New search options, if given. Defaults to last used search options.
   * @return {YTSearch}                          - The Search result, or null if currentPage is already the last page.
   */
  nextPage(newOptions = this.options) {
    newOptions = Object.assign({}, newOptions, this.options);
    return new Promise(async(res, rej) => {
      if (!this.nextPageToken) res(null);

      try {
        res(await this.search(Object.assign(newOptions, { pageToken: this.nextPageToken })));
      } catch (err) {
        rej(err);
      }
    });
  }

  /**
   * prevPage - Updates the search object, populating it with data from the previous page
   *
   * @memberof YTSearch
   * @instance
   * @method prevPage
   * @param  {Object=} [newOptions=this.options] - New search options, if given. Defaults to last used search options.
   * @return {YTSearch}                          - The Search result, or null if currentPage is already the first page.
   */
  prevPage(newOptions = {}) {
    newOptions = Object.assign({}, newOptions, this.options);
    return new Promise(async(res, rej) => {
      if (!this.prevPageToken) res(null);

      try {
        res(await this.search(Object.assign(newOptions, { pageToken: this.prevPageToken })));
      } catch (err) {
        rej(err);
      }
    });
  }
};

exports.YTSearch = YTSearch;
