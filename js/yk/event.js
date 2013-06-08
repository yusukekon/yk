define(['yk/base'], function() {

    yk.package('yk.event');

    /**
     * @param {*} target
     * @param {string} type
     * @param {Object=} opt_data
     * @constructor
     * @inherits {yk.Object}
     */
    yk.event.Event = function(target, type, opt_data) {
        yk.super(this);

        /**
         * @type {*}
         */
        this.target = target;

        /**
         * @type {string}
         */
        this.type = type;

        /**
         * @type {?*}
         */
        this.data = opt_data || null;
    };
    yk.inherits(yk.event.Event, yk.Object);

    /**
     * @constructor
     * @inherits {yk.Object}
     */
    yk.event.EventTarget = function() {
        yk.super(this);

        /**
         * @type {!Object.<string, Array.<function>>}
         * @private
         */
        this.handlers_ = {};
    };
    yk.inherits(yk.event.EventTarget, yk.Object);

    /** @override */
    yk.event.EventTarget.prototype.dispose = function() {
        yk.super(this, 'dispose');
        delete this.handlers_;
    };

    /**
     *
     * @param {!string} type
     * @param {!function} listener
     */
    yk.event.EventTarget.prototype.listen = function(type, listener) {
        if (!this.handlers_[type]) {
            this.handlers_[type] = [];
        }
        this.handlers_[type].push(listener);
    };

    /**
     *
     * @param {!string} type
     * @param {*=} opt_data
     */
    yk.event.EventTarget.prototype.fire = function(type, opt_data) {
        this.dispatchEvent(new yk.event.Event(this, type, opt_data));
    };

    /**
     * @param {yk.event.Event} evt
     */
    yk.event.EventTarget.prototype.dispatchEvent = function(evt) {
        var listeners = this.handlers_[evt.type];
        if (listeners) {
           listeners.forEach(function(each) {
                each.call(this, evt);
           }, this);
        }
    };

});
