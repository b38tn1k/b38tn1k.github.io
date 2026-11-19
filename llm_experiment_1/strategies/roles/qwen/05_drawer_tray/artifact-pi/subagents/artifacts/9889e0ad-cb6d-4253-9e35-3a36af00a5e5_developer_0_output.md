All fixes verified. Here's the summary of changes:

---

## Fixes Applied

### Bug 1 [CRITICAL] - STL offset unit mismatch
Replaced `Float32Array(buffer)` with DataView-only writes. The old code used `dv[offset++] = value` (float index) mixed with `view.setUint8/setUint32(offset, ...)` (byte offset), causing buffer corruption because Float32Array treats the number as an array index (multiplied by 4) while DataView treats it as a byte offset. Now uses only `view.setFloat32(byteOffset, value, true)` with `byteOffset += 4`.

### Bug 2 [MEDIUM] - Compartment sizing asymmetry
Both `buildTray()` and `exportSTL()` now use:
```js
compW = (innerW - (cols - 1) * wallT) / cols
compD = (innerD - (rows - 1) * wallT) / rows
```
Divider positions use new `dividerXStart`/`dividerZStart` formulas with loop starting at `i=0`. Verified: both functions produce identical geometry for a test case (W=180, D=120, cols=3, rows=2).

### Bug 3 [MEDIUM] - Face winding mismatch
Fixed CCW vertex order for +Y, -Y, and -Z faces relative to their outward normals. Cross product of (v1-v0)×(v2-v0) now points in the declared normal direction for each face.

### Bug 4 [LOW] - OrbitControls panning at theta=0
Replaced `cos/sin` screen-space mixing with camera-local vectors computed from `getWorldDirection()` and `cross(camera.up)`, giving correct pan behavior at any theta angle.