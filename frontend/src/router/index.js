import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Rules from '../components/Rules.vue'
import axios from 'axios'
import Login from '../components/Login.vue'
import Reports from '../components/Reports.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false}
  },
  {
    path: '/rules',
    name: 'Rules',
    component: Rules,
    meta: { requiresAuth: true}
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { requiresAuth: true}
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true}
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
    meta: { requiresAuth: true}
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

async function auth() {
  var auth = false;
  try {
    const res = await axios.get(process.env.VUE_APP_BACKEND_URL + '/ct/whoami', {
      params: {only_allow_authenticated: true},
      withCredentials: true,
    })
    auth = res.status === 200
  } catch (error) {
    console.log(error)
  }
  return auth
}

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth && !await auth()) {
    return {
      path: '/login',
    }
  }
})


export default router
