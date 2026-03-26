# Neoja Finals — Interactive Basketball Championship Reveal

## The World

Under the bright lights of the Neoja Arena in Beit Shemesh, three players have battled through a season of interactive basketball challenges — Sharp Shooter, IBEAM, and Party Mode. **The Neoja Finals** is the climax: a dramatic, cinematic reveal ceremony that crowns the season champion. Points, assists, rebounds — every stat has been counted. Now the court goes dark, and the scoreboard lights up one last time.

## Setup

```bash
npm install && npm run dev
```

## Animation Approach

- **Motion (Framer Motion)** drives all component-level animations: `AnimatePresence` for mount/unmount transitions, `useAnimation()` for the imperative 1st-place reveal sequence, and spring physics for natural card settle animations.
- **CSS `@keyframes`** handle ambient loops: court line pulses, shimmer text effects, screen shake, and the shockwave ring on the champion reveal.
- **Canvas API** powers floating ember/spark particles that shift from orange (energy) to gold (victory) as the ceremony progresses.
- **Web Audio API** generates programmatic synth stings for each reveal — escalating from a simple tone for 3rd to a full harmonic chord with sub-bass for the champion.
- **canvas-confetti** fires an orange & gold particle burst on the 1st place reveal.
- The reveal orchestration uses a state machine (`idle → countdown → reveal3 → reveal2 → reveal1 → podium`) with timed auto-advance.

## If I Had More Time

- **Basketball bounce animation**: A 3D basketball that bounces across the screen before each reveal, with realistic physics and court-floor shadow.
- **Sound toggle**: A mute button in the corner for the Web Audio stings.
- **Player avatars**: Generated basketball player silhouettes or jersey illustrations for each card.
