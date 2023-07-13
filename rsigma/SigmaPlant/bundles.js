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
            [
                'load_screen.js',
                'application.js',
                'ui/menu.js',
                'ui/ui_helpers.js'
            ],
            'bundle1'
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
            [
                'session/feature_helpers/feature_actions.js',
                'session/feature_helpers/feature_components.js',
                'session/session_helpers/redo_actions.js',
                'session/session_helpers/undo_actions.js'
            ],
            'bundle4'
        );
    }
});
loadjs.ready('bundle4', {
    success: function () {
        loadjs(
            [
                'session/feature_helpers/feature_buttons.js',
                'session/plant_helpers/plant_setup.js',
                'session/session_helpers/undo_stack.js',
                'session/session_helpers/session_setup_mixin.js',
                'session/plant_helpers/process_active_feature.js',
                'session/plant_helpers/self_construct_helper.js',
                'session/widget_helpers/widget_frame.js'
            ],
            'bundle5'
        );
    }
});
loadjs.ready('bundle5', {
    success: function () {
        loadjs(
            [
                'session/features.js',
                'session/plant.js',
                'session/session.js',
                'session/widget.js'
            ],
            'bundle6'
        );
    }
});

loadjs.ready('bundle6', {
    success: function () {
        loadjs(
            [
                'session/widgets/note_widget.js',
                'session/widgets/info_widget.js',
                'session/widgets/number_widget.js',
                'session/widgets/tag_widget.js'
            ],
            'bundle7'
        );
    }
});

loadjs.ready('bundle7', {
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
                'session/features/zone.js',
                'session/features/note.js'
            ],
            'bundle8'
        );
    }
});

loadjs.ready('bundle8', {
    success: function () {
        loadjs('src.js');
    }
});
