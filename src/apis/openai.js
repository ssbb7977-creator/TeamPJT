export async function chatWithOpenAI(systemPrompt, userPrompt, options = {}) {
  const model = options.model || 'gpt-5-mini'
  const temperature = typeof options.temperature === 'number' ? options.temperature : 0

  const apiKey = import.meta.env.VITE_OPENAI_KEY
  if (!apiKey) throw new Error('Missing VITE_OPENAI_KEY in environment')

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text().catch(()=> '')
    throw new Error(`OpenAI API error: ${res.status} ${res.statusText} ${text}`)
  }

  const json = await res.json()
  const choice = json.choices && json.choices[0]
  const assistant = choice && choice.message && choice.message.content
  return assistant || ''
}
