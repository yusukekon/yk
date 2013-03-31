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
