import { defineStore } from 'pinia'
import { chatWithOpenAI } from '../apis/openai'
import { searchContext, extractEntities } from '../apis/searchContext'

const MAX_MESSAGES = 10
const STORAGE_KEY = 'localhub_chat_history_v1'

const SYSTEM_PROMPT = `너는 LocalHub 부산 관광 도우미이다.\n반드시 제공된 관광 JSON과 게시글 데이터만 이용하여 답변한다.\n없는 내용은 추측하지 말고 "관련 정보를 찾지 못했습니다." 라고 답변한다.\n모든 답변은 한국어로 작성한다.\n답변은 최대 5줄로 간결하게 작성한다.`

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [], // { role: 'user'|'assistant', text, time }
    loading: false,
    error: null
  }),
  actions: {
    initFromStorage() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return
        const arr = JSON.parse(raw)
        if (Array.isArray(arr)) this.messages = arr
      } catch (e) { console.error('initFromStorage', e) }
    },
    saveToStorage() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.messages))
      } catch (e) { console.error('saveToStorage', e) }
    },
    clearHistory() {
      this.messages = []
      this.saveToStorage()
    },
    async sendMessage(text) {
      if (!text || this.loading) return
      this.error = null
      const userMsg = { role: 'user', text, time: Date.now() }
      this.messages.push(userMsg)
      // cap
      while (this.messages.length > MAX_MESSAGES) this.messages.shift()
      this.saveToStorage()

      // quick reject: month+period queries (e.g., "7월에 열리는 축제 알려줘")
      const monthQuestion = /(1|2|3|4|5|6|7|8|9|10|11|12)\s*월/.test(text)
      const periodQuestion = /(오늘|내일|이번주|다음주|주말|언제|기간|운영기간|열리는)/.test(text)
      if (monthQuestion && periodQuestion) {
        const reply = '제공된 관광 데이터에는 축제 운영기간 정보가 없어 월별 축제은 안내할 수 없습니다.\n축제 이름이나 장소를 질문해 주세요.'
        const assistantMsg = { role: 'assistant', text: reply, time: Date.now() }
        this.messages.push(assistantMsg)
        while (this.messages.length > MAX_MESSAGES) this.messages.shift()
        this.saveToStorage()
        return
      }

      this.loading = true
      try {
        // Search local context from Busan JSON and posts
        // detect recommendation intent to use a special prompt and larger candidate set
        const isRecommend = /(추천|추천해주|추천해줘|추천해주세요|추천해)/.test(text)
        const ctxItems = await searchContext(text, isRecommend ? 30 : 5)
        const contextText = ctxItems.length ? `${ctxItems.join('\n')}` : ''

        // If no local context found, do not call OpenAI — return immediately
        if (!ctxItems || ctxItems.length === 0) {
          const reply = '관련 정보를 찾지 못했습니다.'
          const assistantMsg = { role: 'assistant', text: reply, time: Date.now() }
          this.messages.push(assistantMsg)
          while (this.messages.length > MAX_MESSAGES) this.messages.shift()
          this.saveToStorage()
          this.loading = false
          return
        }

        // extract entities and build intent header
        const entities = extractEntities(text)
        const intentLines = [
          '사용자 의도:',
          `지역 : ${entities.location || '없음'}`,
          `카테고리 : ${entities.category || '없음'}`,
          `테마 : ${entities.theme || '없음'}`
        ].join('\n')

        const combinedContext = [intentLines, contextText ? `Context:\n${contextText}` : ''].filter(Boolean).join('\n\n')

        // Debug: show what context items were found and the prompt sent to OpenAI
        try {
          console.debug('searchContext results:', ctxItems)
          console.debug('context preview:', contextText ? contextText.slice(0, 200) : '(none)')
        } catch (e) { /* ignore logging errors */ }

        let userPrompt
        if (isRecommend) {
          // determine how many to recommend based on available context items
          const count = Math.min(ctxItems.length, 3)

          // theme-based headline (if theme exists)
          const THEME_PROMPTS = {
            아이: '아이들과 가기 좋은 장소',
            데이트: '데이트하기 좋은 장소',
            러닝: '러닝하기 좋은 장소',
            사진: '사진 찍기 좋은 장소',
            가족: '가족과 가기 좋은 장소'
          }
          const theme = entities && entities.theme ? entities.theme : null
          const headline = theme && THEME_PROMPTS[theme] ? THEME_PROMPTS[theme] : '추천 장소'

          userPrompt = `${headline} 중에서 Context에 있는 장소만을 대상으로\n${count}곳만 추천하라.\n추천 이유는 한 줄로 작성하라.\nContext에 없는 장소는 절대 생성하지 마라.\n후보가 부족하면 있는 개수만 추천하라.\n'관련 정보를 찾지 못했습니다.'를 추천 목록 사이에 넣지 않는다.`
        } else {
          userPrompt = `질문: ${text}`
        }

        try {
          console.debug('messages to OpenAI:', [
            { role: 'system', content: SYSTEM_PROMPT },
            combinedContext ? { role: 'system', content: combinedContext } : null,
            { role: 'user', content: userPrompt }
          ].filter(Boolean))
        } catch (e) { /* ignore logging errors */ }

        const assistant = await chatWithOpenAI(SYSTEM_PROMPT, userPrompt, { model: 'gpt-5-mini', context: combinedContext || undefined })

        const assistantMsg = { role: 'assistant', text: assistant || '관련 정보를 찾지 못했습니다.', time: Date.now() }
        this.messages.push(assistantMsg)
        while (this.messages.length > MAX_MESSAGES) this.messages.shift()
        this.saveToStorage()
      } catch (e) {
        console.error('sendMessage error', e)
        // surface actual error message to assist debugging; user-facing UI can show generic text later
        this.error = e && e.message ? e.message : '잠시 후 다시 시도해주세요.'
      } finally {
        this.loading = false
      }
    }
  }
})
