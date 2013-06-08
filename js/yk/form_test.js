require(['yk/form'], function() {

    module('Form', {
        setup: function() {
            $sandbox = $('#sandbox');
            form = new yk.Form('/path/to/api.json');
            stub = sinon.stub(jQuery, 'ajax');
        },
        teardown: function() {
            form.dispose();
            stub.restore();
        }
    });

    test('Form', function() {
        var deferred = new $.Deferred();
        stub.returns(deferred.promise());

        var textbox = new yk.ui.control.Textbox({
            name: 'textbox',
            value: 'ほげ'
        });
        textbox.render($sandbox);
        form.registerInput(textbox, true);

        var hidden = new yk.ui.control.Hidden({
            name: 'hidden',
            value: '1'
        });
        hidden.render($sandbox);
        form.registerInput(hidden, true);

        form.submit(function(data) {
            equal('hoge', data['result']);
        });
        equal('textbox=%E3%81%BB%E3%81%92&hidden=1', stub.getCall(0).args[0].data);

        // submit 後、input要素は disabled 状態になる
        ok(textbox.disabled());
        ok(hidden.disabled());

        // レスポンスを受け取る
        deferred.resolve({result: "hoge"});

        // 実行後、disabled 状態から復帰する
        ok(!textbox.disabled());
        ok(!hidden.disabled());
    });

});
