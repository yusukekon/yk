define(['yk/event'], function() {

    yk.package('yk.model');

    /**
     * @enum {string}
     */
    yk.model.EventType = {
        UPDATED: 'yk.Model.EventType.UPDATED',
        DELETED: 'yk.Model.EventType.DELETED'
    };

    /**
     * @param {*} target
     * @param {yk.Model.EventType} type
     * @param {*=} opt_data
     * @constructor
     * @inherits {yk.event.Event}
     */
    yk.model.Event = function(target, type, opt_data) {
        yk.super(this, target, type, opt_data);
    };
    yk.inherits(yk.model.Event, yk.event.Event);

    /**
     *
     * @param {Object=} opt_json
     * @constructor
     * @inherits {yk.event.EventTarget}
     */
    yk.model.Model = function(opt_json) {
        yk.super(this);
        if (opt_json) {
            this.load(opt_json);
        }
    };
    yk.inherits(yk.model.Model, yk.event.EventTarget);

    /**
     * @const
     */
    yk.Model = yk.model.Model;

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
     * @protected
     */
    yk.Model.prototype.get = function(json, name, opt_nullable, opt_default) {
        var nullable = opt_nullable || false;
        var val = json[name];
        if (val == null) {
            if (opt_default) {
                return opt_default;
            }
            if (nullable) {
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
     * @protected
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

    /** @override */
    yk.Model.prototype.fire = function(type, opt_data) {
        this.dispatchEvent(new yk.model.Event(this, type, opt_data));
    };

    /**
     * @param {!Object} data
     */
    yk.Model.prototype.modify = function(data) {
        yk.object.mixin(this, data, true);
        this.fire(yk.model.EventType.UPDATED);
    };
});
