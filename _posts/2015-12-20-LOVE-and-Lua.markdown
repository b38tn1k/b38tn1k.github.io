---
layout: post
title:  "LÖVE and Lua"
date:   2015-12-20
categories: [code, LOVe and Lua]
comments: True
---

I installed [Lua](http://www.lua.org/) when [char-rnn](https://github.com/karpathy/char-rnn) turned up in mid 2015.

A couple weeks ago I clicked a random link on reddit and ended up on the [LÖVE](https://love2d.org/) homepage where it is claimed:

>LÖVE is an *awesome* framework you can use to make 2D games in Lua. It's free, open-source, and works on Windows, Mac OS X, Linux, Android and iOS.

I already had Lua so I thought I would give it a go...

After messing around with it for a couple weeks I have to agree it is an awesome little framework. It looks after all the boring parts of game coding and lets you jump right into the fun. LÖVE's game loop structure would be familiar to anyone who has worked in Processing or Arduino, or any game framework:

{% highlight null %}
function love.load()
  -- initialize your game objects
end

function love.update(dt)
  -- apply your game logic
end

function love.draw()
  -- draw the new game screen
end
{% endhighlight %}

A great tutorial by [Headchant](http://www.headchant.com/2010/11/27/love2d-tutorial-part-1-invaders-must-die/) had me building a simple Space Invaders clone and I was immediately hooked.
![Space Invaders]({{ site.url }}/images/invaders.png)
Lua is an excellent scripting language that lets you work fast. As Lua is built on the subset of the C standard library common to most C variants, it should work almost anywhere! The gratification of building simple games with LÖVE is really addictive.

After I was satisfied with my [Space Invaders Clone](https://github.com/b38tn1k/InvadersFromSpaceMustDie) (I spend waaaay too much time tuning it) I decided to have a go at [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). I ended up making a little toroidal GOL editor with various options to control the animation and the ability to let different colors fight it out.
![Game Of Life]({{ site.url }}/images/gameoflife.png)
You can grab the source [here](https://github.com/b38tn1k/GameOfLifeLOVE).
