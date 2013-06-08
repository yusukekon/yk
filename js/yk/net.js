define(['yk/util'], function() {

    yk.package('yk.net');

    yk.net.post = function() {

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
