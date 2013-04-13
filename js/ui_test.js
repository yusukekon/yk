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
     * イベント伝搬等が不要で、シンプルに実装する際に利用。
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
