var _xwrap = require('./_xwrap');
var isArrayLike = require('../isArrayLike');


module.exports = (function() {
    function _arrayReduce(xf, acc, list) {
        var idx = -1, len = list.length;
        while (++idx < len) {
            acc = xf.step(acc, list[idx]);
            if (acc && acc.__transducers_reduced__) {
                acc = acc.value;
                break;
            }
        }
        return xf.result(acc);
    }

    function _iterableReduce(xf, acc, iter) {
        var step = iter.next();
        while (!step.done) {
            acc = xf.step(acc, step.value);
            if (acc && acc.__transducers_reduced__) {
                acc = acc.value;
                break;
            }
            step = iter.next();
        }
        return xf.result(acc);
    }

    var symIterator = (typeof Symbol !== 'undefined') ? Symbol.iterator : '@@iterator';
    return function _reduce(fn, acc, list) {
        if (typeof fn === 'function') {
            fn = _xwrap(fn);
        }
        if (isArrayLike(list)) {
            return _arrayReduce(fn, acc, list);
        }
        if (list[symIterator] != null) {
            return _iterableReduce(fn, acc, list[symIterator]());
        }
        if (typeof list.next === 'function') {
            return _iterableReduce(fn, acc, list);
        }
        throw new TypeError('reduce: list must be array or iterable');
    };
})();