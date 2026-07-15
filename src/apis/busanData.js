// Loader for Busan_data JSON files by category
const fileMap = {
  tour: '/Busan_data/부산_관광지.json',
  culture: '/Busan_data/부산_문화시설.json',
  festival: '/Busan_data/부산_축제공연행사.json',
  sports: '/Busan_data/부산_레포츠.json',
  stay: '/Busan_data/부산_숙박.json',
  shopping: '/Busan_data/부산_쇼핑.json',
  // Note: 'food' (맛집) 데이터 file not present in repo and therefore omitted
}

async function fetchFile(path) {
  try {
    const resp = await fetch(path)
    return await resp.json()
  } catch (e) {
    console.error('Failed to fetch', path, e)
    return null
  }
}

export async function loadPlaces(category = 'all') {
  if (category === 'all') {
    // load all known files and merge items arrays
    const paths = Object.values(fileMap)
    const results = await Promise.all(paths.map(p => fetchFile(p)))
    const merged = []
    for (const r of results) {
      if (!r) continue
      if (Array.isArray(r)) merged.push(...r)
      else if (r.items) merged.push(...(r.items))
      else if (r.response && r.response.body && r.response.body.items) {
        const items = r.response.body.items
        merged.push(...(Array.isArray(items) ? items : (items.item || [])))
      }
    }
    return merged
  }

  const path = fileMap[category] || fileMap['tour']
  const r = await fetchFile(path)
  if (!r) return []
  if (Array.isArray(r)) return r
  if (r.items) return r.items
  if (r.response && r.response.body && r.response.body.items) {
    const items = r.response.body.items
    return Array.isArray(items) ? items : (items.item || [])
  }
  return []
}
