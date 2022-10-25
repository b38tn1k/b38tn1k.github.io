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
- [Presentation Mode](#presentation-mode)
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
<strong>tools/clear</strong>
</th>
<th>
removes all user-added blocks and start a new project.
</th>
</tr>
<tr>
<th>
<strong>tools/tidy</strong>
</th>
<th>
rearranges all blocks to be equally spaced near the center of the scrollable canvas.
</th>
</tr>
<tr>
<th>
<strong>tools/speed</strong>
</th>
<th>
changes the rate at which the interpreter runs upon pressing start. There are 3 speed modes: 1: normal, 2: turbo, 3: slow.
</th>
</tr>
<tr>
<th>
<strong>tools/flash</strong>
</th>
<th>
toggles the blocks from flashing when the code is being run.
</th>
</tr>
<tr>
<th>
<strong>tools/origin</strong>
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
<strong>tools/share</strong>
</th>
<th>
opens a submenu in which the 'share project' button converts the project into a URI string that can be used as a link and the 'create presentation' button opens an editor to allow the user to create a basic webpage application - see the section 'presentation mode' for more details.
</th>
</tr>
<tr>
<th>
<strong>tools/refactor</strong>
</th>
<th>
rename a variable or block and its references.
</th>
</tr>
<tr>
<th>
<strong>tools/zoom</strong>
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

Blocks are ordered collections of other data and logic blocks (including references to other Blocks and Variables). They can act as arrays (get, push, set, remove) or be used to define how logic flows. A Block is similar to a Variable in that once it is set, it can be called upon later in the process using a Block reference. Block and Variable definitions cannot be added to other blocks, instead, use a reference block. See blocks, variables and constants in action below:

<div id="data">
<iframe class='embeddedblocks' style="width:100%; zoom:1.0; height:400px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialData"></iframe>
</div>

Blocks and Variables can be renamed in the tools/refactor menu.

# Presentation Mode
It is possible to share, save, and bookmark scripting projects using the 'tools/share/share project' button.

To share a less visually cluttered version of the project (for using rather than building) the user can select 'tools/share/create presentation' and open a presentation editor. The presentation editor provides a list of potentially user-editable blocks from the project source and introduces the layout block which is used to create rows and columns in a webpage application. New layout cells can be added using the buttons located on the block (center-right and center-bottom).

Adding user-editable blocks to a layout block will allow the end-user to change the input in the web-application page.

<div id="presLayoutMode">
<iframe class='presentationMode' style="width:100%; zoom:1.0; height:200px; overflow: hidden;"  scrolling="no" src="{{ site.url }}/WIP/#tutorialPLM"></iframe>
</div>

Once an optimal layout is created, the application can be then be accessed using the 'share presentation' button.

An example delay compensation calculator for multitrack drum-set recording is shown [here.](https://b38tn1k.com/WIP/##%7B%220%22%3A%7B%22t%22%3A1%2C%22i%22%3A%22unset%22%2C%22p%22%3A-1%2C%22c%22%3A%5B38%5D%7D%2C%221%22%3A%7B%22t%22%3A2%2C%22i%22%3A%22unset%22%2C%22p%22%3A-1%7D%2C%222%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22RL%22%2C%22p%22%3A-1%7D%2C%223%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22RR%22%2C%22p%22%3A-1%7D%2C%224%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22OHL%22%2C%22p%22%3A-1%7D%2C%225%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22OHR%22%2C%22p%22%3A-1%7D%2C%226%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22KI%22%2C%22p%22%3A-1%7D%2C%227%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22K0%22%2C%22p%22%3A-1%7D%2C%228%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22S%22%2C%22p%22%3A-1%7D%2C%229%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22Rk%22%2C%22p%22%3A-1%7D%2C%2210%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22Flr%22%2C%22p%22%3A-1%7D%2C%2211%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22Rd%22%2C%22p%22%3A-1%7D%2C%2212%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22Wr%22%2C%22p%22%3A-1%7D%2C%2213%22%3A%7B%22t%22%3A47%2C%22d%22%3A%220.343%22%2C%22i%22%3A%22c%22%2C%22p%22%3A-1%7D%2C%2214%22%3A%7B%22t%22%3A23%2C%22i%22%3A%22r%22%2C%22p%22%3A-1%2C%22c%22%3A%5B15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%5D%7D%2C%2215%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22OHL%22%2C%22p%22%3A14%7D%2C%2216%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22OHR%22%2C%22p%22%3A14%7D%2C%2217%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22RR%22%2C%22p%22%3A14%7D%2C%2218%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22RL%22%2C%22p%22%3A14%7D%2C%2219%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22S%22%2C%22p%22%3A14%7D%2C%2220%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22KI%22%2C%22p%22%3A14%7D%2C%2221%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22K0%22%2C%22p%22%3A14%7D%2C%2222%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22Rk%22%2C%22p%22%3A14%7D%2C%2223%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22Flr%22%2C%22p%22%3A14%7D%2C%2224%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22Rd%22%2C%22p%22%3A14%7D%2C%2225%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22Wr%22%2C%22p%22%3A14%7D%2C%2226%22%3A%7B%22t%22%3A23%2C%22i%22%3A%22strs%22%2C%22p%22%3A-1%2C%22c%22%3A%5B27%2C28%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C36%2C37%5D%7D%2C%2227%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22OH%20L%22%2C%22p%22%3A26%7D%2C%2228%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22OH%20R%22%2C%22p%22%3A26%7D%2C%2229%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Room%20R%22%2C%22p%22%3A26%7D%2C%2230%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Room%20L%22%2C%22p%22%3A26%7D%2C%2231%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Snare%22%2C%22p%22%3A26%7D%2C%2232%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Kik%20in%22%2C%22p%22%3A26%7D%2C%2233%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Kik%20out%22%2C%22p%22%3A26%7D%2C%2234%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Rack%22%2C%22p%22%3A26%7D%2C%2235%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Floor%22%2C%22p%22%3A26%7D%2C%2236%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Ride%22%2C%22p%22%3A26%7D%2C%2237%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Wurst%22%2C%22p%22%3A26%7D%2C%2238%22%3A%7B%22t%22%3A51%2C%22d%22%3A0%2C%22i%22%3A%22unset%22%2C%22p%22%3A0%2C%22c%22%3A%5B39%2C40%5D%7D%2C%2239%22%3A%7B%22t%22%3A150%2C%22d%22%3A0%2C%22i%22%3A%22I%22%2C%22p%22%3A38%2C%22c%22%3A%5B41%5D%7D%2C%2240%22%3A%7B%22t%22%3A101%2C%22i%22%3A%22unset%22%2C%22p%22%3A38%2C%22c%22%3A%5B43%2C50%2C53%5D%7D%2C%2241%22%3A%7B%22t%22%3A6%2C%22d%22%3A11%2C%22i%22%3A%22r%22%2C%22p%22%3A39%7D%2C%2242%22%3A%7B%22t%22%3A47%2C%22d%22%3A%22%22%2C%22i%22%3A%22I%22%2C%22p%22%3A-1%7D%2C%2243%22%3A%7B%22t%22%3A27%2C%22i%22%3A%22unset%22%2C%22p%22%3A40%2C%22c%22%3A%5B44%5D%7D%2C%2244%22%3A%7B%22t%22%3A8%2C%22d%22%3A%22Wurst%22%2C%22i%22%3A%22strs%22%2C%22p%22%3A43%2C%22c%22%3A%5B45%5D%7D%2C%2245%22%3A%7B%22t%22%3A222%2C%22i%22%3A%22unset%22%2C%22p%22%3A44%2C%22c%22%3A%5B46%5D%7D%2C%2246%22%3A%7B%22t%22%3A45%2C%22d%22%3A%22%22%2C%22i%22%3A%22I%22%2C%22p%22%3A45%7D%2C%2247%22%3A%7B%22t%22%3A8%2C%22d%22%3A%221%22%2C%22i%22%3A%22r%22%2C%22p%22%3A50%2C%22c%22%3A%5B48%5D%7D%2C%2248%22%3A%7B%22t%22%3A222%2C%22i%22%3A%22unset%22%2C%22p%22%3A47%2C%22c%22%3A%5B49%5D%7D%2C%2249%22%3A%7B%22t%22%3A45%2C%22d%22%3A%22%22%2C%22i%22%3A%22I%22%2C%22p%22%3A48%7D%2C%2250%22%3A%7B%22t%22%3A14%2C%22i%22%3A%22unset%22%2C%22p%22%3A40%2C%22c%22%3A%5B51%2C47%2C52%5D%7D%2C%2251%22%3A%7B%22t%22%3A104%2C%22d%22%3A2.9154518950437316%2C%22i%22%3A%22j%22%2C%22p%22%3A50%7D%2C%2252%22%3A%7B%22t%22%3A45%2C%22d%22%3A%220.343%22%2C%22i%22%3A%22c%22%2C%22p%22%3A50%7D%2C%2253%22%3A%7B%22t%22%3A27%2C%22i%22%3A%22unset%22%2C%22p%22%3A40%2C%22c%22%3A%5B55%5D%7D%2C%2254%22%3A%7B%22t%22%3A47%2C%22d%22%3A%22%22%2C%22i%22%3A%22j%22%2C%22p%22%3A-1%7D%2C%2255%22%3A%7B%22t%22%3A45%2C%22d%22%3A%22%22%2C%22i%22%3A%22j%22%2C%22p%22%3A53%7D%2C%22layout%22%3A%5B%5B%5B%22Distance%20in%20meters%20from%20Mic%20to%20Datum%22%5D%5D%2C%5B%5B%22OH%20L%22%2C4%5D%2C%5B%22OH%20R%22%2C5%5D%2C%5B%22Room%20L%22%2C2%5D%2C%5B%22Room%20R%22%2C3%5D%5D%2C%5B%5B%22Kick%20In%22%2C6%5D%2C%5B%22Kick%20Out%22%2C7%5D%5D%2C%5B%5B%22Snare%22%2C8%5D%2C%5B%22Rack%22%2C9%5D%2C%5B%22Floor%22%2C10%5D%2C%5B%22Ride%22%2C11%5D%2C%5B%22Wurst%22%2C12%5D%5D%5D%7D)

<div id="unclickable">
<iframe class='drumcalc' style="width:100%; zoom:1.0; height:500px; overflow: scroll;"  scrolling="no" src="{{ site.url }}/WIP/##%7B%220%22%3A%7B%22t%22%3A1%2C%22i%22%3A%22unset%22%2C%22p%22%3A-1%2C%22c%22%3A%5B38%5D%7D%2C%221%22%3A%7B%22t%22%3A2%2C%22i%22%3A%22unset%22%2C%22p%22%3A-1%7D%2C%222%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22RL%22%2C%22p%22%3A-1%7D%2C%223%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22RR%22%2C%22p%22%3A-1%7D%2C%224%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22OHL%22%2C%22p%22%3A-1%7D%2C%225%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22OHR%22%2C%22p%22%3A-1%7D%2C%226%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22KI%22%2C%22p%22%3A-1%7D%2C%227%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22K0%22%2C%22p%22%3A-1%7D%2C%228%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22S%22%2C%22p%22%3A-1%7D%2C%229%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22Rk%22%2C%22p%22%3A-1%7D%2C%2210%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22Flr%22%2C%22p%22%3A-1%7D%2C%2211%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22Rd%22%2C%22p%22%3A-1%7D%2C%2212%22%3A%7B%22t%22%3A47%2C%22d%22%3A%221%22%2C%22i%22%3A%22Wr%22%2C%22p%22%3A-1%7D%2C%2213%22%3A%7B%22t%22%3A47%2C%22d%22%3A%220.343%22%2C%22i%22%3A%22c%22%2C%22p%22%3A-1%7D%2C%2214%22%3A%7B%22t%22%3A23%2C%22i%22%3A%22r%22%2C%22p%22%3A-1%2C%22c%22%3A%5B15%2C16%2C17%2C18%2C19%2C20%2C21%2C22%2C23%2C24%2C25%5D%7D%2C%2215%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22OHL%22%2C%22p%22%3A14%7D%2C%2216%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22OHR%22%2C%22p%22%3A14%7D%2C%2217%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22RR%22%2C%22p%22%3A14%7D%2C%2218%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22RL%22%2C%22p%22%3A14%7D%2C%2219%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22S%22%2C%22p%22%3A14%7D%2C%2220%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22KI%22%2C%22p%22%3A14%7D%2C%2221%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22K0%22%2C%22p%22%3A14%7D%2C%2222%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22Rk%22%2C%22p%22%3A14%7D%2C%2223%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22Flr%22%2C%22p%22%3A14%7D%2C%2224%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22Rd%22%2C%22p%22%3A14%7D%2C%2225%22%3A%7B%22t%22%3A45%2C%22d%22%3A%221%22%2C%22i%22%3A%22Wr%22%2C%22p%22%3A14%7D%2C%2226%22%3A%7B%22t%22%3A23%2C%22i%22%3A%22strs%22%2C%22p%22%3A-1%2C%22c%22%3A%5B27%2C28%2C29%2C30%2C31%2C32%2C33%2C34%2C35%2C36%2C37%5D%7D%2C%2227%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22OH%20L%22%2C%22p%22%3A26%7D%2C%2228%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22OH%20R%22%2C%22p%22%3A26%7D%2C%2229%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Room%20R%22%2C%22p%22%3A26%7D%2C%2230%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Room%20L%22%2C%22p%22%3A26%7D%2C%2231%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Snare%22%2C%22p%22%3A26%7D%2C%2232%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Kik%20in%22%2C%22p%22%3A26%7D%2C%2233%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Kik%20out%22%2C%22p%22%3A26%7D%2C%2234%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Rack%22%2C%22p%22%3A26%7D%2C%2235%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Floor%22%2C%22p%22%3A26%7D%2C%2236%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Ride%22%2C%22p%22%3A26%7D%2C%2237%22%3A%7B%22t%22%3A46%2C%22d%22%3A%22Wurst%22%2C%22p%22%3A26%7D%2C%2238%22%3A%7B%22t%22%3A51%2C%22d%22%3A0%2C%22i%22%3A%22unset%22%2C%22p%22%3A0%2C%22c%22%3A%5B39%2C40%5D%7D%2C%2239%22%3A%7B%22t%22%3A150%2C%22d%22%3A0%2C%22i%22%3A%22I%22%2C%22p%22%3A38%2C%22c%22%3A%5B41%5D%7D%2C%2240%22%3A%7B%22t%22%3A101%2C%22i%22%3A%22unset%22%2C%22p%22%3A38%2C%22c%22%3A%5B43%2C50%2C53%5D%7D%2C%2241%22%3A%7B%22t%22%3A6%2C%22d%22%3A11%2C%22i%22%3A%22r%22%2C%22p%22%3A39%7D%2C%2242%22%3A%7B%22t%22%3A47%2C%22d%22%3A%22%22%2C%22i%22%3A%22I%22%2C%22p%22%3A-1%7D%2C%2243%22%3A%7B%22t%22%3A27%2C%22i%22%3A%22unset%22%2C%22p%22%3A40%2C%22c%22%3A%5B44%5D%7D%2C%2244%22%3A%7B%22t%22%3A8%2C%22d%22%3A%22Wurst%22%2C%22i%22%3A%22strs%22%2C%22p%22%3A43%2C%22c%22%3A%5B45%5D%7D%2C%2245%22%3A%7B%22t%22%3A222%2C%22i%22%3A%22unset%22%2C%22p%22%3A44%2C%22c%22%3A%5B46%5D%7D%2C%2246%22%3A%7B%22t%22%3A45%2C%22d%22%3A%22%22%2C%22i%22%3A%22I%22%2C%22p%22%3A45%7D%2C%2247%22%3A%7B%22t%22%3A8%2C%22d%22%3A%221%22%2C%22i%22%3A%22r%22%2C%22p%22%3A50%2C%22c%22%3A%5B48%5D%7D%2C%2248%22%3A%7B%22t%22%3A222%2C%22i%22%3A%22unset%22%2C%22p%22%3A47%2C%22c%22%3A%5B49%5D%7D%2C%2249%22%3A%7B%22t%22%3A45%2C%22d%22%3A%22%22%2C%22i%22%3A%22I%22%2C%22p%22%3A48%7D%2C%2250%22%3A%7B%22t%22%3A14%2C%22i%22%3A%22unset%22%2C%22p%22%3A40%2C%22c%22%3A%5B51%2C47%2C52%5D%7D%2C%2251%22%3A%7B%22t%22%3A104%2C%22d%22%3A2.9154518950437316%2C%22i%22%3A%22j%22%2C%22p%22%3A50%7D%2C%2252%22%3A%7B%22t%22%3A45%2C%22d%22%3A%220.343%22%2C%22i%22%3A%22c%22%2C%22p%22%3A50%7D%2C%2253%22%3A%7B%22t%22%3A27%2C%22i%22%3A%22unset%22%2C%22p%22%3A40%2C%22c%22%3A%5B55%5D%7D%2C%2254%22%3A%7B%22t%22%3A47%2C%22d%22%3A%22%22%2C%22i%22%3A%22j%22%2C%22p%22%3A-1%7D%2C%2255%22%3A%7B%22t%22%3A45%2C%22d%22%3A%22%22%2C%22i%22%3A%22j%22%2C%22p%22%3A53%7D%2C%22layout%22%3A%5B%5B%5B%22Distance%20in%20meters%20from%20Mic%20to%20Datum%22%5D%5D%2C%5B%5B%22OH%20L%22%2C4%5D%2C%5B%22OH%20R%22%2C5%5D%2C%5B%22Room%20L%22%2C2%5D%2C%5B%22Room%20R%22%2C3%5D%5D%2C%5B%5B%22Kick%20In%22%2C6%5D%2C%5B%22Kick%20Out%22%2C7%5D%5D%2C%5B%5B%22Snare%22%2C8%5D%2C%5B%22Rack%22%2C9%5D%2C%5B%22Floor%22%2C10%5D%2C%5B%22Ride%22%2C11%5D%2C%5B%22Wurst%22%2C12%5D%5D%5D%7D"></iframe>
</div>

## Caveats
UBT runs completely in the client browser and uses URI strings to 'load' script layouts. Some browsers concatenate the length of URI strings and as such large projects may not load. Layout URI strings can exceed 5000 characters (as above)! I need to look into compression for this to be realistic.


# Under The Hood
UBT uses an indexed node graph to create processes.

Graphical elements are rendered using p5.js, leaning on basic html divs and widgets for User I/O.

A stack and variable map are generated every time the process is run. Instructions for each block are very simple javascript methods that are triggered based on their position in the stack. The stack is not exhaustive and may skip some child processes if possible, or shrink itself upon repeated operations.

A stack trace is provided in the browser console after running a process.

A proof of Turing 'completeness' is provided [here.](https://b38tn1k.com/WIP/#demo15)

# Thoughts & Credits
I made a Turing Machine that shows UBT is Turing complete (as much as anything else) so I'm feeling pretty happy. Here are some thoughts...

Implementing array operations (get, set, delete, push, run) has made me appreciate everyone who contributed to Python. When I think about code, I think in Python. It's my 'internal dialogue programming language'. My (probably still incomplete) approach to array operations was directly inspired by how easy Python lists work.

If you check the [source](https://github.com/b38tn1k/b38tn1k.github.io/tree/master/WIP), you might see some weird non-idiomatic javascript. I learnt javascript to convert some of my Processing PDE sketches to p5.js. I learnt Processing PDE because it appeared similar to Arduino, but unlocked the screen as something I could play with. Most of my coding xp is robot facing - not UI or screen elements. I'm sure there are more structured approaches to writing javascript but I'm doing this for fun and to learn!

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
  elem = document.getElementById('presLayoutMode');
  elem.style.cursor = 'pointer';
  elem.onclick=function(){location.href='{{ site.url }}/WIP/#tutorialPLM'};
}
</script>
