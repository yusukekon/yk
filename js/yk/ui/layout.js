define(['yk/ui'], function() {
    yk.package('yk.ui.layout');

    /**
     * @constructor
     * @extends {yk.ui.Component}
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
     * @extends {yk.ui.Component}
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
     * @param {string|yk.ui.Component} inner
     */
    yk.ui.layout.Table.Row.prototype.append = function(inner) {
        var cell = new yk.ui.layout.Table.Cell(inner);
        this.cells_.push(cell);
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
     * @param {number} index
     * @return {yk.ui.layout.Table.Cell}
     */
    yk.ui.layout.Table.Row.prototype.getCellAt = function(index) {
        var i = yk.assertNumber(index);
        if (i < 0 || i > (this.cells_.length - 1)) {
            throw Error('Index out of bounds');
        }
        return this.cells_[i];
    };

    /**
     * @param {string|yk.ui.Component} inner
     * @constructor
     * @extends {yk.ui.Component}
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
            this.$el_.text(yk.assertString(this.inner_));
        }
    };

    /**
     * @param {string|yk.ui.Component} inner
     */
    yk.ui.layout.Table.Cell.prototype.replace = function(inner) {
        if (this.inner_ instanceof yk.ui.Component) {
            yk.assertInstanceof(inner, yk.ui.Component);
            this.inner_.dispose();
            this.addChild(inner);
        } else {
            yk.assertString(inner);
            this.$el_.text(yk.assertString(inner));
        }
        this.inner_ = inner;
    };
});
