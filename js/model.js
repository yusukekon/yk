/**
 *
 * @param {Object=} opt_json
 * @constructor
 */
yk.Model = function(opt_json) {
    if (opt_json) {
        this.load(opt_json);
    }
};
yk.inherits(yk.Model, yk.EventTarget);

/**
 * @param {!Object} json
 */
yk.Model.prototype.load = function(json) {
};

/**
 * @param {!Object} json
 * @param {string} name
 * @param {boolean=} opt_nullable
 * @param {*=} opt_default
 * @return {*}
 * @private
 */
yk.Model.prototype.get = function(json, name, opt_nullable, opt_default) {
    var nullable = opt_nullable || false;
    var val = json[name];
    if (val == null) {
        if (opt_default) {
            return opt_default;
        }
        if (opt_nullable) {
            return null;
        }
        throw Error("No property exists: " + name);
    }
    return val;
};

/**
 *
 * @param {!Object} json
 * @param {string} name
 * @param {Array.<*>} opt_default
 * @return {Array.<*>}
 */
yk.Model.prototype.getAsArray = function(json, name, opt_default) {
    var value = this.get(json, name, false, opt_default || []);
    return yk.assertArray(value);
};

/**
 * @return {Object}
 */
yk.Model.prototype.toJSON = function() {
    return {};
};
