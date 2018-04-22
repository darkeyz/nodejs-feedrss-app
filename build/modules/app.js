'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.main = undefined;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _xmldom = require('xmldom');

var _cache = require('./cache');

var _cache2 = _interopRequireDefault(_cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var RSSCache = new _cache2.default();
/*
console.log(RSSCache.get('pippo'))
RSSCache.set('pippo','pluto')
console.log(RSSCache.get('pippo'))
setTimeout(() => {
    console.log(RSSCache.get('pippo'))
}, 1000);
*/

//Api keys
var api_url = 'https://content.guardianapis.com/search';
var api_key = 'e8e99174-a76b-4eb4-801f-c6998511fe70';

//Main request function 
var main = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(url) {
        var status, msg, validUrl, validRss, uppercase, feeds;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log("URL:", url);
                        status = void 0, msg = void 0, validUrl = void 0, validRss = void 0;
                        uppercase = url.match(/[A-Z]/);

                        if (!(uppercase !== null || !url.match(/[a-z]+/))) {
                            _context.next = 9;
                            break;
                        }

                        console.log("Url not valid");
                        status = 404;
                        msg = "Url not valid";
                        _context.next = 25;
                        break;

                    case 9:
                        feeds = RSSCache.get(url);

                        if (feeds) {
                            _context.next = 22;
                            break;
                        }

                        _context.next = 13;
                        return getFeeds(url);

                    case 13:
                        feeds = _context.sent;
                        _context.next = 16;
                        return validateFeeds(feeds);

                    case 16:
                        validRss = _context.sent;

                        validRss = new _xmldom.DOMParser().parseFromString(validRss, 'text/xml').documentElement.getElementsByTagName('m:validity')[0].textContent;
                        if (validRss !== "true") {
                            console.log("RSS not valid");
                            status = 500;
                            msg = "RSS not valid";
                        } else {
                            console.log("RSS valid new");
                            status = 200;
                            msg = feeds;
                        }
                        //RSSCache.set(url, feeds, 10000)
                        RSSCache.set(url, feeds, 600000);
                        _context.next = 25;
                        break;

                    case 22:
                        console.log("RSS valid cached");
                        status = 200;
                        msg = RSSCache.get(url);

                    case 25:
                        return _context.abrupt('return', { status: status, msg: msg });

                    case 26:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function main(_x) {
        return _ref.apply(this, arguments);
    };
}();

//Replace xml special characters in entities
var replaceSpecialChars = function replaceSpecialChars(str) {
    return str.replace('<', '&lt;').replace('&', '&amp;').replace('>', '&gt;').replace('\"', '&quot;').replace('\'', '&apos;');
};

//Create xml from The guardian data
var toXmlRss = function toXmlRss(feeds) {
    var feedsXml = "<?xml version='1.0' encoding='UTF-8' ?><rss version = '2.0' >";

    feedsXml += "<channel>";
    feedsXml += "<title>" + "The Guardian news" + "</title>";
    feedsXml += "<description>" + "Latest international news, sport and comment from the Guardian" + "</description>";
    feedsXml += "<link>" + "https://www.theguardian.com" + "</link>";

    for (var i = 0; i < feeds.length; i++) {
        //console.log(i);
        feedsXml += "<item>";
        //feedsXml += "<title>" + feeds[i].webTitle.replace('&','&amp;') + "</title>"
        feedsXml += "<title>" + replaceSpecialChars(feeds[i].webTitle) + "</title>";
        feedsXml += "<description>" + replaceSpecialChars(feeds[i].webTitle) + "</description>";
        feedsXml += "<link>" + replaceSpecialChars(feeds[i].webUrl) + "</link>";
        feedsXml += "</item>";
        //console.log>feedsXml);
    }

    feedsXml += "</channel>";
    feedsXml += "</rss>";
    return feedsXml;
};

//Get feeds from The Guardian
var getFeeds = function getFeeds(url) {
    return new Promise(function (resolve) {
        var param = url.split('/');
        _axios2.default.get(api_url, {
            params: {
                q: param[1],
                'api-key': api_key,
                'format': 'json'
            }
        }).then(function (response) {
            var data = response.data;
            var feeds = response.data.response.results;
            resolve(toXmlRss(feeds));
        }).catch(function (error) {
            console.log(error);
        });
    });
};

//Validate RSS from w3 SOAP validator service
var validateFeeds = function validateFeeds(feeds) {
    return new Promise(function (resolve) {
        var uri = "http://validator.w3.org/feed/check.cgi";
        _axios2.default.get(uri, {
            params: {
                rawdata: feeds,
                output: "soap12"
            }
        }).then(function (response) {
            resolve(response.data);
        }).catch(function (error) {
            console.log(error);
        });
    });
};

exports.main = main;