yk.package('yk.ui');
yk.package('yk.ui.control');
yk.package('yk.ui.layout');

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

    /**
     * @type {!Object.<string, Array.<function>>}
     * @private
     */
    this.handlers_ = {};
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
 * @param {boolean=} opt_force
 */
yk.ui.Component.prototype.render = function(opt_parentEl, opt_force) {
    var force = opt_force || false;
    if (!this.$el_ || force) {
        this.createDom();
    }
    var parentEl = opt_parentEl || document.body;
    this.$el_.appendTo(parentEl); 
};

/**
 *
 */
yk.ui.Component.prototype.dispose = function() {
    if (this.$el_) {
        this.$el_.remove();
        this.$el_ = null;
    }
    this.handlers_ = null;
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
 *
 * @param {!string} type
 * @param {!function} listener
 */
yk.ui.Component.prototype.listen = function(type, listener) {
    if (!this.handlers_[type]) {
        this.handlers_[type] = [];
    }
    this.handlers_[type].push(listener);
};

/**
 *
 * @param {!string} type
 * @param {*=} opt_data
 */
yk.ui.Component.prototype.fire = function(type, opt_data) {
    var listeners = this.handlers_[type];
    if (listeners) {
        var self = this;
        listeners.forEach(function(each) {
            each.call(self, {
                target: self,
                data: opt_data || null
            });
        });
    }
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
    this.$deferred.always(function() {
        self.$el_ && yk.ui.Component.prototype.render.call(self, parentEl);
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
    yk.super(this);

    /**
     *
     * @type {!Object}
     * @protected
     */
    this.options_ = opt_options || {};
};
yk.inherits(yk.ui.control.AbstractControl, yk.ui.Component);

/**
 *
 * @param {!string} key
 * @param {*} value
 */
yk.ui.control.AbstractControl.prototype.setOption = function(key, value) {
    this.options_[key] = value;
}

/**
 * @param key
 * @param {*=} opt_default
 * @return {*}
 */
yk.ui.control.AbstractControl.prototype.getOption = function(key, opt_default) {
    return this.options_[key] || opt_default || null;
};

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
    this.$input_ = $('<input type="text">').prop(this.options_);
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
    this.$input_.val(opt_value);
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
 * @inherits {yk.ui.control.AbstractControl}
 */
yk.ui.control.Checkbox = function(opt_options, opt_label) {
    yk.super(this, opt_options);

    /**
     * @type {string=} opt_label
     */
    this.label_ = opt_label || null;

    /**
     * @type {$}
     * @private
     */
    this.$input_;

    /**
     * @type {boolean}
     * @private
     */
    this.checked_ = Boolean(this.options_['checked']);
};
yk.inherits(yk.ui.control.Checkbox, yk.ui.control.AbstractControl);

/** @override */
yk.ui.control.Checkbox.prototype.createDom = function() {
    this.$input_ = $('<input type="checkbox">').prop(this.options_);
    this.$el_ = $('<span class="control-checkbox">').append(this.$input_);
    if (this.label_) {
        if (!this.$input_.prop('id')) {
            this.$input_.prop('id', this.hashcode());
        }
        this.$el_.append($('<label>').prop('for', this.$input_.prop('id')).text(this.label_));
    }

    var self = this;
    this.bind('change', function(evt) {
        self.handleChange_(evt);
    });
    this.listen('change', function(evt) {
        self.handleChange_(evt);
        this.$input_.prop('checked', this.checked_);
    });
};

yk.ui.control.Checkbox.prototype.handleChange_ = function(evt) {
    this.checked_ = !this.checked_;
};

/**
 * @return {string}
 */
yk.ui.control.Checkbox.prototype.value = function() {
    return this.$input_.val();
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
 * @inherits {yk.ui.control.AbstractControl}
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
     * @type {$}
     * @private
     */
    this.$input_;

    /**
     * @type {boolean}
     * @private
     */
    this.checked_ = group.getOption('default') === this.getOption('value');
};
yk.inherits(yk.ui.control.RadioButton , yk.ui.control.AbstractControl);

/** @override */
yk.ui.control.RadioButton.prototype.createDom = function() {
    this.$input_ = $('<input type="radio">').prop(this.options_);
    this.$el_ = $('<span class="control-radio">').append(this.$input_);
    if (Boolean(this.group_.getOption('alignVertical'))) {
        this.$el_ = $('<div>').append(this.$el_);
    }
    if (this.label_) {
        if (!this.$input_.prop('id')) {
            this.$input_.prop('id', this.hashcode());
        }
        this.$el_.append($('<label>').prop('for', this.$input_.prop('id')).text(this.label_));
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
 * @return {string}
 */
yk.ui.control.RadioButton.prototype.value = function() {
    return this.$input_.val();
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
 * @inherits {yk.ui.Control.AbstractControl}
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
yk.inherits(yk.ui.control.RadioButtons, yk.ui.control.AbstractControl);


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

/**
 * @return {?yk.ui.control.RadioButton}
 */
yk.ui.control.RadioButtons.prototype.checked = function() {
    return this.checked_;
};

/** @override */
yk.ui.control.RadioButtons.prototype.dispose = function() {
    this.inputs_.forEach(function(radio) {
        radio.dispose();
    });
    yk.super(this, 'dispose')
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
    var $button= $('<input type="button">').prop(this.options_);
    this.$el_ = $('<span class="control-button">').append($button);
};

/**
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.ui.layout.Table = function() {
    yk.super(this);

    /**
     * @type {Array.<yk.ui.layout.Table.Row>}
     * @private
     */
    this.rows_ = [];
};
yk.inherits(yk.ui.layout.Table, yk.ui.Component);

/** @override */
yk.ui.layout.Table.prototype.createDom = function() {
    this.$el_ = $('<table>');

    var self = this;
    this.rows_.forEach(function(row) {
        self.addChild(row);
    });
};

/**
 * @param {Array.<string|yk.ui.Component>} cells
 */
yk.ui.layout.Table.prototype.newRow = function(cells) {
    this.append(new yk.ui.layout.Table.Row(cells));
};

/**
 * @param {yk.ui.layout.Table.Row} row
 */
yk.ui.layout.Table.prototype.append = function(row) {
    this.rows_.push(row);
};

/**
 * @param {Array.<string|yk.ui.Component>=} opt_cells
 * @param {string=} opt_tag
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.ui.layout.Table.Row = function(opt_cells, opt_tag) {
    yk.super(this);

    /**
     * @type {Array.<yk.ui.layout.Table.Cell>}
     * @protected
     */
    this.cells_ = (opt_cells || []).map(function(each) {
        return new yk.ui.layout.Table.Cell(each)
    });

    /**
     * <tr> | <thead> | <tfoot>
     * @type {!string}
     * @private
     */
    this.tag_ = opt_tag || '<tr>';
};
yk.inherits(yk.ui.layout.Table.Row, yk.ui.Component);

/**
 * @param {string|yk.ui.Component} cell
 */
yk.ui.layout.Table.Row.prototype.append = function(cell) {
    this.cells_.push(new yk.ui.layout.Table.Cell(cell));
};

/** @override */
yk.ui.layout.Table.Row.prototype.createDom = function() {
    this.$el_ = $(this.tag_).addClass('layout-table-row');

    var self = this;
    this.cells_.forEach(function(cell) {
        self.addChild(cell);
    });
};

/**
 * @param {string|yk.ui.Component} inner
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.ui.layout.Table.Cell = function(inner) {
    yk.super(this);

    /**
     * @type {string|yk.ui.Component}
     * @private
     */
    this.inner_ = inner;
};
yk.inherits(yk.ui.layout.Table.Cell, yk.ui.Component);

/** @override */
yk.ui.layout.Table.Cell.prototype.createDom = function() {
    this.$el_ = $('<td class="layout-table-cell">')
    if (this.inner_ instanceof yk.ui.Component) {
        this.addChild(this.inner_)
    } else {
        this.$el_.text(this.inner_);
    }
};
