import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'
// 页面加载进度
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 配置process
NProgress.configure({
  // 关闭圆形加载进度
  showSpinner: false
})
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: () => import('@/views/Login/index.vue'),
      meta: { title: '登录' }
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: () => import('@/views/Consult/ConsultDep.vue'),
      meta: { title: '选择科室' }
    },
    {
      path: '/',
      component: () => import('@/views/Layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: () => import('@/views/Home/index.vue'),
          meta: { title: '首页' }
        },
        {
          path: '/article',
          component: () => import('@/views/Article/index.vue'),
          meta: { title: '健康百科' }
        },
        {
          path: '/notify',
          component: () => import('@/views/Notify/index.vue'),
          meta: { title: '消息通知' }
        },
        {
          path: '/user',
          component: () => import('@/views/User/index.vue'),
          meta: { title: '个人中心' }
        }
      ]
    }
  ]
})
router.beforeEach((to) => {
  // 页面加载进度开启
  NProgress.start()

  // token判断
  const state = useUserStore()
  const token = state.user?.token
  //  不需要登录页面
  const whiteList = ['/login', '/register']
  //  如果没有token，并且不在白名单中，跳转到登录页面
  if (!token && !whiteList.includes(to.path)) {
    return '/login'
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || ''}-省心问诊`
  // 页面加载进度关闭
  NProgress.done()
})

export default router
