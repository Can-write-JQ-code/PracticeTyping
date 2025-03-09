import { createRouter, createWebHistory } from 'vue-router'

// 导入组件
const Auth = () => import('../components/Auth.vue')
const ModeSelector = () => import('../components/ModeSelector.vue')
const TypingPractice = () => import('../components/TypingPractice.vue')
const Results = () => import('../components/Results.vue')
const FileUpload = () => import('../components/FileUpload.vue')

const routes = [
  {
    path: '/',
    redirect: '/auth'
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path: '/mode-selector',
    name: 'ModeSelector',
    component: ModeSelector
  },
  {
    path: '/typing-practice',
    name: 'TypingPractice',
    component: TypingPractice
  },
  {
    path: '/results',
    name: 'Results',
    component: Results
  },
  {
    path: '/file-upload',
    name: 'FileUpload',
    component: FileUpload
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router