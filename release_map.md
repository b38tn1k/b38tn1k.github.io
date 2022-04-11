---
layout: empty
title: internal_map
---
HEAD
{% for post in site.posts %}
  {% if post.tags contains 'release' %}
    release
    title {{ post.title}}
    artists {{ post.artists}}
    cover {{ post.albumcover}}
    spotify {{ post.spotify}}
    applemusic {{ post.applemusic}}
    bandcamp {{ post.bandcamp}}
    endrelease
  {% else %}
  {% endif %}
{% endfor %}
END
