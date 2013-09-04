define(['yk/base'], function() {

    yk.package('yk.util');
    yk.package('yk.string');
    yk.package('yk.object');
    yk.package('yk.array');
    yk.package('yk.math');
    yk.package('yk.collection');


    /**
     * @param {!Object} obj
     * @param {string} key
     * @param {*=} opt_default
     */
    yk.object.get = function(obj, key, opt_default) {
        var value = obj[key];
        return yk.isDefAndNotNull(value) ? value : opt_default;
    };

    /**
     * @param {!Object} obj
     * @param {*} key
     */
    yk.object.containsKey = function(obj, key) {
        return key in obj;
    };

    /**
     *
     * @param obj
     * @param value
     */
    yk.object.containsValue = function(obj, value) {
        for (var key in obj) {
            if (value instanceof yk.Object && value.equals(obj[key])) {
                return true;
            } else if (value === obj[key]) {
                return true;
            }
        }
        return false;
    };

    /**
     * @param {!Object} target
     * @return {number}
     */
    yk.object.size = function(target) {
        var count = 0;
        for (var key in target) {
            count++;
        }
        return count;
    };

    /**
     * @param {Object} o1
     * @param {Object} o2
     * @param {Function} opt_equality
     * @return {boolean}
     */
    yk.object.equals = function(o1, o2, opt_equality) {
        if (yk.object.size(o1) !== yk.object.size(o2)) {
            return false;
        }

        // TODO: 毎回定義するのが無駄なのでどこかに移動したい
        var defaultEquality = opt_equality || function(a, b) {
            if (a instanceof yk.Object && b instanceof yk.Object) {
                return a.equals(b);
            }
            return a === b;
        }

        var equality = opt_equality || defaultEquality;
        for (var key in o1) {
            if (!equality(o1[key], o2[key])) {
                return false;
            }
        }
        return true;
    };

    /**
     * @param {!Object} target
     * @param {!Object} source
     * @param {boolean=} opt_ownPropertyOnly
     */
    yk.object.mixin = function(target, source, opt_ownPropertyOnly) {
        var ownPropertyOnly = yk.isDef(opt_ownPropertyOnly) ? yk.assertBoolean(opt_ownPropertyOnly) : false;
        for (var key in source) {
            if (ownPropertyOnly && !target.hasOwnProperty(key)) {
                continue;
            }
            target[key] = source[key];
        }
    };

    /**
     * @param {!Object} target
     * @return {Array}
     */
    yk.object.values = function(target) {
        var values = [];
        for (var key in target) {
            var value = target[key];
            if (value != null) {
                values.push(value);
            }
        }
        return values;
    };

    /**
     * @param {Array.<*>} a1
     * @param {Array.<*>} a2
     * @param {Function} opt_equality
     * @return {boolean}
     */
    yk.array.equals = function(a1, a2, opt_equality) {
        return yk.object.equals(a1, a2, opt_equality);
    };

    /**
     * @param {Array.<Object|Array>} var_args
     * @return {Array.<*>}
     */
    yk.array.flatten = function(var_args) {
        var result = [];
        for (var i = 0; i < arguments.length; i++) {
            var each = arguments[i];
            if (yk.isArray(each)) {
                result = result.concat(yk.array.flatten.apply(null, each));
            } else {
                result.push(each);
            }
        }
        return result;
    };

    /**
     * @param {string} target
     * @param {string} prefix
     * @return {boolean}
     */
    yk.string.startsWith = function(target, prefix) {
        return yk.assertString(target).indexOf(prefix) === 0;
    };

    /**
     * @param {string} target
     * @return {string}
     */
    yk.string.htmlEscape = function(target) {
        if (!/%<>¥"/g.test(target)) {
            return target;
        }

        if (target.indexOf('&') != -1) {
            target = target.replace(/&/g, '&amp;');
        }
        if (target.indexOf('<') != -1) {
            target = target.replace(/</g, '&lt;');
        }
        if (target.indexOf('>') != -1) {
            target = target.replace(/>/g, '&gt;');
        }
        if (target.indexOf('"') != -1) {
            target = target.replace(/¥"/g, '&quot;');
        }
        return target;
    };

    /**
     *
     * @param {F} first
     * @param {S} second
     * @constructor
     * @extends {yk.Object}
     * @template F,S
     */
    yk.util.Pair = function(first, second) {
        this.first_ = first;
        this.second_ = second;
    };
    yk.inherits(yk.util.Pair, yk.Object);

    /**
     * @return {F}
     */
    yk.util.Pair.prototype.getFirst = function() {
        return this.first_;
    };

    /**
     * @return {S}
     */
    yk.util.Pair.prototype.getSecond = function() {
        return this.second_;
    };

    /**
     * @param {*...} var_args
     * @constructor
     * @extends {yk.Object}
     */
    yk.util.Tuple = function(var_args) {
        yk.super(this);

        /**
         * @type {Array.<*>}
         * @private
         */
        this.values_ = yk.slice(arguments);
    };
    yk.inherits(yk.util.Tuple, yk.Object);

    /**
     * @return {number}
     */
    yk.util.Tuple.prototype.length = function() {
        return this.values_.length;
    };

    /**
     * @param {number} index
     * @return {*}
     */
    yk.util.Tuple.prototype.get = function(index) {
        if (index < 0 || index >= this.length()) {
            throw new Error('index out of bounds: ' + index);
        }
        return this.values_[index];
    };

    /**
     *
     * @param {number} opt_start
     * @param {number=} opt_end
     */
    yk.util.Tuple.prototype.slice = function(start, opt_end) {
        return yk.slice(this.values_, start, opt_end);
    };

    /**
     * @return {number}
     */
    yk.util.currentTimeInMillis = function() {
        return yk.util.nativeDate().getTime();
    };

    /**
     *
     * @param {string|number} opt_date
     * @return {Date}
     */
    yk.util.nativeDate = function(opt_date) {
        var d = new Date(opt_date || null);
        if (isNaN(d)) {
            throw new Error('illegal date format: ' + date);
        }
        // ミリ秒は考慮しない
        d.setMilliseconds(0);
        return d;
    };

    /**
     *
     * @param {number} timeInMillies
     * @param {yk.util.Timezone} opt_timezone
     * @constructor
     * @extends {yk.Object}
     */
    yk.util.DateTime = function(timeInMillis, opt_timezone) {
        yk.super(this);

        /**
         *
         * @type {!number}
         * @protected
         */
        this.date = yk.util.nativeDate(timeInMillis);

        /**
         * @type {?yk.util.Timezone}
         * @private
         */
        this.timezone_ = opt_timezone || null;
    };
    yk.inherits(yk.util.DateTime, yk.Object);

    /**
     * @param {string|number} target
     * @return {yk.util.DateTime}
     */
    yk.util.DateTime.parse = function(target) {
        var d = yk.util.nativeDate(target);
        if (!d) {
            throw Error('Failed to parse datetime: ' + target);
        }
        return new yk.util.DateTime(d.getTime());
    };

    /** @override */
    yk.util.DateTime.prototype.equals = function(target) {
        if (!target || !(target instanceof yk.util.DateTime)) {
            return false;
        }
        return this.getTimeInMillis() === target.getTimeInMillis();
    };

    /**
     * @return {yk.util.DateTime}
     */
    yk.util.DateTime.now = function() {
        return new yk.util.DateTime(yk.util.currentTimeInMillis());
    };

    /**
     * @return {number}
     */
    yk.util.DateTime.prototype.getYear = function() {
        return this.date.getFullYear();
    };

    /**
     * @return {number}
     */
    yk.util.DateTime.prototype.getMonth = function() {
        return this.date.getMonth() + 1;
    };

    /**
     * @return {number}
     */
    yk.util.DateTime.prototype.getDate = function() {
        return this.date.getDate();
    };

    /**
     * @return {number}
     */
    yk.util.DateTime.prototype.getHour = function() {
        return this.date.getHours();
    };

    /**
     * @return {number}
     */
    yk.util.DateTime.prototype.getMinutes = function() {
        return this.date.getMinutes();
    };

    /**
     * @return {number}
     */
    yk.util.DateTime.prototype.getSeconds = function() {
        return this.date.getSeconds();
    };

    /**
     *
     * @param {yk.util.Timezone} timezone
     * @return {yk.util.DateTime}
     */
    yk.util.DateTime.prototype.setTimezone = function(timezone) {
        this.timezone_ = timezone;
        return this;
    };

    /**
     *
     * @param {number} interval
     */
    yk.util.DateTime.prototype.forward = function(interval) {
        this.date.setTime(this.timeInMillis + (interval * 1000));
        return this;
    };

    /**
     * @return {yk.util.UtcDateTime}
     */
    yk.util.DateTime.prototype.utc = function() {
        return new yk.util.UtcDateTime(this.getTimeInMillis());
    };

    /**
     * @return {yk.util.Date}
     */
    yk.util.DateTime.prototype.toDate = function() {
        return new yk.util.Date(this.clone());
    };

    /**
     *
     * @return {yk.util.Time}
     */
    yk.util.DateTime.prototype.toTime = function() {
        return new yk.util.Time(this.clone());
    };

    /**
     * @return {number}
     */
    yk.util.DateTime.prototype.getTimeInMillis = function() {
        return this.date.getTime();
    };

    /**
     * @return {yk.util.DateTime}
     */
    yk.util.DateTime.prototype.clone = function() {
        return new yk.util.DateTime(this.getTimeInMillis());
    };

    /**
     * %Y/%m/%d %H:%M
     * @return {string}
     */
    yk.util.DateTime.prototype.format = function() {
        return this.toDate().format() + " " + this.toTime().format();
    };

    /**
     * %Y-%m-%d %H:%M:%s
     * @return {string}
     */
    yk.util.DateTime.prototype.formatWithSeconds = function() {
        return this.toDate().format() + " " + this.toTime().formatWithSeconds();
    };

    /**
     *
     * @param {number} timeInMillis
     * @constructor
     * @extends {yk.util.DateTime}
     */
    yk.util.UtcDateTime = function(timeInMillis) {
        yk.super(this, timeInMillis, yk.util.Timezone.UTC);
    };
    yk.inherits(yk.util.UtcDateTime, yk.util.DateTime);

    /** @override */
    yk.util.UtcDateTime.prototype.clone = function() {
        return new yk.util.UtcDateTime(this.getTimeInMillis());
    };

    /** @override */
    yk.util.UtcDateTime.prototype.getYear = function() {
        return this.date.getUTCFullYear();
    };

    /** @override */
    yk.util.UtcDateTime.prototype.getMonth = function() {
        return this.date.getUTCMonth() + 1;
    };

    /** @override */
    yk.util.UtcDateTime.prototype.getDate = function() {
        return this.date.getUTCDate();
    };

    /** @override */
    yk.util.UtcDateTime.prototype.getHour = function() {
        return this.date.getUTCHours();
    };

    /** @override */
    yk.util.UtcDateTime.prototype.getMinutes = function() {
        return this.date.getUTCMinutes();
    };

    /** @override */
    yk.util.UtcDateTime.prototype.getSeconds = function() {
        return this.date.getUTCSeconds();
    };

    /**
     *
     * @param {string|number} target
     * @return {yk.util.UtcDateTime}
     */
    yk.util.UtcDateTime.parse = function(target) {
        return yk.util.DateTime.parse(target).utc();
    };

    /**
     * %Y-%m-%d'T'%H:%M:%S'Z'
     * @return {string}
     */
    yk.util.UtcDateTime.prototype.formatIso8601 = function() {
        var year = this.getYear();
        var month = this.getMonth();
        var day = this.getDate();
        return year +
               "-" +
               (month < 10 ? "0" + month : month) +
               "-" +
               (day < 10 ? "0" + day : day) +
               'T' + this.toTime().formatWithSeconds() + 'Z';
    };

    /**
     * @return {yk.util.UtcDateTime}
     */
    yk.util.UtcDateTime.now = function() {
        return yk.util.DateTime.now().utc();
    };

    /**
     *
     * @param {yk.util.DateTime} datetime
     * @constructor
     * @extends {yk.Object}
     */
    yk.util.Date = function(datetime) {
        yk.super(this);

        /**
         *
         * @type {yk.util.DateTime}
         * @private
         */
        this.datetime_ = datetime;
    };
    yk.inherits(yk.util.Date, yk.Object);

    /**
     * @return {yk.util.Date}
     */
    yk.util.Date.now = function() {
        return yk.util.DateTime.now().toDate();
    };

    /**
     *
     * @param {string} target
     * @return {yk.util.Date}
     */
    yk.util.Date.parse = function(target) {
        return yk.util.DateTime.parse(target).toDate();
    };

    /** @override */
    yk.util.Date.prototype.equals = function(target) {
        if (!target || !(target instanceof yk.util.Date)) {
            return false;
        }
        return this.format() === target.format();
    };

    /**
     * %Y/%m/%d
     * @return {string}
     */
    yk.util.Date.prototype.format = function() {
        var year = this.getYear();
        var month = this.getMonth();
        var day = this.getDate();
        return year +
               "/" +
               (month < 10 ? "0" + month : month) +
               "/" +
               (day < 10 ? "0" + day : day);
    };

    /**
     * @return {number}
     */
    yk.util.Date.prototype.getYear = function() {
        return this.datetime_.getYear();
    };

    /**
     * @return {number}
     */
    yk.util.Date.prototype.getMonth = function() {
        return this.datetime_.getMonth();
    };

    /**
     * @return {number}
     */
    yk.util.Date.prototype.getDate = function() {
        return this.datetime_.getDate();
    };

    /**
     *
     * @param {yk.util.DateTime} datetime
     * @constructor
     * @extends {yk.Object}
     */
    yk.util.Time = function(datetime) {
        yk.super(this);

        /**
         * @type {yk.util.DateTime}
         * @private
         */
        this.datetime_ = datetime;
    };
    yk.inherits(yk.util.Time, yk.Object);

    /**
     * @return {yk.util.Time}
     */
    yk.util.Time.now = function() {
        return yk.util.DateTime.now().toTime();
    };

    /** @override */
    yk.util.Time.prototype.equals = function(target) {
        if (!target || !(target instanceof yk.util.Time)) {
            return false;
        }
        return this.formatWithSeconds() === target.formatWithSeconds();
    };

    /**
     * %H:%M
     * @return {string}
     */
    yk.util.Time.prototype.format = function() {
        var hour = this.getHour();
        var minutes = this.getMinutes();
        return (hour < 10 ? "0" + hour : hour) +
               ":" +
               (minutes < 10 ? "0" + minutes : minutes);
    };

    /**
     * %H:%M:%S
     * @return {string}
     */
    yk.util.Time.prototype.formatWithSeconds = function() {
        var seconds = this.getSeconds();
        return this.format() +
               ":" +
               (seconds < 10 ? "0" + seconds : seconds);
    };

    /**
     * @return {number}
     */
    yk.util.Time.prototype.getHour = function() {
        return this.datetime_.getHour();
    };

    /**
     * @return {number}
     */
    yk.util.Time.prototype.getMinutes = function() {
        return this.datetime_.getMinutes();
    };

    /**
     * @return {number}
     */
    yk.util.Time.prototype.getSeconds = function() {
        return this.datetime_.getSeconds();
    };

    /**
     *
     * @param {string} name
     * @param {number} offset
     * @constructor
     * @extends {yk.Object}
     */
    yk.util.Timezone = function(name, offset) {
        yk.super(this);

        /**
         * @type {string}
         * @private
         */
        this.name_ = name;

        /**
         * @type {number}
         * @private
         */
        this.offset_ = offset;
    };
    yk.inherits(yk.util.Timezone, yk.Object);

    /**
     * @param {yk.util.DateTime} datetime
     */
    yk.util.Timezone.prototype.apply = function(datetime) {
        return datetime.setTimezone(this);
    };

    yk.util.Timezone.UTC = new yk.util.Timezone('utc', 0);
    yk.util.Timezone.JST = new yk.util.Timezone('utc', 9);

    /**
     * @type {number}
     * @const
     */
    yk.math.DEFAULT_SCALE = 2;

    /**
     * @param {...Array<number>|number} var_args
     * @return {number}
     */
    yk.math.sum = function(var_args) {
        var args = yk.array.flatten(yk.slice(arguments));
        return yk.assertNumber(args.reduce(function(total, val) {
            return total+ val;
        }, 0));
    };

    /**
     * @param {...Array<number>|number} var_args
     * @return {number}
     */
    yk.math.average = function(var_args) {
        var args = yk.array.flatten(yk.slice(arguments));
        var total = yk.math.sum(args);
        // TODO: scale 指定できるように
        var scale = Math.pow(10, yk.math.DEFAULT_SCALE);
        return Math.round(total * scale / args.length) / scale;
    };

    /**
     * @constructor
     * @extends {yk.Object}
     */
    yk.collection.MultiMap = function() {

        /**
         * @type {Array.<*>}
         * @private
         */
        this.order_ = [];

        /**
         * @type {Object.<string, Array>}
         * @private
         */
        this.values_ = {};
    };
    yk.inherits(yk.collection.MultiMap, yk.Object);

    /**
     * @param {*} key
     * @param {*} value
     */
    yk.collection.MultiMap.prototype.put = function(key, value) {
        if ( !(key in this.values_) ) {
            this.order_.push(key);
            this.values_[key] = [];
        }
        this.values_[key].push(value);
    };

    /**
     * @return {Array.<*>}
     */
    yk.collection.MultiMap.prototype.keys = function() {
        return this.order_;
    };

    /**
     * @param {*} key
     * @return {!Array.<*>}
     */
    yk.collection.MultiMap.prototype.get = function(key) {
        return this.values_[key] || [];
    };

    /**
     * @param {function} f
     * @param {*=} opt_scope
     */
    yk.collection.MultiMap.prototype.forEach = function(f, opt_scope) {
        var scope = opt_scope || this;
        for (var i = 0; i < this.order_.length; i++) {
            var key = this.order_[i];
            f.call(scope, this.get(key), key, i);
        }
    };

    /**
     * @param {function} f
     * @param {*=} opt_scope
     * @return {Array.<*>}
     */
    yk.collection.MultiMap.prototype.map = function(f, opt_scope) {
        var result = [];
        this.forEach(function(values, key, i) {
            result.push(f.call(this, values, key, i));
        }, opt_scope);
        return result;
    };
});
