# iPhone device frame (marketing mockups)

## Approach

Every marketing app screenshot is wrapped by `AppScreenShot` — an **original** App Store–style iPhone 17 Pro Max chrome (black titanium bezel, side buttons, hardware Dynamic Island, soft shadow).

Screen content is Alexander’s **real** 1320×2868 simulator captures (status bar **9:41** already in-shot). The frame does **not** draw a fake status bar. The hardware Dynamic Island sits over the black island already present in each capture.

## Source & license

Pure CSS in `src/components/AppScreenShot.tsx` + `.bawo-app-screen*` in `src/index.css`.

**Not** Apple Design Resources artwork (Apple’s license does not allow redistribution). Proportions follow publicly documented iPhone display metrics (CSS viewport ~440×956, screen corner radius ~55–62pt, Dynamic Island ~126×37pt).

**License for this chrome:** same as the repository (site code). Free for commercial use on joinbawo.com as original work.

## Fit

Screens fill the inner viewport with `object-fit: cover` + `object-position: top`, clipped to the screen radius. No letterbox gaps between bezel and image.
