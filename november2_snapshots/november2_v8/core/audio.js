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
            console.log('before play:', s.getVolume(), s.isPlaying());
            console.log('AudioManager: play', name, opts, s);
            if (!s) return;
            if (opts.stopOthers) {
                Object.values(tracks).forEach(t => { if (t.isPlaying()) t.stop(); });
            }
            if (!s.isPlaying()) {
                s.play();
            }
            console.log('after play:', s.getVolume(), s.isPlaying());
        },

        stop(name, opts = {}) {
            const s = tracks[name];
            if (s && s.isPlaying()) {
                s.stop();
            }
        },

        stopAll() {
            Object.values(tracks).forEach(s => { if (s.isPlaying()) s.stop(); });
        },

        warmAll() {
            // Attempt to force decoding of all registered audio files
            Object.values(tracks).forEach(s => {
                try {
                    // If the buffer is already decoded, skip
                    if (s.buffer) return;

                    // Silent decoding trick:
                    // start at time=0, rate=1, volume=0 — immediately stop
                    s.play(0, 1, 0);
                    s.stop();

                } catch (e) {
                    console.warn("Audio warm-up failed for a track:", s, e);
                }
            });
        }
    };
}