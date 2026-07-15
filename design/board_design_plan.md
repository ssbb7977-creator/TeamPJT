# Board Page Design Implementation Plan

Source: `board_localhub/code.html` (Tailwind-based design)

목표
- 현재 기능 컴포넌트(`Board`, `BoardWrite`, `BoardDetail`, `PlaceCard`, 등)를 디자인 파일에 맞춰 스타일링하고 상호작용을 일치시킵니다.
- Tailwind 유틸리티를 사용하여 반응형, 접근성, 재사용 가능한 컴포넌트로 구현합니다.
- 기존 기능/데이터 구조는 유지(로컬Storage 기반 게시판, Busan_data 사용)하되 스타일·레이아웃을 디자인 가이드에 맞게 적용합니다.

구성 요약
- 상단 바(TopNav) — 이미 있는 `AppLayout`/`Header.vue`에 디자인 스타일 적용
- Board 페이지: 리스트(list view), 상세(detail view), 작성(write view)
- 공통 스타일: Tailwind + 일부 컴포넌트별 scoped CSS

우선순위 작업 (단계별)

1) 프로젝트 준비
- 확인: 프로젝트에 Tailwind 혹은 비슷한 유틸이 존재하는가? (`tailwindcss`가 설치되어 있지 않으면, 디자인 파일은 CDN Tailwind를 사용함)
- 우리는 기존 CSS(assets/styles.css + component styles)를 사용하며, 디자인 유틸 클래스는 HTML을 참고해 클래스맵을 적용.

2) Global / Layout
- `Header.vue`를 디자인에 맞게 업데이트
  - 로고, 네비게이션(홈/맵/게시판), 검색/계정 버튼 스타일
- `Footer`의 문구(출처/라이선스)는 이미 반영되어 있으므로 폰트/간격만 조정

3) Board 페이지 (핵심)
- `src/views/Board.vue` 구조를 디자인 템플릿으로 교체
  - 상단 Page Header (제목, 설명, 탭 컨트롤(Post List / Write Post))
  - 필터 바(태그 칩들)
  - 리스트 뷰: 테이블형(bento-style) 레이아웃
    - 기존 `PlaceCard` 대신 게시판 전용 카드(또는 재사용)로 변환
    - 각 행 클릭 → `/board/:id` 경로
  - 페이지네이션 컨트롤
- `src/views/BoardDetail.vue` 디자인 개선
  - 헤더 이미지(cover), 메타(작성자, 날짜, 조회수), 컨텐츠, 액션(수정/삭제/좋아요/댓글)
- `src/views/BoardWrite.vue` 디자인 개선
  - 카테고리 버튼 그룹, 업로더(파일 드롭영역), 취소/게시 버튼 동작

4) 컴포넌트화
- 재사용 가능한 컴포넌트 목록
  - `BoardRow.vue` (테이블의 한 줄) 또는 `BoardCard.vue`
  - `TagChip.vue` (필터용 칩)
  - `UploaderDropzone.vue` (업로드 UI 스켈레톤)
  - `Pagination.vue`
  - `TopNav` 개선(이미 Header.vue 존재)
- 각 컴포넌트는 props/emit으로 명확히 분리

5) 스타일링 정책
- Tailwind 유틸리티 스타일을 가능한 한 클래스 형태로 적용
- 컴포넌트별로 추가적 스타일은 scoped CSS에 위치
- 색상·타이포그래피는 디자인 CSS 변수 또는 Tailwind theme 확장으로 관리(이미 code.html의 `tailwind.config`를 참고)

6) 상호작용 / 접근성
- 테이블 행은 버튼 또는 링크로 구현하여 키보드 포커스 가능
- 모달(비밀번호 입력)은 aria 속성 부여
- 이미지 alt, form label, aria-live 알림 등 추가

7) 데이터 연동
- 목록은 `loadPosts()`로 채우고, 페이지네이션 시 슬라이스
- 상세/수정/삭제는 기존 util(`updatePost`, `deletePost`) 사용
- 업로드는 클라이언트-only 데이터 URL 저장(옵션)

8) 작업분해(개별 작업 항목)
- [ ] `Header.vue` 스타일 정리 (폰트, 간격, 액션 버튼)
- [ ] `Board.vue` 전체 레이아웃 구현 (헤더, 필터, 테이블, 페이지네이션)
- [ ] `BoardRow.vue` 생성 및 `Board.vue`에 적용
- [ ] `BoardDetail.vue` UX/스타일 업데이트 (커버 이미지, 액션 버튼)
- [ ] `BoardWrite.vue` UI 개선 (카테고리 버튼, 드롭존)
- [ ] `TagChip.vue`, `Pagination.vue` 생성
- [ ] 반응형 테스트 및 접근성 점검
- [ ] 최종 스타일 리파인(폰트 스케일, 색상 대비)

9) 마이그레이션 가이드 (코드 매핑)
- Design HTML element → Vue component 매핑 예
  - `.bg-surface.rounded-2xl` 등 카드 → `<div class="card">` + scoped 스타일 또는 Tailwind 클래스
  - 테이블 행 → `<BoardRow :post="p" />`
  - 필터 칩 → `<TagChip label="#Haeundae" />`

10) 검증 체크리스트
- [ ] 모든 페이지에서 반응형(모바일/데스크톱) 동작 확인
- [ ] 게시글 작성/수정/삭제 동작 유지
- [ ] 접근성(키보드 네비게이션, 스크린리더 라벨) 기본 충족
- [ ] 디자인 파일(`board_localhub/code.html`)과 시각적 일치성 검토(색, 타이포, 여백)

참고/메모
- 디자인 HTML은 Tailwind CDN을 사용하므로 프로젝트에서 동일한 클래스들을 그대로 사용할 수 있지만, 빌드 환경을 위해 Tailwind를 설치하지 않는 한 일부 클래스(예: `container-queries`)는 동작 차이가 있을 수 있음.
- 우선 구현은 프로젝트의 existing CSS와 scoped styles로 빠르게 맞추고, 필요시 Tailwind 설치·설정(프로덕션 빌드용) 진행 권장.

다음 단계로 제가 할 일
1. `Header.vue`을 디자인에 맞춰 정리하거나
2. `Board.vue`를 디자인 템플릿 기준으로 교체(권장) — 바로 시작하겠습니다.

원하시는 다음 작업을 알려주세요: `Header` 수정 vs `Board` 전체 레이아웃 적용 (추천: `Board` 적용).

---

## Notes from `design/DESIGN.md` (to incorporate)

- Brand: "Marine Modern" — coastal, tactile, modern.
- Core tokens to apply across Board: colors (primary #00478d, secondary #2e6385, surface #f8f9fa), typography (Be Vietnam Pro headlines, Noto Sans body), spacing (8px base, 24px md), border radii (8px default, 16px cards).
- Component specifics: buttons use primary blue, inputs use subtle surface bg with 2px primary focus, cards have 16px radius and clipped images, chips are pill-shaped secondary pale blue.

Action: I'll apply these tokens when converting the `board_localhub/code.html` visual style into Vue components; the plan above already references placing cards, chips, and header controls — these should follow the token rules.
