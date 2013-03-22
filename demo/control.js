yk.package('yk.demo');

/**
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.demo.ControlComponent = function() {
    yk.super(this);

    /**
     * @type {yk.ui.control.Textbox}
     * @private
     */
    this.textbox_;

    /**
     * @type {yk.ui.control.Button}
     * @private
     */
    this.button_;

    /**
     * @type {yk.ui.control.Checkbox}
     * @private
     */
    this.checkbox_;
};
yk.inherits(yk.demo.ControlComponent, yk.ui.Component);

/** @override */
yk.demo.ControlComponent.prototype.createDom = function() {
    this.$el_ = $('<div>');

    this.textbox_ = new yk.ui.control.Textbox({
        placeholder: 'demo'
    });
    this.addChild(this.textbox_);

    this.button_ = new yk.ui.control.Button({
        value: 'show'
    });
    this.addChild(this.button_);

    var self = this;
    this.button_.bind('click', function(evt) {
        var value = self.textbox_.value();
        if (value !== '') {
            window.alert(value);
        }
    });
    this.$el_.append($('<div>'));

    this.checkbox_ = new yk.ui.control.Checkbox({
        name: 'check',
        value: '1'
    }, 'check1');
    this.addChild(this.checkbox_);

    this.checkbox_.bind('change', function(evt) {
        var el = evt.target;
        if (el.checked()) {
            window.alert(el.value())
        }
    });
};
