# get-src [![Build Status](https://travis-ci.org/radiovisual/get-src.svg?branch=master)](https://travis-ci.org/radiovisual/get-src) [![Coverage Status](https://coveralls.io/repos/github/radiovisual/get-src/badge.svg?branch=master)](https://coveralls.io/github/radiovisual/get-src?branch=master)

> Get the &#39;src&#39; value from any string containing a src=&#34;&#34; (embed, iframe, html, etc).


## Install

```
$ npm install --save get-src
```


## Usage

```js
const getSrc = require('get-src');

getSrc('<image src="image.png" />');
//=> 'image.png'

getSrc('<iframe width="400" height="300" src="video.mp4"></iframe>');
//=> 'video.mp4'
```


## API

### getSrc(input)

#### input

Type: `string`

The string containing the `src=""` from which you want to extract the src value.

## Double Quotes Only

Currently, there is only support for double quotes, meaning the value you want to extract must
rest inside two double quotes:

**Valid**
```js
src="this is valid"
```

**Invalid**
```js
src='this will return undefined'
```

**Pull requests are welcome if you want to add support for double AND single quotes.**

## License

MIT © [Michael Wuergler](http://numetriclabs.com)
