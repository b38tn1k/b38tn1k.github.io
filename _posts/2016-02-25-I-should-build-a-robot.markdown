---
layout: post
title:  "I should build a robot..."
date:   2016-02-25
categories: [rover, code]
comments: True
---
The other day I had an idea; *The process of immigration has provided me with an abundance of free time so I'm going to build a robot!!!.*

But what sort of robot? What am I actually building?
My toolbox consists of:


- a screwdriver
- a leatherman
- a solder iron
- a multimeter

so I am probably not building the platform from scratch. Which is probably a good thing. My first few years of engineering school saw many optimistic but flawed robotic platforms built from stuff found in dumpsters or the local hardware store.
Stuff like this:

![ENG1000 ROBOT ARM]({{ site.url }}/images/robotarmbad.jpg)
My ENG1000 Group Project Robotic Arm 'The Claw'.

*SIDE-STORY: the first robotic decision making device I built, in a group with [this guy](https://huckanddyno.wordpress.com/author/jbultitude/), used electromechanical relays and timers to react to control signals from multiple ultrasound sensors. When the robot drove towards a wall, it would stop for about 20 seconds and you could hear it clicking and reconfiguring before it would turn and continue on its way. We were all really proud of it until the next semester, when we learnt about transistors and microcontrollers. I wish I still had a photo of it as it was really terrible. We called it M.A.R.V but I can't remember what that stands for.*

Around the same time I was making these terrible robots (2005/2006), but on the other side of the world (Italy), a teacher called Massimo Banzi and a bunch of other really smart people had been creating a cheap and  portable programmable device called an [Arduino](https://www.arduino.cc/). *EDIT: a couple days after I wrote this post, this [website](http://arduinohistory.github.io/) popped up. Apparently there is some sort of controversy surrounding the formative years of the Arduino and who should get credit for various parts of its development. Wrt the impact and usefulness of the Arduino this does not matter at all.*
The Arduino made programming embedded devices easier and cheaper. The impact of the Arduino on the tech education and hobbyist scene was massive. It is the spiritual predecessor of all hobbyist development platforms available in 2016:


- Raspberry Pi
- BeagleBone Black
- Intel Curie and Edison
- Kinoma Create
- this is obviously a complete list.

All these devices make development of embedded devices easier.

Accompanying the Arduino, a multitude of 'shields' became available. These shields provided the Arduino with additional circuitry. This circuitry is built onto separate plug-and-play style boards known better as daughter-boards (well, outside of Arduino-land). Shields allow the developer to easily choose and combine prebuilt and complete circuits to make their project.

Shields can (for example) report the surrounding temperature back to the Arduino, or convert commands from the Arduino into high power control voltages for motors, or even connect the Arduino to the Internet via WiFi network or SIM Card.

As the Arduino design was Open Source, developers could even manufacture their own shields without resorting to hacky reverse engineering. Companies formed around supplying hobbyist tech components and the amount of Open Source devices grew further and further.

Which brings us to 2016. It has never been a better time to build a hobby robot. The Open Source hardware movement has led to the availability of many cheap robotic platforms. These platforms can be purchased in kits or fully assembled. In most cases the manufacturing quality is much better than anything I could achieve (without access to a laser cutter or 3D printer).

But what sort of robot kit should I get?


- I don't really have anywhere to test a UAV.
- I have spent enough time with drawing robots. They draw. cool.
- Robot arms are awesome but expensive.
- Hexapods are creepy and appear delicate.

My top 3 robots of all time in order:


1. Opportunity
2. Curiosity
3. Sojourner

They all have a few things in common:

- They are all from JPL.
- They are all on Mars.
- They are all rovers!
- They all have 6 wheels. hmmm

I am going to make a 4 wheel rover. It won't have the crazy-awesome suspension that Curiosity has and it will be significantly smaller than even Sojourner, but it will provide a platform onto which I can attach some sensors and a small computer.

For my next post I will figure out what platform and sensors I should use and maybe think about some applications for the rover. I hope to complete this build using mainly Open Source components. stay tuned!
