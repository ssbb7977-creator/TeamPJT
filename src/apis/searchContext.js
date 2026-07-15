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
  const q = normalize(query)
  if (!q) return []

  const results = []

  // search posts (localStorage)
  try {
    const posts = loadPosts() || []
    for (const p of posts) {
      const hay = (normalize(p.title) + ' ' + normalize(p.content) + ' ' + normalize(p.category))
      if (hay.includes(q)) {
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
    for (const it of items) {
      const title = it.title || it.name || ''
      const addr = it.addr1 || it.address || ''
      const hay = normalize(title) + ' ' + normalize(addr) + ' ' + normalize(it.overview || it.intro || '')
      if (hay.includes(q)) {
        results.push({ type: 'place', title: title, snippet: addr || (it.overview||'').slice(0,120), meta: f.replace('.json','') })
        if (results.length >= limit) return formatResults(results)
      }
    }
  }

  return formatResults(results.slice(0, limit))
}

function formatResults(items) {
  // return array of short strings to include in prompt
  return items.map(it => {
    if (it.type === 'post') return `게시글: ${it.title} / ${it.meta} / ${truncate(it.snippet,120)}`
    return `${it.meta}: ${it.title} / ${truncate(it.snippet,120)}`
  })
}

function truncate(s, n) { return s && s.length > n ? s.slice(0,n-1) + '…' : (s||'') }
