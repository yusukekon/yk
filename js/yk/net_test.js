require(['yk/net'], function() {

    module('Form', {
        setup: function() {
            stub = sinon.stub(jQuery, 'ajax');
        },
        teardown: function() {
            stub.restore();
        }
    });

    test('yk.net.get', function() {
        var deferred = $.Deferred();
        stub.returns(deferred.promise());
        yk.net.get('http://google.com/').as(yk.net.DataType.JSON).send(function(resp) {
            equal('hoge', resp['result']);
        });
        deferred.resolve({'result': 'hoge'});

        var param = stub.getCall(0).args[0];
        equal('http://google.com/', param['url']);
        equal(yk.net.Method.GET, param['method']);
        equal(yk.net.DataType.JSON, param['dataType']);
        ok(!param['data']);
    });

    test('yk.net.post', function() {
        var deferred = $.Deferred();
        stub.returns(deferred.promise());
        yk.net.post('http://google.com/', 'a=1&b=2').send(function(resp) {
            equal('ok', resp)
        });
        deferred.resolve('ok');

        var param = stub.getCall(0).args[0];
        equal('http://google.com/', param['url']);
        equal(yk.net.Method.POST, param['method']);
        equal(yk.net.DataType.ANY, param['dataType']);
        equal('a=1&b=2', param['data']);
    });

    test('yk.net.serialize', function() {
        var params;

        params = [
            new yk.net.HttpKeyValue('hoge', 'fuga'),
            new yk.net.HttpKeyValue('a', ['1', '2']),
            new yk.net.HttpKeyValue('foo', 'bar')
        ];
        equal('hoge=fuga&a=1&a=2&foo=bar', yk.net.serialize(params));

        params = [
            new yk.net.HttpKeyValue('ほげ', 'ふが')
        ];
        equal('%E3%81%BB%E3%81%92=%E3%81%B5%E3%81%8C', yk.net.serialize(params));
    });

});
