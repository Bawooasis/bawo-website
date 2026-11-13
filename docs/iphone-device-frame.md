# iPhone device frame (marketing mockups)

## Approach

App screens on the marketing site are **pre-framed** App Store–style phone renders:

1. Alexander’s approved raw captures in `webshots/` (status patched to clean **9:41**)
2. Device chrome from `webshots/render.py` `phone()` — purple-black titanium edge, rounded screen mask, Dynamic Island
3. Output: transparent PNG/WebP/AVIF (+ JPG on near-black) at `src/assets/images/phone-*.{png,webp,avif,jpg}`

`AppScreenShot` only applies a soft drop-shadow. **No CSS bezel.**

## Mapping

| Source | Asset | Placement |
|--------|-------|-----------|
| 01-community-lounge.png | phone-community | Hero + Circles gallery |
| 02-events-approved.jpg | phone-events | Showcase Afrobeats/Events |
| 03-explore.png | phone-explore | Showcase Explore + gallery |
| 04-jobs.png | phone-jobs | Showcase Daily Vibe + gallery |
| 05-start-a-circle.png | phone-start-circle | Showcase Discover Spaces |
| 06-ask-ai.png | phone-ask-ai | Showcase Ask AI |

## License

Frame proportions follow `webshots/render.py` (original CSS/Pillow chrome, not Apple Design Resources artwork).
