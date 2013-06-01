/**
 * @const
 */
var yk = yk || {};

/**
 * @type {*}
 */
yk.global = this;

/**
 * @type {boolean}
 * @const
 */
yk.DEBUG = true;

/**
 * @type {Array.<string>}
 */
yk.modules = [
    'templates', 'util', 'net', 'model', 'ui'
];

/**
 * load framework
 */
define(['base'], function() {
    require(yk.modules);
    return yk;
});
