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
yk.modules = ['event', 'util', 'net', 'model', 'ui'].map(function(module) {
    return 'yk/' + module;
});


/**
 * load framework
 */
define(['yk/base'], function() {
    return yk;
});
