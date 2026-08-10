# Tauseef.Khan — Interactive 3D Portfolio

A premium, futuristic 3D portfolio built with React, TypeScript, Three.js (React Three Fiber), Framer Motion and Lenis.

## Run it

```bash
npm install
npm run dev      # dev server with hot reload
npm run build    # production build → dist/
npm run preview  # preview the production build
npm run lint     # oxlint
```

## Edit your content (no code knowledge needed)

Almost all text, skills, projects and links live in **one file**:

```
src/data/profile.ts
```

| What you want to change            | Where in `src/data/profile.ts` |
| ---------------------------------- | ------------------------------ |
| Name, roles, hero intro            | `profile`                      |
| "My Perspective" text              | `perspective`                  |
| Skills & tool chips                | `skillGroups`, `tools`         |
| Projects (name, desc, links…)      | `projects`                     |
| Testing capabilities & demo bugs   | `testingCapabilities`, `testingDemos` |
| AI interests                       | `aiInterests`                  |
| About bio & interests              | `about`                        |
| Learning journey stages            | `journey`                      |
| Certifications / milestones        | `achievements`                 |
| Email, GitHub, LinkedIn, socials   | `contact`                      |

Notes:

- Leave a project's `github` / `demo` empty to hide its button.
- Leave `contact.linkedin` empty until you add a real link — the site shows placeholder hints instead of fake data.
- The achievement cards are placeholders — fill them in as you earn real certifications.

## Deploy (GitHub Pages)

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys to GitHub Pages automatically. Live at:

```
https://tauseef666-ctrl.github.io/portfolio/
```

First-time setup in the repo settings: **Settings → Pages → Source: "GitHub Actions"**.

## Project structure

```
src/
  data/profile.ts          ← all editable content
  context/                 ← app context (smooth-scroll provider)
  hooks/                   ← touch / reduced-motion / lenis helpers
  components/
    effects/               ← loading screen, cursor, particle field
    navigation/            ← navbar + scroll progress
    sections/              ← one file per page section
    three/                 ← WebGL (hero orb) & canvas (neural net)
    ui/                    ← reusable pieces (tilt card, reveal, buttons)
  index.css                ← global styles & design tokens
```

## Performance & mobile

- The Three.js scene is code-split (loaded lazily) so it never blocks first paint.
- Particles, neural-network nodes and the orb labels reduce automatically on touch devices.
- `prefers-reduced-motion` is respected.
