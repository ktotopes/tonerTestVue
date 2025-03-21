import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Callback from '../views/Callback.vue';
import AuthService from '../auth/service.js';
import Home from '../views/Home.vue';

const routes = [
  { path: '/', component: Home , meta: { requiresAuth: true } },
  { path: '/login', component: Login },
  { path: '/callback', component: Callback }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !AuthService.state.accessToken) {
    return '/login';
  }
});

export default router;
