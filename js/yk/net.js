define(['yk/util'], function() {

    yk.package('yk.net');

   /**
     * @param {string} url
     * @return {yk.net.HttpBuilder}
     */
    yk.net.get = function(url) {
        return new yk.net.HttpBuilder(url);
    };

    /**
     * @param {string} url
     * @param {string=} opt_data
     * @return {yk.net.HttpBuilder}
     */
    yk.net.post = function(url, opt_data) {
        return new yk.net.HttpBuilder(url).method(yk.net.Method.POST).data(opt_data || null);
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
    yk.net.DataType = {
        JSON: 'json',
        HTML: 'html',
        ANY: '*'
    };

    /**
     * @param {string} url
     * @constructor
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
         * @type {yk.net.DataType}
         * @private
         */
        this.dataType_ = yk.net.DataType.ANY;

        /**
         * @type {!string}
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
     * @param {string} data
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
            data: this.data_
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
     * @param {string?|Array.<string>} value
     * @constructor
     * @inherits {yk.util.Pair}
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
        if (this.isMultipleValue_) {
            yk.assertArray(value).forEach(function(each) {
                yk.assertString(each);
            });
            return value;
        }
        return yk.assertString(value);
    };

});
