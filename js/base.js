/**
 * @const
 */
var yk = yk || {};

yk.global = this;

/**
 * @param {!Object} childClass
 * @param {!Object} parentClass
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
 * @param {!Object} self
 * @param {string=} opt_name
 * @param {...*} var_args
 * @return {*}
 */
yk.super = function(self, opt_name, var_args) {
    var caller = arguments.callee.caller;
    if (caller.__super__) {
        return caller.__super__.constructor.apply(self, yk.slice(arguments, 1));
    }
    if (!opt_name) {
        throw Error('name must be not null');
    }
    return self.constructor.__super__[opt_name].apply(self, yk.slice(arguments, 2));
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
 * @TODO ちゃんとする
 * @return {number}
 */
yk.generateUniqueId = function() {
    return String(Math.floor(Math.random() * 1000000));
};

/**
 * @constructor
 */
yk.Object = function() {
    /**
     * @type {string}
     * @private
     */
    this.objectId_ ;
};
yk.inherits(yk.Object, Object);

/**
 * @return {string}
 */
yk.Object.prototype.hashcode = function() {
    return this.objectId_ || (this.objectId_ = yk.generateUniqueId());
};

/**
 *
 * @param {*} target
 * @return {boolean}
 */
yk.Object.prototype.equals = function(target) {
    if (!target || !(target instanceof yk.Object)) {
        return false;
    }
    return (this === target && this.hashcode() === target.hashcode());
}
