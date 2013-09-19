define(['3rd/jquery-template', 'yk/util', 'yk/net', 'yk/model', 'yk/templates'], function() {

    yk.package('yk.ui');

    /**
     * var c = yk.ui.Component();
     * c.render("#hoge");
     * c.render($element);
     *
     * @constructor
     * @extends {yk.Object}
     */
    yk.ui.Component = function() {
        yk.super(this);

        /**
         * @type {$}
         * @protected
         */
        this.$el_;

        /**
         * @type {yk.ui.Component|Element=}
         * @protected
         */
        this.parent_;

        /**
         * @type {Array.<yk.ui.Component>}
         * @protected
         */
        this.children_ = [];

        /**
         * @type {Array.<yk.ui.Component>}
         * @private
         */
        this.disposables_ = [];
    };
    yk.inherits(yk.ui.Component, yk.event.EventTarget);

    /**
     * @return {boolean}
     */
    yk.ui.Component.prototype.rendered = function() {
        return yk.isDef(this.$el_) && this.$el_.parent().length > 0;
    };

    /**
     * @protected
     */
    yk.ui.Component.prototype.createDom = function() {
        this.$el_ = $('<div>');
    };

    /**
     * @param {!yk.ui.Component} child
     */
    yk.ui.Component.prototype.addChild = function(child) {
        if (!this.$el_) {
            this.createDom();
        }
        child.render(this);
        this.children_.push(child);
    };

    /**
     * @return {$}
     */
    yk.ui.Component.prototype.getElement = function() {
        return this.$el_;
    };

    /**
     * @param {string} selector
     * @return {$}
     */
    yk.ui.Component.prototype.selector = function(selector) {
        return $(yk.assertString(selector), this.$el_);
    };

    /**
     * @return {yk.ui.Component|Element=}
     */
    yk.ui.Component.prototype.getParent = function() {
        return this.parent_;
    };

    /**
     * @return {Array.<yk.ui.Component>}
     */
    yk.ui.Component.prototype.getChildren = function() {
        return this.children_;
    };

    /**
     * @param {yk.ui.Component|Element=|string=} opt_parentEl
     * @param {boolean=} opt_force
     */
    yk.ui.Component.prototype.render = function(opt_parentEl, opt_force) {
        var force = opt_force || false;
        if (!this.$el_ || force) {
            this.createDom();
        }
        this.$el_.fadeIn();
        var parentEl = opt_parentEl || document.body;
        if (parentEl instanceof yk.ui.Component) {
            this.parent_ = parentEl;
            parentEl = this.parent_.getElement();
        }
        this.$el_.appendTo(parentEl);
    };

    /**
     */
    yk.ui.Component.prototype.show = function() {
        if (this.$el_) {
            this.$el_.show();
        }
    };

    /**
     * @param {boolean=} opt_disposeOnClose
     */
    yk.ui.Component.prototype.hide = function(opt_disposeOnClose) {
        if (this.$el_) {
            this.$el_.fadeOut();
        }

        var disposeOnClose = yk.isDef(opt_disposeOnClose) ? yk.assertBoolean(opt_disposeOnClose) : false;
        if (disposeOnClose) {
            var self = this;
            setTimeout(function () {
                self.dispose();
            }, 1000);
        }
    };

    /**
     * @param {yk.ui.Component} target
     */
    yk.ui.Component.prototype.registerDisposable = function(target) {
        this.disposables_.push(target);
    };

    /** @override */
    yk.ui.Component.prototype.dispose = function() {
        yk.super(this, 'dispose');

        if (this.$el_) {
            this.$el_.remove();
            delete this.$el_;
        }
        if (this.parent_) {
            delete this.parent_;
        }
        if (this.children_) {
            this.children_.forEach(function(child) {
                child.dispose();
            });
            delete this.children_;
        }
        if (this.disposables_) {
            this.disposables_.forEach(function(each) {
                each.dispose();
            });
            delete this.disposables_
        }
    };

    /**
     * @param {!string} type
     * @param {!function} listener
     * @param {Object=} opt_scope
     */
    yk.ui.Component.prototype.bind = function(type, listener, opt_scope) {
        if (!this.$el_) {
            this.createDom();
        }
        var self = this;
        var scope = opt_scope || this;
        this.$el_.bind(type, function(e) {
            listener.call(scope, {
                target: self,
                wrapped: e
            });
        });
    };

    /**
     *
     * @param {!string} type
     * @param {*=} opt_data
     */
    yk.ui.Component.prototype.trigger = function(type, opt_data) {
        this.$el_.trigger(type, opt_data);
    };


    /**
     * @param {string} url
     * @param {string=} opt_dataType
     * @constructor
     * @extends {yk.ui.Component}
     */
    yk.ui.DynamicComponent = function(url, opt_dataType) {
        yk.super(this);

        /**
         * @type {string}
         * @private
         */
        this.url_ = url;

        /**
         * @type {string}
         * @private
         */
        this.dataType_ = opt_dataType || 'json';

        /**
         * @type {Deferred}
         * @private
         */
        this.$deferred_;
    };
    yk.inherits(yk.ui.DynamicComponent, yk.ui.Component);

    /** @override */
    yk.ui.DynamicComponent.prototype.createDom = function() {
        var self = this;
        this.$deferred_ = yk.net.get(this.url_).as(yk.net.DataType.JSON).send(function(resp) {
            self.createDynamicDom(resp);
        }).fail(function(xhr) {
            self.failure(xhr);
        });
    };

    /** @override */
    yk.ui.DynamicComponent.prototype.render = function(opt_parentEl) {
        if (!this.$el_) {
            this.createDom();
        }

        var self = this;
        var parentEl = opt_parentEl || document;
        this.$deferred_.always(function() {
            self.$el_ && yk.ui.Component.prototype.render.call(self, parentEl);
        });
    };

    /**
     * @return {Deferred}
     */
    yk.ui.DynamicComponent.prototype.getDeferred = function() {
        return this.$deferred_;
    };

    /**
     * @param {Object} data
     */
    yk.ui.DynamicComponent.prototype.createDynamicDom = yk.abstractMethod;

    /**
     * @param {xhr} xhr
     */
    yk.ui.DynamicComponent.prototype.failure = yk.nullFunction;


    /**
     * @param {yk.ui.DynamicComponent} target
     * @param {string|Element} opt_parentEl
     * @constructor
     * @extends {yk.ui.Component}
     */
    yk.ui.Loading = function(target, opt_parentEl) {

        /**
         * @type {yk.ui.DynamicComponent}
         * @private
         */
        this.target_ = yk.assertInstanceof(target, yk.ui.DynamicComponent);

        /**
         * @type {yk.ui.Component|Element=|string=} opt_parentEl
         * @private
         */
        this.parentEl_ = opt_parentEl || yk.global.document.body;
    };
    yk.inherits(yk.ui.Loading, yk.ui.Component);

    /** @override */
    yk.ui.Loading.prototype.createDom = function() {
        this.$el_ = $(yk.templates.loading);
    };

    yk.ui.Loading.prototype.render = function(opt_parentEl, opt_force) {
        yk.super(this, 'render', opt_parentEl || this.parentEl_, opt_force);
        this.target_.render(this.parentEl_);

        var self = this;
        this.target_.getDeferred().always(function() {
            self.dispose();
        });
    };
});
