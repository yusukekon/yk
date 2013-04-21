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
