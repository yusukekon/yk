/**
 * @const
 */
var yk = yk || {};

yk.global = this;

/**
 * @param {Object} childClass
 * @param {Object} parentClass
 */
yk.inherits = function(childClass, parentClass) {
  /** @constructor */
  function temp() {};
  temp.prototype = parentClass.prototype;
  childClass.__super__ = parentClass.prototype;
  childClass.prototype = new temp();
  /** @override */
  childClass.prototype.constructor = childClass;
};

/**
 * @param {string} def
 */
yk.package = function(def) {
    var parent = yk.global;
    def.split('.').forEach(function(name) {
        if (!parent.hasOwnProperty()) {
            parent[name] = {};
        }
        parent = parent[name];
    });
};

/**
 * @return {function}
 */
yk.nullFunction = function() {};

/**
 * @return {funtion}
 */
yk.abstractFuntion = function() {
    throw Error('not implemented');
};

/**
 * @param {Object} array
 * @param {number=} opt_index
 * @return {Array}
 */
yk.slice = function(array, opt_index) {
    var i = opt_index || 0;
    return Array.prototype.slice.call(array, i);
};

/**
 * @constructor
 */
yk.Object = function() {
};
yk.inherits(yk.Object, Object);

/**
 * @param {string=} opt_name
 * @param {...*} var_args
 * @return {*}
 * @protected
 */
yk.Object.prototype.super = function(opt_name, var_args) {
    var caller = arguments.callee.caller;
    if (caller.__super__) {
        return caller.__super__.constructor.apply(this, arguments);
    }
    var args = yk.slice(arguments);
    return this.constructor.__super__[args[0]].apply(this, args.slice(1));
};
