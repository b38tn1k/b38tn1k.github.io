# Pi workflow experiments

These extend the original five-task, two-model benchmark. Pi writes every application and repair. The supervisor configures workflows, inspects artifacts, runs independent checks and publishes scorecards; it supplies no application implementation.

## Selected approaches

- **Plan mode:** `@narumitw/pi-plan-mode@0.60.1`, read-only planning followed by a structured `plan_mode_complete` result and the standard `/plan implement` command in the same session. The runner cancels the ready-plan menu, then sends that already-authorized command. It supplies no design decisions. RPC mode is required: this extension deliberately rejects implementation in print/JSON mode.
- **Specialist roles:** `pi-subagents@0.88.1`. A coordinator delegates implementation to `developer`, functional checking to `tester`, and interaction review to `ui`. Only developer owns application changes. At most two repair rounds.
- **Guidance + worker:** the same extension. A read-only parent plans, delegates to `worker`, inspects actual artifacts/evidence and requests corrections, at most two repair rounds. This tests a lighter coordination structure.

Package selection used primary GitHub/npm metadata, recorded in `research/popularity.json`. Among the checked candidates, pi-subagents had about 4,202 GitHub stars and 972,794 monthly npm downloads; the Narumi plan package had about 35,665 monthly downloads and its extensions monorepo about 782 stars. Counts are time-specific adoption signals, not quality guarantees.

Sources: https://github.com/nicobailon/pi-subagents and https://pi.dev/packages/@narumitw/pi-plan-mode . Pinned package documentation is retained under `packages/node_modules`.

## Controls

The exact original five prompts are in `experiment-plan.json`: reaction timer, Snake, pixel painter, Breakout/editor, drawer tray/STL. Both Ornith 1.5 35B and Qwen3.6 35B-A3B run all three approaches. The Pi coordinator and all child agent contexts run on this Mac; only model inference runs on Songbird through the local SSH forward. No server-to-Mac SSH hop is involved. Child roles inherit the parent model. Songbird has one inference slot, so independent agent contexts do not imply simultaneous GPU inference.

Billion-context is disabled. Earlier runs did not establish a correctness benefit; the only long compression run also had rejected summaries/history warnings. All other ambient extensions, skills, MCP and prompt templates are disabled. SDK peers are symlinked to the exact installed Pi 1.5.2 release, rather than installing a second host SDK.

All writes are OS-confined to this strategies tree. Per-run instructions further limit application/test writes to the current project. Agent configuration, npm cache, temp files, sessions and artifacts are local to this tree. Parent coordinators have only read/search/list and subagent tools. Tester has bash for verification but is instructed not to edit application files; this is a role instruction, not a per-file OS sandbox. Any observed role violation must be reported.

Subagent configuration uses eager activation, a compact description, fresh contexts, project artifact storage, concurrency 1, depth 1, ten child admissions maximum. Unneeded management/workflow scripting features are disabled. The runner requests foreground `async:false` and sets `asyncByDefault:false`. These defaults do not prohibit async workflow chains: some Qwen coordinators used chains that detached and later completed through notifications. Final child metadata is included in the role-completion audit, so those successful children are not incorrectly counted as skipped. This is an observed workflow deviation, not evidence of simultaneous GPU inference. The extension requires exactly one subagent tool call per assistant turn; multiple children can be requested in one tasks array. Case 12 submitted separate tester/UI calls together and the UI call was rejected while tester ran. From case 13, the coordinator instructions explicitly repeat this protocol requirement. Cases 11–12 retain the original instructions; models, briefs, role permissions and deadlines are unchanged. After a real infinite Node verification loop in case 12, revision 2 also asks Bash callers to set a 90-second timeout and configures the extension hard tool timeout at 120 seconds. A hard tool timeout ends that child with an error, allowing coordinator recovery; it does not extend the shared project deadline. Changes activate only after case 12 and the old runner have stopped. The scored generation parameters remain unchanged. Omit `model` to inherit: the literal model name `current` is invalid.

