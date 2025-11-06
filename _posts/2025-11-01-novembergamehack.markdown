---
layout: post
title:  "November Game Hack 2 - Electric Boogaloo"
date:   2025-11-01
categories: [code, fun, game, november]
comments: True
sitemap:
  lastmod: 2025-11-05
  priority: 0.7
  changefreq: 'monthly'
  exclude: 'yes'
---

It's November again. 

[where it's at](https://github.com/b38tn1k/november2)


{% for pst in site.posts %}
{% if pst.tags contains 'game2progress' %}
<h3> {{ pst.title }} </h3>
<time datetime="{{ pst.date | date_to_xmlschema }}" class="post-date">{{ pst.date | date_to_string }}</time>
{{ pst.content }}
{% endif %}
{% endfor %}
