'use strict';
module.exports = function (input) {
	if (typeof input !== 'string') {
		throw new TypeError('get-src expected a string');
	}
	var re = /src="(.*?)"/gm;
	var url = re.exec(input);

	if (url && url.length >= 2) {
		return url[1];
	}
};
