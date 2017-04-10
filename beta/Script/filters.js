/*global angular */
angular.module('D3ClassFilter', []).filter('class', function () {
    'use strict';
    return function (items, uClass) {
        if (uClass === '') { return items; }
        var rItems = [];
        angular.forEach(items, function (item, key) {
            if (item.Class.contains(uClass)) {
                rItems.push(item);
            }
        });
        return rItems;
    };
});

Array.prototype.contains = function (obj) {
    'use strict';
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};