Each project has one shared 60-minute deadline, including all roles (child defaults are also 60 minutes, but cannot extend that shared project deadline), and a 30-minute checkpoint. The runner waits for `agent_settled`, rather than treating `agent_end` as terminal; it allows a short grace period for extension followups. Every prompt, UI response and mechanical plan handoff is saved in `control.jsonl`. Raw events and child artifacts are retained. Smoke tests are excluded from scores; the first plan smoke demonstrated write blocking, and the second completed planning/implementation (with an unnecessary trailing newline, so the smoke is protocol evidence rather than exact-content correctness).

## Normal Pi context correction

Normal global Pi metadata advertised Qwen3.6 as 16,384 tokens while the verified Songbird vision profile serves 65,536. That one contextWindow value was corrected to 65,536 in `~/.pi/agent/models.json`; all other provider/model values were verified unchanged. A private backup remains in the Pi configuration directory, and the non-secret audit record is `research/configuration-changes.json`. New normal Pi sessions pick up the corrected metadata. Benchmark configurations were already isolated at 65,536, so this does not change the experimental settings. The same verified correction was subsequently applied to the short Ornith alias (16,384 → 262,144) and Qwen3.8 Flash (16,384 → 131,072), matching gateway aliases and model parameters. Only those contextWindow values changed; fresh Pi model listings confirm them. See research/configuration-alias-context-fix.json.

## Generation-control calibration

An idle-only audit after case 12 found that the installed SDK serializes the configured 4,096-token ceiling as max_completion_tokens. The live Ornith endpoint ignored a limit of 1 in that field and returned 51 tokens; max_tokens:1 returned one token with a length stop. The model registry also marks the models as lacking thinking support, so its off setting sends no explicit reasoning-off parameter. Server Qwen metadata defaults thinking to true. Ornith probes accepted reasoning_effort:none and a native tool call. These findings are recorded in research/pi-request-shape.json, research/server-compat-metadata.json and research/ollama-compat-probe.ornith.json.

Scored provider definitions and generation settings remain unchanged across the new runs. Their client labels do not establish an effective 4K server ceiling or disabled server reasoning. After the original 50 assessments, live installed-SDK tool call/result replay passed for Qwen3.6, Ornith and Qwen3.8 Flash. Normal Songbird entries now advertise thinking capability, map off to reasoning_effort:none, and use max_tokens with a 32768 output ceiling. Corrected interactive profiles are separate from frozen historical benchmark definitions; see research/provider-config-corrections.json.

## Verification and scoring

Rubric: functionality 40, artifact correctness 25, usability 15, self-verification 10, autonomy 10. Workflow adherence is assessed separately from application correctness. Autonomy measures reaching a terminal result without supervisor help or a deadline stop; functionality and workflow completion have their own measures. The coarse protocol flag requires an accepted plan and implementation handoff; or successful completion of all three specialist roles; or a successful worker plus the guidance parent reading the application artifact. Team/guidance parents must not write application code, and children must use the parent model. Concrete quality of review, sequencing, ownership violations and repair outcomes are also inspected in each scorecard. A page produced without the requested delegation is not credited as a successful multi-agent workflow.

The first ten runs were completed under an earlier browser-origin denial. The user subsequently authorized local browser tests, including http://127.0.0.1:8766, but the browser tool still rejected access because of a saved permission/managed policy. No independent browser/visual testing or alternative browser execution has been used. All 30 new attempts are complete and graded under source/runtime-only verification; see research/browser-access.json. Checks may inspect source and execute actual extracted application code with isolated DOM/canvas/time shims; export geometry is checked independently where possible. These checks cannot establish browser compatibility or visual polish. STL edge matching uses a 0.0001 mm coordinate tolerance. Signed-volume integrals represent physical material volume only for closed, consistently oriented, non-self-intersecting surfaces; overlapping shells need separate interpretation. Self-intersections, slicer repair and physical printability are not independently verified. The checker is sanity-tested against analytic ASCII/binary cuboids and deliberately damaged meshes. Single trials do not isolate architecture effects from model sampling.

## Reproduce / use interactively

