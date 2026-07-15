import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MapView from '../views/Map.vue'
import Board from '../views/Board.vue'
import BoardDetail from '../views/BoardDetail.vue'
import BoardWrite from '../views/BoardWrite.vue'
import NotFound from '../views/NotFound.vue'
import Calender from '../views/Calender.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/map', name: 'Map', component: MapView },
  { path: '/calender', name: 'Calender', component: Calender },
  { path: '/board', name: 'Board', component: Board },
  { path: '/board/write', name: 'BoardWrite', component: BoardWrite },
  { path: '/board/:id', name: 'BoardDetail', component: BoardDetail },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
