우리가 원하는 것은

> **"현재 Home.vue를 예시 디자인처럼 리팩토링"**

입니다.

또 하나 문제는 **Header와 Footer가 Home에 포함되어 있지 않습니다.** 그래서 Copilot은 Hero만 수정하려고 합니다.

---

제가라면 아래처럼 작성합니다.

# Home UI 리디자인 계획 (LocalHub)

## 목표

`home_localhub/code.html`의 디자인을 최대한 참고하여 현재 LocalHub의 `Home.vue`를 새롭게 구성한다.

**기능은 변경하지 않는다.**

* 기존 데이터 사용
* 기존 API 사용
* 기존 Vue Router 유지
* 기존 컴포넌트 최대한 재사용

오직 UI와 레이아웃만 변경한다.

---

# 적용 범위

다음 컴포넌트까지 모두 디자인을 적용한다.

```
App.vue

 ├ Header
 ├ Home
 ├ Footer
 └ ChatBot(Floating)
```

Map, Board 화면은 수정하지 않는다.

---

# Header

예시 디자인처럼 상단 Navigation을 적용한다.

구성

```
LocalHub 로고

Home
Map
Board

검색 아이콘
```

조건

* sticky header
* 흰색 배경
* 얇은 border-bottom
* 현재 페이지 활성화 표시
* Vue Router 사용

---

# Hero Section

예시와 최대한 동일하게 구성한다.

좌측

```
지역 추천 Badge

부산을 탐험해보세요

설명

지도 탐색 버튼

커뮤니티 버튼
```

우측

```
오늘의 날씨 카드

오늘 날짜

현재 기온

최고/최저

날씨 아이콘
```

배경

* 부산 이미지
* 파란 Overlay
* Gradient 적용

---

# Main Layout

Hero 아래는

```
2 Column Layout

----------------------------

좌측 (70%)

우측 (30%)
```

---

# 좌측

### 추천 관광지

카드 형태

```
이미지

관광지 이름

주소

클릭 가능
```

최대 5개

---

### 추천 축제

카드 형태

```
축제 이미지

축제명

장소

클릭 가능
```

최대 3개

---

### 최근 게시글

간단 리스트

```
제목

작성일

댓글 수
```

최대 3개

---

# 우측 Sidebar

항상 세로 배치

```
오늘 날씨

추천 관광지

추천 축제
```

Card 형태

---

# Footer

예시 디자인과 동일한 구조

```
LocalHub

개인정보처리방침

이용약관

문의

---------------------

한국관광공사 TourAPI 데이터 사용

공공누리 라이선스 표기

Copyright
```

항상 모든 페이지 하단에 표시

---

# Floating ChatBot

오른쪽 아래 고정

조건

```
원형 버튼

클릭 시

채팅창 Open

기존 ChatBot 컴포넌트 재사용
```

---

# 디자인 규칙

전체 색상

```
Marine Blue

White

Light Gray
```

Card

```
border-radius 16px

box-shadow

hover 효과
```

Button

```
Primary

Outline
```

Spacing

```
8px Grid

24px Section Padding

1280px max-width
```

---

# 구현 원칙

반드시 지킬 것

* Header/Footer는 컴포넌트 분리
* Home.vue는 레이아웃만 담당
* 기존 데이터 구조 변경 금지
* 기존 API 변경 금지
* Vue Router 유지
* 기존 기능 삭제 금지
* 반응형 유지
* 디자인은 `home_localhub/code.html`과 최대한 유사하게 구현

---