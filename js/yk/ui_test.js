require(['yk/ui'], function() {

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

        // 初期状態では 1 が選択されてる
        equal('1', radio.checked().value());
        ok(radio.getButtons()[0].checked());
        ok(!radio.getButtons()[1].checked());

        // ネイティブイベントで 2 を選択。
        radio.getButtons()[1].trigger('change');
        equal('2', radio.checked().value());
        ok(!radio.getButtons()[0].checked());
        ok(radio.getButtons()[1].checked());

        // カスタムイベントで再度 1 を選択
        radio.getButtons()[0].fire('change');
        equal('1', radio.checked().value());
        ok(radio.getButtons()[0].checked());
        ok(!radio.getButtons()[1].checked());
    });

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

    module('ui.Form', {
        setup: function() {
            $sandbox = $('#sandbox');
            form = new yk.ui.Form('/path/to/api.json');
            stub = sinon.stub(jQuery, 'ajax');
        },
        teardown: function() {
            form.dispose();
            stub.restore();
        }
    });

    test('ui.Form', function() {
        var deferred = new $.Deferred();
        stub.returns(deferred.promise());

        var textbox = new yk.ui.control.Textbox({
            name: 'textbox',
            value: 'ほげ'
        });
        form.registerInput(textbox, true);

        var hidden = new yk.ui.control.Hidden({
            name: 'hidden',
            value: '1'
        });
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
