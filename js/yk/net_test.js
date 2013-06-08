require(['yk/net'], function() {

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
