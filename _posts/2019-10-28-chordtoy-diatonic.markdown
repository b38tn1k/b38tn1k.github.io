---
layout: post
title:  "chordtoy: Diatonic Mode"
date:   2019-10-28
categories: arduino
comments: True
---

I added diatonic mode to the chordtoy project (the idea came from reddit user ddk4x5). You can now use a 4th pot to select a key, and the chords played will be based on the diatonic triads of that key. 

It took a couple tries, my first attempts were using variations on MIDI table lookups which required too much memory for the Arduino.

The implementation I arrived upon works by checking the interval of the played note from the key note and then deciding if the chord built on that note should be major, minor or diminished. It required me to recite "tone tone semitone tone tone tone semitone" many times before I (hope) I got it correct.

If the note is not in the scale, it will play it as the same tonality as the root note. eg, if you play a C# in C major you will hear a chord based on the C# major triad.

Quick Demo:

<iframe width="560" height="315" src="https://www.youtube.com/embed/W6AAWXIQn-M" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

[Code and Build deets here](https://github.com/b38tn1k/chordtoy)
