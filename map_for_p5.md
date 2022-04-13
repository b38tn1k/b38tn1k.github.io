---
layout: empty
title: internal_map
---
{% for post in site.posts %}
  {% if post.tags contains 'release' %}
    startrelease
    title {{ post.title}}
    artists {{ post.artists}}
    cover {{ post.albumcover}}
    spotify {{ post.spotify}}
    applemusic {{ post.applemusic}}
    bandcamp {{ post.bandcamp}}
    date {{ post.date | date_to_string }}
    endrelease
  {% else %}
    startpost
    {{ post.title }}
    {{ post.url }}
    {{ post.date | date_to_string }}
    endpost
  {% endif %}
{% endfor %}
