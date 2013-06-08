require(['yk/ui/dialog', 'yk/ui/control'], function() {

    module('ui.Dialog', {
        setup: function() {
            $sandbox = $('#sandbox');
            yk.document = $sandbox;
            function SampleDialog() {
                yk.super(this, $sandbox);

                this.close_ = new yk.ui.control.Button({
                    value: 'CLOSE'
                });
            };
            yk.inherits(SampleDialog, yk.ui.Dialog);

            SampleDialog.prototype.createDom = function() {
                this.$el_ = $('<div>');
                this.addChild(this.close_);
            };

            dialog = new SampleDialog();
        },
        teardown: function() {
            dialog.dispose();
            yk.document = yk.global.document;
        }
    });

    test('ui.Dialog', function() {
        dialog.open();

        ok($('.modal-dialog', $sandbox).length > 0);
    });

});
