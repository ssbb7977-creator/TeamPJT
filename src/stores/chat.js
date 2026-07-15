import { defineStore } from 'pinia'
import { chatWithOpenAI } from '../apis/openai'
import { searchContext } from '../apis/searchContext'

const STORAGE_KEY = 'localhub_chat_history_v1'
const MAX_MESSAGES = 10

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

      this.loading = true
      try {
        // Search local context from Busan JSON and posts
        const ctxItems = await searchContext(text, 5)
        const contextText = ctxItems.length ? `Context:\n${ctxItems.join('\n')}` : ''

        const userPrompt = `${contextText}\n\n질문: ${text}`

        const assistant = await chatWithOpenAI(SYSTEM_PROMPT, userPrompt, { model: 'gpt-5-mini', temperature: 0 })

        const assistantMsg = { role: 'assistant', text: assistant || '관련 정보를 찾지 못했습니다.', time: Date.now() }
        this.messages.push(assistantMsg)
        while (this.messages.length > MAX_MESSAGES) this.messages.shift()
        this.saveToStorage()
      } catch (e) {
        console.error('sendMessage error', e)
        this.error = '잠시 후 다시 시도해주세요.'
      } finally {
        this.loading = false
      }
    }
  }
})
