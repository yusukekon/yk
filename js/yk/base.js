define(['yk'], function() {

    /**
     * @type {*}
     */
    yk.document = yk.global.document;

    /**
     * @param {!Object} childClass
     * @param {!Object} parentClass
     */
    yk.inherits = function(childClass, parentClass) {
        /** @constructor */
        function temp() {};
        temp.prototype = parentClass.prototype;
        childClass.__super__ = parentClass.prototype;
        childClass.prototype = new temp();
        /** @override */
        childClass.prototype.constructor = childClass;
    };

    /**
     * @param {!Object} self
     * @param {string=} opt_name
     * @param {...*} var_args
     * @return {*}
     */
    yk.super = function(self, opt_name, var_args) {
        var caller = arguments.callee.caller;
        if (caller.__super__) {
            return caller.__super__.constructor.apply(self, yk.slice(arguments, 1));
        }
        if (!opt_name) {
            throw Error('name must be not null');
        }

        var found = false;
        for (var parent = self.constructor; parent;
             parent = parent.__super__ && parent.__super__.constructor) {

            if (parent.prototype[opt_name] === caller) {
                found = true;
            } else if (found) {
                return parent.prototype[opt_name].apply(self, yk.slice(arguments, 2));
            }
        }

        if (self[opt_name] === caller) {
            return self.constructor.prototype[opt_name].apply(self, yk.slice(arguments, 2));
        }

        throw Error('base method not found.');
    };

    /**
     * @param {string} def
     */
    yk.package = function(def) {
        var parent = yk.global;
        def.split('.').forEach(function(name) {
            if (!parent.hasOwnProperty(name)) {
                parent[name] = {};
            }
            parent = parent[name];
        });
    };

    /**
     * @return {function}
     */
    yk.nullFunction = function() {};

    /**
     * @return {funtion}
     */
    yk.abstractFuntion = function() {
        throw Error('not implemented');
    };

    /**
     *
     * @param {*} target
     * @return {boolean}
     */
    yk.isDef = function(target) {
        return target !== undefined;
    };

    /**
     * @param {!Object} array
     * @param {number=} opt_start
     * @param {number=} opt_end
     * @return {Array.<*>}
     */
    yk.slice = function(array, opt_start, opt_end) {
        var var_args = Array.prototype.slice.call(arguments, 1);
        return Array.prototype.slice.apply(array, var_args);
    };

    /**
     * @TODO ちゃんとする
     * @return {string}
     */
    yk.generateUniqueId = function() {
        return String(Math.floor(Math.random() * 1000000));
    };

    /**
     * @constructor
     */
    yk.Object = function() {

        /**
         * @type {string}
         * @private
         */
        this.objectId_;

        /**
         * @type {boolean}
         * @private
         */
        this.disposed_ = false;
    };
    yk.inherits(yk.Object, Object);

    /**
     * @return {string}
     */
    yk.Object.prototype.hashcode = function() {
        return this.objectId_ || (this.objectId_ = yk.generateUniqueId());
    };

    /**
     *
     * @param {*} target
     * @return {boolean}
     */
    yk.Object.prototype.equals = function(target) {
        if (!target || !(target instanceof yk.Object)) {
            return false;
        }
        return (this === target && this.hashcode() === target.hashcode());
    };

    /**
     *
     */
    yk.Object.prototype.dispose = function() {
        if (this.disposed_) {
            this.disposed_ = true;
            return;
        }
        delete this.objectId_;
    };


    /**
     * native な配列であれば true を返す
     * @param {*} target
     * @return {boolean}
     */
    yk.isArray = function(value) {
        if (!value) {
            return false;
        }
        if (Array.isArray) {
            return Array.isArray(value);
        }

        /** @see http://www.oreilly.co.jp/books/9784873116105/ */
        return Object.prototype.toString.call(value) === '[object Array]';
    };

    /**
     * @param {!*} value
     * @return {!*}
     */
    yk.assertDefAndNotNull = function(value) {
        if (yk.DEBUG && (value === undefined || value === null)) {
            throw Error("must not be null");
        }
        return value;
    };

    /**
     * @param {string} value
     * @return {string}
     */
    yk.assertString = function(value) {
        if (yk.DEBUG && typeof value !== "string") {
            throw TypeError('must be string');
        }
        return /** @type {string} */(value);
    };

    /**
     * @param {number} value
     * @return {number}
     */
    yk.assertNumber = function(value) {
        if (yk.DEBUG && typeof value !== "number") {
            throw TypeError('must be number');
        }
        return /** @type {number} */(value);
    };

    /**
     * @param {boolean} value
     * @return {boolean}
     */
    yk.assertBoolean = function(value) {
        if (yk.DEBUG && typeof value !== "boolean") {
            throw TypeError('must be boolean');
        }
        return /** @type {boolean} */(value);
    };

    /**
     * @param value
     * @return Array.<*>
     */
    yk.assertArray = function(value) {
        if (yk.DEBUG && !yk.isArray(value)) {
            throw TypeError('must be array');
        }
        return /** @type {Array.<*>} */(value);
    };

    /**
     * @param {T} value
     * @param {function} clazz
     * @return {T}
     * @template T
     */
    yk.assertInstanceof = function(value, clazz) {
        if (yk.DEBUG && !(value instanceof clazz)) {
            throw TypeError('must be ' + clazz);
        }
        return /** @type {T} */(value);
    };

});
