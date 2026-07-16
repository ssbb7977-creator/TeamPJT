import { defineStore } from 'pinia'
import { chatWithOpenAI } from '../apis/openai'
import { searchContext } from '../apis/searchContext'

const MAX_MESSAGES = 10

const SYSTEM_PROMPT = `너는 LocalHub 부산 관광 도우미이다.\n반드시 제공된 관광 JSON과 게시글 데이터만 이용하여 답변한다.\n없는 내용은 추측하지 말고 "관련 정보를 찾지 못했습니다." 라고 답변한다.\n모든 답변은 한국어로 작성한다.\n답변은 최대 5줄로 간결하게 작성한다.`

export const useChatStore = defineStore('chat', {
  state: () => ({
    messages: [], // { role: 'user'|'assistant', text, time }
    loading: false,
    error: null
  }),
  actions: {
    // Persistence disabled: do not retain chat history across page refresh
    initFromStorage() {},
    saveToStorage() {},
    clearHistory() {
      this.messages = []
    },
    async sendMessage(text) {
      if (!text || this.loading) return
      this.error = null
      const userMsg = { role: 'user', text, time: Date.now() }
      this.messages.push(userMsg)
      // cap
      while (this.messages.length > MAX_MESSAGES) this.messages.shift()

      this.loading = true
      try {
        // Search local context from Busan JSON and posts
        const ctxItems = await searchContext(text, 5)
        const contextText = ctxItems.length ? `Context:\n${ctxItems.join('\n')}` : ''

        // Debug: show what context items were found and the prompt sent to OpenAI
        try {
          console.debug('searchContext results:', ctxItems)
          console.debug('context preview:', contextText ? contextText.slice(0, 200) : '(none)')
        } catch (e) { /* ignore logging errors */ }

        const userPrompt = `${contextText}\n\n질문: ${text}`

        try {
          console.debug('messages to OpenAI:', [
            { role: 'system', content: SYSTEM_PROMPT },
            contextText ? { role: 'system', content: `Context:\n${contextText}` } : null,
            { role: 'user', content: userPrompt }
          ].filter(Boolean))
        } catch (e) { /* ignore logging errors */ }

        const assistant = await chatWithOpenAI(SYSTEM_PROMPT, userPrompt, { model: 'gpt-5-mini' })

        const assistantMsg = { role: 'assistant', text: assistant || '관련 정보를 찾지 못했습니다.', time: Date.now() }
        this.messages.push(assistantMsg)
        while (this.messages.length > MAX_MESSAGES) this.messages.shift()
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
