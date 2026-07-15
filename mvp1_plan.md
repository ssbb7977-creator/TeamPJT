좋습니다. 지금은 **코딩을 시작하는 것이 아니라 "Copilot이 일을 잘할 수 있도록 프로젝트를 설계하는 단계"**입니다.

3일 프로젝트에서 가장 위험한 것은 **UI 만들다가 구조가 계속 바뀌는 것**입니다.

그래서 **MVP1 = 프로젝트 뼈대 완성**을 목표로 잡는 것을 추천합니다.

---

# Day1 목표 (MVP1)

> **"개발을 시작할 수 있는 프로젝트 골격을 완성한다."**

완성 기준

* 폴더 구조 결정
* 페이지 구성 완료
* 컴포넌트 구조 완료
* Router 연결
* JSON 구조 파악
* 데이터 타입 정의
* 지도 API 연결 확인
* OpenAI 연결 테스트
* 디자인 레퍼런스 결정

**아직 CRUD는 안 만듭니다.**

※ 게시판 CRUD 일정

- 게시판 CRUD(localStorage + 비밀번호 검증)는 **Day2** 일정으로 계획합니다. Day1에는 프로젝트 뼈대(폴더/라우터/컴포넌트 구조, 타입 정의, API 연동 테스트 등)만 완료합니다.

---

# MVP1 체크리스트

## 1. 프로젝트 세팅

### 해야 하는 것

* Vue3 생성
* Vue Router
* Pinia 설치
* axios 설치
* eslint/prettier

### 산출물

```
npm run dev

정상 실행
```

---

## 2. 폴더 구조

결정

```
src

assets

components

views

router

stores

apis

composables

utils

types
```

회의 질문

> 폴더 구조 이대로 갈까?

---

## 3. 페이지 정의

오늘 끝내기

```
Home

Map

Board

BoardDetail

BoardWrite

NotFound
```

회의 질문

> 페이지 더 필요한가?

---

## 4. Router

전부 연결

```
/

map

board

board/:id

board/write
```

---

## 5. UI Wireframe

정하기

### Home

```
Header

부산 소개

날씨

축제

추천 관광지

최근 게시글

Footer
```

---

### Map

```
Header

Category Filter

Map

Marker Detail

Footer
```

---

### Board

```
Header

검색

카테고리

글쓰기

목록
```

---

## 6. 공통 Layout

정하기

```
Header

Main

Footer

ChatBot Floating
```

모든 페이지 동일

---

## 7. Header 메뉴

결정

```
HOME

MAP

BOARD
```

---

## 8. Footer

간단

```
Copyright

Github
```

---

## 9. ChatBot 위치

결정

```
우측 하단

모든 페이지 공통
```

---

# 10. JSON 분석

가장 중요

오늘 해야 함

확인

```
contentType

title

mapx

mapy

firstimage

addr1

tel
```

회의 질문

> 필요한 데이터 더 있는가?

주의사항

- 제공 데이터만 사용: 프론트엔드는 반드시 `Busan_data` 폴더에 제공된 JSON 파일만 사용합니다. 외부 공공 API를 직접 호출하지 않습니다.


---

# 11. 카테고리 결정

확정

```
전체

관광지

문화시설

축제

레포츠

숙박

쇼핑

맛집
```

---

# 12. 지도 API

오늘 할 것

* 키 발급

* 지도 띄우기

* 부산 중심 좌표

여기까지만

마커는 내일

허용 범위

- 지도 시각화(예: Leaflet.js, Kakao Maps JS SDK)는 **허용**합니다. 다만 지도 위의 관광지/맛집 데이터는 `Busan_data`의 JSON을 사용해야 하며, 공공 API를 직접 호출해 데이터를 가져오면 안 됩니다.


---

# 13. OpenAI

오늘 할 것

.env

```
VITE_OPENAI_KEY=
```

API 호출 테스트

```
Hello

↓

응답 오는지 확인
```

챗 UI 안 만듦

---

## 환경 및 배포 규칙

- `.env` 파일: `VITE_` 접두 변수를 사용합니다 (예: `VITE_OPENAI_KEY`). `.env` 파일은 절대 Git에 커밋하지 않습니다. 프로젝트 루트의 `.gitignore`에 `.env`를 반드시 추가하세요.
- Netlify 배포: 배포 대상은 `dist` 폴더이며 빌드 명령은 `npm run build` 입니다. Netlify의 Site Settings > Environment variables 에 `VITE_OPENAI_KEY` 등 필요한 환경변수를 설정하세요.


# 14. 역할 분담

예시

A

```
Home
```

B

```
Map
```

C

```
Board
```

D

```
ChatBot
```

---

# 15. Copilot에게 줄 명세

이게 제일 중요합니다.

오늘 끝날 때

```
프로젝트 구조

페이지 구조

컴포넌트 구조

Router

데이터 구조

API 구조

공통 Layout

디자인 레퍼런스
```

까지 전부 문서화합니다.

---

# 📋 Day1 최종 To-do (우선순위)

| 우선순위 | 작업                                  | 완료 기준                            |
| ---- | ----------------------------------- | -------------------------------- |
| 🔴 1 | RFP 및 MVP 범위 확정                     | 팀 전체 동일한 이해                      |
| 🔴 2 | JSON 데이터 분석 및 카테고리 정의               | 사용할 필드와 카테고리 확정                  |
| 🔴 3 | 화면(UI) 와이어프레임 설계                    | Home / Map / Board 구조 확정         |
| 🔴 4 | 프로젝트 생성 및 개발 환경 세팅                  | Vue3, Router, Pinia, Axios 정상 실행 |
| 🔴 5 | 폴더 구조 및 Router 구성                   | 페이지 이동 가능                        |
| 🟠 6 | Kakao Map API, OpenAI API 연결 테스트    | 지도 표시 및 API 응답 확인                |
| 🟠 7 | 공통 레이아웃(Header, Footer, ChatBot) 설계 | 모든 페이지 공통 구조 완성                  |
| 🟢 8 | 역할 분담 및 Git 브랜치 전략 확정               | 개발 시작 준비 완료                      |

---

### Copilot을 잘 활용하려면

작업을 "게시판 만들어줘"처럼 크게 요청하지 말고, **컴포넌트 단위**로 나누는 것이 중요합니다.

예를 들어,

1. `AppLayout.vue` 생성
2. `Header.vue` 생성
3. `CategoryFilter.vue` 생성
4. `MapView.vue` 생성
5. `PlaceCard.vue` 생성

처럼 **한 번에 하나의 컴포넌트만 생성하도록 지시**하면 Copilot이 훨씬 정확하고 일관성 있게 코드를 작성해 줍니다. 이렇게 준비하면 Day2에는 각 컴포넌트에 기능만 붙이면 되므로 개발 속도가 크게 빨라집니다.
