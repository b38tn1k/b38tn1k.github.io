---
layout: post
title:  "November Game Hack"
date:   2022-11-01
categories: [code, fun, game, november]
comments: True
sitemap:
  lastmod: 2022-10-02
  priority: 0.7
  changefreq: 'monthly'
  exclude: 'yes'
---

![logo]({{ site.url }}/november/assets/logo.png)

It's November. Let's make something fun and stop thinking about Untitled Block Thing for a bit.

[where it's at](https://b38tn1k.com/november/)

Dec 3 update: [play on Itch](https://b38tn1k.itch.io/november-man-and-possum)

{% for pst in site.posts %}
{% if pst.tags contains 'gameprogress' %}
<h3> {{ pst.title }} </h3>
<time datetime="{{ pst.date | date_to_xmlschema }}" class="post-date">{{ pst.date | date_to_string }}</time>
{{ pst.content }}
{% endif %}
{% endfor %}
