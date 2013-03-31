test('yk.package', function() {
    yk.package('a.b.c.d.e');
    ok(a.b.c.d.e, 'a.b.c.d.e must not be null');
});

test('yk.inherits', function() {
    function Parent() {
        this.id = 'parent';
        this.name = 'hoge';
    };
    function Child() {
        yk.super(this);
        this.id = 'child';
    };
    yk.inherits(Child, Parent);

    equal(Child.__super__, Parent.prototype);
    equal(Child.__super__.constructor, Parent);
    equal(Child.prototype.constructor, Child);

    var c = new Child();
    ok(c.name, 'hoge');
    ok(c.id, 'child');
});

test('yk.super', function() {
    function Parent() {
        this.id = 'parent';
    };
    Parent.prototype.hoge = function() {
        return "hogehoge";
    };
    function Child() {
        yk.super(this);
    };
    Child.prototype.hoge = function() {
        return yk.super(this, 'hoge');
    };
    yk.inherits(Child, Parent);

    var c = new Child();
    equal(c.id, 'parent');
    equal(c.hoge(), 'hogehoge');
});

test('yk.slice', function() {
    var target = [1, 2, 3];

    equal(yk.slice(target).length, 3);
    equal(yk.slice(target, 1).length, 2);
    equal(yk.slice(target, 1)[0], 2);
    equal(yk.slice(target, 1, 2).length, 1);
    equal(yk.slice(target, 1, 2)[0], 2);
});

test('yk.Object', function() {
    var obj1 = new yk.Object();
    var obj2 = new yk.Object();

    ok(obj1.equals(obj1));
    ok(obj2.equals(obj2));
    ok(!obj1.equals(obj2));
});
