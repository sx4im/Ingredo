'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const noop = (any) => any;

exports.warning = noop;
exports.invariant = noop;
if (process.env.NODE_ENV !== "production") {
    exports.warning = (check, message) => {
        if (!check && typeof console !== "undefined") {
            console.warn(message);
        }
    };
    exports.invariant = (check, message) => {
        if (!check) {
            throw new Error(message);
        }
    };
}

exports.noop = noop;
