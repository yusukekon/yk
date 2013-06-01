require(['yk'], function() {
    require(yk.modules, function() {
        // 全モジュールを読み込んでからテスト実行
        require(yk.modules.map(function(module) {
            return module + '_test';
        }));
    });
});
