yk.package('yk.demo');

/**
 * @constructor
 * @inherits {yk.ui.DynamicComponent}
 */
yk.demo.Header = function() {
    yk.super(this, '/web-static/demo/data/profile.json');
};
yk.inherits(yk.demo.Header, yk.ui.DynamicComponent);

/** @override */
yk.ui.DynamicComponent.prototype.createDynamicDom = function(data) {
    this.$el_ = $.tmpl(yk.templates.header, data);
};
