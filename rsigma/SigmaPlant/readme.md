# Sigma Plant

## TODO:

- [ ] Zone should have knowledge of contained features:
  - [ ] group moving
  - [ ] duplication
  - [ ] station list

- [ ] Processes can have 'sub process' which are actually 'Sub Plants'
  - to show sub processes need a level naviagation widget as above 
  - sub process plants need special Source / Sink zones for the input and output of the higher level process
  - ~~'add sub process' on station block~~ All Processes have a Source, Delay, and Sink. THey can have a description on a higher level. They can also have more blocks inside them, but this is how they shoudl initialise.

- [ ] Conectors should come straight out, then choose a sensible path the the source
- [ ] Conectors should be deletable
- [ ] Connectors should be initi w/ both inp and outp

- [ ] Inputs and Outputs should be addable components to subprocesse
  - Tags for Material / Informational /  Energy / Mechanical / Custom
  - Created by adding sources or sinks in the process, consider the Station block above as now having multiple ins/outs (update to match + tags)

- [ ] Split Block with Percentages (two way only, slider split maybe)
  - Handle multiple outputs (on Connector side?)

- [ ] Delay / Duration Block 

- [ ] Feature Tagging:
  - Value Add
  - No-Value Add
  - Mandated Necessary
  - Waste
  - Rework
  - Handoff

- [ ] Map and time between any Source and Sink

- [ ] Mobile touch input


### Requires Server
- [ ] Undo and constant save 
- [ ] Real Time collaboration 


