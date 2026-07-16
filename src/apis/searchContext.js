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
            const cleaned = (query || '')
              .toString()
              .replace(/[?.,!()"'`]/g, ' ')
              .replace(/은|는|이|가|을|를|에|에서|으로|와|과|도|만|으로서/g, ' ')
              .toLowerCase()
              .trim()
            const parts = cleaned.split(/\s+/).map(p => p.trim()).filter(Boolean)
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
                // try next
              }
            }
            return []
          }

          export async function searchContext(query, limit = 10) {
            if (!query) return []
            const periodPattern = /(오늘|내일|이번주|이번 주|다음주|다음 주|주말|몇 시|예약|운영기간|운영 기간|기간)/
            if (periodPattern.test(query)) return []

            const tokens = extractKeywords(query)

            const categoryMap = {
              '숙박': '부산_숙박.json','호텔': '부산_숙박.json','모텔': '부산_숙박.json','펜션': '부산_숙박.json',
              '맛집': '부산_관광지.json','음식': '부산_관광지.json','식당': '부산_관광지.json',
              '관광': '부산_관광지.json','명소': '부산_관광지.json',
              '전시': '부산_문화시설.json','박물관': '부산_문화시설.json','미술관': '부산_문화시설.json','공연': '부산_문화시설.json',
              '쇼핑': '부산_쇼핑.json','시장': '부산_쇼핑.json','아울렛': '부산_쇼핑.json',
              '축제': '부산_축제공연행사.json','행사': '부산_축제공연행사.json',
              '러닝': '부산_관광지.json','산책': '부산_관광지.json','운동': '부산_레포츠.json'
            }

            const themeTokens = ['데이트','러닝','가족','아이','키즈','체험','추천']
            let categoryFile = null
            let theme = null
            for (const t of tokens) {
              if (!categoryFile && categoryMap[t]) categoryFile = categoryMap[t]
              if (!theme && themeTokens.includes(t)) theme = t
            }

            let location = null
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

            const candidates = []
            const seen = new Set()
            for (const f of (categoryFile ? [categoryFile] : DATA_FILES)) {
              const items = await loadJsonFile(f)
              for (const it of items) {
                const title = it.title || it.name || ''
                const addr = it.addr1 || it.address || ''
                const hay = normalize(title + ' ' + addr + ' ' + (it.overview || it.intro || ''))
                let score = 0
                if (location && ((addr && normalize(addr).includes(location)) || normalize(title).includes(location))) score += 5
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

            candidates.sort((a,b)=> (b.score||0) - (a.score||0))
            if (candidates.length === 0) return []
            return formatResults(candidates.slice(0, Math.min(limit, candidates.length)))
          }
