---
layout: post
title: Everything is wobbly. half way
date: 2025-11-15
categories: [game, november]
tags: game2progress
---
Physics engines are a lot to make. But is it a very interesting process. I spend most of dev time today adding more bugs into the physics and removing them. But I got to a basic level where currents can be zoned and add realistic forces with momentum and squish and collisions and it's all very nice. I had to add a world border, and I am very excited to start adding some plankton and sea weed type ambient mobs (and maybe some low level ambient currents). I am interested to see when my computer is going to start complaining - with the spider web demo linked earlier I can get a couple hunder nodes running. This **should** be a little more efficient than that demo. We shall see. For plankton, I want to use my Personal Space Invaders algorithm. Cause theyre cute and that would be fun. 

The un-shader-ed colors are getting weirder. I keep on thinking of layers to add, then thinking maybe I should remove others, so I made a litte preloader thing that counts however layers I am currently excited about and distributes them equally over the color wheel for easy seperation in the shader. shaders use floats for RGB, so there is like a similarity threshold that can get a little blurry. 

just reaslised I am at the halfway time point. [Comparing with last time....](https://b38tn1k.github.io/code/fun/game/november/2022/11/01/novegamehack/#darkmode) I was writing a blog post called "Minimum Viable Mechanics". The game looked a lot prettier. But it was a lot simpler also. 

**Nov 15 2022:**
![snow](https://b38tn1k.github.io/images/iceLands.png)
![desert](https://b38tn1k.github.io/images/deserLands.png)

**Nov 15 2025:**
![world border](https://b38tn1k.github.io/images/wobbbbles.png)
![current zones](https://b38tn1k.github.io/images/current_zones.png)

hmmmm... anyway, the currents are fun, the physics is fun. excited to add some life to the maze next. then enemies. then levels, music, story, ... 

[Snapshot](https://b38tn1k.github.io/november2_snapshots/november2_v3)
