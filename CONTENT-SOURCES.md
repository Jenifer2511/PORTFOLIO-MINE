# Content provenance

## Personal information

- User-provided resume screenshot (latest source): seven freelance websites, six months freelance experience, current CGPA 8.39, B.Tech AI & DS (2023–2027), Honors in Creative Media in progress, technical project descriptions, education, certifications, and contact information.
- User statements: pursuing B.Tech AI & DS; completed a Python Full Stack Development course.
- Existing portfolio source: https://github.com/Jenifer2511/My-Portfolio (read-only clone inspected during implementation). Original portfolio text provided project descriptions, skills, internship details, live website URLs, contact links, certificate metadata, and award descriptions.
- The attached `NSNCV0226173.pdf` is the Networkz Systems Python certificate: Professional in Python Programming; skill set Python Full Stack Development; March 4–May 19, 2026; 120 hours; issued May 25, 2026. Stored as `public/Python-Full-Stack-Certificate.pdf`.

## Original assets recovered from the user's earlier portfolio

The original portfolio embedded assets as data URLs. They were decoded into local files without modification. `src/documents.json` maps every image to its original alt text.

- `portrait.jpg`: original professional portrait of Jenifer J. Displayed in full colour, uncropped, inside a bounded white frame.
- `document-1.jpg` to `document-9.jpg` (document 7 is PNG): internship certificates, course certificates, bootcamp, and hackathon participation.
- `document-10.jpg` through `document-15.jpg`: creative and technical event certificates.
- `document-16.jpg`, `document-18.jpg`: original award presentation photographs.
- `document-17.jpg`, `document-19.jpg`: associated certificates/event document photographs.
- `Jenifer-J-Resume.pdf`: original resume PDF decoded from the earlier portfolio. Its older CGPA and site count are preserved in the original download; the web content uses the newer screenshot.

No stock photographs, generated people, testimonials, or invented professional results are used. The downloadable and preview assets retain the owner's original information.

## New artwork and typography

- `work-srinava.png`, `work-outfit.png`, `work-sdk.png`, `work-film.png`: original typographic title cards authored for the gallery. These are project covers, not live website screenshots. Generation source is `scripts/generate-covers.mjs`.
- The four academic project panels are original typographic covers and neutral project summaries, not claimed production UI screenshots.
- The asterisk wordmark and interface arrow SVGs are simple authored marks/icons.
- Manrope is self-hosted from `@fontsource/manrope` under the SIL Open Font License. Its license is included in the dependency package.
- The reel supplied visual inspiration for pacing and a curved project gallery only. No identity, footage, screenshots, artwork, or code was copied from it.

## Cobalt scroll chapters

The user's requested black, white, and cobalt blue palette defines the chapter backgrounds and original title-card artwork. All source photographs and certificates retain their original pixels and colour. They use bounded `object-fit: contain` frames without cropping, background removal, image zoom, or filters. Motion animates the typography and chapter containers; Three.js renders only the project-cover gallery.

The portable HTML embeds these same source assets; it does not fetch replacement imagery from third parties.
