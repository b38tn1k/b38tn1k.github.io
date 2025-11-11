---
layout: post
title:  "The Anenome Of My Anenome"
date:   2025-11-11
categories: [game, november]
tags: game2progress
---

The Anenome Of My Anenome; a relaxing current-surfing game where you play as a sea anenome, looking for another sea anenome who went missing during a storm. You can drift with the current, float or sink, and grab objects/surfaces to change your momentum. 

The goal is for the game to be a low stress comfortable maze/puzzle game with simple hero's story elements (like last time). I want to make some more interesting physics compared to last time, and I think current stuff / momentum zones would be very interesting. Especially if I can get environmental assets to react to the same currents. 

Progress update:
Still in architecture mode - building out a tool to convert ASCII art definitions into physics and graphics sources:

```
     "layers": {
      "layout": [
        "####################",
        "#S................E#",
        "#..####............#",
        "#..#...............#",
        "#..#......#####....#",
        "#..#...............#",
        "#..#.......#####...#",
        "#..#...............#",
        "#..#...............#",
        "#..##########......#",
        "#..S..........######",
        "####################"
      ],

      "currents": [
        "....................",
        "....wwwwww..........",
        "....w....w..........",
        "....w....w..........",
        "....w....w..........",

        etc...
```

it is not even rendered in programmer art yet - it is all boxes, with a basic necesary bitcrusher pixelator shader stuff 

![a little progress](https://b38tn1k.github.io/images/nov2maze1.png)

## mostly IMPORTANT TODOs
1. Decide how I want to do maps - thinking N++ style, full map on screen. I think would be nice to see the goal, this game is a maze problem more than anything, and I think I like full screen only mazes
2. Physics - collision, blocking, grabbing, floating, current zones and how they impart momentum
3. More Physics - recycle [spider web physics sim](https://b38tn1k.github.io/awickedweb/) concept into anenome fronds that move individually.. and sea weed etc... currents should be able to rotate and flip anenome - thinking about [motion like i did here](https://b38tn1k.github.io/toysat/) too I guess. Anenome should be like two rigid nodes that each have momentum added to get rotation, plus a number of nodes connected via spring constant, that can wobble and react to motion naturally (like fronds). when you want to sink, they pull in (spring constant change) otherwise they float around