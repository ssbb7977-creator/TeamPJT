# Tailwind CSS 규칙 (필수)

## 현재 프로젝트 환경

- Tailwind CSS는 **v3.4.x**를 사용한다.
- Tailwind CSS v4로 업그레이드하지 않는다.
- `@tailwindcss/postcss`를 설치하거나 사용하지 않는다.
- 기존 Tailwind3 설정을 반드시 유지한다.

## PostCSS 설정

postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## CSS 진입 파일

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 절대 변경 금지

다음 작업은 하지 않는다.

- Tailwind v4 업그레이드
- `npm install @tailwindcss/postcss`
- `postcss.config.js`를 v4 방식으로 변경
- `@import "tailwindcss"` 방식으로 변경
- 기존 Tailwind 설정 삭제

## UI 수정 규칙

UI만 수정한다.

레이아웃, 컴포넌트, 스타일은 자유롭게 수정 가능하지만,

- package.json
- postcss.config.js
- tailwind.config.js
- vite.config.js
- npm 패키지 버전

은 수정하지 않는다.

새 패키지가 반드시 필요한 경우에는 먼저 이유를 설명한 후 승인을 받은 뒤 진행한다.