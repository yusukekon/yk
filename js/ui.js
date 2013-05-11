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
     * @protected
     */
    this.$el_;

    /**
     * @type {Array.<yk.ui.Component>}
     * @protected
     */
    this.children_ = [];

    /**
     * @type {!Object.<string, Array.<function>>}
     * @private
     */
    this.handlers_ = {};

    /**
     * @type {Array.<yk.ui.Component>}
     * @private
     */
    this.disposables_ = [];
};
yk.inherits(yk.ui.Component, yk.Object);

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
 * @param {!yk.ui.Component} component
 */
yk.ui.Component.prototype.addChild = function(child) {
    if (!this.$el_) {
        this.createDom();
    }
    child.render(this.$el_);
    this.$el_.append(child);
    this.children_.push(child);
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
    this.$el_.fadeIn();
    var parentEl = opt_parentEl || document.body;
    this.$el_.appendTo(parentEl);
};

/**
 * @param {yk.ui.Component} target
 */
yk.ui.Component.prototype.registerDisposable = function(target) {
    this.disposables_.push(target);
};

/**
 *
 */
yk.ui.Component.prototype.dispose = function() {
    if (this.$el_) {
        this.$el_.remove();
        this.$el_ = null;
    }
    if (this.children_) {
        this.children_.forEach(function(child) {
            child.dispose();
        });
        this.children_ = null;
    }
    if (this.disposables_) {
        this.disposables_.forEach(function(each) {
            each.dispose();
        });
        this.disposables_ = null;
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
 * @param {Object} opt_options
 * @constructor
 * @inherits {yk.ui.Component}
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
 * @inherits {yk.ui.Control}
 */
yk.ui.control.HtmlControl = function(opt_options) {
    yk.super(this, opt_options);

    /**
     * @type {$}
     * @protected
     */
    this.$input;
};
yk.inherits(yk.ui.control.HtmlControl, yk.ui.Control);

/**
 * @return {$}
 */
yk.ui.control.HtmlControl.prototype.getInput = function() {
    return this.$input;
};

/** @override */
yk.ui.control.HtmlControl.prototype.value = function() {
    return this.getInput().val();
};

/** @override */
yk.ui.control.HtmlControl.prototype.disabled = function(opt_disabled) {
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
 * @inherits {yk.ui.Control}
 */
yk.ui.control.CustomControl = function(opt_options) {
    yk.super(this, opt_options);
};
yk.inherits(yk.ui.control.CustomControl, yk.ui.Control);

/**
 * @param {Object=} opt_options
 * @constructor
 * @inherits {yk.ui.control.HtmlControl}
 */
yk.ui.control.Textbox = function(opt_options) {
    yk.super(this, opt_options);
};
yk.inherits(yk.ui.control.Textbox, yk.ui.control.HtmlControl);

/** @override */
yk.ui.control.Textbox.prototype.createDom = function() {
    this.$input = $('<input type="text">').prop(this.options);
    this.$el_ = $('<span class="control-textbox">').append(this.$input);
};

/**
 * @param {string=} opt_value
 * @return {string}
 * @override
 */
yk.ui.control.Textbox.prototype.value = function(opt_value) {
    if (opt_value === undefined) {
        return this.$input.val();
    }
    this.$input.val(opt_value);
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
 * @inherits {yk.ui.control.HtmlControl}
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
yk.inherits(yk.ui.control.Checkbox, yk.ui.control.HtmlControl);

/** @override */
yk.ui.control.Checkbox.prototype.createDom = function() {
    this.$input = $('<input type="checkbox">').prop(this.options);
    this.$el_ = $('<span class="control-checkbox">').append(this.$input);
    if (this.label_) {
        if (!this.$input.prop('id')) {
            this.$input.prop('id', this.hashcode());
        }
        this.$el_.append($('<label>').prop('for', this.$input.prop('id')).text(this.label_));
    }

    var self = this;
    this.bind('change', function(evt) {
        self.handleChange_(evt);
    });
    this.listen('change', function(evt) {
        self.handleChange_(evt);
        this.$input.prop('checked', this.checked_);
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
 * @inherits {yk.ui.control.HtmlControl}
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
yk.inherits(yk.ui.control.RadioButton , yk.ui.control.HtmlControl);

/** @override */
yk.ui.control.RadioButton.prototype.createDom = function() {
    this.$input = $('<input type="radio">').prop(this.options);
    this.$el_ = $('<span class="control-radio">').append(this.$input);
    if (Boolean(this.group_.getOption('alignVertical'))) {
        this.$el_ = $('<div>').append(this.$el_);
    }
    if (this.label_) {
        if (!this.$input.prop('id')) {
            this.$input.prop('id', this.hashcode());
        }
        this.$el_.append($('<label>').prop('for', this.$input.prop('id')).text(this.label_));
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
 * @inherits {yk.ui.control.HtmlControl}
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
 * @param {Object=} opt_options
 * @constructor
 * @inherits {yk.ui.control.HtmlControl}
 */
yk.ui.control.Hidden = function(opt_options) {
    yk.super(this, opt_options);
};
yk.inherits(yk.ui.control.Hidden, yk.ui.control.HtmlControl);

/** @override */
yk.ui.control.Hidden.prototype.createDom = function() {
    this.$el_ = $('<input type="hidden">').prop(this.options);
    this.$input = this.$el_;
};

/**
 * @param {Object=} opt_options
 * @constructor
 * @inherits {yk.ui.control.HtmlControl}
 */
yk.ui.control.Button = function(opt_options) {
    yk.super(this, opt_options);
};
yk.inherits(yk.ui.control.Button, yk.ui.control.HtmlControl);

/** @override */
yk.ui.control.Button.prototype.createDom = function() {
    this.$input = $('<input type="button">').prop(this.options);
    this.$el_ = $('<span class="control-button">').append(this.$input);
};

/** @override */
yk.ui.control.Button.prototype.value = function() {
    throw Error('yk.ui.control.Button has not value.');
};

/**
 * @param {$|Element|string} opt_parent
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.ui.Dialog = function(opt_parent) {
    yk.super(this);

    /**
     * @type {$}
     * @private
     */
    this.$parent_ = $(opt_parent || yk.document.body);
};
yk.inherits(yk.ui.Dialog, yk.ui.Component);

/**
 * @type {string}
 * @const
 */
yk.ui.Dialog.MODAL_BG_CLASS = 'modal-dialog-bg';

/** @override */
yk.ui.Dialog.prototype.dispose = function() {
    this.hide();
    yk.super(this, 'dispose');
};

/**
 *
 */
yk.ui.Dialog.prototype.open = function() {
    if (!this.rendered()) {
        this.render(this.$parent_);
    }
    this.modal_(true);
    if (!this.$el_.hasClass('modal-dialog')) {
        this.$el_.addClass('modal-dialog');
    }
    this.reposition_();
    this.$el_.fadeIn();
 };

/**
 *
 */
yk.ui.Dialog.prototype.hide = function() {
    if (this.$el_) {
        this.$el_.fadeOut();
    }
    this.modal_(false);
};

/**
 *
 * @param {boolean} on
 * @private
 */
yk.ui.Dialog.prototype.modal_ = function(on) {
    if (yk.assertBoolean(on)) {
        $('<div id="modal-dialog-bg">').addClass(yk.ui.Dialog.MODAL_BG_CLASS).appendTo(yk.document.body);
    } else {
        $('#modal-dialog-bg').remove();
    }
};

/**
 * @private
 */
yk.ui.Dialog.prototype.reposition_ = function() {
    // position は absolute で調整
    if (this.$el_.css('position') !== 'absolute') {
        this.$el_.css('position', 'absolute');
    }

    var winHeight = $(yk.document).height();
    var winWidth = $(yk.document).width();
    var elHeight = this.$el_.height();
    var elWidth = this.$el_.width();

    this.$el_.css({
        top: Math.max(winHeight / 2 - elHeight / 2, 0),
        left: Math.max(winWidth / 2 - elWidth / 2, 0)
    });
};

/**
 * @param {Object=} opt_options
 * @return {yk.ui.control.Button}
 * @protected
 */
yk.ui.Dialog.prototype.createDefaultCancelButton = function() {
    var cancel = new yk.ui.control.Button({
        value: 'cancel'
    });
    cancel.bind('click', function(evt) {
        this.hide();
    }, this);
    return cancel;
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

    this.rows_.forEach(function(row) {
        this.addChild(row);
    }, this);
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
        return new yk.ui.layout.Table.Cell(each);
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
    if (this.$el_) {
        this.addChild(cell);
    }
};

/** @override */
yk.ui.layout.Table.Row.prototype.createDom = function() {
    this.$el_ = $(this.tag_).addClass('layout-table-row');

    this.cells_.forEach(function(cell) {
        this.addChild(cell);
    }, this);
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
    this.$el_ = $('<td class="layout-table-cell">');
    if (this.inner_ instanceof yk.ui.Component) {
        this.addChild(this.inner_);
    } else {
        this.$el_.text(this.inner_);
    }
};

/**
 *
 * @param {string} action
 * @param {string=} opt_method
 * @param {Object=} opt_options
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.ui.Form = function(uri, opt_method, opt_options) {
    yk.super(this);

    /**
     * @type {string}
     * @private
     */
    this.uri_ = uri;

    /**
     * @type {string}
     * @private
     */
    this.method_ = opt_method || 'POST';

    /**
     * @type {!Object}
     * @private
     */
    this.options_ = opt_options || {};

    /**
     * @type {Array.<yk.ui.Control>}
     * @private
     */
    this.inputs_ = [];
};
yk.inherits(yk.ui.Form, yk.ui.Component);

/** @override */
yk.ui.Form.prototype.createDom = function() {
    this.$el_ = $('<div>').prop(this.options_);
};

/**
 * @param {function} callback
 * @param {function=} opt_errback
 * @param {*=} opt_scope
 * @param {boolean=} opt_safe
 * @return {Deferred}
 */
yk.ui.Form.prototype.submit = function(callback, opt_errback, opt_scope, opt_safe) {
    if (!this.$el_) {
        this.createDom();
    }
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
 * @param {string} data
 * @param {function} callback
 * @param {function=} opt_errback
 * @param {*=} opt_scope
 * @private
 */
yk.ui.Form.prototype.submitInternal_ = function(data, callback, opt_errback, opt_scope) {
    var scope = opt_scope || this;
    return $.ajax({
        url: this.uri_,
        data: data,
        dataType: 'json',
        method: this.method_
    }).done(function(data) {
        callback.call(scope, data);
    }).fail(function(xhr) {
        if (opt_errback) {
            opt_errback.call(scope, xhr);
        }
    });
};

/**
 * @param {yk.ui.Control} control
 * @param {boolean} opt_append
 */
yk.ui.Form.prototype.registerInput = function(control, opt_append) {
    this.inputs_.push(control);
    if (!yk.isDef(opt_append) || yk.assertBoolean(opt_append)) {
        this.addChild(control);
    }
};

/**
 * @param {number} opt_timeout
 * @return {function}
 * @private
 */
yk.ui.Form.prototype.lock_ = function(opt_timeout) {
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
