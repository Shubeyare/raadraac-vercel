import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/result",
    name: "result",
    component: () => import("../views/ResultView.vue"),
  },
];

// Get the base URL from the environment or use a default path that matches deployment
const base = import.meta.env.BASE_URL || '/raadraac-vercel/';

const router = createRouter({
  history: createWebHistory(base),
  routes,
});

export default router;
