require(['yk/ui/control'], function() {

    module('ui.control.Textbox', {
        setup: function() {
            $sandbox = $('#sandbox');
            textbox = new yk.ui.control.Textbox({
                name: 'sample',
                value: 'hoge'
            });
        },
        teardown: function() {
            textbox.dispose();
        }
    });

    test('ui.control.Textbox', function() {
        textbox.render($sandbox);
        equal('hoge', textbox.value());
        textbox.value('hoge2');
        equal('hoge2', textbox.value());

        var rootEl = $sandbox.children()[0];
        equal('text', rootEl.type);
        equal('sample', rootEl.name);
        equal('hoge2', rootEl.value);
    });

    test('ui.control.Textbox event', function() {
        textbox.render($sandbox);
        var called = false;
        textbox.listen(yk.ui.control.Event.CHANGE, function(evt) {
            called = true;
            equal('hoge', evt.data.before);
            equal('fuga', evt.data.after);
        });

        equal('fuga', textbox.value('fuga'));
        ok(called);
    });

    module('ui.control.Checkbox', {
        setup: function() {
            $sandbox = $('#sandbox');
            check1 = new yk.ui.control.Checkbox({
                name: 'sample',
                value: '1',
                checked: true
            });
            check2 = new yk.ui.control.Checkbox({
                name: 'sample',
                value: '2',
                checked: false
            });
            check3 = new yk.ui.control.Checkbox({
                name: 'sample',
                value: '3'
            });
        },
        teardown: function() {
            check1.dispose();
            check2.dispose();
            check3.dispose();
        }
    });

    test('ui.control.Checkbox', function() {
        check1.render($sandbox);
        check2.render($sandbox);
        check3.render($sandbox);

        equal($sandbox.children().length, 3);
        ok('1', check1.value());
        ok('2', check2.value());
        ok('3', check3.value());
        ok(check1.checked());
        ok(!check2.checked());
        ok(!check3.checked());
    });

    test('ui.control.Checkbox event', function() {
        var called = false;
        check1.render($sandbox);

        check1.listen(yk.ui.control.Event.CHANGE, function(evt) {
            called = true;
            ok(evt.data.before);
            ok(!evt.data.after);
            equal(this.checked(), evt.data.after);
        });
        ok(!check1.checked(false));
        ok(called);
    });

    module('ui.control.RadioButton', {
        setup: function() {
            $sandbox = $('#sandbox');
            radio = new yk.ui.control.RadioButtons({
                name: 'sample',
                default: '1'
            });
            radio.add({
                value: '1'
            }, 'hoge1');
            radio.add({
                value: '2'
            }, 'hoge2');
        },
        teardown: function() {
            radio.dispose();
        }
    });

    test('ui.control.RadioButton', function() {
        radio.render($sandbox);

        equal(2, radio.getButtons().length);
        equal('1', radio.getButtons()[0].value());
        equal('2', radio.getButtons()[1].value());

        // 初期状態では 1 が選択されてる
        equal('1', radio.checked().value());
        ok(radio.getButtons()[0].checked());
        ok(!radio.getButtons()[1].checked());
    });

    test('ui.control.RadioButton event', function() {
        radio.render($sandbox);

        // カスタムイベントで 2 を選択
        radio.getButtons()[1].fire(yk.ui.control.Event.CHANGE);
        equal('2', radio.checked().value());
        ok(!radio.getButtons()[0].checked());
        ok(radio.getButtons()[1].checked());
    });
});
