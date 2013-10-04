define(['yk/ui'], function() {

    yk.package('yk.ui.control');

    /**
     * @enum
     * @type {string}
     */
    yk.ui.control.Event = {
        CHANGE: 'yk.ui.Control.Event.CHANGE',
        ENABLE: 'yk.ui.Control.Event.ENABLE',
        DISABLE: 'yk.ui.Control.Event.DISABLE'
    };

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
     * @param {$} $el
     * @return {yk.ui.Control}
     */
    yk.ui.Control.prototype.setElement = function($el) {
        if (this.$el_) {
            this.dispose();
        }
        this.$el_ = $el;
        return this;
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
            if (disabled !== this.disabled()) {
                this.getInput().prop('disabled', disabled);
                this.fire(disabled ? yk.ui.control.Event.DISABLE : yk.ui.control.Event.ENABLE);
            }
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
    yk.ui.control.Textbox.wrap = function($el) {
        return /** @type {yk.ui.control.Textbox} */(new yk.ui.control.Textbox().setElement($el));
    };

    /** @override */
    yk.ui.control.Textbox.prototype.createDom = function() {
        this.setElement($('<input type="text">').prop(this.options));
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
        var current = this.value();
        if (current === opt_value) {
            return current;
        }

        if (this.getInput()) {
            this.$el_.val(opt_value);
        } else {
            this.setOption('value', opt_value);
        }
        this.fire(yk.ui.control.Event.CHANGE, {
            before: current,
            after: opt_value
        });
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

    /**
     * @param {$} $el
     * @return {yk.ui.control.Checkbox}
     */
    yk.ui.control.Checkbox.wrap = function($el) {
        return /** @type {yk.ui.control.Checkbox} */(new yk.ui.control.Checkbox({
            checked: yk.assertBoolean($el.prop('checked'))
        }).setElement($el));
    };

    /** @override */
    yk.ui.control.Checkbox.prototype.setElement = function($el) {
        yk.super(this, 'setElement', $el);
        this.bind('change', function(evt) {
            this.checked_ = !this.checked_;
        }, this);
        return this;
    };

    /** @override */
    yk.ui.control.Checkbox.prototype.createDom = function() {
        this.setElement($('<input type="checkbox">').prop(this.options));
        if (this.label_) {
            if (!this.$el_.prop('id')) {
                this.$el_.prop('id', this.hashcode());
            }
            this.$el_.after($('<label>').prop('for', this.$el_.prop('id')).text(this.label_));
        }
    };

    /**
     * @param {boolean=} opt_checked
     * @return {boolean}
     */
    yk.ui.control.Checkbox.prototype.checked = function(opt_checked) {
        if (yk.isDef(opt_checked) && this.checked_!== opt_checked) {
            var current = this.checked_;
            this.checked_ = yk.assertBoolean(opt_checked);
            this.getInput().prop('checked', this.checked_);
            this.fire(yk.ui.control.Event.CHANGE, {
                before: current,
                after: this.checked_
            });
        }
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

    /**
     * @param {yk.ui.control.RadioButtons} group
     * @param {$} $el
     * @return {yk.ui.control.RadioButton}
     */
    yk.ui.control.RadioButton.wrap = function(group, $el) {
        return /** @type {yk.ui.control.RadioButton} */(new yk.ui.control.RadioButton(group, {
            value: $el.val()
        }).setElement($el));
    };

    /** @override */
    yk.ui.control.RadioButton.prototype.setElement = function($el) {
        yk.super(this, 'setElement', $el);
        this.bind('change', this.handleChange_, this);
        this.listen(yk.ui.control.Event.CHANGE, this.handleChange_, this);
        return this;
    };


    /** @override */
    yk.ui.control.RadioButton.prototype.createDom = function() {
        this.setElement($('<input type="radio">').prop(this.options));
        if (this.label_) {
            if (!this.$el_.prop('id')) {
                this.$el_.prop('id', this.hashcode());
            }
            this.$el_.after($('<label>').prop('for', this.$el_.prop('id')).text(this.label_));
        }
    };

    /**
     * @param {Event} evt
     * @private
     */
    yk.ui.control.RadioButton.prototype.handleChange_ = function(evt) {
        this.group_.fire(yk.ui.control.Event.CHANGE, this);
    };

    /**
     * @param {boolean=} opt_checked
     * @param {boolean=} opt_fireChangeEvent
     * @return {boolean}
     */
    yk.ui.control.RadioButton.prototype.checked = function(opt_checked, opt_fireChangeEvent) {
        if (yk.isDef(opt_checked) && this.checked_!== opt_checked) {
            var fireChangeEvent = yk.isDef(opt_fireChangeEvent) ? yk.assertBoolean(opt_fireChangeEvent) : true;
            var current = this.checked_;
            this.checked_ = yk.assertBoolean(opt_checked);
            this.getInput().prop('checked', this.checked_);
            fireChangeEvent && this.fire(yk.ui.control.Event.CHANGE, {
                before: current,
                after: this.checked_
            });
        }
        return this.checked_;
    };

    /**
     * new yk.ui.control.RadioButtons({
     *     name: 'hoge',
     *     default: 1,
     *     alignVertical: true
     * });
     *
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
     * @param {$} $parent
     * @return {yk.ui.control.RadioButtons}
     */
    yk.ui.control.RadioButtons.wrap = function($parent) {
        var radio = /** @type {yk.ui.control.RadioButtons} */(new yk.ui.control.RadioButtons().setElement($parent));

        var checked = null;
        $('input[type=radio]', $parent).each(function(i, el) {
            var button = yk.ui.control.RadioButton.wrap(radio, $(el))
            if (button.getInput().prop('checked')) {
                // チェックされてるのは一つだけ
                yk.assert(!radio.checked());
                radio.checked(button);
            }
            radio.add_(button);
        });
        return radio;
    };


    /** @override */
    yk.ui.control.RadioButtons.prototype.setElement = function($el) {
        yk.super(this, 'setElement', $el);
        this.listen(yk.ui.control.Event.CHANGE, function(evt) {
            var checked = this.checked_;
            if (evt.data) {
                checked = yk.assertInstanceof(evt.data, yk.ui.control.RadioButton);
            }
            this.inputs_.forEach(function(input) {
                input.checked(input.equals(checked), false);
            }, this);
            this.checked_ = checked;
        }, this);
        return this;
    };

    /**
     * buttons.add({
     *     value: '1'
     * }, 'label');
     * @param {Object=} opt_options
     * @param {string=} opt_label
     */
    yk.ui.control.RadioButtons.prototype.add = function(opt_options, opt_label) {
        this.add_(new yk.ui.control.RadioButton(this, opt_options, opt_label));
    };

    /**
     * @param {yk.ui.control.RadioButton} button
     * @private
     */
    yk.ui.control.RadioButtons.prototype.add_ = function(button) {
        this.inputs_.push(button);
    };

    /**
     * @return {!Array.<yk.ui.control.RadioButton>}
     */
    yk.ui.control.RadioButtons.prototype.getButtons = function() {
        return this.inputs_;
    };

    /** @override */
    yk.ui.control.RadioButtons.prototype.createDom = function() {
        this.setElement($('<div>'));

        this.inputs_.forEach(function(input) {
            input.setOption('name', this.getOption('name'));
            var checked = input.getOption('value') === this.getOption('default');
            input.setOption('checked', checked);
            if (checked) {
                this.checked_ = input;
            }
            this.addChild(input);
        }, this);
    };

    /** @override */
    yk.ui.control.RadioButtons.prototype.value = function() {
        if (!this.checked_) {
            return null;
        }
        return this.checked_.value();
    };

    /**
     * @param {yk.ui.control.RadioButton=} opt_checked
     * @return {?yk.ui.control.RadioButton}
     */
    yk.ui.control.RadioButtons.prototype.checked = function(opt_checked) {
        if (opt_checked && yk.assertInstanceof(opt_checked, yk.ui.control.RadioButton)) {
            this.checked_ = opt_checked;
        }
        return this.checked_;
    };

    /**
     * @param {string} value
     */
    yk.ui.control.RadioButtons.prototype.checkValueOf = function(value) {
        if (yk.assertString(value) === this.value()) {
            return;
        }

        this.inputs_.forEach(function(input) {
            if (value === input.value()) {
                this.checked_ = input;
                this.fire(yk.ui.control.Event.CHANGE);
            }
        }, this);
    };

    /** @override */
    yk.ui.control.RadioButtons.prototype.disabled = function(opt_disabled) {
        if (yk.isDef(opt_disabled)) {
            var disabled = yk.assertBoolean(opt_disabled);
            if (this.disabled() !== disabled) {
                this.inputs_.forEach(function(radio) {
                    radio.disabled(disabled);
                });
                this.fire(disabled ? yk.ui.control.Event.DISABLE : yk.ui.control.Event.ENABLE);
            }
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
         * @type {?string}
         * @private
         */
        this.value_ = this.options['value'] || null;
    };
    yk.inherits(yk.ui.control.Selectbox, yk.ui.control.NativeControl);

    /**
     * @param {$} $el
     * @return {yk.ui.control.Selectbox}
     */
    yk.ui.control.Selectbox.wrap = function($el) {
        var choices = $el.find('option').map(function(i, el) {
            var option = $(el);
            return new yk.util.Pair(option.text(), option.val());
        });
        return /** @type {yk.ui.control.Selectbox} */ new yk.ui.control.Selectbox(choices, {
            value: $el.val()
        }).setElement($el);
    };

    /** @override */
    yk.ui.control.Selectbox.prototype.createDom = function() {
        this.setElement($('<select></select>').prop(this.options));
        (this.choices_ || []).forEach(function(each) {
            this.add(each.getFirst(), each.getSecond());
        }, this);
        this.$el_.val(this.value_);
    };

    /**
     * @param {string} label
     * @param {string=} opt_value
     */
    yk.ui.control.Selectbox.prototype.add = function(label, opt_value) {
        var value = yk.assertString(opt_value || '');
        $('<option></option>').text(yk.assertString(label)).val(value).appendTo(this.$el_);
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

        var current = this.value();
        if (current !== yk.assertString(opt_value)) {
            if (this.getInput()) {
                this.$el_.val(opt_value);
            } else {
                this.setOption('value', opt_value);
            }
            this.fire(yk.ui.control.Event.CHANGE, {
                before: current,
                after: opt_value
            });
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
        this.setElement($('<input type="button">').prop(this.options));
    };

    /**
     * @param {$} $el
     * @return {yk.ui.control.Button}
     */
    yk.ui.control.Button.wrap = function($el) {
        return /** @type {yk.ui.control.Button} */(this.setElement($el));
    };

    /** @override */
    yk.ui.control.Button.prototype.value = function() {
        throw Error('yk.ui.control.Button has not value.');
    };
});
