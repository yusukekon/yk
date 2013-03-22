yk.package('yk.ui.control');

/**
 * @inherits {yk.ui.Component}
 * @constructor
 */
yk.ui.control.AbstractControl = function() {
    this.super();
};
yk.inherits(yk.ui.control.AbstractControl, yk.ui.Component);

/**
 * @return {new yk.ui.control.TextboxBuilder}
 */
yk.ui.control.textbox = function() {
    return new yk.ui.control.TextboxBuilder();
};

/**
 * @inherits {yk.Object}
 * @constructor
 */
yk.ui.control.TextboxBuilder = function() {
    this.super();
};
yk.inherits(yk.ui.control.AbstractControl, yk.Object);


/**
 * @inherits {yk.ui.control.AbstractControl}
 * @constructor
 */
yk.ui.control.Textbox = function() {
    this.super();

    /**
     * @type {string}
     * @private
     */
    this.value_ = null;
};
yk.inherits(yk.ui.control.Textbox, yk.ui.control.AbstractControl);

/** @override */
yk.ui.control.Textbox.prototype.createDom = function() {
    var $dom = this.super();
};

yk.ui.control
