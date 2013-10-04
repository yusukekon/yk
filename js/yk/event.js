define(['yk/base'], function() {

    yk.package('yk.event');

    /**
     * @param {string} type
     * @param {Object=} opt_data
     * @param {*=} opt_target
     * @constructor
     * @extends {yk.Object}
     */
    yk.event.Event = function(type, opt_data, opt_target) {
        yk.super(this);

        /**
         * @type {string}
         */
        this.type = yk.assertString(type);

        /**
         * @type {?*}
         */
        this.data = opt_data || null;

        /**
         * @type {?*}
         */
        this.target = opt_target || null;
    };
    yk.inherits(yk.event.Event, yk.Object);

    /**
     * @constructor
     * @extends {yk.Object}
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
     * @param {*=} opt_scope
     */
    yk.event.EventTarget.prototype.listen = function(type, listener, opt_scope) {
        if (!this.handlers_[type]) {
            this.handlers_[type] = [];
        }
        var scope = opt_scope || this;
        this.handlers_[type].push(function() {
            listener.apply(scope, arguments);
        });
    };

    /**
     *
     * @param {!string} type
     * @param {*=} opt_data
     */
    yk.event.EventTarget.prototype.fire = function(type, opt_data) {
        this.dispatchEvent(new yk.event.Event(type, opt_data));
    };

    /**
     * @param {yk.event.Event} evt
     */
    yk.event.EventTarget.prototype.dispatchEvent = function(evt) {
        var listeners = this.getHandlers(yk.assertInstanceof(evt, yk.event.Event).type);
        if (!evt.target) {
            evt.target = this;
        }
        listeners && listeners.forEach(function(each) {
            each.call(this, evt);
        }, this);
    };

    /**
     * @param {string} type
     * @return {Array.<function>}
     * @protected
     */
    yk.event.EventTarget.prototype.getHandlers = function(type) {
        return this.handlers_[type];
    };
});
