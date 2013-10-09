require(['yk/ui', 'yk/ui/control'], function() {

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

        // 子コンポーネントの親が正しく設定されている
        ok(component === component.getChildren()[0].getParent());
        ok(component === component.getChildren()[1].getParent());

        // 内部要素が破棄され、親要素から切り離される
        component.dispose();
        ok(!component.getElement());
        equal($sandbox.children().length, 0);
    });

    test('ui.Component event', function() {
        var called;

        called = false;
        component.listen('click', function(evt) {
            called = true;
            // target は component 自身
            ok(component.equals(triggeredEvent.target));
            equal('click', triggeredEvent.nativeEvent.type);
            // 実際に発火された target は HTML 要素
            equal(component.getElement()[0], triggeredEvent.nativeEvent.target);
        });
        component.fire('click', 'hoge');
        ok(called);

        called = false;
        component.listen(yk.ui.Component.EventType.ENTER_DOCUMENT, function(evt) {
            called = true;
        });
        component.render($sandbox);
        ok(called);
    });

    module('ui.DynamicComponent', {
        setup: function() {
            $sandbox = $('#sandbox');

            function SampleDynamicComponent() {
                yk.super(this);
            };
            yk.inherits(SampleDynamicComponent, yk.ui.DynamicComponent);

            SampleDynamicComponent.prototype.setUrl = function(url) {
                this.url_ = url;
            };

            SampleDynamicComponent.prototype.createDynamicDom = function(json) {
                this.$el_ = $('<div>');
                json.forEach(function(id) {
                    $('<div>').prop('id', id).appendTo(this.$el_);
                }, this);
            };
            SampleDynamicComponent.prototype.failure = function(xhr) {
                this.$el_ = $('<div>').text('failure');
            };
            component = new SampleDynamicComponent();
            stub = sinon.stub(jQuery, "ajax");
        },
        teardown: function() {
            component.dispose();
            stub.restore();
        }
    });

    test('ui.DynamicComponent success', function() {
        var deferred = new $.Deferred();
        stub.returns(deferred.resolve([1, 2]).promise());
        component.render($sandbox);

        equal(1, $sandbox.children().length);
        equal(2, component.getElement().children().length);
        equal(1, component.getElement().children()[0].id);
        equal(2, component.getElement().children()[1].id);

    });

    test('ui.DynamicComponent failure', function() {
        var deferred = new $.Deferred();
        stub.returns(deferred.reject().promise());
        component.render($sandbox);

        equal(1, $sandbox.children().length);
        equal('failure', component.getElement().text());
    });



});
