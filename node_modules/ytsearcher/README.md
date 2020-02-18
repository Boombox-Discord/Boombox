<div align="center">
    <br />
    <p>
        <a href="https://www.codacy.com/app/wzhouwzhou/ytsearcher?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=wzhouwzhou/ytsearcher&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/1c131140d5974a798c4c2509df7bd452" alt="Codacy Badge" /></a>
        <a href="https://www.npmjs.com/package/ytsearcher"><img src="https://img.shields.io/npm/v/ytsearcher.svg" alt="NPM version" /></a>
        <a href="https://www.npmjs.com/package/ytsearcher"><img src="https://img.shields.io/npm/dt/ytsearcher.svg" alt="NPM downloads" /></a>
        <a href="https://david-dm.org/wzhouwzhou/ytsearcher"><img src="https://img.shields.io/david/wzhouwzhou/ytsearcher.svg" alt="Dependencies" /></a>
        <a href="https://snyk.io/test/npm/ytsearcher"><img src="https://snyk.io/test/npm/ytsearcher/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/ytsearcher" style="max-width:100%;"></a>
        <a href="https://paypal.me/wzhouwzhou"><img src="https://img.shields.io/badge/donate-paypal-009cde.svg" alt="Paypal" /></a>
    </p>
    <p>
        <a href="https://nodei.co/npm/ytsearcher/"><img src="https://nodei.co/npm/ytsearcher.png?stars=true&downloads=true"></a>
    </p>
</div>

# YTSearcher
## A nodejs package that provides an easy-to-use promise-based system of getting youtube search results.

### Installing via NPM.

```$ npm install ytsearcher@1.2.2```

### Why ytsearcher?

• Modern and trustworthy (promises, es6, up-to-date) with thousands of downloads.

• Lightweight (packed size ~10kB) and NO other dependencies; this means **more productivity, less bloat**!

### I'm all about that! How do I start searching YouTube the right way?

**Creating the object:**

    const { YTSearcher } = require('ytsearcher');
    const searcher = new YTSearcher(apikey);

It's a good idea to get a key due to Google's rate limit on the API.
For details on how to obtain an API key and create a project visit [this link](https://developers.google.com/youtube/v3/getting-started)

By default the api key will be irretrievable.
To enable access to `searcher.key` create the object like so:

    const searcher2 = new YTSearcher({
      key: apiKey,
      revealkey: true,
    });

**To Perform Searches**

This package interacts directly with google's api. The base url can be retrieved by doing
```const { apiurl } = require('ytsearcher');```

    // result will be a YTSearch object.
    let resultA = await searcher.search('A Search Query');

    // You can customize your search with like so:
    let resultB = await searcher.search('Another Query', searchOptions)

A list of options is available [here](https://developers.google.com/youtube/v3/docs/search/list)

Or you can fetch the list via:
```const { validOptions } = require('ytsearcher');``` which will return the array.

**Examples**

    // For example, to grab only video results from a search query:
    let resultC = await searcher.search('A Third Query', { type: 'video' });

    // This shortcut will log the first search result (in the active page).
    console.log(result.first);

    // This will log the url of the first search result (in the active page).
    console.log(result.first.url);

### Pagination

**A YTSearch has a built in page flipper, which will update the properties of YTSearch, including search.first.**

    // These will return null when the last and first page have been hit (respectively).
    await result.nextPage();
    await result.prevPage();

    // result.currentPage is an array of objects containing the current active page in the search object.
    const currentPage = result.currentPage

    // To print everything in the current page.
    console.log(currentPage);

    // You can also get individual elements from it like so:
    console.log(currentPage.first());
    console.log(currentPage.last());
    console.log(currentPage[1]);

### Summary example to get the url of the second result on the second page of a video-only search (assuming both the page and the result exist):

**For async functions:**

    (async () => {

    const APIKEY = "12345"; // replace me
    const QUERY = "Anything you want"; // replace me too

    const { YTSearcher } = require('ytsearcher');
    const ytsearcher = new YTSearcher(APIKEY);

    // Type can be 'all', 'video', 'channel', 'playlist', or comma separated combination such as 'video,channel'
    const searchResult = await ytsearcher.search(QUERY, { type: 'video' });

    const secondPage = await searchResult.nextPage();
    // secondPage is same object as searchResult

    const page = secondPage.currentPage;
    const videoEntry = page[1];

    console.log(videoEntry.url);

    })();

**For completely non-async functions:**

    const APIKEY = "12345"; // replace me
    const QUERY = "Anything you want"; // replace me too

    const { YTSearcher } = require('ytsearcher');
    const ytsearcher = new YTSearcher(APIKEY);

    ytsearcher.search(QUERY, { type: 'video' })
    .then(searchResult => {

      searchResult.nextPage()
      .then(secondPage => {
        // secondPage is same object as searchResult

        const page = secondPage.currentPage;
        const videoEntry = page[1];

        console.log(videoEntry.url);
      });
    });

The Search Query can be anything, including a youtube link itself.

Searches may error, and if an error code is available it will be in the error. A list of possible errors responses is available here: [https://developers.google.com/analytics/devguides/reporting/core/v3/errors](https://developers.google.com/analytics/devguides/reporting/core/v3/errors)

Version:

    const version = require('ytsearcher').version;

Full docs are available here: [http://ytsearcher.willyz.cf](https://ytsearcher.willyz.cf)

Enjoy this package? Consider starring on [github](https://github.com/wzhouwzhou/ytsearcher) and checking out some of my other work:

[Fluent Filepaths](https://npmjs.com/easypathutil)

[Urban Dictionary](https://npmjs.com/easyurban)

Need support? Send me an email at wzhouwzhou@gmail.com, or connect with me on Discord at https://discord.gg/jj5FzF7 (William Zhou#0001)

Like what you're seeing? Consider helping to fund my education through https://paypal.me/wzhouwzhou  
