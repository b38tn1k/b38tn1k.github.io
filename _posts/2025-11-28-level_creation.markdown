---
layout: post
title: Level Creation - Part 1
date: 2025-11-28
categories: [game, november]
tags: game2progress
---

Levels are described using JSON format. Levels are tile-based, with various layers allowing for overlapping components (currents over terrain for example). 

The "layout" layer requires specific characters. '#' indicates terrain, 'S' indicates the spawn location, and 'E' indications the end goal. 

All other layers provide a legend, that allows for creation of various objects and configuration of parameters. You can see examples below.

Testing level design is possble using the [/] button on the home screen of the game.
[Snapshot](https://b38tn1k.github.io/november2_snapshots/november2_v8)

More stuff will be added, but this is a start!

```
{
    "name": "level7",
    "layers": {
        "layout": [
            ".....................",
            ".....................",
            "..#....#....#....#...",
            "..#....#....#....#...",
            "..######....#....#...",
            "..#....#....#........",
            "..#....#....#....#...",
            ".....................",
            "........#####........",
            ".....................",
            ".....................",
            "S...................E"
        ],
        "currents": [
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            "bbbbbbbbbbbbbbbbbbbbb",
            "bbbbbbbbbbbbbbbbbbbbb",
            ".....................",
            "...aaaa..............",
            "bbbbbbb......ll......",
            ".............ll......",
            "....bbbbbbbbbbbbbbbbb"
        ],
        "hazards": [
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            "........SSS..........",
            ".......L#####R.......",
            "...........DD........",
            ".....................",
            "....................."
        ],
        "entities": [
            "..FFFF..FFFFFF.llm.I.",
            "......FF...........I.",
            "..................I..",
            "..................I..",
            "..................I..",
            "...................I.",
            "...................I.",
            "...................I.",
            ".....................",
            ".....................",
            ".....................",
            ".....................",
            "...........ggg......."
        ]
    },
    "currentsLegend": {
        "a": {
            "dx": -5,
            "dy": 0,
            "style": "current",
            "params": {}
        },
        "b": {
            "dx": 5,
            "dy": 0,
            "style": "current",
            "params": {}
        },
        "c": {
            "dx": 0,
            "dy": -5,
            "style": "current",
            "params": {}
        },
        "d": {
            "dx": 0,
            "dy": 5,
            "style": "current",
            "params": {}
        },
        "i": {
            "dx": 5,
            "dy": 5,
            "style": "current",
            "params": {}
        },
        "j": {
            "dx": -5,
            "dy": 5,
            "style": "current",
            "params": {}
        },
        "k": {
            "dx": -5,
            "dy": -5,
            "style": "current",
            "params": {}
        },
        "l": {
            "dx": 5,
            "dy": -5,
            "style": "current",
            "params": {}
        }
    },
    "entityLegend": {
        "F": {
            "type": "pathFollower",
            "hazard": true
        },
        "I": {
            "type": "pathFollower",
            "hazard": false
        },
        "g": {
            "type": "grass",
            "direction": "up",
            "count": 2
        },
        "l": {
            "type": "grass",
            "direction": "down",
            "count": 1
        },
        "m": {
            "type": "grass",
            "direction": "down",
            "count": 3
        }
    },
    "hazardLegend": {
        "S": {
            "type": "spike",
            "direction": "up"
        },
        "R": {
            "type": "spike",
            "direction": "right"
        },
        "L": {
            "type": "spike",
            "direction": "left"
        },
        "D": {
            "type": "spike",
            "direction": "down"
        }
    }
}
```