import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ProsmotrView from './views/ProsmotrView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/prosmotr',
    name: 'prosmotr',
    component: ProsmotrView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
