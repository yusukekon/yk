yk.package('yk.ui');
yk.package('yk.ui.control');

/**
 * var c = yk.ui.Component();
 * c.render("#hoge");
 * c.render($element);
 * 
 * @constructor
 * @inherits {yk.Object}
 */
yk.ui.Component = function() {
    yk.super(this);

    /**
     * @type {$}
     * @private
     */
    this.$el_;
};
yk.inherits(yk.ui.Component, yk.Object);

/**
 * @protected
 */
yk.ui.Component.prototype.createDom = function() {
    this.$el_ = $('<div>');
};

/**
 * @param {!yk.ui.Component} component
 */
yk.ui.Component.prototype.addChild = function(child) {
    child.render(this.$el_);
    this.$el_.append(child);
};

/**
 *
 * @return {$}
 */
yk.ui.Component.prototype.getElement = function() {
    return this.$el_;
};

/**
 * @param {Element=|string=} opt_parentEl
 */
yk.ui.Component.prototype.render = function(opt_parentEl) {
    if (!this.$el_) {
        this.createDom();
    }
    var parentEl = opt_parentEl || document.body;
    this.$el_.appendTo(parentEl); 
};

/**
 * @param {!string} type
 * @param {!function} listener
 */
yk.ui.Component.prototype.bind = function(type, listener) {
    this.$el_.bind(type, listener);
};

/**
 * @param {string} url
 * @param {string=} opt_dataType
 * @constructor
 * @inherits {yk.ui.Component}
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
    this.$deferred;
};
yk.inherits(yk.ui.DynamicComponent, yk.ui.Component);

/** @override */
yk.ui.DynamicComponent.prototype.createDom = function() {
    var self = this;
    this.$deferred = $.ajax({
        url: this.url_,
        dataType: this.dataType_
    }).done(function(data) {
        self.createDynamicDom(data);
    });
};

/** @override */
yk.ui.DynamicComponent.prototype.render = function(opt_parentEl) {
    if (!this.$el_) {
        this.createDom();
    }

    var self = this;
    this.$deferred.done(function() {
        yk.ui.Component.prototype.render.call(self, opt_parentEl);
    });
};

/**
 * @param {Object} data 
 */
yk.ui.DynamicComponent.prototype.createDynamicDom = yk.abstractMethod;

/**
 * @param {xhr} xhr
 */
yk.ui.DynamicComponent.prototype.failure = yk.abstractMethod;


/**
 *
 * @param opt_options
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.ui.control.AbstractControl = function(opt_options) {
    /**
     *
     * @type {!Object}
     * @private
     */
    this.options_ = opt_options || {};
};
yk.inherits(yk.ui.control.AbstractControl, yk.ui.Component);

/**
 * @param {Object=} opt_options
 * @constructor
 * @inherits {yk.ui.control.AbstractControl}
 */
yk.ui.control.Textbox = function(opt_options) {
    yk.super(this, opt_options);

    /**
     * @type {$}
     * @private
     */
    this.$input_;
};
yk.inherits(yk.ui.control.Textbox, yk.ui.control.AbstractControl);

/** @override */
yk.ui.control.Textbox.prototype.createDom = function() {
    this.$input_ = $('<input type="text">').attr(this.options_);
    this.$el_ = $('<span class="control-textbox">').append(this.$input_);
};

/**
 * @param {string=} opt_value
 * @return {string}
 */
yk.ui.control.Textbox.prototype.value = function(opt_value) {
    if (opt_value === undefined) {
        return this.$input_.val();
    }
    return this.$input_.val(opt_value).value();
};

/**
 * @param {Object=} opt_options
 * @constructor
 * @inherits {yk.ui.control.AbstractControl}
 */
yk.ui.control.Button = function(opt_options) {
    yk.super(this, opt_options);
};
yk.inherits(yk.ui.control.Button, yk.ui.control.AbstractControl);

/** @override */
yk.ui.control.Button.prototype.createDom = function() {
    var $button= $('<input type="button">').attr(this.options_);
    this.$el_ = $('<span class="control-button">').append($button);
};
