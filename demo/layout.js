yk.package('yk.demo');

/**
 * @param {!Object} data
 * @constructor
 * @inherits {yk.ui.Component}
 */
yk.demo.LayoutComponent = function(data) {
    yk.super(this);

    /**
     * @type {!Object}
     * @private
     */
    this.data_ = data;

    /**
     * @type {Array.<yk.ui.control.Checkbox>}
     * @private
     */
    this.checkboxes_ = [];

    /**
     * @type {yk.demo.LayoutComponent.HeaderRow}
     * @private
     */
    this.tableHeader_ = new yk.demo.LayoutComponent.HeaderRow(this.checkboxes_);
};
yk.inherits(yk.demo.LayoutComponent, yk.ui.Component);

/** @override */
yk.demo.LayoutComponent.prototype.createDom = function() {
    this.$el_ = $('<div>');

    var self = this;
    var table = new yk.ui.layout.Table();
    table.append(this.tableHeader_);
    this.data_.forEach(function(each) {
        var checkbox = new yk.ui.control.Checkbox({name: 'id', value: each.id});
        self.checkboxes_.push(checkbox);
        table.newRow([checkbox, each.name]);
    });
    this.addChild(table);
};

/**
 *
 * @constructor
 * @inherits {yk.ui.layout.Table.Row}
 */
yk.demo.LayoutComponent.HeaderRow = function(checkboxes) {
    yk.super(this, [], '<thead>');

    /**
     * @type {Array.<yk.ui.control.Checkbox>}
     * @private
     */
    this.checkboxes_ = checkboxes;
};
yk.inherits(yk.demo.LayoutComponent.HeaderRow, yk.ui.layout.Table.Row);

/** @override */
yk.demo.LayoutComponent.HeaderRow.prototype.createDom = function() {
    var checkAllButton = new yk.ui.control.Button({value: 'x'});
    this.append(checkAllButton);
    this.append('');
    yk.ui.layout.Table.Row.prototype.createDom.call(this);

    var self = this;
    checkAllButton.bind('click', function(evt) {
        var checkedAll = self.checkboxes_.every(function(input) {
            return input.checked();
        });
        self.checkboxes_.forEach(function(each) {
            each.fire('change');
        });
    });
};
