define(['yk/ui'], function() {

    yk.package('yk.ui.dialog');

    /**
     * @param {$|Element|string} opt_parent
     * @constructor
     * @extends {yk.ui.Component}
     */
    yk.ui.dialog.Dialog = function(opt_parent) {
        yk.super(this);

        /**
         * @type {$}
         * @private
         */
        this.$parent_ = $(opt_parent || yk.document.body);
    };
    yk.inherits(yk.ui.dialog.Dialog, yk.ui.Component);

    /**
     * @type {yk.ui.dialog.Dialog}
     * @const
     */
    yk.ui.Dialog = yk.ui.dialog.Dialog;

    /**
     * @type {string}
     * @const
     */
    yk.ui.dialog.Dialog.MODAL_BG_CLASS = 'modal-dialog-bg';


    /**
     * @type {string}
     * @const
     */
    yk.ui.dialog.Dialog.MODAL_DIALOG_CLASS = 'modal-dialog';

    /**
     *
     */
    yk.ui.dialog.Dialog.prototype.open = function() {
        if (!this.rendered()) {
            this.render(this.$parent_);
        }
        this.modal_(true);
        if (!this.$el_.hasClass(yk.ui.Dialog.MODAL_DIALOG_CLASS)) {
            this.$el_.addClass(yk.ui.Dialog.MODAL_DIALOG_CLASS);
        }
        this.reposition_();
        this.$el_.fadeIn();
     };

    /** @override */
    yk.ui.dialog.Dialog.prototype.hide = function(opt_disposeOnClose) {
        yk.super(this, 'hide', opt_disposeOnClose);
        this.modal_(false);
    };

    /**
     *
     * @param {boolean} on
     * @private
     */
    yk.ui.dialog.Dialog.prototype.modal_ = function(on) {
        if (yk.assertBoolean(on)) {
            $('<div>').prop('id', this.hashcode()).addClass(yk.ui.Dialog.MODAL_BG_CLASS).appendTo(yk.document.body);
        } else {
            $('#' + this.hashcode()).remove();
        }
    };

    /**
     * @private
     */
    yk.ui.dialog.Dialog.prototype.reposition_ = function() {
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
    yk.ui.dialog.Dialog.prototype.createDefaultCancelButton = function() {
        var cancel = new yk.ui.control.Button({
            value: 'cancel'
        });
        cancel.bind('click', function(evt) {
            this.hide(false);
        }, this);
        return cancel;
    };

});
