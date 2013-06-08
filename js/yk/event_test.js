require(['yk/event'], function() {

    test('yk.event.EventTarget', function() {
        var firedEvent = null;
        var target = new yk.event.EventTarget();
        target.listen('sampleEvent', function(evt) {
            firedEvent = evt;
        });
        target.fire('sampleEvent', 'hoge');

        ok(firedEvent instanceof yk.event.Event);
        ok(target.equals(firedEvent.target));
        ok('hoge', firedEvent.data);
    });

});