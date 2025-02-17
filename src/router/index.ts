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
      path: '/superDoctor',
      component: () => import('@/views/User/SuperDoctor.vue'),
      meta: { title: '超级医生' }
    },
    {
      path: '/login/callback',
      component: () => import('@/views/Login/LoginCallback.vue'),
      meta: { title: 'QQ登录-绑定手机' }
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/user/consult',
      component: () => import('@/views/User/ConsultPage.vue'),
      meta: { title: '问诊记录' }
    },
    {
      path: '/user/consult/:id',
      component: () => import('@/views/User/ConsultDetail.vue'),
      meta: { title: '问诊详情' }
    },
    {
      path: '/consult/doctor',
      component: () => import('@/views/Consult/ConsultDoctor.vue'),
      meta: { title: '找医生' }
    },
    {
      path: '/doctorList/:depId',
      component: () => import('@/views/Consult/ConsultDoctorList.vue'),
      meta: { title: '医生搜索' }
    },
    {
      path: '/doctorDetail/:id',
      component: () => import('@/views/Consult/ConsultDoctorDetail.vue'),
      meta: { title: '医生详情' }
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
      path: '/consult/illness',
      component: () => import('@/views/Consult/ConsultIllness.vue'),
      meta: { title: '病情描述' }
    },
    {
      path: '/consult/pay',
      component: () => import('@/views/Consult/ConsultPay.vue'),
      meta: { title: '问诊支付' }
    },
    {
      path: '/consult/medicine',
      component: () => import('@/views/Consult/ConsultMedicine.vue'),
      meta: { title: '开药门诊' }
    },
    {
      path: '/consult/choose',
      component: () => import('@/views/Consult/ConsultChoose.vue'),
      meta: { title: '选择药品' }
    },
    {
      path: '/medicineDetail/:id',
      component: () => import('@/views/Consult/ConsultMedicineDetail.vue'),
      meta: { title: '药品详情' }
    },
    {
      path: '/order/pay',
      component: () => import('@/views/Order/OrderPay.vue'),
      meta: { title: '药品支付' }
    },
    {
      path: '/order/pay/result',
      component: () => import('@/views/Order/OrderPayResult.vue'),
      meta: { title: '药品支付结果' }
    },
    {
      path: '/order/:id',
      component: () => import('@/views/Order/OrderDetail.vue'),
      meta: { title: '药品订单详情' }
    },
    {
      path: '/order/logistics/:id',
      component: () => import('@/views/Order/OrderLogistics.vue'),
      meta: { title: '物流详情' }
    },

    {
      path: '/room',
      component: () => import('@/views/Room/index.vue'),
      meta: { title: '问诊室' },
      beforeEnter(to) {
        // 进入问诊室前，若支付失败，返回问诊页面
        if (to.query.payResult === 'false') return '/user/consult'
      }
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
  const whiteList = ['/login', '/register', '/login/callback']
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
