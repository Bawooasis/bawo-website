# iPhone device frame (marketing mockups)

## Source & license

The site uses an **original pure CSS/SVG device chrome** in `src/components/IphoneDeviceFrame.tsx` + `.bawo-iphone*` styles in `src/index.css`.

It is **not** Apple marketing artwork and does **not** redistribute files from [Apple Design Resources](https://developer.apple.com/design/resources/) (those assets are subject to Apple’s license and are not redistributed here).

Proportions follow publicly documented iPhone 17 Pro Max display metrics (CSS viewport **440×956**, screen corner radius ~**62pt**, Dynamic Island ~**125×37pt**). The titanium shell, side buttons, and Dynamic Island are hand-authored CSS.

**License for this chrome:** same as the repository (site code). Free for commercial use on joinbawo.com as original work.

## Screen fitting

Raw in-app shots already include the iOS status bar. Screens fill the mockup screen with `object-fit: cover` + `object-position: top`, clipped to the screen radius. Outer letterbox/margins on source JPGs were cropped before encoding.
