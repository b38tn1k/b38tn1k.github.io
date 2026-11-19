# Editing the experiment post

The editable article is `_posts/2026-11-19-local-coding-agents.markdown`.
Replace the introduction placeholder and edit the Markdown freely. The report tables,
scorecard controls, and interview foldouts live in `_includes/llm_experiment_1/`.
They inherit the existing blog layout and stylesheet; report styles are scoped.

The draft has `published: false`. Preview it with Jekyll's `--unpublished` option.
Remove that front-matter line when you choose to publish through your normal workflow.
No commit, push, or deployment was performed during staging.

Local preview: http://127.0.0.1:8768/code/ai/2026/11/19/local-coding-agents/
The current Jekyll preview watches this checkout; refresh the page after it rebuilds.

To restart it from the blog repository (with the site's Ruby environment active):

```sh
bundle exec jekyll serve --unpublished --future --host 127.0.0.1 --port 8768
```

## Frozen archive

`llm_experiment_1/` holds the public experiment artifacts. `manifest.json` records
source paths, original hashes, staged hashes, and compression flags. All 145 grades
and 140 comparison cells are retained, including failures and five calibrations.
One failed attempt produced no launchable HTML; its scorecard remains available.

App and snapshot HTML is byte-identical to the tested originals. Transcript JSONL
and two author model-card documents are gzip downloads: decompress them to recover
exact original bytes. Evidence navigation has been relocated; `.pi` directories
have public-safe names because Jekyll omits hidden directories.

Runtime trees, dependencies, and internal operational notes were not copied. The
ongoing survival game is separate. Do not regenerate the article from the working
experiment directory over your edited introduction or prose.

The full GitHub Pages/Jekyll build passed, all 1,711 checked archive links resolve,
and filters, sorting, and scorecard dialogs passed source/DOM/runtime verification.
Browser layout, GPU behavior, and physical printability remain outside that check.
