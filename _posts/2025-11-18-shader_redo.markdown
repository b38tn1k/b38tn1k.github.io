---
layout: post
title: shader_redo
date: 2025-11-18 19:00:00 -0500
categories: [game, november]
tags: game2progress
---

I reworked the shader pipeline this afternoon. My first approach was pretty simple and copied my usual p5 shader approach (see November Man & Possum). I wanted to make a pipeline that allowed me to define a pipeline of shaders and ping pong between two buffers. Handling the shader contexts to facilitate this ping pong, while maintaining an interface that allowed for easy experimentation was too hard for me, and too hard for CGPT, so I ended up with a minorly improve dual buffer pipeline without the swapping - stage 1 for textures, stage 2 for the post processing effect. It works. It looks pretty ugly. but it works. sorta

<iframe width="560" height="315" src="https://www.youtube.com/embed/3KIsJx5bp70?si=0wd1PBkK2ZSYH_HQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>