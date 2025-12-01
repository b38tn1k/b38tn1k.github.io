export function createAudioManager(p) {
    const tracks = {};
    let themeFilter = null;
    let themeFiltered = false;

    return {
        cancelTweensFor(obj, setter = null) {
            if (!p.shared || !p.shared.tweens) return;
            const tweens = p.shared.tweens;
            for (let i = tweens.length - 1; i >= 0; i--) {
                const t = tweens[i];
                if (t.obj === obj && (setter === null || t.setter === setter)) {
                    tweens.splice(i, 1);
                }
            }
        },

        register(name, sound) {
            tracks[name] = sound;
        },

        fadeIn(name, duration = 300) {
            const s = tracks[name];
            if (!s) return;

            this.cancelTweensFor(s, 'setVolume');

            if (!s.isPlaying()) {
                s.setVolume(0);
                s.play();
            }

            p.shared.tween(s, 'setVolume', 1, duration);
        },

        fadeOut(name, duration = 300) {
            const s = tracks[name];
            if (!s) return;

            this.cancelTweensFor(s, 'setVolume');

            if (!s.isPlaying()) {
                s.stop();
                return;
            }

            p.shared.tween(
                s,
                'setVolume',
                0,
                duration,
                () => {
                    s.pause();
                    s.setVolume(0);
                    setTimeout(() => {
                        try { s.stop(); } catch (e) {}
                    }, 20);
                    this.cancelTweensFor(s, 'setVolume');
                }
            );
        },

        play(name, opts = {}) {
            const s = tracks[name];
            // console.log('before play:', s.getVolume(), s.isPlaying());
            // console.log('AudioManager: play', name, opts, s);
            if (!s) return;
            if (opts.stopOthers) {
                Object.entries(tracks).forEach(([otherName, otherTrack]) => {
                    if (otherName === name) return;
                    if (otherTrack.isPlaying()) {
                        this.stop(otherName);
                    }
                });
            }
            // if (!s.isPlaying()) {
            //     s.play();
            // }
            if (!s.isPlaying()) {
                this.cancelTweensFor(s, 'setVolume');
                s.setVolume(0);
                s.play();

                if (name === 'theme') { // hacky but lazy 
                    s.setLoop(true);
                }

                p.shared.tween(s, 'setVolume', 1, 400);
            }
            // console.log('after play:', s.getVolume(), s.isPlaying());
        },

        enableThemeFilter() {
            // console.log('AudioManager: enableThemeFilter');
            const s = tracks['theme'];
            if (!s) return;

            // create and install filter once
            if (!themeFilter) {
                themeFilter = new p5.LowPass();
                themeFilter.freq(20000);        // wide open initially

                s.disconnect();
                s.connect(themeFilter);
                themeFilter.connect(p5.soundOut);

                // Force WebAudio graph stabilization
                try {
                    const ctx = p.getAudioContext();
                    if (ctx.state === 'suspended') ctx.resume();
                } catch (e) {
                    console.warn("AudioCtx resume failed:", e);
                }
            }

            // Ensure routing remains intact after play() calls
            if (!s.output || !themeFilter) {
                s.disconnect();
                s.connect(themeFilter);
            }

            // smooth transition to muffled underwater sound
            p.shared.tween(
                themeFilter,
                'freq',
                300,       // target cutoff
                1000       // duration ms
            );

            themeFiltered = true;
        },

        disableThemeFilter() {
            // console.log('AudioManager: disableThemeFilter');
            const s = tracks['theme'];
            if (!s) return;

            // Ensure filter node is still valid
            if (!themeFilter) return;
            if (!s.output) {
                s.disconnect();
                s.connect(themeFilter);
            }

            // smooth transition back to full clarity
            p.shared.tween(
                themeFilter,
                'freq',
                20000,     // fully open
                1000
            );

            themeFiltered = false;
        },

        stop(name, opts = {}) {
            const s = tracks[name];
            if (s && s.isPlaying()) {
                p.shared.tween(s, 'setVolume', 0, 400, () => {
                    s.pause();
                    s.setVolume(0);
                    setTimeout(() => {
                        try { s.stop(); } catch (e) {}
                    }, 20);
                });
            }
        },

        stopAll() {
            Object.entries(tracks).forEach(([name, s]) => {
                if (s && s.isPlaying()) {
                    this.stop(name);
                }
            });
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