Keep the SSH forward to Songbird at `127.0.0.1:11435` active. The local launcher below selects the isolated Songbird model configuration and the pinned extension, without changing normal global Pi settings:

```
/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/pi-mode plan ornith
/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/pi-mode roles qwen
/Users/jamescarthew/Developer/vibes/local_agent_testing/strategies/pi-mode guide_worker ornith
```

Run it from your project directory. In plan mode, use `/plan <brief>`, then `/plan implement` when satisfied. Roles/guidance mode adds the generic workflow instructions; give the normal project brief. Custom role profiles live in `config/<model>/agents`. The interactive launcher is not the benchmark write sandbox: it is intended for your own projects.

The benchmark runner is `run-suite.py`; it uses RPC and the fixed write boundary. Reports and the experiment manifest retain versions, time, usage, protocol adherence and verification limitations.

## Completed assessment

All 50 attempts are assessed: 20 earlier solo/billion attempts and 30 new workflow attempts. There are 49 HTML artifacts; guidance/worker Ornith tray delivered no index.html and scored zero. Seven new attempts reached the shared deadline. The full comparison, every scorecard, all five briefs, these methods and Pi findings are embedded in the root index.html. A subsequent user-authorized round adds ten enforced-loop attempts. GitHub Pages publication remains deferred.

The final QA adds an identity-size five-argument Canvas drawImage shim without changing existing three-argument behavior. Painter fixtures normalize CSS color serialization where needed; inline onclick handlers are explicitly invoked where linkedom does not compile them. These adaptations implement missing environment behavior and do not repair application algorithms. Exact exported STL bytes are analyzed, with underlying geometry functions extracted by AST and evaluated using pinned local Three.js where CDN dependencies prevent offline startup. Such extraction is diagnostic evidence, not proof that the standalone page works offline.

## New enforced-loop cohort

Ten new attempts reuse the same five briefs for both models, with billion-context off. The user requested provider repairs first, then the enforced loop. This is therefore a combined provider/configuration-and-workflow intervention, not a pure orchestration ablation. The original 50 artifacts and technical scores remain unchanged.

run-enforced.py is an external controller, not an LLM coordinator. Each stage runs fresh Pi RPC context on the same model. It requires build, executable acceptance testing and independent review, followed by at most two repair/test/review rounds. All stages share 60 minutes. Build has at most 15 minutes, first testing eight and first review five; later phases have bounded budgets and reserve time for required followups. Subprocess tests have a hard 90-second limit and process-group cleanup. Reviewer/tester sandboxes cannot edit the app; repair stages cannot edit acceptance tests. The controller executes tests itself and checks the real exit code.

The shared test platform provides the existing partial DOM/Canvas runtime with browser-like CSS color serialization and a virtual Date.now clock. Agent-written tests must execute actual handlers, include a source-hashed acceptance ledger and trace real loads/events/time or pixel reads. A fresh reviewer inspects both the application and the tests. The gate also requires no blocking review findings for the same source hash. Maker export requires captured STL bytes, matching-edge closed topology, a single component, consistent winding/normals, default outer dimensions and a material-volume check. These checks do not establish slicer or physical-print correctness.

The gate enforces stage and evidence completion, not an A grade: tests and reviews can still be wrong. Candidate-written acceptance tests are distinct from independent grading; historical evaluation defects and verifier scripts are not supplied as implementation hints. No browser-policy workaround is used. The controller, shared runtime and validator are read-only to candidates. Gate results and stage transcripts are linked from scorecards.

## Enforced Bash timeout correction

The first enforced-loop reviewer launched an unbounded filesystem search despite the requested timeout. Its five-minute stage limit did stop it, but prompt-only tool limits were insufficient. A normal Pi extension now defaults missing Bash timeouts to 90 seconds, preserving explicitly requested normal-session limits. The new controller explicitly loads a pinned copy and caps every Bash call at 90 seconds. A live smoke with a one-second diagnostic value timed out an unbounded sleep call and recorded the hook mutation. The original reaction-timer attempt was preserved, including its original shared deadline and an infrastructure intervention; no app edits or repair hints came from the supervisor. Later phases resume in fresh contexts. Historical scored profiles remain frozen. See research/enforced-timeout-recovery.json and research/enforced-bash-timeout-smoke.json.

