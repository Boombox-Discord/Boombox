///////////////////////////////////////////////////////////////////////
// ytsearcher by (@wzhouwzhou/https://github.com/wzhouwzhou).        //
// Code ©2017-Present William Zhou under the Apache License 2.0      //
///////////////////////////////////////////////////////////////////////

const { YTSearcher } = require('./lib/struct/YTSearcher');
const { YTSearch } = require('./lib/struct/YTSearch');
const { YTSearchPage } = require('./lib/struct/YTSearchPage');

const { validOptions } = require('./lib/deps/Constants');

module.exports = {
  YTSearcher,
  YTSearch,
  YTSearchPage,
  validOptions,
  version: require('./package.json').version,
};
