"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cache = function () {
    function cache() {
        _classCallCheck(this, cache);

        this.entries = {};
    }

    _createClass(cache, [{
        key: "get",
        value: function get(key) {
            return this.entries[key] !== undefined ? this.entries[key] : false;
        }
    }, {
        key: "set",
        value: function set(key, value, timeout) {
            var self = this;
            this.entries[key] = value;

            if (timeout) {
                setTimeout(function () {
                    console.log("Cache for " + key + " expired!!");
                    self.delete(key);
                }, timeout);
            }
        }
    }, {
        key: "delete",
        value: function _delete(key) {
            delete this.entries[key];
        }
    }]);

    return cache;
}();

exports.default = cache;