import { loadPosts } from '../utils/posts'

// Invalid query words that require an early return
const INVALID_WORDS = [
  '오늘', '내일', '이번주', '운영기간', '예약', '몇시'
]

// Location keywords to detect in user questions
const LOCATIONS = [
  '서면', '광안리', '광안', '명지', '기장', '초량', '송정', '감천', '감천문화마을', '다대포', '해운대', '부산'
]

// Theme keywords dictionary
const THEME_KEYWORDS = {
  아이: ['공원', '체험', '과학', '아쿠아', '박물관'],
  가족: ['공원', '체험', '과학', '아쿠아', '박물관'],
  데이트: ['전망대', '야경', '해변', '공원', '문화'],
  러닝: ['공원', '체육공원', '생태공원', '산책', '해변', '레포츠'],
  산책: ['공원', '생태공원', '해변'],
  사진: ['전망대', '야경', '해변', '벽화', '문화'],
  힐링: ['공원', '숲', '해변', '생태'],
  쇼핑: ['시장', '쇼핑', '아울렛'],
  체험: ['체험', '박물관', '과학', '공방']
}

// theme synonyms for extraction
const THEME_SYNS = {
  아이: ['아이', '어린이', '유아', '키즈', '아이들'],
  가족: ['가족'],
  데이트: ['데이트', '커플'],
  러닝: ['러닝', '조깅', '달리기'],
  산책: ['산책'],
  사진: ['사진', '포토', '찍'],
  힐링: ['힐링', '휴식'],
  쇼핑: ['쇼핑', '시장', '아울렛'],
  체험: ['체험', '체험장']
}

// category keyword map (user-provided)
const CATEGORY_MAP = {
  숙박: ['숙소', '호텔', '모텔', '펜션'],
  음식점: ['맛집', '밥', '국밥', '식당'],
  관광지: ['관광', '명소', '가볼만'],
  문화시설: ['박물관', '미술관', '전시'],
  축제공연행사: ['축제', '행사'],
  쇼핑: ['시장', '쇼핑', '아울렛'],
  레포츠: ['러닝', '산책', '운동']
}

// Map category keys to actual data file names in the repo
const DATA_FILES = {
  관광지: '/Busan_data/부산_관광지.json',
  레포츠: '/Busan_data/부산_레포츠.json',
  문화시설: '/Busan_data/부산_문화시설.json',
  쇼핑: '/Busan_data/부산_쇼핑.json',
  숙박: '/Busan_data/부산_숙박.json',
  여행코스: '/Busan_data/부산_여행코스.json',
  축제공연행사: '/Busan_data/부산_축제공연행사.json'
}

let _cache = null

async function loadAllData() {
  if (_cache) return _cache
  const items = []
  await Promise.all(Object.entries(DATA_FILES).map(async ([key, p]) => {
    try {
      const res = await fetch(p)
      if (!res.ok) return
      const json = await res.json()
      const list = Array.isArray(json.items) ? json.items : (Array.isArray(json) ? json : [])
      list.forEach(i => items.push({ ...i, __source: key }))
    } catch (e) {
      // ignore individual file errors
    }
  }))
  _cache = items
  return items
}

function detectLocation(question) {
  const q = (question || '').toLowerCase()
  for (const loc of LOCATIONS) {
    if (q.includes(loc.toLowerCase())) return loc
  }
  return null
}

function detectCategory(question) {
  const q = (question || '').toLowerCase()
  for (const [cat, syns] of Object.entries(CATEGORY_MAP)) {
    for (const s of syns) {
      if (q.includes(s)) return cat
    }
  }
  return null
}

function extractTheme(question) {
  if (!question) return null
  const q = question.toLowerCase()
  for (const [theme, syns] of Object.entries(THEME_SYNS)) {
    for (const s of syns) {
      if (q.includes(s)) return theme
    }
  }
  return null
}

export function extractEntities(question) {
  if (!question) return { location: null, category: null, theme: null, keywords: [] }
  const location = detectLocation(question)
  const category = detectCategory(question)
  const theme = extractTheme(question)

  // keywords: split by non-letter/number and filter short words
  const q = question.toLowerCase()
  const keywords = q.split(/[^\p{L}0-9]+/u).map(s => s.trim()).filter(s => s && s.length > 1)

  return { location, category, theme, keywords }
}

function scoreText(text, keywords) {
  if (!text || !keywords || keywords.length === 0) return 0
  const hay = text.toLowerCase()
  let score = 0
  for (const k of keywords) if (hay.includes(k)) score += 1
  return score
}

async function loadDataForCategory(catKey) {
  // if category maps to an exact file, load only that file
  const filePath = DATA_FILES[catKey]
  if (filePath) {
    try {
      const res = await fetch(filePath)
      if (!res.ok) return []
      const json = await res.json()
      return Array.isArray(json.items) ? json.items : (Array.isArray(json) ? json : [])
    } catch (e) { return [] }
  }
  // fallback: load all data
  return await loadAllData()
}

