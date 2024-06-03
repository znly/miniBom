// router.js
import { createRouter, createWebHistory } from "vue-router";

// 定义路由
const routes = [
  {
    path: "/",
    name: "主页",
    component: () => import("../views/Main.vue"),
    meta: { title: "主页" },
  },
  {
    path: "/login",
    name: "登录",
    component: () => import("../views/user/Login.vue"),
    meta: { title: "用户登录" },
  },
  //404页面捕获
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    meta: { title: "错误" },
    component: () => import("../views/404.vue"),
  },
];

// 创建router实例
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

//全局后置路由，配置每个页面的标题
router.afterEach((to, from) => {
  let title = to.meta.title;
  if (title == null) {
    title = "miniBOM";
  }
  document.title = title;
});

export default router;
