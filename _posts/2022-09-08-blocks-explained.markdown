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
- [Data types](#data)
- [Under The Hood](#under-the-hood)

# Introduction

[Untitled Block Thing]({{ site.url }}/WIP) (UBT) is a dynamic-ish visual scripting environment that allows small software processes to be graphically constructed and run with minimal use of a computer keyboard. UBT is inspired by [Scratch](http://scratch.mit.edu/) and various white-board applications.

![screenshot of UBT with a process to draw a 9 sided polygon]({{ site.url }}/images/blocks-polygon.png)

# The Basics
The UBT interface includes a menu and a scrolling canvas upon which blocks can be arranged. A new UBT project always includes a start block and a console block - these components cannot be duplicated or deleted from a project.
![an empty project]({{ site.url }}/images/newblocks.png)
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
<tr>
<th>
<strong>save</strong>
</th>
<th>
downloads the project as JSON, not very useful without an upload option.
</th>
</tr>
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
<strong>mobile</strong>
</th>
<th>
tries to make things easier on mobile devices and small screens.
</th>
</tr>
</table>
</details>

## Blocks
Blocks have clickable square handles arranged in the corners and on some edges. Depending on the type of block, different handles may be available. The handles functions are linked to their position in space.
![a constant block]({{ site.url }}/images/constblockhello.png)
Beginning at pink handle in the top right corner and moving clockwise around the block, the handle functions are:
- delete
- copy
- resize (bottom right)
- expand/collapse
- mutate (bottom left)
- move (top left)

### Move
Using the move handle, blocks can be dragged over other blocks. If the blocks are compatible, the inactive block will change color and the dragged block can be dropped to create a parent/child relationship. When two blocks are not compatible, the relationship will not be made.
![drag drop animation]({{ site.url }}/images/shortdrop.gif)

**Dragging and dropping blocks onto other blocks is how processes are created in UBT.**


### Copy
The copy handle functionality changes depending on the type of block being copied. A data container block will copy to a block referencing this container. A functional or reference block will copy to a duplicate, including any children.
![copy animation]({{ site.url }}/images/copy.gif)


### Mutate
The mutate handle allows parent blocks to be quickly swapped out for different blocks with similar functionality. A data container block will not mutate.
![mutate animation]({{ site.url }}/images/mutate.gif)

# Hello, World!
In a [new]({{ site.url }}/WIP) UBT project, select the blocks menu / utilities / print. Drag and drop it onto the start block. The print block initializes with a variable block as child. By clicking the bottom left handle, you can mutate this variable reference block into a green constant block. In the text field, type "hello world". Press the start button to see 'hello world' in the Console block output.
![hello world block]({{ site.url }}/images/helloworldblocks.png)
Check out the Demos menu to learn more!

# Data
UBT has three data types:
- Variables,
- Constants,
- and Blocks.

Data types are dynamic; Variables and Constants can both hold one 'piece' of data which can be used in a few different ways.

*For example, the word 'false' is both a string and the boolean opposite of 'true', the number 123 is also a string '123'.*

The only difference between Constants and Variables is that Variables can be set and then called later in the process using a Variable block, whereas Constants exist only in the block they are defined in.

Blocks are ordered collections of other blocks (including other Blocks). They can act as arrays (get, set) or be used to define how logic flows. A Block is similar to a Variable in that once it is set, it can be called upon later in the process using a Block reference.

Blocks and Variables can be renamed by clicking on the title of the related Set block.

![data blocks and their reference blocks]({{ site.url }}/images/datatypes.png)


# Under The Hood
UBT uses an indexed node graph to create processes.

Graphical elements are rendered using p5.js, leaning on basic html divs and widgets for User I/O.

A stack and variable map are generated every time the process is run. Instructions for each block are very simple javascript methods that are triggered based on their position in the stack. The stack is not exhaustive and may skip some child processes if possible, or shrink itself upon repeated operations.

A stack trace is provided in the browser console after running a process.
