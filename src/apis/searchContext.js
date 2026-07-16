import { loadPosts } from '../utils/posts'

const DATA_FILES = [
  '부산_관광지.json',
  '부산_레포츠.json',
  '부산_문화시설.json',
  '부산_쇼핑.json',
  '부산_숙박.json',
  '부산_여행코스.json',
  '부산_축제공연행사.json'
]

function normalize(s) {
  return (s || '').toString().toLowerCase()
}

function extractKeywords(query) {
  if (!query) return []
  // remove common Korean particles and punctuation, normalize spacing
  const cleaned = (query || '')
    .toString()
    .replace(/[?.,!\(\)"'`]/g, ' ')
    .replace(/은|는|이|가|을|를|에|에서|으로|와|과|도|만|으로서/g, ' ')
    .toLowerCase()
    .trim()
  const parts = cleaned.split(/\s+/).map(p => p.trim()).filter(Boolean)
  // prefer tokens length>=2 to avoid noisy single-char matches
  const keys = parts.filter(p => p.length >= 2)
  return keys.length ? keys : parts
}

async function loadJsonFile(name) {
  const candidates = [
    `/Busan_data/${encodeURIComponent(name)}`,
    `Busan_data/${encodeURIComponent(name)}`,
    `./Busan_data/${encodeURIComponent(name)}`
  ]

  for (const path of candidates) {
    try {
      const r = await fetch(path)
      if (!r.ok) continue
      const j = await r.json()
      return Array.isArray(j) ? j : (j.items || [])
    } catch (e) {
      // try next candidate
    }
  }

  console.error('loadJsonFile error: failed to fetch any candidate paths', name, candidates)
  return []
}

export async function searchContext(query, limit = 5) {
  const keywords = extractKeywords(query)
  if (!keywords || keywords.length === 0) return []

  // detect month queries like '7월' or '07월'
  const monthMatch = (query || '').toString().match(/(\d{1,2})\s*월/)
  const monthFilter = monthMatch ? Number(monthMatch[1]) : null

  // detect family/children intent (return curated family-friendly places)
  const isFamily = /(아이|어린이|유아|가족|키즈|아동)/.test((query||''))
  // recommendation detection (includes family intent)
  const isRecommend = /(추천|추천해주|추천해줘|추천해주세요|추천해)/.test((query||''))
  const isFamilyRecommend = isFamily || isRecommend

  if (isFamilyRecommend) {
    // scoring map
    const scoreMap = {
      '과학': 10,
      '아쿠아': 10,
      '수족관': 10,
      '체험': 9,
      '키즈': 9,
      '박물관': 8,
      '동물': 8,
      '놀이': 8,
      '공원': 4,
      '해변': 5,
      '체육공원': 2,
      '기념': 0,
      '묘지': 0
    }

    const candidates = []
    const seen = new Set()
    for (const f of DATA_FILES) {
      const items = await loadJsonFile(f)
      for (const it of items) {
        const title = it.title || it.name || ''
        const addr = it.addr1 || it.address || ''
        const hay = normalize(title + ' ' + addr + ' ' + (it.overview || it.intro || ''))

        // base score from keyword matches
        let score = 0
        for (const key in scoreMap) {
          if (hay.includes(key)) score += scoreMap[key]
        }

        // slight boost if title directly matches a keyword from query
        for (const k of keywords) if ((title || '').toLowerCase().includes(k)) score += 2

        if (score > 0) {
          const id = (it.contentid || it.title || it.addr1 || '')
          if (!seen.has(id)) {
            seen.add(id)
            candidates.push({ type: 'place', title, addr, tel: it.tel || '', snippet: (it.overview || '').slice(0,120), meta: f.replace('.json',''), score })
          }
        }
      }
    }

    // sort by score desc, take top 30 then return formatted contexts (OpenAI will pick 3)
    candidates.sort((a,b)=> (b.score||0) - (a.score||0))
    if (candidates.length > 0) return formatResults(candidates.slice(0, Math.min(30, candidates.length)))
    // fallthrough if none found
  }

  // detect simple tourism recommendation queries (e.g., '해운대 관광지 추천해줘')
  const isTourRecommend = /(관광지|관광|추천)/.test((query||''))
  // choose a location token that's not a generic word
  const generic = new Set(['추천','관광지','관광','부산','축제','여행','여행코스'])
  const locationToken = keywords.find(k => !generic.has(k)) || null

  if (isTourRecommend) {
    // load tour file and return a numbered recommendation list
    try {
      const items = await loadJsonFile('부산_관광지.json')
      const matches = []
      for (const it of items) {
        const title = it.title || it.name || ''
        const addr = it.addr1 || it.address || ''
        const hay = normalize(title + ' ' + addr + ' ' + (it.overview||''))
        if (!locationToken || hay.includes(locationToken)) matches.push({ title, addr })
        if (matches.length >= limit) break
      }
      if (matches.length > 0) {
        const header = locationToken ? `${locationToken} 관광지 추천` : `관광지 추천`
        const lines = matches.map((m,i)=> `${i+1}. ${m.title}${m.addr ? ' — ' + m.addr : ''}`)
        return [ `${header}:\n${lines.join('\n')}` ]
      }
    } catch (e) { /* ignore */ }
    // fallthrough to normal search if none found
  }

  const results = []

  // search posts (localStorage)
  try {
    const posts = loadPosts() || []
    for (const p of posts) {
      const hay = normalize((p.title || '') + ' ' + (p.content || '') + ' ' + (p.category || ''))
      const matched = keywords.some(k => hay.includes(k))
      if (matched) {
        results.push({ type: 'post', title: p.title, snippet: p.content || '', meta: p.category || '' })
        if (results.length >= limit) return formatResults(results)
      }
    }
  } catch (e) {
    // ignore
  }

  // search Busan_data files
  for (const f of DATA_FILES) {
    const items = await loadJsonFile(f)
    // special handling for festival month queries: collect month matches first
    const monthMatches = []
    const otherMatches = []
    for (const it of items) {
      const title = it.title || it.name || ''
      const addr = it.addr1 || it.address || ''
      const hay = normalize(title + ' ' + addr + ' ' + (it.overview || it.intro || ''))
      const keywordMatched = keywords.some(k => hay.includes(k))

      // try to parse event start month if available
      const evStr = it.eventstartdate || it.eventstart || it.eventstart || it.modifiedtime || ''
      let evMonth = null
      if (evStr) {
        const s = evStr.toString()
        if (s.length >= 6) {
          const mm = parseInt(s.slice(4,6))
          if (!isNaN(mm) && mm >= 1 && mm <= 12) evMonth = mm
        }
      }

      const matchesMonth = monthFilter && evMonth === monthFilter

      if (monthFilter && f === '부산_축제공연행사.json') {
        // festival month query: prefer items that occur in requested month
        if (matchesMonth && (keywordMatched || true)) monthMatches.push({ type: 'place', title, addr, tel: it.tel||'', snippet: (it.overview||'').slice(0,120), meta: f.replace('.json','') })
        else if (keywordMatched) otherMatches.push({ type: 'place', title, addr, tel: it.tel||'', snippet: (it.overview||'').slice(0,120), meta: f.replace('.json','') })
      } else {
        if (keywordMatched) otherMatches.push({ type: 'place', title, addr, tel: it.tel||'', snippet: (it.overview||'').slice(0,120), meta: f.replace('.json','') })
      }
    }

    // merge monthMatches first, then otherMatches
    for (const m of monthMatches) results.push(m)
    for (const o of otherMatches) results.push(o)
  }

  // If monthFilter was requested, format as a compact festival list block
  if (monthFilter) {
    if (!results || results.length === 0) return []
    const lines = results.slice(0, limit).map((it,i)=> `${i+1}. ${it.title}${it.addr ? ' — ' + it.addr : ''}${it.tel ? ' ('+it.tel+')' : ''}`)
    return [ `${monthFilter}월 추천 축제:\n${lines.join('\n')}` ]
  }

  return formatResults(results.slice(0, limit))
}

function formatResults(items) {
  // return array of short strings to include in prompt
  return items.map(it => {
    if (it.type === 'post') return `게시글: ${it.title} / ${it.meta} / ${truncate(it.snippet,120)}`
    // place: include address, phone, coordinates when available
    const parts = []
    parts.push(`제목: ${it.title}`)
    if (it.addr) parts.push(`주소: ${it.addr}`)
    if (it.tel) parts.push(`전화: ${it.tel}`)
    if (it.mapx && it.mapy) parts.push(`좌표: ${it.mapy},${it.mapx}`)
    const body = parts.join(' / ')
    return `${it.meta}: ${body}`
  })
}

function truncate(s, n) { return s && s.length > n ? s.slice(0,n-1) + '…' : (s||'') }
