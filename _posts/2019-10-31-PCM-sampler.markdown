---
layout: post
title:  "MIDI triggered PCM Sample Player"
date:   2019-10-31
categories: [arduino, code, music]
comments: True
sitemap:
  lastmod: 2019-10-31
  priority: 0.7
  changefreq: 'monthly'
  exclude: 'yes'
---

I found an old thumb drive and it had this Arduino project from 2010 on it. I was trying to make a drum machine with PCM samples using the [high-low tech](http://highlowtech.org/?p=1963) Arduino PCM playback library and encoder.

I cleaned up the code and built it into a case with a Pro Trinket. It plays samples with a very noisy gritty lo-fi sound. Some extra pots allow you to further mangle the sounds. In addition to being noisy, audio output is very low.

<iframe width="560" height="315" src="https://www.youtube.com/embed/oUzMPR78WlY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

I was thinking about making some better samples but I couldn't get the encoder to work without risking messing up my Java environment, so I didn't try :-P

[Code and build deets here](https://github.com/b38tn1k/MIDI_PCM_SAMPLER)
