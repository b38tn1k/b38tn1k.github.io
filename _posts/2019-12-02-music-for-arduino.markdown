---
layout: post
title:  "Music For Arduino [2 more B38TN1K EPs!]"
date:   2019-12-02
categories: [arduino, code, music]
comments: True
sitemap:
  lastmod: 2019-12-02
  priority: 0.7
  changefreq: 'monthly'
  exclude: 'yes'
---
I made some music with Arduino. All sounds are Arduino generated, I added some reverb in post.  Everything was multitracked from monophonic Arduino sketches (polyphony is possible, I just didn't feel like yak shaving). Here is my sound track to an imagined arcade game.

<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=OLAK5uy_k6pQ6mqAA8GgChEbQVuIguaIlOITxflpM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Arduino should be popular for chiptune music.

The Arduino tone() function can be used to oscillate a digital out pin at audio frequency.

With the [Arduino Volume Control Library](https://github.com/connornishijima/arduino-volume1) you can control the volume of this tone.

With the code from this [Arduino forum post](https://forum.arduino.cc/index.php?topic=79326.0) the Arduino can receive MIDI events and play the correct note.

You could go even deeper with [Auduino](https://code.google.com/archive/p/tinkerit/wikis/Auduino.wiki) or [Talkie, the Arduino Speech Library](https://github.com/going-digital/Talkie) or paraphonic synthesis.

I also made a system that synced four Uno boards, each with their own audio out. I previously wrote some tips on [developing for similar systems.](https://b38tn1k.com/arduino/code/music/2019/09/27/EEPROM-IDs/) This system doesn't use MIDI and the scale was mathematically defined based on divisions of the doubled frequency. Sort of beepy, alien, interesting but not the sort of music you would put on for guests :-P 

<iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=OLAK5uy_lk3zxy2fN1Me69lqQLPw8xnXjF7vEqCIk" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
