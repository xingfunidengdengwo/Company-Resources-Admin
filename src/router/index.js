import { createRouter, createWebHashHistory } from "vue-router";
import api from "../api";
const islogin = async function (to, from) {
  //获取token
  let token = sessionStorage.getItem("token");
  //验证token是否有效
  let result = await api.get("/api/checktoken");

  if (!token || result.code != 200) {
    return { path: "/login" };
  }
};

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/register", component: () => import("../views/register.vue") },

    {
      path: "/home",
      component: () => import("../views/home.vue"),
      children: [
        {
          path: "/items",
          component: () => import("../views/items.vue"),
        },
        {
          path: "/itemtypes",
          component: () => import("../views/itemtypes.vue"),
        },
        {
          path: "/borrowreturn",
          component: () => import("../views/borrowreturn.vue"),
        },
        {
          path: "/unreturned",
          component: () => import("../views/unreturned.vue"),
        },
        {
          path: "/maintenance",
          component: () => import("../views/maintenance.vue"),
        },
        {
          path: "/employees",
          component: () => import("../views/employees.vue"),
        },
        {
          path: "/departments",
          component: () => import("../views/departments.vue"),
        },
        {
          path: "/operators",
          component: () => import("../views/operators.vue"),
        },
        {
          path: "/charts",
          component: () => import("../views/charts.vue"),
        },
      ],

      beforeEnter: islogin,
    },
    { path: "/login", component: () => import("../views/login.vue") },
  ],
});

export default router;
