requirejs.config({
    urlArgs: 'v=' + new Date().getTime(),
    paths: {
        '3rd/jquery': '../3rd-party/jquery-1.9.1',
        '3rd/jquery-template': '../3rd-party/jquery-template.min'
    }
});

require(['yk', '3rd/jquery'], function() {
    require(['yk/base_test']);
    require(['yk/event_test']);
    require(['yk/util_test']);
    require(['yk/net_test']);
    require(['yk/model_test']);
    require(['yk/form_test']);
    require(['yk/ui_test']);
    require(['yk/ui/control_test']);
    require(['yk/ui/layout_test']);
    require(['yk/ui/dialog_test']);
});
