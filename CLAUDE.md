# Breathing Focus Timer

A standalone, minimal breathing exercise timer. No frameworks or external dependencies — open `index.html` directly in a browser.

## Files

| File | Purpose |
|---|---|
| `index.html` | HTML structure. Links `styles.css` and loads `script.js` at end of `<body>`. |
| `styles.css` | All visual styles. Dark calm theme (`#0d1b2a` background, `#3a8ca8` accent). |
| `script.js` | All behaviour: phase engine, countdown, circle animation, input handling. |
| `CLAUDE.md` | This file. |

## How it works

### Phase engine (`script.js`)

`buildPhases()` reads the four number inputs and returns an array of phase objects:

```js
{ label, duration, scale, glow, animate }
```

- **Inhale** and **Exhale** are always included (minimum duration 1).
- **Hold** phases are only added if their duration is > 0, making 2-phase patterns (e.g. 4-0-4-0) valid.

`enterPhase()` applies the phase to the circle:
- If `animate: true`, sets `transition-duration` to the phase duration so the CSS scale transition runs in sync with the countdown.
- If `animate: false` (Hold), sets `transition: none` so the circle snaps and stays still.

`breathTick()` runs every second via `setInterval`. When the countdown hits 0 it advances to the next phase (wrapping around).

### Breathing circle

The `#breath-circle` element scales between `0.42` (exhale/rest) and `1.0` (full inhale) using `transform: scale()`. The `box-shadow` glow also transitions in sync to give a soft pulse effect.

### Controls

Inputs are disabled while the timer is running to prevent mid-session edits. Spinner arrows are hidden via CSS for a cleaner look; users type or use keyboard up/down.

## Default pattern

4-4-4-4 box breathing: inhale 4s, hold 4s, exhale 4s, hold 4s.
