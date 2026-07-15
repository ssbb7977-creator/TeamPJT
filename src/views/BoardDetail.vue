<template>
  <div class="board-detail">
    <div v-if="!post">게시글을 찾을 수 없습니다.</div>

    <div v-else>
      <div class="bg-white rounded-xl shadow-md overflow-hidden border">
        <div class="h-48 bg-slate-200 flex items-end p-4">
          <h1 class="text-2xl font-bold text-white drop-shadow">{{ post.title }}</h1>
        </div>
        <div class="p-6">
          <div class="meta text-sm text-slate-600 mb-4">{{ formatTimestamp(post.createdAt) }} · {{ post.category }}</div>

          <div v-if="!editing" class="content text-base text-slate-800">
            <p style="white-space:pre-wrap">{{ post.content }}</p>
          </div>

          <div v-else class="edit-form">
            <div class="mb-3"><label class="block text-sm font-medium mb-2">제목</label><input v-model="form.title" class="w-full border rounded px-3 py-2" /></div>
            <div class="mb-3"><label class="block text-sm font-medium mb-2">카테고리</label><input v-model="form.category" class="w-64 border rounded px-3 py-2" /></div>
            <div class="mb-3"><label class="block text-sm font-medium mb-2">내용</label><textarea v-model="form.content" rows="6" class="w-full border rounded px-3 py-2"></textarea></div>
          </div>

          <div class="actions flex gap-3 mt-4">
            <button v-if="!editing" @click="startEdit" class="px-4 py-2 bg-primary text-white rounded">수정</button>
            <button v-if="editing" @click="saveEdit" class="px-4 py-2 bg-primary text-white rounded">저장</button>
            <button v-if="editing" @click="cancelEdit" class="px-4 py-2 border rounded">취소</button>
            <button @click="confirmDelete" class="px-4 py-2 bg-red-600 text-white rounded">삭제</button>
            <router-link to="/board" class="px-4 py-2 text-slate-600">목록</router-link>
          </div>
        </div>
      </div>

      <div v-if="showPassword" class="pwd-modal">
        <div class="box">
          <label>비밀번호를 입력하세요</label>
          <input v-model="pwd" type="password" />
          <div class="buttons">
            <button @click="pendingAction === 'edit' ? verifyForEdit() : verifyForDelete()">확인</button>
            <button @click="closePwd">취소</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPost, updatePost, deletePost } from '../utils/posts'

export default {
  data() {
    return { post: null, editing: false, form: {}, showPassword: false, pwd: '', pendingAction: null }
  },
  mounted() {
    const id = this.$route.params.id
    this.post = getPost(id)
  },
  methods: {
    formatTimestamp(ts) {
      if (!ts) return ''
      const d = new Date(ts)
      return isNaN(d.getTime()) ? '' : d.toLocaleString()
    },
    startEdit() {
      this.form = { title: this.post.title, content: this.post.content, category: this.post.category }
      this.pendingAction = 'edit'
      this.showPassword = true
    },
    verifyForEdit() {
      if (this.pwd === (this.post.password || '')) {
        this.showPassword = false
        this.editing = true
        this.pwd = ''
      } else alert('비밀번호가 틀립니다')
    },
    saveEdit() {
      updatePost(this.post.id, { title: this.form.title, content: this.form.content, category: this.form.category })
      this.post = getPost(this.post.id)
      this.editing = false
    },
    cancelEdit() { this.editing = false },
    confirmDelete() {
      this.pendingAction = 'delete'
      this.showPassword = true
    },
    closePwd() { this.showPassword = false; this.pwd = '' },
    verifyForDelete() {
      if (this.pwd === (this.post.password || '')) {
        deletePost(this.post.id)
        this.$router.push('/board')
      } else alert('비밀번호가 틀립니다')
    }
  },
  watch: {
    // handle confirm modal actions
    pendingAction(val) {
      // noop
    },
    showPassword(val) {
      if (!val && this.pendingAction === 'delete' && this.pwd) {
        // if modal closed via verify (not cancel) do delete
      }
    }
  }
}
</script>

<style scoped>
.board-detail { max-width:900px; margin:0 auto }
.meta { color:#475569 }
.pwd-modal { position:fixed; left:0; right:0; top:0; bottom:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.4) }
.pwd-modal .box { background:#fff; padding:16px; border-radius:8px }
.buttons { display:flex; gap:8px; margin-top:8px }
</style>
