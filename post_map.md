---
layout: empty
title: post_map
---

{% for post in site.posts %}
  {% if post.tags contains 'release' %}
  {% else %}
    startpost
    {{ post.title }}
    {{ post.url }}
    {{ post.date | date_to_string }}
    endpost
  {% endif %}
{% endfor %}
