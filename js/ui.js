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
            
    this.createDom();
};
yk.inherits(yk.ui.Component, yk.Object);

/**
 * @protected
 */
yk.ui.Component.prototype.createDom = function() {
    this.$el_ = $('<div>');
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
        throw new Error('element must not be null');
    }
    var parentEl = opt_parentEl || document.body;
    this.$el_.appendTo(parentEl); 
};

/**
 * @param {string} url
 * @param {string=} opt_dataType
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.ui.DynamicComponent = function(url, opt_dataType) {
    /**
     * @type {string}
     */
    this.url_ = url;

    /**
     * @type {string}
     */
    this.dataType_ = opt_dataType || 'json';

    yk.super(this);
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
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.ui.control.Textbox = function() {
    yk.super(this);

    /**
     * @private
     * @type {string}
     */
    this.value_ = null;
};
yk.inherits(yk.ui.control.Textbox, yk.ui.Component);

/** @override */
yk.ui.control.Textbox.prototype.createDom = function() {
    this.$el_ = $('<div class="control-textbox"><input type="text"></div>');
};
