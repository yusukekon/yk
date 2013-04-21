function User(json) {
    yk.super(this, json);

    /**
     * @type {number}
     */
    this.id;

    /**
     * @type {string}
     */
    this.name;

    /**
     * @type {yk.util.Date}
     */
    this.birthday;

    /**
     * @type {Array.<number>}
     */
    this.groups;

    /**
     * @type {Array.<User>}
     */
    this.friends;
};
yk.inherits(User, yk.Model);

User.prototype.load = function(json) {
    this.id = yk.assertNumber(this.get(json, 'id'));
    this.name = yk.assertString(this.get(json, 'name'));
    this.birthday = yk.util.Date.parse(this.get(json, 'birthday'));
    this.groups = yk.assertArray(this.get(json, 'groups', true, []));
    this.friends = this.getAsArray(json, 'friends').map(function(each) {
        return new User(each);
    });
};

test('Model', function() {
    // 何も渡さなければ、空の Model を生成
    ok(new User());

    var user = new User({
        id: 1,
        name: 'hoge',
        groups: [100, 200],
        birthday: '1984-08-13',
        friends: [
            {id: 2, name: 'a', birthday: '1985-12-24'},
            {id: 3, name: 'b', birthday: '1985-11-11'}
        ]
    });
    equal(1, user.id);
    equal('hoge', user.name);
    equal('1984/08/13', user.birthday.format());
    equal(100, user.groups[0]);
    equal(200, user.groups[1]);
    equal(2, user.friends[0].id);
    equal(3, user.friends[1].id);
});

test('Model error cases', function() {
    // name 指定がない
    throws(function() {
        new User({
            id: 1
        });
    }, Error);

    // id が number でない
    throws(function() {
        new User({
            id: 'error'
        });
    }, Error);
});
