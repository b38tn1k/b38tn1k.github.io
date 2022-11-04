---
layout: post
title:  "Animation & Contradictions"
date:   2022-10-04
categories: [game, november]
tags: gameprogress
---

I made some dummy assets to start figuring out some sprite animation stuff and realised the concept sorta looks cool in portrait mode... so I undid all the orientation forcing code I created yesterday. Today I have the beginnings of an animated 'drawable' using sprite sheets. A lot of time was spent trying to reinstall PixelSmash and get it to export the animation, rather than just the first frame of the animation N times. I gave up and used Pixelmator, will have a look for a new program once I need to make proper assets. Animation class has 'stop frames' and 'move frames'. 'Stop frames' allow sprites to naturally assume a resting position when an animation trigger is removed (eg, stop walking). 'Move frames' do the opposite - if the current frame of the animation is in a 'rest state', don't allow the sprite to move on screen. It makes walking look a little more natural, but a better sprite sheet would help more too. Happy Friday!
