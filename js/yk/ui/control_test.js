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

    test('ui.control.Textbox.wrap', function() {
        var textbox = $('<input type="text" value="hoge">');
        var wrapped = yk.ui.control.Textbox.wrap(textbox);
        equal('hoge', wrapped.value());

        wrapped.value('fuga');
        equal('fuga', textbox.val());
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

    test('ui.control.Checkbox.wrap', function() {
        var checkbox = $('<input type="checkbox" name="check" value="hoge">');
        var wrapped = yk.ui.control.Checkbox.wrap(checkbox);
        equal('hoge', wrapped.value());
        ok(!wrapped.checked());

        wrapped.checked(true);
        ok(checkbox.prop('checked'));
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

        radio.checkValueOf('2');
        equal('2', radio.value());
    });

    test('ui.control.RadioButton event', function() {
        radio.render($sandbox);

        // カスタムイベントで 2 を選択
        radio.getButtons()[1].fire(yk.ui.control.Event.CHANGE);
        equal('2', radio.checked().value());
        ok(!radio.getButtons()[0].checked());
        ok(radio.getButtons()[1].checked());
    });

    test('ui.control.RadioButtons.wrap', function() {
        var buttonSize = 3;
        // 最後のボタンを選択されてる
        var checkedValue = 2;
        var radioGroup = $('<div id="parent"></div>');
        for (var i = 0; i < buttonSize; i++) {
            $('<input type="radio" name="hoge">').val(String(i)).prop('checked', i === checkedValue).appendTo(radioGroup);
        }

        var wrapped = yk.ui.control.RadioButtons.wrap(radioGroup);
        equal(String(checkedValue), wrapped.value());

        wrapped.checkValueOf(String(0));
        equal('0', wrapped.value());
    });

    module('ui.control.Selectbox', {
        setup: function() {
            $sandbox = $('#sandbox');
            var choices = [
                new yk.util.Pair('one', '1'),
                new yk.util.Pair('two', '2'),
                new yk.util.Pair('three', '3')
            ];
            selectbox = new yk.ui.control.Selectbox(choices, {
                name: 'sample',
                value: '1'
            });
        },
        teardown: function() {
            selectbox.dispose();
        }
    });

    test('ui.control.Selectbox', function() {
        selectbox.render($sandbox);

        equal('1', selectbox.value());

        selectbox.value('2');
        equal('2', selectbox.value());
    });

    test('ui.control.Selectbox event', function() {
        selectbox.render($sandbox);

        var called = false;
        selectbox.listen(yk.ui.control.Event.CHANGE, function(evt) {
            called = true;
            equal('1', evt.data.before);
            equal('3', evt.data.after);
        });

        selectbox.value('3');
        ok(called);
    });

    test('ui.control.Selectbox.wrap', function() {
        var choiceSize = 3;
        var select = $('<select name="hoge"></select>');
        for (var i = 0; i < choiceSize; i++) {
            $('<option></option>').val(String(i)).text(String(i)).appendTo(select);
        }
        var wrapped = yk.ui.control.Selectbox.wrap(select);
        ok('0', wrapped.value());

        wrapped.value('2');
        equal('2', wrapped.value());
    });
});
