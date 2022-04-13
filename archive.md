---
layout: page
title: Stuff
---

<!-- # Blog Posts -->

{% for post in site.posts %}
  {% if post.tags contains 'release' or post.tags contains 'demo'%}
  {% else %}
  * {{ post.date | date_to_string }} &raquo; [ {{ post.title }} ]({{ post.url }})
  {% endif %}
{% endfor %}