async function searchData(entity, limit = 10) {
  const posts = (await Promise.resolve(loadPosts())) || []

  const allItems = await loadAllData()

  // start with all items and filter down
  let candidates = allItems.slice()

  const loc = entity.location ? entity.location.toLowerCase() : null
  const cat = entity.category || null
  const theme = entity.theme || null
  // prefer strict theme filter list if available
  const themeWords = theme && THEME_FILTER[theme] ? THEME_FILTER[theme].map(s => s.toLowerCase()) : (theme && THEME_KEYWORDS[theme] ? THEME_KEYWORDS[theme].map(s => s.toLowerCase()) : [])

  const overviewField = (it) => (it.overview || it.intro || it.content || it.description || '')

  // 1) filter by location if provided
  if (loc) {
    candidates = candidates.filter(it => {
      const title = (it.title || it.name || '').toLowerCase()
      const addr = (it.addr1 || it.addr || '').toLowerCase()
      return addr.includes(loc) || title.includes(loc)
    })
  }

  // 2) filter by category if provided and we have a direct data file mapping
  if (cat && DATA_FILES[cat]) {
    candidates = candidates.filter(it => it.__source === cat)
  }

  // 3) filter by theme keywords within the current candidates
  if (theme && themeWords.length > 0) {
    candidates = candidates.filter(it => {
      const title = (it.title || it.name || '').toLowerCase()
      const addr = (it.addr1 || it.addr || '').toLowerCase()
      const overview = (overviewField(it) || '').toLowerCase()
      return themeWords.some(w => title.includes(w) || addr.includes(w) || overview.includes(w))
    })
  }

  // If too few candidates, relax constraints in order: remove theme filter, then category filter
  // Keep location filter if provided
  if (candidates.length < 3 && theme) {
    // try without theme
    let relaxed = allItems.slice()
    if (loc) relaxed = relaxed.filter(it => {
      const title = (it.title || it.name || '').toLowerCase()
      const addr = (it.addr1 || it.addr || '').toLowerCase()
      return addr.includes(loc) || title.includes(loc)
    })
    if (cat && DATA_FILES[cat]) relaxed = relaxed.filter(it => it.__source === cat)
    candidates = relaxed
  }

  if (candidates.length < 3 && cat && DATA_FILES[cat]) {
    // try category across all data (ignore theme and location)
    let catItems = allItems.filter(it => it.__source === cat)
    // if location provided, prefer location-matching within category
    if (loc) {
      const locCat = catItems.filter(it => {
        const title = (it.title || it.name || '').toLowerCase()
        const addr = (it.addr1 || it.addr || '').toLowerCase()
        return addr.includes(loc) || title.includes(loc)
      })
      candidates = candidates.concat(locCat.filter(it => !candidates.includes(it)))
    }
    candidates = candidates.concat(catItems.filter(it => !candidates.includes(it)))
  }

  // Final fallback: if still too few and location was provided, include any location matches across data
  if (candidates.length < 3 && loc) {
    const locAll = allItems.filter(it => {
      const title = (it.title || it.name || '').toLowerCase()
      const addr = (it.addr1 || it.addr || '').toLowerCase()
      return addr.includes(loc) || title.includes(loc)
    })
    candidates = candidates.concat(locAll.filter(it => !candidates.includes(it)))
  }

  // Deduplicate by title+addr and prepare results
  const seen = new Set()
  const results = []
  for (const it of candidates) {
    const key = `${(it.title || it.name || '')}||${(it.addr1 || it.addr || '')}`
    if (seen.has(key)) continue
    seen.add(key)
    // compute score (for ordering) similar to earlier but not required to filter
    let score = 0
    const title = (it.title || it.name || '').toLowerCase()
    const addr = (it.addr1 || it.addr || '').toLowerCase()
    const overview = (overviewField(it) || '').toLowerCase()
    if (loc && addr.includes(loc)) score += 50
    if (cat && it.__source === cat) score += 30
    if (themeWords.length > 0) {
      if (themeWords.some(k => title.includes(k))) score += 20
      if (themeWords.some(k => addr.includes(k))) score += 20
      if (themeWords.some(k => overview.includes(k))) score += 10
    }
    if (score <= 0) score = 1 // minimal score to keep ordering among candidates
    results.push({ type: 'place', title: it.title || it.name || '', addr: it.addr1 || it.addr || '', tel: it.tel || '', score, raw: it })
    if (results.length >= Math.min(limit, 10)) break
  }

  // sort by score desc
  results.sort((a, b) => (b.score || 0) - (a.score || 0))
  return results.slice(0, Math.min(limit, 10))
}

function formatResults(results, limit = 5) {
  if (!results || results.length === 0) return []
  const out = []
  for (const r of results.slice(0, limit)) {
    if (r.type === 'place') {
      const lines = []
      lines.push(`제목:`)
      lines.push(r.title || '')
      lines.push(`주소:`)
      lines.push(r.addr || '')
      lines.push(`전화:`)
      lines.push(r.tel || '')
      out.push(lines.join('\n'))
    } else if (r.type === 'post') {
      const lines = []
      lines.push(`POST 제목:`)
      lines.push(r.title || '')
      lines.push(`요약:`)
      lines.push(String(r.content || '').slice(0, 160))
      out.push(lines.join('\n'))
    }
  }
  return out
}

export async function searchContext(question, limit = 5) {
  try {
    if (!question) return []

    // early invalid-word check
    const qlow = question.toLowerCase()
    if (INVALID_WORDS.some(w => qlow.includes(w))) {
      return ['제공된 데이터에는 운영기간 정보가 없습니다.']
    }

    const entity = extractEntities(question)
    const results = await searchData(entity, Math.max(limit, 10))
    return formatResults(results, limit)
  } catch (e) {
    console.error('searchContext error', e)
    return []
  }
}

// Strict theme filter: only items containing these tokens will be kept when theme is present
const THEME_FILTER = {
  러닝: ['공원', '산책', '둘레길', '해변', '해안', '트레킹', '걷기', '레포츠', '자전거'],
  아이: ['과학', '체험', '아쿠아', '공원', '박물관', '키즈'],
  데이트: ['전망대', '해변', '카페', '야경', '문화', '공원'],
  쇼핑: ['시장', '아울렛', '백화점'],
  사진: ['전망대', '야경', '해변', '벽화', '문화']
}