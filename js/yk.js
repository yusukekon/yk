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
define(['../3rd-party/jquery-1.9.1.js', '../3rd-party/jquery-template.min.js', 'base'], function() {
    require(yk.modules);
    return yk;
});
