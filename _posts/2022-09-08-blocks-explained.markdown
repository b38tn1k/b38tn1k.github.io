---
layout: post
title:  "Untitled Block Thing"
date:   2022-09-08
categories: [code, ux]
comments: True
sitemap:
  lastmod: 2022-09-08
  priority: 0.7
  changefreq: 'monthly'
  exclude: 'yes'
---

# Contents
- [Introduction](#introduction)
- [The Basics](#the-basics)
- [Hello, World!](#hello-world)
- [Data Stuff](#data-stuff)
- [Under The Hood](#under-the-hood)

# Introduction

[Untitled Block Thing]({{ site.url }}/WIP) (UBT) is a dynamic-ish visual scripting environment that allows small software processes to be graphically constructed and run with minimal use of a computer keyboard. UBT is inspired by [Scratch](http://scratch.mit.edu/) and various white-board applications.

<div id="hello">
<iframe class='embeddedblocks' style="width:100%; zoom:1.0; height:400px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialHello"></iframe>
</div>

# The Basics
The UBT interface includes a menu and a scrolling canvas upon which blocks can be arranged. A new UBT project always includes a start block and a console block - these components cannot be duplicated or deleted from a project.
<div id="blank">
<iframe style="width:100%; height:400px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialblank"></iframe>
</div>
<details>
<summary>Menu information</summary>
<table style="width:100%">
<tr>
<th>
<strong>blocks menu</strong>
</th>
<th>
is where new blocks can be selected to add to the project.
</th>
</tr>
<tr>
<th>
<strong>demo menu</strong>
</th>
<th>
provides a list of examples that can be loaded, run, and modified.
</th>
</tr>
<tr>
<th>
<strong>clear</strong>
</th>
<th>
removes all user-added blocks and start a new project.
</th>
</tr>
<tr>
<th>
<strong>tidy</strong>
</th>
<th>
rearranges all blocks to be equally spaced near the center of the scrollable canvas.
</th>
</tr>
<tr>
<th>
<strong>speed</strong>
</th>
<th>
changes the rate at which the interpreter runs upon pressing start. There are 3 speed modes: 1: normal, 2: turbo, 3: slow.
</th>
</tr>
<tr>
<th>
<strong>flash off</strong>
</th>
<th>
toggles the blocks from flashing when the code is being run.
</th>
</tr>
<tr>
<th>
<strong>center</strong>
</th>
<th>
returns the view to canvas origin.
</th>
</tr>
<!-- <tr>
<th>
<strong>save</strong>
</th>
<th>
downloads the project as JSON, not very useful without an upload option.
</th>
</tr> -->
<tr>
<th>
<strong>share</strong>
</th>
<th>
converts the project into a URI string that can be used as a link.
</th>
</tr>
<tr>
<th>
<strong>zoom out / in</strong>
</th>
<th>
tries to make things easier on mobile devices and small screens. Tries.
</th>
</tr>
</table>
</details>

## Blocks
Blocks have clickable square handles arranged in the corners and on some edges. Depending on the type of block, different handles may be available. The handles functions are linked to their position in space.

<div id="handles">
<iframe class='embeddedblocks' style="width:100%; zoom:1.0; height:200px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialHandles"></iframe>
</div>

Beginning at pink handle in the top right corner and moving clockwise around the block, the handle functions are:
- delete
- copy
- resize
- expand/collapse
- mutate
- move

**Some block types do not have some handles.**


### Move
Using the move handle, blocks can be dragged over other blocks. If the blocks are compatible, the inactive block will change color and the dragged block can be dropped to create a parent/child relationship. When two blocks are not compatible, the relationship will not be made. Try it out below!

<div id="movediv">
<iframe class='embeddedblocks' style="width:100%; zoom:1.0; height:200px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialMove"></iframe>
</div>

**Dragging and dropping blocks onto other blocks is how processes are created in UBT.**


### Copy
The copy handle functionality changes depending on the type of block being copied. A data container block (Set Block or Set Variable) will copy to a block referencing this container. A functional or reference block will copy to a duplicate, including any children. Try it out below: press the middle square handle on the right side of the block.
<div id="copydiv">
<iframe class='embeddedblocks' style="width:100%; zoom:1.0; height:350px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialCopy"></iframe>
</div>

### Mutate
The mutate handle allows parent blocks to be quickly swapped out for different blocks with similar functionality. A data container block will not mutate. Try it out below!
<div id="mutatediv">
<iframe style="width:100%; zoom:1.0; height:350px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialMutate"></iframe>
</div>

# Hello, World!
In a new UBT project, select the blocks menu / utilities / print. Drag and drop it onto the start block. The print block initializes with a variable block as child. By clicking the bottom left handle, you can mutate this variable reference block into a green constant block. In the text field, type "hello world". Press the start button to see 'hello world' in the Console block output. Try it out below or find it in the demos menu.
<div id="justload">
<iframe style="width:100%; zoom:1.0; height:400px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialblank"></iframe>
</div>


# Data Stuff
UBT has two types of data; Variables and Constants.

Data types are dynamic; Variables and Constants can both hold one 'piece' of data which can be used in a few different ways.

*For example, the word 'false' is both a string and the boolean opposite of 'true', the number 123 is also a string '123'.*

Constants only 'exist' inside the block they are placed into - they cannot be referenced in another block and cannot be changed or updated.

Variables have a name that can be used to access and update the data at different times during the script execution.

Both data and logic blocks can be collected into a sequence using the Set Block.

Blocks are ordered collections of other data and logic blocks (including references to other Blocks and Variables). They can act as arrays (get, push, set, *remove (TODO)*) or be used to define how logic flows. A Block is similar to a Variable in that once it is set, it can be called upon later in the process using a Block reference. Block and Variable definitions cannot be added to other blocks, instead, use a reference block. See blocks, variables and constants in action below:

<div id="data">
<iframe class='embeddedblocks' style="width:100%; zoom:1.0; height:400px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialData"></iframe>
</div>

(functionality temporarily removed) ~~Blocks and Variables can be renamed by clicking on the title of the related Set block.~~

# Under The Hood
UBT uses an indexed node graph to create processes.

Graphical elements are rendered using p5.js, leaning on basic html divs and widgets for User I/O.

A stack and variable map are generated every time the process is run. Instructions for each block are very simple javascript methods that are triggered based on their position in the stack. The stack is not exhaustive and may skip some child processes if possible, or shrink itself upon repeated operations.

A stack trace is provided in the browser console after running a process.

A proof of Turing completeness is provided [here.](https://b38tn1k.com/WIP/#demo15)

# Thoughts & Credits
I made a Turing Machine that shows UBT is Turing complete (as much as anything else) so I'm feeling pretty happy. Here are some thoughts...

Implementing array operations (get, set, delete, push, run) has made me appreciate everyone who contributed to Python. When I think about code, I think in Python. It's my 'internal dialogue programming language'. My (probably still incomplete) approach to array operations was directly inspired by how easy Python lists work.

If you check the [source](https://github.com/b38tn1k/b38tn1k.github.io/tree/master/WIP), you might see some weird non-idiomatic javascript. I learnt javascript to convert some of my Processing PDE sketches to p5.js. I learnt Processing PDE because it appeared similar to Arduino, but unlocked the screen as something I could play with. Most of my coding xp is robot facing - not UI or screen elements. I'm sure there are more structured approaches to writing javascript but I'm doing this for fun.

Proving this idea out sent me down many Wikipedia rabbit holes, stackoverflow, and reddit posts.

All to say, I built this using tools and knowledge from a lot of different awesome people.

A big thank you to Hamish for being my idea sounding board.

<script>
if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
  const iframes = document.getElementsByTagName("iframe");
  for (let i = 0; i < iframes.length; i++){
    iframes[i].style.pointerEvents = 'none';
  }
  let elem = document.getElementById('hello');
  elem.style.cursor = 'pointer';
  elem.onclick=function(){location.href='{{ site.url }}/WIP/#tutorialHello'};
  elem = document.getElementById('blank');
  elem.style.cursor = 'pointer';
  elem.onclick=function(){location.href='{{ site.url }}/WIP/#tutorialblank'};
  elem = document.getElementById('handles');
  elem.style.cursor = 'pointer';
  elem.onclick=function(){location.href='{{ site.url }}/WIP/#tutorialHandles'};
  elem = document.getElementById('movediv');
  elem.style.cursor = 'pointer';
  elem.onclick=function(){location.href='{{ site.url }}/WIP/#tutorialMove'};
  elem = document.getElementById('copydiv');
  elem.style.cursor = 'pointer';
  elem.onclick=function(){location.href='{{ site.url }}/WIP/#tutorialCopy'};
  elem = document.getElementById('mutatediv');
  elem.style.cursor = 'pointer';
  elem.onclick=function(){location.href='{{ site.url }}/WIP/#tutorialMutate'};
  elem = document.getElementById('justload');
  elem.style.cursor = 'pointer';
  elem.onclick=function(){location.href='{{ site.url }}/WIP/#tutorialblank'};
  elem = document.getElementById('data');
  elem.style.cursor = 'pointer';
  elem.onclick=function(){location.href='{{ site.url }}/WIP/#tutorialData'};
}
</script>
