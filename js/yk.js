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
    'templates', 'event', 'util', 'net', 'model', 'ui'
];

requirejs.config({
    paths: {
        'jquery': '../3rd-party/jquery-1.9.1',
        'jquery-template': '../3rd-party/jquery-template.min'
    }
});

/**
 * load framework
 */
define(['jquery', 'base'], function() {
    require(['jquery-template'], function() {
        require(yk.modules);
    });
    return yk;
});
