// router.js
import { createRouter, createWebHistory } from "vue-router";

// 定义路由
const routes = [
  {
    path: "/",
    name: "首页",
    component: () => import("../views/Index.vue"),
    meta: { title: "首页" },
  },
  {
    path: "/login",
    name: "登录",
    component: () => import("../views/user/Login.vue"),
    meta: { title: "用户登录" },
  },
  {
    path: "/home",
    name: "个人主页",
    component: () => import("../views/user/Home.vue"),
    meta: { title: "个人主页" },
  },
  {
    path: "/main",
    name: "管理系统主页",
    component: () => import("../views/miniBom/Main"),
    meta: { title: "miniBOM管理系统" },
    children: [
      {
        path: "part",
        name: "部件管理",
        component: () => import("../views/miniBom/Part/Part"),
        meta: { title: "部件管理" },
      },
      {
        path: "attribute",
        name: "属性管理",
        component: () => import("../views/miniBom/Attribute/Attribute"),
        meta: { title: "属性管理" },
      },
    ],
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
