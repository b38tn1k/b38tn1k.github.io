# The Anemone Of My Anemone

Play as an anemone in search of your missing beloved, using your unique ability to grasp, release, and drift through the environment to uncover the story of loss, memory, and connection.

[LLM Wiki docs](https://app.komment.ai/github/b38tn1k/november2)

## Running Locally

You just need to serve the files somehow:

```
npm install -g http-server
http-server -c-1
```

## Questions for Alex

 - how can we do shaders with transparent regions?
 - can we 'simple color code' a region and use the primary color channel of a pixel on the mat to decide which pixel effect to draw there? like green screen shit?

## Level Concepts

- Coral Reef (tutorial level, w/ your friend the clown fish? grab rocks to wait for predators to leave areas, don't drift into view)
- Kelp Forest (the maze can change/shift)
- Deep Sea Trench (currents from thermal vents help but hurt)
- Sewer (currents may help, but you need to stop before you get pushed into pollution)

## Mechanic Concepts

- Push to grab or release when near something grab-able
- Push to sink or float when in open water
- Push to grab and attack when near prey/enemy
- Grab fish to catch a ride (Nelson)
- If the bottom is sandy, particles could be picked up and move with the currents etc... (Nelson)
- grabbing those sandy regions doesnt fully hold you down, but does add to your mass (impact bouyancy etc)

## Currents
Currents are shown by environmental hints such as plankton, bioluminscent organisms, sea week, sand, bubbles, etc moving in a direction. Currents can be linear, curved, eddy currents, or even waves that push you out of the water!

## James Stuff

- Make a cache maths mechanism 
- Make main Canvas always act as landscape / lets you draw assuming landscape and rotates on final render. 

## Inspo

- https://youtube.com/shorts/QV18JZGVV4Y?si=reocyPAGcm7iPJfR
- I think could use spider web approach I made [demo](http://b38tn1k.github.io/awickedweb/) [code](https://github.com/b38tn1k/b38tn1k.github.io/tree/master/awickedweb) to animate 'tethered' components in current. Physics.js should provide some toolkits.
- [Not our work, but great proof of concept](https://openprocessing.org/sketch/207474)
