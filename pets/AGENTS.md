# /pets — agent notes

A single-page pet-sitter briefing for the household. Lives at `/pets/` on the site.

## Files

```
index.html      single file, embedded CSS + JS, no build step
pets.json       all content — house notes, day timeline, per-pet details
images/         pet photos (jpeg). Filename matches pet `id`.
```

That's it. No bundler, no framework. Open `index.html` in a server (any static
server) and it `fetch`es `pets.json`. The Jekyll site around it ignores this
folder; treat it as a self-contained static app.

## Local preview

`fetch()` won't work over `file://`, so serve it:

```
python3 -m http.server 8765
# open http://127.0.0.1:8765/pets/
```

Port 4000–4002 are usually occupied locally — pick something else.

## Data model — `pets.json`

Three top-level arrays power the page:

- **`house_notes`** — grouped subsections. Each entry is `{ title, items[] }`
  where `items` is an array of strings.
- **`day_timeline`** — ordered rows shown in the "A Day in the Life" panel.
  Each row is `{ time, kind, event }` where:
    - `kind` is one of `chickens | meds | cats | dogs` (used for left-border
      colour-coding and timestamp colour).
    - `event` can be **a string**, **an array of strings** (renders as a
      bullet list), or **an object** (clickable — see below). Inside an array,
      individual bullets can be string OR object.
- **`pets`** — array of pet objects. Each has: `id, name, aka?, species,
  image, focus, tagline, badges[], stats{}, feeding{}, meds?{}, quirks[],
  warnings[]`. See an existing entry for the shape.

The grid order on the page = the order of the `pets` array. Reorder by
shuffling the array, not by adding a sort field.

## The clickable-timeline pattern

A timeline event or bullet becomes tap-to-detail by replacing its string with:

```json
{ "text": "Morning feed for Boomba & Cabbage.", "pets": ["boomba", "cabbage"] }
```

The page renders `text` as an accent-colour underlined link. Tapping opens a
small overlay showing each referenced pet's feeding fields (`where`, `what`,
`notes`) plus a thumbnail. `when` is intentionally skipped in this overlay
because the timestamp is already visible on the timeline row.

Use sparingly — only mark items clickable when the overlay genuinely adds
non-redundant info. Self-explanatory rows ("Chicken shed door auto-closes.")
stay plain strings.

## Image focus

Each pet has a `focus: "50% 40%"` field — passed straight to CSS
`object-position`. Tweak per pet if the subject isn't centred in the photo.
Don't re-crop the JPEGs; CSS handles it.

## Design rules (the owner has been very clear)

- **Dark mode, calm, modern.** Not light/white-bg. Not pastel rainbow.
  Not Y2K maximalist.
- **Fonts:** Inter for body. JetBrains Mono ONLY as small accent labels
  (timestamps, section headings, badges). Never Press Start 2P or
  Fredoka One — those got nuked deliberately.
- **One accent colour** — coral `#e25858` (the Pokedex hint). Kind-specific
  muted accents exist (`--k-chickens`, `--k-meds`, `--k-cats`, `--k-dogs`)
  for timeline left-borders only.
- **Clickable text follows the link convention** — accent colour, semibold,
  underlined. Don't tint whole rows, don't add chevron badges, don't make
  the entire `<li>` a tap target. The text itself looks clickable. (This
  pattern was iterated on; don't regress it.)
- **Hint at cutesy, don't be over the top.** Restraint over ornament. No
  floating shapes, no twinkling stars, no holo gradient borders, no
  rainbow gradient text.
- **MEDS chip on Ziggy** — the one corner-of-the-photo badge that stays.
  Driven by `pet.meds` being non-null.

## Sharing / link previews

Open Graph + Twitter + Apple touch-icon are wired in `<head>`. The OG
image filename has a comment next to it — that's the swap point for the
link-preview thumbnail.

iMessage caches link previews aggressively. To force-refresh during
testing, append a query string (`?v=2`) — Messages.app treats it as a
new URL.

## Editing tips for agents

- The user often hand-edits `pets.json` between sessions. **Preserve their
  wording** when scripting changes — make the smallest patch, don't rewrite
  surrounding fields you weren't asked to touch.
- For multi-field JSON updates, a Python script that mutates specific keys
  is safer than wholesale rewrites or many sequential `Edit` calls.
- Don't add vet / emergency / wifi / owner-contact info to the page —
  that's handled out-of-band via direct phone hand-off, by design.
- When in doubt about a style choice, default to less: smaller, quieter,
  fewer animations. The page should feel like a calm reference, not a
  showcase.