The initial reviewer sandbox also blocked temporary repro scripts while its instructions allowed project work. Before continuing, the supervisor added a writable .scratch directory and named the already supplied runtime path in review instructions; index.html and acceptance evidence remain locked. OS smoke checks confirm those permissions. Case 31 retains its two infrastructure interventions, all interrupted stages and original shared deadline. Subsequent attempts use this corrected setup from the start. This limits interpretation of that first attempt’s time and autonomy. The gate also rejects a later failed assertion even when an earlier check with the same ID passed.

During the first Snake test stage, the supplied runtime’s default RNG was corrected from a fixed value to a deterministic sequence: a fixed value can falsely hang valid retry-based food placement. constantRandom:true remains available for deliberate isolated fixtures. Case 31 retains the old behavior and its archived kit at enforced-harness/runtime.constant-rng-v1.cjs; later fresh executions in case 32 and all of cases 33–40 use the sequence. The case 32 tester had already started, so its initial preflight and possibly its first runtime read used the old kit; this is an additional test-platform timing confound. The historical core runtime and original 50 application artifacts remain unchanged. See research/enforced-test-platform-change.json and research/enforced-rng-selfcheck.json.

During the first Snake repair, getComputedStyle was corrected to return strings and resolve inline/root CSS custom properties and simple aliases. The old mock returned undefined for a valid root variable and caused .trim() to throw; the original unchanged Pi-authored Snake starts under the corrected kit. The reviewer incorrectly described this as a latent app defect. Case 32 testing/review is therefore further confounded by the supplied environment, not solely agent behavior. The prior kit is archived at enforced-harness/runtime.sequence-v2.cjs. Preflight records platform revision 3 and source hashes thereafter; this still provides no CSS layout or actual browser verification.


## Calibration retention and final procedure

Before scoring any later enforced attempts, the first two Ornith attempts were designated setup calibration because the supervisor changed its test platform and permissions during them. All their application bytes, grades, logs and time costs are retained. Their scores are excluded from configuration means. Both identical prompts will be repeated under the final procedure regardless of the resulting scores; selecting a repeat does not depend on whether it improves. The final matrix therefore has 60 comparisons, with two additional calibration attempts in the complete cards/data (62 attempts total).

Protocol revision 5 gives each fresh role its actual allocated seconds and required handoff before starting. A single automatic stage-deadline steer asks it to write honest results before time expires, preserving all failures and uncertainty. These are mechanical workflow notices, not application-specific debugging advice. Both models use this same procedure, corrected provider controls, supplied runtime and Bash bounds. The original shared deadline and maximum two repair rounds remain unchanged. Cases 33–42 use this procedure; cases 31–32 remain the pilots. The clean repeat reports have a separate enforced_final report stem so pilot evidence cannot be overwritten.


## pi-proof cohort (authorized after the enforced round)

Ten new attempts repeat the exact five original briefs for both models. `run-proof.py` starts only after all final-procedure enforced attempts are assessed. Applications and behavioral tests are written by Pi alone. No historical bug hints or supervisor product code are supplied.

The extension is pinned to pi-proof 1.1.0 at commit `5c7334eb1f3ff0030bdc42f29702651936382190` in a local checkout, loaded only in isolated benchmark sessions. Both proof tools are explicitly enabled in Pi's tool allowlist. The installed-Pi smoke verifies a blocked early write, a failing test unlocking production writes, and a passing test. Upstream's 134 tests also pass. Fixture files are excluded from benchmark attempts.

Each attempt gets a fresh Pi RPC context, the same corrected model profile as the clean enforced round, explicit thinking off, billion-context off, and a shared 60-minute cap. There is no external developer/tester/reviewer stage chain. Common workflow instructions ask Pi to call proof_start, implement incrementally against its own tests, and call proof_done. This is additional workflow assistance; the original product brief is retained verbatim in prompt.txt.

