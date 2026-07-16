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
  export async function searchContext(query, limit = 10) {
    // do not attempt search for period/time related queries
    const periodPattern = /(오늘|내일|이번주|이번 주|다음주|다음 주|주말|몇 시|예약|운영기간|운영 기간|기간)/
    if (periodPattern.test(query || '')) return []

    const tokens = extractKeywords(query)

    // category keyword -> data file mapping
    const categoryMap = {
      '숙박': '부산_숙박.json',
      '호텔': '부산_숙박.json',
      '모텔': '부산_숙박.json',
      '펜션': '부산_숙박.json',
      '맛집': '부산_관광지.json',
      '음식': '부산_관광지.json',
      '식당': '부산_관광지.json',
      '관광': '부산_관광지.json',
      '명소': '부산_관광지.json',
      '전시': '부산_문화시설.json',
      '박물관': '부산_문화시설.json',
      '미술관': '부산_문화시설.json',
      '공연': '부산_문화시설.json',
      '쇼핑': '부산_쇼핑.json',
      '시장': '부산_쇼핑.json',
      '아울렛': '부산_쇼핑.json',
      '축제': '부산_축제공연행사.json',
      '행사': '부산_축제공연행사.json',
      '러닝': '부산_관광지.json',
      '산책': '부산_관광지.json',
      '운동': '부산_레포츠.json'
    }

    // theme tokens we care about
    const themeTokens = ['데이트','러닝','가족','아이','키즈','체험','추천']

    // 1) extract category and theme from tokens
    let categoryFile = null
    let theme = null
    for (const t of tokens) {
      if (!categoryFile && categoryMap[t]) categoryFile = categoryMap[t]
      if (!theme && themeTokens.includes(t)) theme = t
    }

    // 2) extract location by scanning addresses in data files for tokens
    let location = null
    // load files and scan for address matches
    for (const f of DATA_FILES) {
      const items = await loadJsonFile(f)
      for (const it of items) {
        const addr = (it.addr1 || it.address || '').toString()
        if (!addr) continue
        const naddr = normalize(addr)
        for (const t of tokens) {
          if (t.length < 2) continue
          if (naddr.includes(t)) { location = t; break }
        }
        if (location) break
      }
      if (location) break
    }

    // 3) perform search: if categoryFile provided, search only that file, else search all
    const candidates = []
    const seen = new Set()
    for (const f of (categoryFile ? [categoryFile] : DATA_FILES)) {
      const items = await loadJsonFile(f)
      for (const it of items) {
        const title = it.title || it.name || ''
        const addr = it.addr1 || it.address || ''
        const hay = normalize(title + ' ' + addr + ' ' + (it.overview || it.intro || ''))

        // scoring: base on location match, token match, and theme
        let score = 0
        if (location && (addr && normalize(addr).includes(location) || normalize(title).includes(location))) score += 5
        for (const t of tokens) if (hay.includes(t)) score += 2
        if (theme) for (const tt of themeTokens) if (theme === tt && hay.includes(tt)) score += 3

        if (score > 0) {
          const id = it.contentid || title || addr
          if (!seen.has(id)) {
            seen.add(id)
            candidates.push({ type: 'place', title, addr, tel: it.tel||'', snippet: (it.overview||'').slice(0,120), meta: f.replace('.json',''), score })
          }
        }
      }
    }

    // sort candidates by score desc and return up to limit formatted results
    candidates.sort((a,b)=> (b.score||0) - (a.score||0))
    if (candidates.length === 0) return []
    return formatResults(candidates.slice(0, Math.min(limit, candidates.length)))
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
