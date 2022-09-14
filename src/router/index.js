import Vue from "vue";
import VueRouter from "vue-router";
import LoginView from "../views/LoginView.vue";
import DashboardView from "@/views/DashboardView";
import EditorView from "@/views/EditorView";
import ConnectView from "@/views/ConnectView";

Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
  },
  {
    path: "/editor/:id",
    name: "editor",
    component: EditorView,
  },
  {
    path: "/connect",
    name: "connect",
    component: ConnectView
  },
  {
    path: "/",
    redirect: "/dashboard",
    name: "main"
  }
];

const router = new VueRouter({
  routes,
  mode: "history",
});

router.beforeEach((to, _1, next) => {
  if (to.name.toLowerCase() === 'dashboard' || to.name.toLowerCase() === "editor" || to.name.toLowerCase() === "connect") {
    if (localStorage.getItem("auth")) {
      next();
    } else {
      next({
        path: "/login",
        replace: true
      })
    }
  } else {
    next();
  }
})

export default router;