A package.json supplies only npm-test plumbing. A generic runner finds test/*.test/spec JavaScript recursively, uses Node's TAP reporter (supported by the extension), rejects an empty suite, and caps a run at 90 seconds. Automatic extension tests use a subprocess independent of the Bash tool hook, so this separate limit matters. The application remains a single offline index.html. Runtime logs record and clean up owned test subprocess groups. A final read-only test run records actual exit status independently of the agent's final prose.

The underlying seeded partial DOM/Canvas runtime is unchanged. All scored proof attempts use runtime-v2.cjs, which supplies checkbox booleans and pointerdown/mousedown/pointerup/mouseup/click activation plus exact inline onclick code. The first proof attempt used v1, which omitted pointer events; it is retained as a stopped setup calibration and repeated fresh under v2. Its source, costs and tests remain visible and excluded from configuration means. Conformance fixtures check these helpers, filled pixels and virtual clocks. These changes do not fix the older WebGL, path-rasterization or image-encoding limitations and cannot certify browser behavior. Unsupported runtime APIs are treated as inconclusive and must not be labeled application defects. No protected tray-volume oracle is used in this cohort.

Proof workflow adherence records start/end calls, red and green transitions, early blocked writes, shell-write warnings and final test exit status. These establish procedure only, not meaningful test quality. Independent source/runtime/export grading uses the existing rubric after the artifact freezes. No browser automation, extra models or supervisor application repairs are used. Read restrictions in the prompt exclude historical benchmarks and scorecards. OS write restrictions isolate each project and keep shared helpers and runner config immutable.

This is a descriptive single trial per brief/configuration, not a pure extension-only ablation: workflow instructions and helper access differ from earlier setups. Full setup provenance and integration checks are under research/pi-proof-setup.json and research/pi-proof-*-smoke.json.


### Independent Canvas2D checks

For the proof painters, the supervisor may additionally run exact local application source in the same VM/DOM environment with a pinned @napi-rs/canvas 1.1.1 Skia backend for Canvas2D. This is a Node unit-test adapter: no browser, URL navigation, layout engine, GPU/WebGL or remote image loading. It can inspect actual circle/path pixels, ImageData history and locally encoded PNG signatures/dimensions. Inline PNG Image loading is modeled asynchronously from local byte buffers, with separate conformance checks; remote image URLs are unsupported. It does not establish browser rendering, focus or default actions. Zero-size canvas behavior remains approximated.

The supplied Pi helpers and prompts are unchanged. The adapter affects independent verification only and is documented in research/independent-native-canvas.json; conformance fixtures test paths, pixels, ImageData round trips, resize and PNG encoding. Additional independent coverage is another reason not to attribute differences causally to pi-proof.


Proof activation is also assessed chronologically. A successful start/end pair after the entire implementation does not satisfy the requested proof-first sequence. Reports retain the controller's loose signal criterion and the independent count of index writes before/during activation. Layout-only scaffolding exceptions require explicit assessment notes. The runtime and prompts remain frozen; this is an evidence interpretation, not model steering.


## Completed Ralph grading (17 November 2026)

All20 main Ralph attempts are independently assessed; two earlier reporter calibrations remain excluded from means. See ../ralph-results.json and the one-page report. Three additional independent drivers cover the final twelve outputs: qa/ralph-final-games.cjs, qa/ralph-final-breakout.cjs and qa/ralph-final-trays.cjs. They execute final source, exercise actual controls, inspect native Canvas2D pixels/PNG or actual STL downloads, and retain source hashes. Controlled fixtures may expose existing lexical state/functions; no application algorithms are replaced. Coordinates are scaled to the app’s actual logical grid when those dimensions differ from the backing canvas.

Case63 cannot render WebGL under this adapter. It is not failed for that limitation: exact extracted makeBox/getTrayGeometry functions demonstrate a missing return independently of GPU setup. Test/helper errors are not automatically application bugs. Autonomy credit follows accepted workflow completion, separately from functionality. Scores remain provisional POC assessments.

The preferred-setup controller runs separately, one native Pi session at a time. Its cells remain ungraded until independent assessment. No product code, authored tests or app-specific repair hints were supplied by Codex during these runs.
