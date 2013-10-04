define(['yk/util'], function() {

    yk.package('yk.net');

   /**
    * @param {string} url
    * @return {yk.net.HttpBuilder}
    */
    yk.net.request = function(url) {
        return new yk.net.HttpBuilder(url);
    };

   /**
    * @param {string} url
    * @return {yk.net.HttpBuilder}
    */
    yk.net.get = function(url) {
        return yk.net.request(url);
    };

    /**
     * @param {string} url
     * @param {string=} opt_data
     * @return {yk.net.HttpBuilder}
     */
    yk.net.post = function(url, opt_data) {
        return yk.net.request(url).method(yk.net.Method.POST).data(opt_data || null);
    };


    /**
     * @enum {string}
     */
    yk.net.Method = {
        GET: 'GET',
        POST: 'POST',
        PUT: 'PUT',
        DELETE: 'DELETE',
        HEAD: 'HEAD'
    };

    /**
     * @enum {string}
     */
    yk.net.ContentType = {
        URLENCODED: 'application/x-www-form-urlencoded',
        JSON: 'application/json'
    };

    /**
     * @enum {string}
     */
    yk.net.DataType = {
        JSON: 'json',
        HTML: 'html',
        ANY: '*'
    };

    /**
     * @param {string} url
     * @constructor
     * @extends {yk.Object}
     */
    yk.net.HttpBuilder = function(url) {

        /**
         * @type {string}
         * @private
         */
        this.url_ = url;

        /**
         * @type {yk.net.Method}
         * @private
         */
        this.method_ = yk.net.Method.GET;

        /**
         * @type {yk.net.ContentType}
         * @private
         */
        this.contentType_ = yk.net.ContentType.URLENCODED;

        /**
         * @type {yk.net.DataType}
         * @private
         */
        this.dataType_ = yk.net.DataType.ANY;

        /**
         * @type {!*}
         */
        this.data_;
    };
    yk.inherits(yk.net.HttpBuilder, yk.Object);

    /**
     * @param {yk.net.DataType} dataType
     * @return {yk.net.HttpBuilder}
     */
    yk.net.HttpBuilder.prototype.as = function(dataType) {
        this.dataType_ = dataType;
        return this;
    };

    /**
     * @param {yk.net.Method} method
     * @return {yk.net.HttpBuilder}
     */
    yk.net.HttpBuilder.prototype.method = function(method) {
        this.method_ = method;
        return this;
    };

    /**
     * @param {yk.net.ContentType} contentType
     * @return {yk.net.HttpBuilder}
     */
    yk.net.HttpBuilder.prototype.contentType = function(contentType) {
        this.contentType_ = contentType;
        return this;
    };

    /**
     * @param {*} data
     * @return {yk.net.HttpBuilder}
     */
    yk.net.HttpBuilder.prototype.data = function(data) {
        this.data_ = data;
        return this;
    };

    /**
     * @param {Function} callback
     * @return {Deferred}
     */
    yk.net.HttpBuilder.prototype.send = function(callback) {
        return $.ajax({
            method: this.method_,
            url: this.url_,
            dataType: this.dataType_,
            data: this.data_,
            contentType: this.contentType_
        }).done(callback);
    };

    /**
     *
     * @param {Array.<yk.net.HttpKeyValue>} params
     * @return {string}
     */
    yk.net.serialize = function(params) {
        return (params || []).map(function(each) {
            return yk.assertInstanceof(each, yk.net.HttpKeyValue).stringify();
        }).join('&');
    };

    /**
     * @param {string} key
     * @param {?string|Array.<string>} value
     * @constructor
     * @extends {yk.util.Pair}
     */
    yk.net.HttpKeyValue = function(key, value) {
        yk.super(this, yk.assertString(key), this.assertValue_(value));

        /**
         * @type {boolean}
         * @private
         */
        this.isMultipleValue_ = yk.isArray(value);
    };
    yk.inherits(yk.net.HttpKeyValue, yk.util.Pair);

    /**
     * @return {string}
     */
    yk.net.HttpKeyValue.prototype.getKey = function() {
        return yk.assertString(this.getFirst());
    };

    /**
     * @return {string?|Array.<string>}
     */
    yk.net.HttpKeyValue.prototype.getValue = function() {
        return this.getSecond();
    };

    /**
     * @return {string}
     */
    yk.net.HttpKeyValue.prototype.stringify = function() {
        var value = this.isMultipleValue_ ? this.getValue() : [this.getValue()];
        return value.map(function(v) {
            return encodeURIComponent(this.getKey()) + "=" + encodeURIComponent(v);
        }, this).join('&');
    };

    /**
     * @param {string?|Array.<string>} value
     * @private
     */
    yk.net.HttpKeyValue.prototype.assertValue_ = function(value) {
        if (yk.isArray(value)) {
            yk.assertArray(value).forEach(function(each) {
                yk.assertString(each);
            });
            return value;
        }
        return yk.assertString(value);
    };

    /**
     * @param {string} query
     * @constructor
     * @extends {yk.Object}
     */
    yk.net.Query = function(query) {
        yk.super(this);

        /**
         * @type {Object.<string, yk.net.HttpKeyValue>}
         * @private
         */
        this.params_ = {};

        yk.net.Query.parse(query).forEach(function(keyValue) {
            this.params_[keyValue.getKey()] = keyValue;
        }, this);
    };
    yk.inherits(yk.net.Query, yk.Object);

    /**
     * @param {string} query
     * @return {Array.<yk.net.HttpKeyValue>}
     */
    yk.net.Query.parse = function(query) {
        var result = [];
        yk.assertString(query).split('&').forEach(function(keyValue) {
            var equalIndex = keyValue.indexOf('=');
            if (equalIndex === -1) {
                result.push(new yk.net.HttpKeyValue(keyValue, ''));
            } else {
                var key = keyValue.substring(0, equalIndex);
                var value = keyValue.substring(equalIndex + 1);
                result.push(new yk.net.HttpKeyValue(key, value));
            }
        });
        return result;
    };

    /**
     * @param {string} key
     * @return {?string|Array.<string>}
     */
    yk.net.Query.prototype.getValue = function(key) {
        if (!(key in this.params_)) {
            return null;
        }
        return this.params_[key].getValue();
    };

    /**
     * @return {Array.<yk.net.HttpKeyValue>}
     */
    yk.net.Query.prototype.params = function() {
        return yk.object.values(this.params_);
    };

    /**
     * @return {Array.<yk.net.HttpKeyValue>}
     */
    yk.net.Query.prototype.asJson = function() {
        var json = {};
        this.params().forEach(function(each) {
            json[each.getKey()] = each.getValue();
        }, this);
        return json;
    };
});
