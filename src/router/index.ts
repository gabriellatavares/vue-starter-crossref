import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
     {
      // Catch-all 404
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
})

// Navigation guard: strip out any query params that aren't ours
// so that /?q=...&type=...&year=... are the only accepted params.
const ALLOWED_PARAMS = new Set(['q', 'type', 'year'])

router.beforeEach((to) => {
  if (to.name !== 'search') return true

  const incoming = to.query
  const cleaned: Record<string, string> = {}
  let dirty = false

  for (const [key, value] of Object.entries(incoming)) {
    if (ALLOWED_PARAMS.has(key) && typeof value === 'string' && value.trim()) {
      cleaned[key] = value.trim()
    } else {
      dirty = true
    }
  }

  if (dirty) {
    return { name: 'home', query: cleaned, replace: true }
  }

  return true
})


export default router
