# Direction: Behind the pixels

An editorial portfolio in black and white, with small cobalt signals. A held title sequence introduces Jenifer through her actual portrait. The oversized name separates while two shutters uncover the photo. Its completed state is a modest, fully visible portrait with identity copy on either side on desktop and above/below on phones.

## Visual system

- Backgrounds alternate black `#101010` and white `#ffffff` across the six chapters. There are no cobalt chapter backgrounds. Cobalt `#0047ff` appears only in small marks, arrows, status dots, and thin progress indicators. Original photographs retain their own colours.
- Manrope is locally hosted. Large typography and generous frame margins carry the composition. There are no gradients, glass panels, fabricated UI screenshots, stock portraits, or fake social proof.
- The original portrait frame is at most 340 pixels wide on desktop and 230 on phones. The award photograph is at most 460 pixels wide. Final-state photos and certificates are fully contained, never cut out or filtered.

## Motion narrative

| Content | Scroll behaviour |
| --- | --- |
| Landing title | Held viewport; oversized name separates in opposing directions. |
| Original portrait | Two shutters open with scroll; the entire photo settles upright and stays visible. |
| Supporting identity | Two entrances follow the portrait reveal at different timeline positions. |
| Freelance work | White held chapter; curved Three.js ribbon turns with scroll and supports drag and controls. |
| About heading | Words fold upward through text masks. |
| Original award photograph | A bounded perspective hinge settles flat, without final-state image cropping. |
| Personal statement | Words gain emphasis as reading progresses. |
| Body copy | An ink wipe and a vertical entrance alternate. |
| Personal facts | Numbers roll upward into their own fixed windows. |
| Toolkit | Groups reveal in horizontal ink wipes. |
| Technical projects | Horizontal held sequence on desktop; covers turn in depth while descriptions arrive independently. Phones use vertical project scenes. |
| Education | A line grows with reading progress; milestones lift into position. |
| Certificates | Each row folds into view at its own scroll position. |
| Creative recognition | Award descriptions reveal in horizontal wipes. |
| Contact | Letters rise and turn independently, the arrow rotates, and the closing rule draws across the page. |

The opening is controlled by scroll, not a timer. Waiting leaves the photo at the same reveal position. Scrolling upward reverses it. A reveal control advances to the complete portrait, while chapter navigation can skip the held sequence. Native scrolling remains free.

## Implementation

React 19 owns the UI. Motion owns the scroll values and shared frame scheduler. Exactly one Lenis instance smooths scrolling. Three.js owns only the curved work canvas and loads near that section. Existing source images and public documents remain local and unchanged. No GSAP is installed.

The previous generic chapter fade wrapper was removed. `Choreography.jsx` contains separate content-level recipes; the hero and horizontal project sequence have dedicated scroll timelines.

Reduced motion and the motion toggle display completed, readable states immediately. They remove shutters, held layouts, and WebGL. Build-time React rendering and a no-JavaScript stylesheet provide the same complete content without hydration. Keyboard focus restores readable states for animated controls.

## Validation

Custom Playwright checks and screenshot reviews are used because the installed design skill’s bundled inspector resources are unavailable through its cloud reader. No third-party design award or score is claimed.

The opening is captured at five scroll positions on desktop and phone. Browser checks cover timer independence, pinning, reversal, full portrait visibility, text separation, monochrome chapter backgrounds, and distinct content motion. The existing gallery, native dialogs, document downloads, motion preferences, WebGL-loss fallback, and no-JavaScript access remain part of the checks.

Project imagery remains clearly labelled authored title cards. CONTENT-SOURCES.md records its provenance and the older original resume PDF’s differences from the newer web content.
