# 구현 체크리스트 — 필수제약 대비

아래는 `필수제약.md` 기준으로 현재 구현 상태를 점검한 체크리스트입니다.

- **데이터**
  - [x] 제공된 JSON 파일을 프론트엔드에서 직접 사용 (`/public/Busan_data/*.json`, `src/apis/busanData.js`, `src/apis/searchContext.js`)
  - [x] 부산 관련 데이터에 대해 공공 API 직접 호출하지 않음 (프로젝트 내 파일 사용)
  - [x] 선택적 API(날씨 등)는 별도 파일로 분리되어 있음

- **커뮤니티(게시판)**
  - [x] 익명 게시판 구현 (`src/views/Board.vue`, `src/views/BoardWrite.vue`, `src/views/BoardDetail.vue`)
  - [x] 게시글 CRUD 구현 (로컬 처리)
  - [x] 게시글 저장: `localStorage` 기반 (`src/utils/posts.js`)
  - [x] 수정/삭제는 비밀번호 검증으로 처리 (비밀번호 확인 모달 존재)

- **챗봇 (OpenAI)**
  - [x] OpenAI 호출 구현 (`src/apis/openai.js`) — `VITE_OPENAI_KEY` 사용
  - [x] 채팅 플로팅 UI 구현 (`src/components/ChatBotFloating.vue`)
  - [x] RAG 스타일로 `searchContext()` 결과를 System/User 메시지에 포함하여 전송
  - [ ] 채팅 히스토리 영속성: **현재 비활성화** (요청에 따라 새로고침 시 기록 삭제하도록 변경됨) — 필수제약은 "채팅 히스토리 유지"이나 현재 구현은 비활성화 상태 (요구와 불일치)
  - [x] 환경변수 사용: `import.meta.env.VITE_OPENAI_KEY` 참조됨
  - [x] `temperature` 전송 제거(모델 제약 대응)

- **프론트엔드(구조/기능)**
  - [x] Vue 3 + Vite SPA 구조
  - [x] 라우터 기반 SPA(페이지 이동 시 전체 새로고침 없음)
  - [x] 컴포넌트 기반 구현 (헤더, 푸터, PlaceCard 등)
  - [x] 반응형/모바일 대응 UI (기본 레이아웃 및 챗봇 플로팅)

- **맵/검색/추천 관련**
  - [x] `searchContext()` 구현 — 키워드 추출, 문장조사 제거, 키워드 매칭
  - [x] 추천용 후보 선정 및 점수화(가족/키즈 의도 감지, scoreMap 적용)
  - [x] 추천 전용 프롬프트 분기 처리 (`src/stores/chat.js`) — OpenAI에 "후보 중에서 3개 추천" 지시
  - [x] 위치 기반 거리 계산 및 거리순 정렬 (`src/views/Map.vue`) — Haversine 사용, 최초 1회 위치 요청, 거리 표시 형식(m/ km)

- **보안/배포 제약**
  - [x] `.env` 파일은 Git에 커밋되지 않음 (현재 로컬에 존재하지만 추적되지 않음)
  - [ ] Netlify 배포: 아직 배포 확인 필요 (배포 스크립트/설정 미확인)
  - [x] OpenAI 키는 VITE_ 환경변수로 참조하도록 구현

- **개발 규칙/제약 준수**
  - [x] 컴포넌트 재사용 및 구조화(대부분 준수)
  - [x] 라우터 기반 SPA 유지
  - [x] 불필요한 서버/DB 구성 없음

---

# 우선적으로 처리할 미구현 혹은 개선 권장 항목
1. 챗봇 채팅 히스토리 영속성 재검토 — `필수제약.md`는 "채팅 히스토리 유지"를 요구합니다. (현재 새로고침 시 삭제하도록 변경됨)
2. Netlify 배포 설정 및 검증(빌드/환경변수 처리 등)
3. 추천 후보 scoreMap 튜닝 — 실제 사용자 테스트 기반으로 키워드 가중치 조정 권장
4. 비밀번호/민감정보 관련: `.env`를 절대 Git에 커밋하지 않도록 `.gitignore` 재확인
5. (선택) 추천 결과를 카드로 렌더링하도록 프론트엔드에서 파싱/표시 — 현재는 OpenAI 텍스트 응답을 그대로 보여줌

원하시면 위 우선순위 항목 중 어떤 것을 먼저 처리할지 알려주시면 제가 바로 진행하겠습니다.
