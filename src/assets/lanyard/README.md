Lanyard model (`card.glb`) and original strap (`lanyard.png`) from React Bits:
https://github.com/DavidHDev/react-bits/tree/main/src/assets/lanyard

The React component is adapted from the React Bits source supplied for this project.
`front.svg`, `back.svg`, and `band.svg` are custom portfolio artwork. The front uses
the existing `src/assets/fahru.png` portrait, embedded so the SVG also works as a
standalone fallback and WebGL texture. Edit these SVGs to change the card artwork.

`card-optimized.glb` is generated with `node scripts/optimize-lanyard.mjs`.
It retains the original geometry and removes the unused baked face texture.
The portfolio supplies its own front/back artwork; keep the original GLB here
as the unmodified source and for uses that need the default baked artwork.
