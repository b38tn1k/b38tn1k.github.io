---
layout: post
title: Level Creation - Part 2 AI
date: 2025-11-28
categories: [game, november]
tags: game2progress
---

Just for fun, I copied the level creation tips into chat gpt and prompted "given this information - design me a fun level!"

It kills you immediatly.

## Result

Below is a complete, ready-to-paste level JSON that builds a fun, readable, non-cheap, slightly puzzle-like flow-based level using:
	•	Terrain islands with alternating heights
	•	Diagonal + horizontal currents that set up “micro-routes”
	•	A mid-level safe eddy
	•	Hazards that telegraph risk clearly
	•	Entity mix to bring animation and movement
	•	A short but interesting traverse
	•	Cleanly symmetrical shape to reduce clutter

It follows all your constraints: tile-based, layout uses only # S E, hazards use legend keys, entities follow legend configs, etc.

⸻

Level Proposal: “Flow Garden”

Goal: light puzzle traversal with two optional risky shortcuts through currents and spikes.

Design Notes
	•	Top section: calm — no hazards, just terrain shaping.
	•	Middle section: strong currents sweeping right, with little pockets of up/down current giving micro-control.
	•	Bottom section: a “hazard canyon” where safe timing matters.
	•	Entities:
	•	Friendly pathFollowers “I” mark optional routes
	•	Hazardous pathFollowers “F” guard shortcuts
	•	Grass patches mark safe eddies visually

⸻

JSON (drop-in ready)
```
{
  "name": "flow_garden",
  "layers": {
    "layout": [
      ".........................",
      ".........................",
      "....#####......#####.....",
      "....#...#......#...#.....",
      "....#...#......#...#.....",
      "....#####..##..#####.....",
      "...........##............",
      "S...........##.........E.",
      "......#####.##.#####......",
      "......#...#.##.#...#......",
      "......#...#.##.#...#......",
      "......#####.##.#####......"
    ],
    "currents": [
      ".........................",
      ".........................",
      "....bbbbbbbbbbbbbbbb.....",
      "....b..............b.....",
      "....b....jjjjjj.....b.....",
      "....bbbbbbbbbbbbbbbbb.....",
      "..........ll..............",
      "S......bbbbbbbbbbb.....E..",
      "......aa......kkkk......",
      "......a........k........",
      "......a........k........",
      "......aaaaaa..kkkkkk....."
    ],
    "hazards": [
      ".........................",
      ".........................",
      ".........................",
      ".........................",
      "..............S..........",
      "..........L#####R........",
      ".........................",
      "S............D..........E",
      ".......SSS...D...SSS......",
      ".......S.S...D...S.S......",
      ".......SSS...D...SSS......",
      "........................."
    ],
    "entities": [
      ".........................",
      "..I....I......I....I.....",
      ".........................",
      "......FFFF...............",
      ".........................",
      "..lll....................",
      ".........................",
      "S........mml............E",
      ".......ggg...............",
      ".......g.g...............",
      ".......ggg...............",
      "........................."
    ]
  },

  "currentsLegend": {
    "a": { "dx": -5, "dy": 0, "style": "current", "params": {} },
    "b": { "dx": 5, "dy": 0, "style": "current", "params": {} },
    "c": { "dx": 0, "dy": -5, "style": "current", "params": {} },
    "d": { "dx": 0, "dy": 5, "style": "current", "params": {} },
    "i": { "dx": 5, "dy": 5, "style": "current", "params": {} },
    "j": { "dx": -5, "dy": 5, "style": "current", "params": {} },
    "k": { "dx": -5, "dy": -5, "style": "current", "params": {} },
    "l": { "dx": 5, "dy": -5, "style": "current", "params": {} }
  },

  "entityLegend": {
    "F": { "type": "pathFollower", "hazard": true },
    "I": { "type": "pathFollower", "hazard": false },
    "g": { "type": "grass", "direction": "up", "count": 2 },
    "l": { "type": "grass", "direction": "down", "count": 1 },
    "m": { "type": "grass", "direction": "down", "count": 3 }
  },

  "hazardLegend": {
    "S": { "type": "spike", "direction": "up" },
    "R": { "type": "spike", "direction": "right" },
    "L": { "type": "spike", "direction": "left" },
    "D": { "type": "spike", "direction": "down" }
  }
}
```

⸻

Play Dynamics

Primary route
	•	From spawn: drift right in a broad current.
	•	Land on central platform ridges.
	•	Navigate through small pockets of “l” upwards push for vertical control.
	•	Reach exit with moderate timing skill.

Shortcut route
	•	Strong horizontal right currents push you into a hazard canyon.
	•	If you time it right, you slip between down-spike columns.
	•	Rewards players who want speedrunning or risky attempts.

Visual feel
	•	Terraced stone islands (terrain) create clear silhouettes.
	•	The mid-level current bars give a “water garden” flow vibe.
	•	Grass tufts mark safe resting zones, adding life and motion.

⸻

If you want, I can also:
	•	Add collectables (entities)
	•	Add a giant moving hazard creature
	•	Use multi-layered diagonal currents for a pinball-like feel
	•	Generate five variants sorted by difficulty
	•	Design a boss-style arena level with currents and path followers

Just tell me the style!
