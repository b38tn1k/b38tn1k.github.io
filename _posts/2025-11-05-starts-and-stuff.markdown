---
layout: post
title:  "here we go again..."
date:   2025-11-05
categories: [game, november]
tags: game2progress
---

It is November and I am going to make a [game](https://itch.io/jam/game-off-2025) again. This year the theme is WAVES.

So, I am going to make something wavey. The last game jam taught me a lot. I've also designed/built some pretty beefy SW projects since then. And AI is a thing now. 

I might vibe a little bit. I refuse to use it for any of the artistic components. Video Games Are Art. Making the graphics, music, story, levels - that is the fun stuff. Video games also have a bunch of boring behind the scenes infrastructure stuff that is less art. and that is where I might vibe for a bit. 

I have kicked off with a very intentional archtecture layout. 

```
.
├── favicon.ico
├── index.html
├── main.js
├── README.md
└── style.css
├── assets
│   ├── created
│   └── found
├── components
│   ├── //TODO
├── config
│   ├── controls.json
│   ├── levels.json
│   └── settings.js
├── core
│   ├── audio.js
│   ├── controls.js
│   ├── debug.js
│   ├── entityManager.js
│   ├── renderer.js
│   ├── resourceManager.js
│   ├── sceneManager.js
│   ├── state.js
│   ├── system.js
│   ├── timing.js
│   └── ui.js
├── entities
│   ├── baseEntity.js
│   └── player.js
├── scenes
│   ├── gameover.js
│   ├── level1.js
│   └── menu.js
└── shaders
    ├── default.frag
    └── default.vert
```

I have a bit of an idea of what I want to make. will see how we go