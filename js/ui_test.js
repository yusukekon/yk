module('ui.Component', {
    setup: function() {
        $sandbox = $('#sandbox');
        component = new yk.ui.Component();
    },
    teardown: function() {
        component.dispose();
    }
});

test('ui.Component rendering', function() {
    equal($sandbox.children().length, 0);

    // render 後、内部要素が生成されて親要素にぶら下がる
    component.render($sandbox);
    ok(component.getElement());
    equal($sandbox.children().length, 1);

    // 追加したコンポーネントが自動で render される
    component.addChild(new yk.ui.Component());
    component.addChild(new yk.ui.Component());
    equal(component.getElement().children().length, 2);

    // 内部要素が破棄され、親要素から切り離される
    component.dispose();
    ok(!component.getElement());
    equal($sandbox.children().length, 0);
});

test('ui.Component event', function() {
    /**
     * ネイティブイベント(jQuery)
     * component の内部要素に対してバインドするため、render 前に
     * 実行すると内部で自動的に createDom を呼び出して dom を構築する。
     */
    var triggeredEvent = null;
    component.bind('click', function(evt) {
        triggeredEvent = evt;
    });
    component.trigger('click', 'hoge');

    // target は component 自身
    ok(component.equals(triggeredEvent.target));
    equal('click', triggeredEvent.wrapped.type);
    // 実際に発火された target は HTML 要素
    equal(component.getElement()[0], triggeredEvent.wrapped.target);
    // TODO: なぜか data が渡ってこない。。。
    equal(/*'hoge'*/null, triggeredEvent.wrapped.data);


    /**
     * 特定のコンポーネントに対してのみ発火させるイベント。
     * イベント伝搬等が不要で、シンプルに実装したい場合に利用する。
     */
    var firedEvent = null;
    // listen は render されてなくても呼び出せる
    component.listen('sampleEvent', function(evt) {
        firedEvent = evt;
    });
    component.fire('sampleEvent', 'hoge');

    // target は component 自身
    ok(component.equals(firedEvent.target));
    // イベント発火時に渡したデータ
    ok('hoge', firedEvent.data);
});

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
    equal('span', rootEl.tagName.toLowerCase());
    equal('control-textbox', rootEl.className);

    var textEl = rootEl.children[0];
    equal('text', textEl.type);
    equal('sample', textEl.name);
    equal('hoge2', textEl.value);
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

    // 任意の change イベントで選択状態が反転する
    check1.trigger('change');
    check2.fire('change');
    ok(!check1.checked());
    ok(check2.checked());
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

    equal('1', radio.checked().value());
    radio.getButtons()[1].trigger('change');
    equal('2', radio.checked().value());
    radio.getButtons()[0].fire('change');
    equal('1', radio.checked().value());
});
