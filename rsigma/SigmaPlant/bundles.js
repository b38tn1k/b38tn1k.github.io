loadjs(
    [
        'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.6.0/p5.min.js',
        'globals.js',
        'modes.js'
    ],
    'bundle0'
);
loadjs.ready('bundle0', {
    success: function () {
        loadjs(
            ['load_screen.js',
            'application.js',
            'ui/menu.js',
            'ui/ui_helpers.js'], 'bundle1'
        );
    }
});
loadjs.ready('bundle1', {
    success: function () {
        loadjs('session/introspector.js', 'bundle2');
    }
});
loadjs.ready('bundle2', {
    success: function () {
        loadjs('session/geometry.js', 'bundle3');
    }
});
loadjs.ready('bundle3', {
    success: function () {
        loadjs(
            ['session/feature_actions.js', 'session/feature_components.js'],
            'bundle4'
        );
    }
});
loadjs.ready('bundle4', {
    success: function () {
        loadjs(['session/feature_buttons.js'], 'bundle5');
    }
});
loadjs.ready('bundle5', {
    success: function () {
        loadjs(
            ['session/features.js', 'session/plant.js', 'session/session.js'],
            'bundle6'
        );
    }
});
loadjs.ready('bundle6', {
    success: function () {
        loadjs(
            [
                'session/features/connector.js',
                'session/features/merge.js',
                'session/features/metric.js',
                'session/features/parentlink.js',
                'session/features/process.js',
                'session/features/sink.js',
                'session/features/source.js',
                'session/features/split.js',
                'session/features/zone.js'
            ],
            'bundle7'
        );
    }
});

loadjs.ready('bundle7', {
    success: function () {
        loadjs('src.js');
    }
});
