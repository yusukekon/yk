yk.package('yk.ui');

/**
 * var c = yk.ui.Component();
 * c.render("#hoge");
 * c.render($element);
 * 
 * @constructor
 * @inherits {yk.Object}
 */
yk.ui.Component = function() {
    this.super();

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

    this.super(yk.slice(arguments, 1));
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
