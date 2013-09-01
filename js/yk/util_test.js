define(['yk/util'], function() {

    test('object.get', function () {
        var obj = {
            a: 1,
            b: null
        };
        equal(1, yk.object.get(obj, 'a'));
        equal(null, yk.object.get(obj, 'b'));
        equal(undefined, yk.object.get(obj, 'c'));
        equal(2, yk.object.get(obj, 'b', 2));
        equal(3, yk.object.get(obj, 'c', 3));
    });

    test('object.containsKey', function() {
        var obj = {
            'a': 1,
            'b': 2
        };
        ok(yk.object.containsKey(obj, 'a'));
        ok(yk.object.containsKey(obj, 'b'));
        ok(!yk.object.containsKey(obj, 'not found'));
    });

    test('object.containsValue', function() {
        var now = yk.util.Date.now();
        var obj = {
            'a': 1,
            'b': now
        };
        ok(yk.object.containsValue(obj, 1));
        ok(yk.object.containsValue(obj, now));
        ok(!yk.object.containsValue(obj, 'not found'));
    });

    test('object.size', function() {
        equal(0, yk.object.size({}));
        equal(1, yk.object.size({a: 1}));

        var obj = {};
        for (var i = 0; i < 100; i++) {
            obj[i] = i;
        }
        equal(100, yk.object.size(obj));
    });

    test('object.equals', function() {
        var o1, o2;

        o1 = {a: 1, b: 2};
        o2 = {a: 1, b: 2};
        ok(yk.object.equals(o1, o2));

        o1 = {a: 1, b: '2'};
        o2 = {a: 1, b: '2'};
        ok(yk.object.equals(o1, o2));

        // 型が違うので同値とはならない
        o1 = {a: 1, b: '2'};
        o2 = {a: 1, b: 2};
        ok(!yk.object.equals(o1, o2));

        // 値が文字列なら数値に変換して判定することもできる
        var equality = function(val1, val2) {
            var val1 = typeof val1 === 'string' ? +val1 : val1;
            var val2 = typeof val2 === 'string' ? +val2 : val2;
            return val1 === val2;
        };
        ok(yk.object.equals(o1, o2, equality));

        o1 = {
            a: {
                hoge: 'fuga',
                b: 'b'
            }
        };
        o2 = {
            a: {
                hoge: 'fuga',
                c: 'c'
            }
        };
        equality = function(val1, val2) {
            return val1['hoge'] === val2['hoge'];
        };
        ok(yk.object.equals(o1, o2, equality));

        // yk.Object およびそのサブクラスは yk.Object#equals で比較する
        // 参照値(オブジェクトID)が異なるので、同値とはならない
        o1 = {a: new yk.Object()};
        o2 = {a: new yk.Object()};
        ok(!yk.object.equals(o1, o2));

        // 同じオブジェクトを指定すれば、同値と判定される
        var obj = new yk.Object();
        o1 = {a: obj};
        o2 = {a: obj};
        ok(yk.object.equals(o1, o2));
    });

    test('object.mixin', function() {
        var obj = {
            a: 1,
            b: 2,
            c: 3
        };
        yk.object.mixin(obj, {
            a: 100,
            d: 400
        });

        var expected = {
            a: 100,
            b: 2,
            c: 3,
            d: 400
        };
        ok(yk.object.equals(expected, obj));

        // ownPropertyOnly フラグを立てると、存在しないプロパティは設定しない
        yk.object.mixin(obj, {
            z: 1000
        }, true);
        ok(yk.object.equals(expected, obj));
    });

    test('object.values', function() {
        var obj = {
            'a': 1,
            'b': 2,
            'c': 3
        };
        var expected = [1, 2, 3];
        var actual = yk.object.values(obj);
        ok(yk.array.equals(expected, actual))
    });

    test('string.startsWith', function() {
        ok(yk.string.startsWith('abcde', 'a'));
        ok(yk.string.startsWith('abcde', 'abc'));
        ok(!yk.string.startsWith('abcde', 'b'));
    });

    test('array.flatten', function() {
        var target = [
            1, 2, [3, 4], 5, [6, 7], [8, 9], 10
        ];
        var expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        ok(yk.array.equals(expected, yk.array.flatten(target)));
    });

    test('util.Pair', function() {
        var pair = new yk.util.Pair('hoge', 'fuga');
        equal('hoge', pair.getFirst());
        equal('fuga', pair.getSecond());
    });

    test('util.Tuple', function() {
        var tuple = new yk.util.Tuple(1, 4, 9, 16);
        equal(4, tuple.length());
        equal(1, tuple.get(0));
        equal(4, tuple.get(1));
        equal(9, tuple.get(2));
        equal(16, tuple.get(3));
        throws(function() {
            tuple.get(4)
        }, Error);
        throws(function() {
            tuple.get(-1)
        }, Error);

        ok(yk.array.equals([1, 4], tuple.slice(0, 2)));
        ok(yk.array.equals([9, 16], tuple.slice(-2)));
    });

    test('util.DateTime', function() {
        ok(yk.util.DateTime.now() instanceof yk.util.DateTime);
        ok(yk.util.UtcDateTime.now() instanceof yk.util.UtcDateTime);

        var d = yk.util.DateTime.parse('2000-01-02T03:04:05Z').utc();
        equal('2000/01/02 03:04', d.format());
        equal('2000/01/02 03:04:05', d.formatWithSeconds());

        var formatted = d.formatIso8601();
        ok(d.equals(yk.util.UtcDateTime.parse(formatted)));
    });

    test('util.Date', function() {
        ok(yk.util.Date.now() instanceof yk.util.Date);

        var target = yk.util.Date.parse('2000-01-02');
        equal('2000/01/02', target.format());

        // 日付が一致しなければ、false
        ok(!target.equals(yk.util.Date.parse('2000-01-03T06:07:08Z')));
        // 日付が一致していれば、時刻が違っても同値と判定
        ok(target.equals(yk.util.Date.parse('2000-01-02T06:07:08Z')));
    });

    test('util.Time', function() {
        ok(yk.util.Time.now() instanceof yk.util.Time);

        var t = yk.util.UtcDateTime.parse('2000-01-02T03:04:05Z').toTime();
        equal('03:04', t.format());
        equal('03:04:05', t.formatWithSeconds());

        var t2 = yk.util.UtcDateTime.parse('2000-01-02T03:04:06Z').toTime();
        var t3 = yk.util.UtcDateTime.parse('2000-01-03T03:04:05Z').toTime();

        // 時刻が一致しなければ、false
        ok(!t.equals(t2))
        // 時刻が一致していれば、日付が違っても同値と判定
        ok(t.equals(t3))
    });

    test('collection.MultiMap', function() {
        var sut = new yk.collection.MultiMap();
        sut.put('a', 1);
        sut.put('a', 2);
        sut.put('a', 3);
        sut.put('b', 4);
        sut.put('b', 5);

        ok(yk.array.equals([1, 2, 3], sut.get('a')));
        ok(yk.array.equals([4, 5], sut.get('b')));
        equal(0, sut.get('c').length);

        var lengthArr = sut.map(function(values, key) {
            return values.length;
        });
        ok(2, lengthArr.length);
        ok(3, lengthArr[0]);
        ok(2, lengthArr[1]);
    });
});
