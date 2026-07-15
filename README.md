# LocalHub (MVP)

Minimal Vue 3 + Vite scaffold for the LocalHub project.

Quick start:

```bash
npm install
npm run dev
```

Environment:
- Copy `.env.example` to `.env` and set `VITE_OPENAI_KEY`.

Build & deploy:

```bash
npm run build
# deploy `dist/` to Netlify
```

Development notes & prerequisites
-------------------------------
- Node.js (recommended >=16, tested on 18+)
- npm (bundled with Node)

Install & setup
1. Install dependencies:
```bash
npm install
```
2. Tailwind CSS (project uses Tailwind v3): postcss config is already set to use `tailwindcss`.
	 If you need to reinitialize Tailwind:
```bash
npx tailwindcss init -p
```
3. Start dev server:
```bash
npm run dev
```

Notes
- Environment variables: put `VITE_OPENAI_KEY` in a `.env` file (do not commit).
- Local data: `Busan_data/` contains JSON source data used by the app; the frontend reads these files directly.
- Seed posts: the app seeds example posts on first load via `src/utils/posts.js::seedExample()`.
- Map category navigation: Home sections link to `/map?category=tour` and `/map?category=festival`.

If you run into PostCSS/Tailwind errors, ensure `tailwindcss` (v3), `postcss`, and `autoprefixer` are installed as devDependencies and that `postcss.config.js` contains:
```js
module.exports = {
	plugins: {
		tailwindcss: {},
		autoprefixer: {},
	},
}
```

