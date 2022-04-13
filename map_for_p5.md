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
    {% if post.tags contains 'demo' %}

    startdemo
    title {{ post.title}}
    image {{ post.image}}
    link {{ post.link}}
    startcontent
    {{ post.content }}
    enddemo

    {% else %}

    startpost
    title {{ post.title }}
    date {{ post.date | date_to_string }}
    link {{ post.url }}

    {% for cat in post.categories %}
      $ {{ cat }}
    {% endfor %}
    endpost

    {% endif %}
    {% endif %}
{% endfor %}
