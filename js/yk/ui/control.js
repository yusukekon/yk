define(['yk/ui'], function() {

    yk.package('yk.ui.control');

    /**
     * @param {Object} opt_options
     * @constructor
     * @extends {yk.ui.Component}
     */
    yk.ui.Control = function(opt_options) {
        yk.super(this);

        /**
         *
         * @type {!Object}
         * @protected
         */
        this.options = opt_options || {};
    };
    yk.inherits(yk.ui.Control, yk.ui.Component);

    /**
     *
     * @param {!string} key
     * @param {*} value
     */
    yk.ui.Control.prototype.setOption = function(key, value) {
        this.options[key] = value;
    };

    /**
     * @param key
     * @param {*=} opt_default
     * @return {*}
     */
    yk.ui.Control.prototype.getOption = function(key, opt_default) {
        return this.options[key] || opt_default || null;
    };

    /**
     * @type {?string|Array.<string>}
     */
    yk.ui.Control.prototype.value = yk.abstractFuntion;

    /**
     * @param {boolean=} opt_disabled
     * @return {boolean}
     */
    yk.ui.Control.prototype.disabled = yk.abstractFuntion;

    /**
     * @return {yk.net.HttpKeyValue}
     */
    yk.ui.Control.prototype.toHttpKeyValue = function() {
        return new yk.net.HttpKeyValue(this.getOption('name'), this.value());
    };

    /**
     *
     * @param {Object} opt_options
     * @constructor
     * @extends {yk.ui.Control}
     */
    yk.ui.control.NativeControl = function(opt_options) {
        yk.super(this, opt_options);
    };
    yk.inherits(yk.ui.control.NativeControl, yk.ui.Control);

    /**
     * @return {$}
     */
    yk.ui.control.NativeControl.prototype.getInput = function() {
        return this.getElement();
    };

    /** @override */
    yk.ui.control.NativeControl.prototype.value = function() {
        return this.getInput() ? this.getInput().val() : this.getOption('value');
    };

    /** @override */
    yk.ui.control.NativeControl.prototype.disabled = function(opt_disabled) {
        if (yk.isDef(opt_disabled)) {
            var disabled = yk.assertBoolean(opt_disabled);
            this.getInput().prop('disabled', disabled);
            return disabled;
        }
        return this.getInput().prop('disabled');
    };

    /**
     *
     * @param {Object} opt_options
     * @constructor
     * @extends {yk.ui.Control}
     */
    yk.ui.control.CustomControl = function(opt_options) {
        yk.super(this, opt_options);
    };
    yk.inherits(yk.ui.control.CustomControl, yk.ui.Control);

    /**
     * @param {Object=} opt_options
     * @constructor
     * @extends {yk.ui.control.NativeControl}
     */
    yk.ui.control.Textbox = function(opt_options) {
        yk.super(this, opt_options);
    };
    yk.inherits(yk.ui.control.Textbox, yk.ui.control.NativeControl);

    /** @override */
    yk.ui.control.Textbox.prototype.createDom = function() {
        this.$el_ = $('<input type="text">').prop(this.options);
    };

    /**
     * @param {string=} opt_value
     * @return {string}
     * @override
     */
    yk.ui.control.Textbox.prototype.value = function(opt_value) {
        if (opt_value === undefined) {
            return yk.super(this, 'value');
        }
        if (this.getInput()) {
            this.$el_.val(opt_value);
        } else {
            this.setOption('value', 'opt_value');
        }
        return opt_value;
    };

    /**
     * new yk.ui.control.Checkbox({
     *     name: 'sample',
     *     value: 1,
     *     checked: false
     * }, 'label for checkbox');
     *
     * @param {Object=} opt_options
     * @param {string=} opt_label
     * @constructor
     * @extends {yk.ui.control.NativeControl}
     */
    yk.ui.control.Checkbox = function(opt_options, opt_label) {
        yk.super(this, opt_options);

        /**
         * @type {string=} opt_label
         * @private
         */
        this.label_ = opt_label || null;

        /**
         * @type {boolean}
         * @private
         */
        this.checked_ = Boolean(this.options['checked']);
    };
    yk.inherits(yk.ui.control.Checkbox, yk.ui.control.NativeControl);

    /** @override */
    yk.ui.control.Checkbox.prototype.createDom = function() {
        this.$el_ = $('<input type="checkbox">').prop(this.options);
        if (this.label_) {
            if (!this.$el_.prop('id')) {
                this.$el_.prop('id', this.hashcode());
            }
            this.$el_.after($('<label>').prop('for', this.$el_.prop('id')).text(this.label_));
        }

        var self = this;
        this.bind('change', function(evt) {
            self.handleChange_(evt);
        });
        this.listen('change', function(evt) {
            self.handleChange_(evt);
            this.$el_.prop('checked', this.checked_);
        });
    };

    /**
     * @param {Event} evt
     * @private
     */
    yk.ui.control.Checkbox.prototype.handleChange_ = function(evt) {
        this.checked_ = !this.checked_;
    };

    /**
     * @return {boolean}
     */
    yk.ui.control.Checkbox.prototype.checked = function() {
        return this.checked_;
    };

    /**
     *
     * @param {yk.ui.control.RadioButtons} group
     * @param {Object=} opt_options
     * @param {string=} opt_label
     * @constructor
     * @extends {yk.ui.control.NativeControl}
     */
    yk.ui.control.RadioButton = function(group, opt_options, opt_label) {
        yk.super(this, opt_options);

        /**
         * @type {yk.ui.control.RadioButtons}
         * @private
         */
        this.group_ = group;

        /**
         * @type {string=} opt_label
         */
        this.label_ = opt_label || null;

        /**
         * @type {boolean}
         * @private
         */
        this.checked_ = group.getOption('default') === this.getOption('value');
    };
    yk.inherits(yk.ui.control.RadioButton , yk.ui.control.NativeControl);

    /** @override */
    yk.ui.control.RadioButton.prototype.createDom = function() {
        this.$el_ = $('<input type="radio">').prop(this.options);
        if (this.label_) {
            if (!this.$el_.prop('id')) {
                this.$el_.prop('id', this.hashcode());
            }
            this.$el_.after($('<label>').prop('for', this.$el_.prop('id')).text(this.label_));
        }

        this.bind('change', this.handleChange_);
        this.listen('change', this.handleChange_);
    };

    /**
     * @param {Event} evt
     * @private
     */
    yk.ui.control.RadioButton.prototype.handleChange_ = function(evt) {
        this.group_.fire('change', this);
    };

    /**
     * @param {boolean=} opt_checked
     * @return {boolean}
     */
    yk.ui.control.RadioButton.prototype.checked = function(opt_checked) {
        if (opt_checked !== undefined) {
            this.checked_ = opt_checked;
        }
        return Boolean(this.checked_);
    };

    /**
     * new yk.ui.control.RadioButtons({
     *     name: 'hoge',
     *     default: 1,
     *     alignVertical: true
     * });
     * @param {Object=} opt_options
     * @constructor
     * @extends {yk.ui.control.NativeControl}
     */
    yk.ui.control.RadioButtons = function(opt_options) {
        yk.super(this, opt_options);

        /**
         * @type {!Array.<yk.ui.control.RadioButton>}
         * @private
         */
        this.inputs_ = [];

        /**
         * @type {?yk.ui.control.RadioButton}
         * @private
         */
        this.checked_ = null;
    };
    yk.inherits(yk.ui.control.RadioButtons, yk.ui.control.CustomControl);

    /**
     * buttons.add({
     *     value: '1'
     * }, 'label');
     * @param {Object=} opt_options
     * @param {string=} opt_label
     */
    yk.ui.control.RadioButtons.prototype.add = function(opt_options, opt_label) {
        this.inputs_.push(new yk.ui.control.RadioButton(this, opt_options, opt_label));
    };

    /**
     * @return {!Array.<yk.ui.control.RadioButton>}
     */
    yk.ui.control.RadioButtons.prototype.getButtons = function() {
        return this.inputs_;
    };

    /** @override */
    yk.ui.control.RadioButtons.prototype.createDom = function() {
        this.$el_ = $('<div>');

        var self = this;
        this.inputs_.forEach(function(input) {
            input.setOption('name', self.getOption('name'));
            var checked = input.getOption('value') === self.getOption('default');
            input.setOption('checked', checked);
            if (checked) {
                self.checked_ = input;
            }
            self.addChild(input);
        });

        this.listen('change', function(evt) {
            var checked = evt.data;
            this.inputs_.forEach(function(input) {
                input.checked(input.equals(checked));
            });
            this.checked_ = checked;
        });
    };

    /** @override */
    yk.ui.control.RadioButtons.prototype.value = function() {
        if (!this.checked) {
            return null;
        }
        return this.checked_.value();
    };

    /**
     * @return {?yk.ui.control.RadioButton}
     */
    yk.ui.control.RadioButtons.prototype.checked = function() {
        return this.checked_;
    };

    /** @override */
    yk.ui.control.RadioButtons.prototype.disabled = function(opt_disabled) {
        if (yk.isDef(opt_disabled)) {
            var disabled = yk.assertBoolean(opt_disabled);
            this.inputs_.forEach(function(radio) {
                radio.disabled(disabled);
            });
            return disabled;
        }
        return this.inputs_.every(function(each) {
            return each.disabled();
        });
    };

    /**
     * @param {Array.<yk.ui.Pair>} choices
     * @param {Object=} opt_options
     * @constructor
     * @extends {yk.ui.control.NativeControl}
     */
    yk.ui.control.Selectbox = function(choices, opt_options) {
        yk.super(this, opt_options);

        /**
         * @type {Array<yk.util.Pair>}
         * @private
         */
        this.choices_ = choices;

        /**
         * @type {string}
         * @private
         */
        this.value_ = this.options['value'];
    };
    yk.inherits(yk.ui.control.Selectbox, yk.ui.control.NativeControl);

    /** @override */
    yk.ui.control.Selectbox.prototype.createDom = function() {
        this.$el_ = $('<select></select>').prop(this.options);
        (this.choices_ || []).forEach(function(each) {
            $('<option></option>').prop('value', each.getSecond()).text(each.getFirst()).appendTo(this.$el_);
        }, this);
        this.$el_.val(this.value_);

        this.bind('change', function(evt) {
            this.handleChange_(evt);
        }, this);
        this.listen('change', function(evt) {
            this.handleChange_(evt);
        }, this);
    };

    /**
     * @param {Event} evt
     * @private
     */
    yk.ui.control.Selectbox.prototype.handleChange_ = function(evt) {
        this.value_ = this.$el_.val();
    };

    /**
     * @param {string=} opt_value
     * @return {string}
     * @override
     */
    yk.ui.control.Selectbox.prototype.value = function(opt_value) {
        if (opt_value === undefined) {
            return yk.super(this, 'value');
        }
        if (this.getInput()) {
            this.$el_.val(opt_value || null);
        } else {
            this.setOption('value', 'opt_value');
        }
        return opt_value;
    };

    /**
     * @param {Object=} opt_options
     * @constructor
     * @extends {yk.ui.control.NativeControl}
     */
    yk.ui.control.Hidden = function(opt_options) {
        yk.super(this, opt_options);
    };
    yk.inherits(yk.ui.control.Hidden, yk.ui.control.NativeControl);

    /** @override */
    yk.ui.control.Hidden.prototype.createDom = function() {
        this.$el_ = $('<input type="hidden">').prop(this.options);
    };

    /**
     * @param {Object=} opt_options
     * @constructor
     * @extends {yk.ui.control.NativeControl}
     */
    yk.ui.control.Button = function(opt_options) {
        yk.super(this, opt_options);
    };
    yk.inherits(yk.ui.control.Button, yk.ui.control.NativeControl);

    /** @override */
    yk.ui.control.Button.prototype.createDom = function() {
        this.$el_ = $('<input type="button">').prop(this.options);
    };

    /** @override */
    yk.ui.control.Button.prototype.value = function() {
        throw Error('yk.ui.control.Button has not value.');
    };
});

