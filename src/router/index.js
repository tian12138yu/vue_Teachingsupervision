import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/admin/User.vue'
import WorkList from  '../components/admin/workList'
import form from "@/components/form";
import courseList from "@/components/admin/courseList";
import myWorkList from "@/components/myWorkList";
import unclaimedWork from "@/components/unclaimedWork";
import Student from "@/components/admin/Student";
import classList from "@/components/admin/classList";
import StudentForm from "@/components/student/StudentForm";
import a404 from "@/components/a404";
import studentCourseList from "@/components/student/studentCourseList";
import NewForm from "@/components/admin/NewForm";
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    component: Login,
    meta: { hidden: true,title:"登录"}
  },
  {
    path: '*',
    component: a404,
    meta: { hidden: true,title:"页面未找到"}
  },
  {
    path: '/home',
    component: Home,
    meta: { hidden: true,title:"home"},
    redirect: '/welcome',
    children: [
      { path:'/welcome', component: Welcome,
      meta: { hidden: true,title:"欢迎页"}},
      { path:'/user', component: User,
        meta: { hidden: true,title:"用户管理"}},
      {
        path: '/workList',
        component: WorkList,
        meta: { hidden: true,title:"任务列表"}
      },
      {
        path: '/courseList',
        component: courseList,
        meta: { hidden: true,title:"课程列表"}

      },
      {
        path: '/myWorkList',
        component: myWorkList,
        meta: { hidden: true,title:"我的任务"}

      },{
      path: '/unclaimed',
        component: unclaimedWork,
        meta: { hidden: true,title:"未分配任务"}

      },{
      path: '/studentList',
        component: Student,
        meta: { hidden: true,title:"学生列表"}

      },
      {
        path: '/classList',
        component: classList,
        meta: { hidden: true,title:"班级列表"}

      },
      {
        path: '/timetable',
        component: studentCourseList,
        meta: { hidden: true,title:"我的课表"}

      },
      {
        path :'/sEvaluation',
        component: StudentForm,
        meta: { hidden: true,title:"我的评教"}

      },
      {
        path: '/newForm',
        component: NewForm
      },
    ],
  },
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:从哪里访问的路径
  // next:之后要做的任务，是一个函数
  //    next（）放行， next（'/URL'）强制跳转的路径。
  if (to.path === '/login') return next();// 访问路径为登录
  // 获取flag
  const flagStr = window.sessionStorage.getItem("flag");// session取值
  if (!flagStr) return next('/login');// 没登录去登录
  next();
})

export default router// 暴露出去
