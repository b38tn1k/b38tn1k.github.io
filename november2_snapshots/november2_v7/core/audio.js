export function createAudioManager(p) {
    const tracks = {};

    return {
        register(name, sound) {
            tracks[name] = sound;
        },

        fadeIn(name, duration = 50) {
            const s = tracks[name];
            if (!s) return;
            s.setVolume(0);
            s.play();
            p.tween(s, 'volume', 1, duration);
        },

        fadeOut(name, duration = 50) {
            const s = tracks[name];
            if (!s) return;
            const startVol = s.getVolume();
            p.tween(s, 'volume', 0, duration, () => s.stop());
        },

        play(name, opts = {}) {
            const s = tracks[name];
            if (!s) return;
            if (opts.stopOthers) {
                Object.values(tracks).forEach(t => { if (t.isPlaying()) t.stop(); });
            }
            if (!s.isPlaying()) {
                if (opts.fadeIn) {
                    this.fadeIn(name, opts.fadeIn);
                } else {
                    s.play();
                }
            }
        },

        stop(name, opts = {}) {
            const s = tracks[name];
            if (s && s.isPlaying()) {
                if (opts?.fadeOut) {
                    this.fadeOut(name, opts.fadeOut);
                } else {
                    s.stop();
                }
            }
        },

        stopAll() {
            Object.values(tracks).forEach(s => { if (s.isPlaying()) s.stop(); });
        }
    };
}