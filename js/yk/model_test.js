require(['yk/model'], function() {

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

    User.prototype.toJSON = function() {
        return {
            id: this.id,
            name: this.name,
            birthday: this.birthday.format(),
            groups: this.groups,
            friends: this.friends.map(function(each) {
                return each.toJSON();
            })
        }
    };

    test('mode.Model', function() {
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
        user.listen(yk.model.EventType.UPDATED, function(evt) {
            ok(evt instanceof yk.model.Event);
            equal(yk.model.EventType.UPDATED, evt.type);
        });

        user.fire(yk.model.EventType.UPDATED);
    });

    test('model.Event', function() {
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

        var json = user.toJSON();
        equal(1, json.id);
        equal('hoge', json.name);
        equal('1984/08/13', json.birthday);
        equal(100, json.groups[0]);
        equal(200, json.groups[1]);
        equal(2, json.friends[0].id);
        equal(3, json.friends[1].id);
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

});
