# Gallery images

Drop showroom / build photographs in **this folder**, then list them in
`src/data/gallery.js`.

## Conventions

- **Format:** `.webp` preferred (`.jpg` works). Export at ~80% quality.
- **Size:** 800×800 to 1200×1200. They render small on the dome — anything
  larger is wasted bytes.
- **Aspect:** square crops look best; other ratios are centre-cropped.
- **Naming:** kebab-case and descriptive — `rift-build-front.webp`,
  `showroom-counter.webp`, `bench-testing.webp`.

## Adding them

```js
// src/data/gallery.js
export const galleryImages = [
  { src: 'gallery/rift-build-front.webp', alt: 'Rift gaming build, front three-quarter view' },
  { src: 'gallery/showroom-counter.webp', alt: 'The service counter at the Heber Road showroom' },
];
```

`alt` is required — it is read out to screen readers and shown if the file
fails to load. Describe what is in the picture, not "gallery image 1".

The dome looks best with **12 or more** images; below that it repeats them to
fill the sphere.
