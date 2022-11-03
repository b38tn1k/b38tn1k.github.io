---
layout: post
title:  "November Game Hack"
date:   2022-10-01
categories: [code, game, November]
comments: True
sitemap:
  lastmod: 2022-10-02
  priority: 0.7
  changefreq: 'monthly'
  exclude: 'yes'
---

It's November. Let's make something.

{% for post in site.posts %}
{% if post.tags contains 'gameprogress' %}
  {{ post.title }}
  <time datetime="{{ page.date | date_to_xmlschema }}" class="post-date">{{ page.date | date_to_string }}</time>
  {{ content }}
  {{ post.content }}

{% endif %}

{% endfor %}
