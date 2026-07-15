요구사항을 모두 반영한 구현 계획(단계별, 파일 위치, 동작 규칙)을 정리했습니다. 요약만 간단히 드립니다.

핵심 요약 (필수 규칙 반영)

모델: gpt-5-mini (단일 모델, 옵션 없음)
temperature: 모델에서 변경을 지원하지 않음 — 요청에 `temperature` 필드를 보내지 마세요.
No streaming, no exponential backoff retry, no response caching
localStorage: 채팅 히스토리만 저장(key: localhub_chat_history_v1), 최근 10개 유지
반드시 JSON 검색(관광/축제/게시글) → 관련 컨텍스트만 OpenAI에 전달 (간단한 RAG)
System prompt: 반드시 포함(한글, 데이터 한정, 5줄 이내)
UI: 최소 요소만 (대화 리스트, 입력창, 전송, 로딩, 에러, 기록 삭제)
권장 파일/함수 (구현할 때 만들 위치)

src/apis/openai.js
export async function chatWithOpenAI(contextMessages, userQuestion) { ... }
uses import.meta.env.VITE_OPENAI_KEY, model gpt-5-mini, temperature 0
no streaming, simple fetch, on error return friendly error
src/apis/searchContext.js
export function searchContext(query) { search Busan JSON files + posts, return short array of relevant items (strings) }
Limit to small token budget (e.g., top 5 matches)
src/stores/chat.js (Pinia)
state: messages[], loading, error
actions:
initFromStorage()
sendMessage(text): push user msg, call searchContext, build prompt (system + context + user), call chatWithOpenAI, push assistant msg, persist (cap to 10)
clearHistory()
ChatBotFloating.vue / ChatWindow.vue
UI binds to store, calls sendMessage, shows loading/error, shows delete history
Prompt template (conceptual)

System: "너는 LocalHub 부산 관광 도우미이다. 반드시 제공된 관광 JSON과 게시글 데이터만 이용하여 답변한다. 없는 내용은 추측하지 말고 '관련 정보를 찾지 못했습니다.'라고 답변한다. 모든 답변은 한국어로, 최대 5줄로 간결하게 작성한다."
Then: "Context: [searchContext results joined]" + "User: <question>"
LocalStorage rules

key: localhub_chat_history_v1
store array of up to 10 message objects { role:'user'|'assistant', text, time }
On push, if length>10, shift oldest
Error handling UX

On API error: show "잠시 후 다시 시도해주세요." (no retries)
On rate-limit or quota: show message advising user
Security note (README)

Keep .env with VITE_OPENAI_KEY, warn that Vite exposes client key — use usage limits and low billing cap. Recommend proxy for production.
Next steps (pick one)

(A) I implement the files and wire the chat (I will create src/apis/openai.js, src/apis/searchContext.js, src/stores/chat.js, and update ChatBotFloating.vue).
(B) I generate scaffolding only (no UI changes), so you can review.
(C) Stop — you’ll implement.
어떤 걸 진행할까요? (A/B/C)