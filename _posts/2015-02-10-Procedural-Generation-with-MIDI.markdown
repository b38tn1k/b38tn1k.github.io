---
layout: post
title:  "Procedural Generation with MIDI"
date:   2015-02-10
categories: [code, music]
comments: True
---
Recently I wrote a [command line tool](https://github.com/b38tn1k/notes) that creates small chord progressions, melodies and beats as MIDI files.

Creation of the musical sequences is achieved using a procedural algorithm based on a musical game that requires a looper pedal or similar device. Playing the musical game results in a pleasing melody that is generated based of a small number of decisions made at the start of the game. This game is best played with a metronome:

- Prepare a loop in your looper pedal/ device so that it is overdubbing a 4 far sequence of your performance.

- Decide on a musical scale and choose two different durations for rests.

- With the looper in overdub mode play ascending notes of your chosen scale, pausing for the first rest duration between notes.

- As you play and the looper overdubs you will find that eventually a note you play will occur at the same time as a previously recorded note. Consider this event a collision.

- At every collision switch the duration of the rest between notes from the first duration to the second and vice versa.

After playing this 'game' for a few minutes you will have created something reminiscent of a melody. Variants of this game can also be played with more intervals or additional rules, such as changing the direction of the scale after each collision, however it already works pretty well in its most simple form. I don't know who originally came up with the game but it has been around for some time and is available on various platforms such as [Native Instruments Reaktor](http://www.native-instruments.com/en/community/reaktor-user-library/entry/show/7997/). It is one of the simpler methods used in procedurally composed music and was easy for me to transcribe in python.

The most recent version of my tool allows you to select the length of the loop, the number of iterations applied, the length of the two intervals and various scale maps such as major, minor and drums. There is a user manual type thing over [here](http://b38tn1k.com/notes/). Currently it uses a MIDI library for python called [midiutil](https://code.google.com/p/midiutil/) which seems to have been created for a similar purpose. Currently duration values are represented as Integers, which removes a lot of the more interesting combinations of rest values - I might fix this one day.

Here are some songs created using the tool - the melodies and some/all of the drums were created using the command line tool. The resulting melodies sound like early acid-house to me and thus I had a lot of fun creating Roland 303 Patches in Ableton Live.

<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https://api.soundcloud.com/playlists/78849498&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>
