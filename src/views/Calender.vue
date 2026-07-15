<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">캘린더</h1>
    <div class="mb-4 flex items-center justify-between">
      <button @click="prevMonth" class="px-3 py-1 bg-gray-200 rounded">이전</button>
      <div class="text-lg font-medium">{{ year }}년 {{ month + 1 }}월</div>
      <button @click="nextMonth" class="px-3 py-1 bg-gray-200 rounded">다음</button>
    </div>

    <div class="grid grid-cols-7 gap-2 text-center">
      <div class="font-medium">일</div>
      <div class="font-medium">월</div>
      <div class="font-medium">화</div>
      <div class="font-medium">수</div>
      <div class="font-medium">목</div>
      <div class="font-medium">금</div>
      <div class="font-medium">토</div>

      <template v-for="(day, idx) in blanks" :key="'b'+idx">
        <div></div>
      </template>

      <template v-for="d in daysInMonth" :key="d">
        <div class="p-2 border rounded text-left">
          <div class="flex items-start justify-between">
            <div class="font-medium">{{ d }}</div>
          </div>
          <div class="mt-2 space-y-1">
            <template v-if="festivalMap[dayKey(d)]">
              <div v-for="(f, i) in festivalMap[dayKey(d)].slice(0,3)" :key="f.id" class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">
                {{ f.title }}
              </div>
            </template>
          </div>
        </div>
      </template>
    </div>
    
    <div class="mt-6 max-w-3xl mx-auto">
      <h2 class="text-xl font-semibold mb-3">{{ year }}년 {{ month + 1 }}월 축제 목록 ({{ monthFestivals.length }})</h2>
      <div v-if="monthFestivals.length === 0" class="text-sm text-gray-600">해당 월에 등록된 축제가 없습니다.</div>
      <ul v-else class="space-y-2">
        <li v-for="f in monthFestivals" :key="f.id" class="p-3 border rounded hover:shadow">
          <div class="font-medium">{{ f.title }}</div>
          <div class="text-sm text-gray-600">{{ f.addr }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import festivalsData from '../../Busan_data/부산_축제공연행사.json'

function parseYMD(yyyymmddhhmmss) {
  if (!yyyymmddhhmmss) return null
  const s = String(yyyymmddhhmmss)
  const y = parseInt(s.slice(0, 4))
  const m = parseInt(s.slice(4, 6))
  const d = parseInt(s.slice(6, 8))
  return { y, m, d }
}

export default {
  name: 'Calender',
  data() {
    const today = new Date()
    return {
      year: today.getFullYear(),
      month: today.getMonth(),
      festivalMap: {}
    }
  },
  created() {
    // Build a map of festivals keyed by YYYY-M-D using `createdtime` as the event date.
    const items = (festivalsData && festivalsData.items) || []
    const map = {}
    items.forEach(it => {
      const p = parseYMD(it.createdtime)
      if (!p) return
      const key = `${p.y}-${p.m}-${p.d}`
      if (!map[key]) map[key] = []
      map[key].push({ title: it.title, id: it.contentid })
    })
    this.festivalMap = map
  },
  computed: {
    daysInMonth() {
      const d = new Date(this.year, this.month + 1, 0).getDate()
      return Array.from({ length: d }, (_, i) => i + 1)
    },
    blanks() {
      const first = new Date(this.year, this.month, 1).getDay()
      return Array.from({ length: first })
    }
    ,
    monthFestivals() {
      const items = (festivalsData && festivalsData.items) || []
      const y = this.year
      const m = this.month + 1
      return items
        .map(it => {
          const p = parseYMD(it.createdtime)
          return p && p.y === y && p.m === m ? { title: it.title, id: it.contentid, addr: it.addr1 } : null
        })
        .filter(Boolean)
    }
  },
  methods: {
    prevMonth() {
      if (this.month === 0) {
        this.month = 11
        this.year -= 1
      } else this.month -= 1
    },
    nextMonth() {
      if (this.month === 11) {
        this.month = 0
        this.year += 1
      } else this.month += 1
    },
    dayKey(d) {
      return `${this.year}-${this.month + 1}-${d}`
    }
  }
}
</script>

<style scoped>
/* basic spacing handled by Tailwind; add any custom styles here if needed */
</style>
