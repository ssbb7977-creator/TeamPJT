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

Download & required files
-------------------------
If you want to set up this repository on another computer, you can either clone the repo or download a ZIP from GitHub.

Clone via Git (recommended):
```bash
git clone https://github.com/ssbb7977-creator/TeamPJT.git
cd TeamPJT
npm install
npm run dev
```

Or download ZIP: open the repo on GitHub, click `Code` → `Download ZIP`, then extract and run `npm install`.

Essential files you should keep or check after downloading
- `필수제약.md` — 프로젝트 필수 제약 및 규칙
- `mvp1.md` — MVP1 목표 및 체크리스트
- `progress.md` — 작업 진행/기록 파일 (프로젝트 상태 기록)

Quick copy (if you only need those files):
```bash
# from a cloned repo root
cp 필수제약.md mvp1.md progress.md /path/to/destination/
```


