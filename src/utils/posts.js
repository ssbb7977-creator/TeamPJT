const STORAGE_KEY = 'localhub_posts_v1'

function loadPosts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch (e) {
    console.error('Failed to load posts', e)
    return []
  }
}

function savePosts(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
  } catch (e) {
    console.error('Failed to save posts', e)
  }
}

function addPost(post) {
  const posts = loadPosts()
  posts.unshift(post)
  savePosts(posts)
}

function getPost(id) {
  const posts = loadPosts()
  return posts.find(p => p.id === id)
}

function updatePost(id, patch) {
  const posts = loadPosts()
  const idx = posts.findIndex(p => p.id === id)
  if (idx === -1) return false
  posts[idx] = { ...posts[idx], ...patch }
  savePosts(posts)
  return true
}

function deletePost(id) {
  const posts = loadPosts()
  const filtered = posts.filter(p => p.id !== id)
  savePosts(filtered)
}

function seedExample() {
  const existing = loadPosts()
  if (existing && existing.length > 0) return
  const now = Date.now()
  const examples = [
    {
      id: 'p-' + (now + 1),
      title: '광안리 야경 추천! 🌉',
      content: '저녁에 다녀왔는데 분위기가 정말 좋았습니다.',
      password: 'pass1',
      category: '추천',
      createdAt: now
    },
    {
      id: 'p-' + (now + 2),
      title: '부산 맛집 후기 🍜',
      content: '국제시장 근처 돼지국밥 맛집 추천드립니다.',
      password: 'pass2',
      category: '맛집',
      createdAt: now + 1
    },
    {
      id: 'p-' + (now + 3),
      title: '해운대 축제 다녀왔어요! 🎉',
      content: '이번 주말 공연도 있으니 방문 예정이라면 참고하세요.',
      password: 'pass3',
      category: '축제',
      createdAt: now + 2
    }
  ]
  savePosts(examples)
}

export { loadPosts, savePosts, addPost, getPost, updatePost, deletePost, seedExample }
