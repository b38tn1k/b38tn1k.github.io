---
layout: post
title:  "Sprite Stuff"
date:   2022-10-08
categories: [game, november]
tags: gameprogress
---
A SpriteCollection class allows animations to be chained together. The DialogEvent class now includes event triggers and ids, allowing testing of animation changes in reaction to dialog.

I would like re-implement part of the LayerHandler for some QOL improvements, but I am finding a rhythm with dedicated graphics layers for Dialog, Sprites, background, etc.

A common method that always annoys me when implementing is inbounds checking: is (x,y) inside a rectange (x1,y1,x2,y2). It is simple enough to implement with a bunch of ugly if statements. I tried something a little neater this time, leaning on a p5 builtin function:

```javascript
function bounded(env, x, y) { // envelope = [x1, y1, x2, y2]
  let result = {}
  result.horizontal = (x == constrain(x, env[0], env[2]));
  result.vertical = (y == constrain(y, env[1], env[3]));
  result.onLeft = (x < (env[0] + (env[2] - env[0])/2));
  result.onTop = (y < (env[1] + (env[3] - env[1])/2));
  result.complete = result.vertical && result.horizontal;
  return(result);
}
```
