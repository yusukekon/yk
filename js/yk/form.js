define(['yk/net', 'yk/ui/control'], function() {

    /**
     *
     * @param {string} uri
     * @param {yk.net.Method=} opt_method
     * @constructor
     * @inherits {yk.Object}
     */
    yk.Form = function(uri, opt_method) {
        yk.super(this);

        /**
         * @type {string}
         * @private
         */
        this.uri_ = uri;

        /**
         * @type {yk.net.Method}
         * @private
         */
        this.method_ = opt_method || yk.net.Method.POST;

        /**
         * @type {Array.<yk.ui.Control>}
         * @private
         */
        this.inputs_ = [];
    };
    yk.inherits(yk.Form, yk.Object);

    /**
     * @param {function} callback
     * @param {function=} opt_errback
     * @param {*=} opt_scope
     * @param {boolean=} opt_safe
     * @return {Deferred}
     */
    yk.Form.prototype.submit = function(callback, opt_errback, opt_scope, opt_safe) {
        var unlock = yk.nullFunction;
        if (!yk.isDef(opt_safe) || opt_safe) {
            unlock = this.lock_();
        }
        var data = yk.net.serialize(this.inputs_.map(function(each) {
            return each.toHttpKeyValue();
        }));
        return this.submitInternal_(data, callback, opt_errback, opt_scope).always(unlock);
    };

    /**
     * @param {yk.ui.Control} control
     */
    yk.Form.prototype.registerInput = function(control) {
        this.inputs_.push(yk.assertInstanceof(control, yk.ui.Control));
    };

    /**
     * @param {string} data
     * @param {function} callback
     * @param {function=} opt_errback
     * @param {*=} opt_scope
     * @return {Deferred}
     * @private
     */
    yk.Form.prototype.submitInternal_ = function(data, callback, opt_errback, opt_scope) {
        var scope = opt_scope || this;
        return yk.net.post(this.uri_, data).as(yk.net.DataType.JSON).send(function(resp) {
            callback.call(scope, resp);
        }).fail(function(xhr) {
            if (opt_errback) {
                opt_errback.call(scope, xhr);
            }
        });
    };

    /**
     * @param {number} opt_timeout
     * @return {function}
     * @private
     */
    yk.Form.prototype.lock_ = function(opt_timeout) {
        var locked = [];
        this.inputs_.forEach(function(each) {
            // 元々 disabled な要素には何もしない
            if (each.rendered() && !each.disabled()) {
                each.disabled(true) ;
                locked.push(each);
            }
        });
       return function() {
            locked.forEach(function(each) {
                each.disabled(false) ;
            });
       };
    };

});
