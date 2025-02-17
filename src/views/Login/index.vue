<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import CpIcon from '@/components/CpIcon.vue'

import { mobileRules, passwordRules, codeRules } from '@/utils/rules'
import {
  loginByMobileCode,
  loginByPassword,
  sendMobileCode
} from '@/services/user'
import { useUserStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { showToast, type FormInstance } from 'vant'
/** 表单实例 */
const form = ref<FormInstance>()
/** 账号密码数据*/
const mobile = ref<string>('13230000001')
const password = ref<any>('')

/** 同意协议 */
const agree = ref<boolean>(false)
/** 切换密码登录和短信登录 */
const isPass = ref<boolean>(true)
/** 切换登录模式 */
const changeLoginMothod = () => {
  isPass.value = !isPass.value
}
const store = useUserStore()
const router = useRouter()
const route = useRoute()
// 处理表单提交
const login = async () => {
  if (!agree.value) return showToast('请勾选我已同意')
  // 验证完毕，进行登录
  try {
    const res = isPass.value
      ? await loginByPassword(mobile.value, password.value)
      : await loginByMobileCode(mobile.value, code.value)
    // 存储用户信息
    store.setUser(res.data)
    // 如果有回跳地址就进行回跳，没有跳转到个人中心
    router.push((route.query.returnUrl as string) || '/user')
  } catch (error) {
    console.error(error)
  }
  showToast({
    type: 'success',
    message: '登录成功'
  })
}
/**显示密码 */
const showPassword = ref(false)
/** 短信验证码 */
const code = ref<string>('')
/** 计时 */
const time = ref<number>(0)
let timer: number
/** 获取验证码 */
const getMobileCode = async () => {
  if (time.value > 0) return
  try {
    await form.value?.validate('mobile')
    await sendMobileCode(mobile.value, 'login')
    time.value = 60
    if (timer) clearInterval(timer)
    // 倒计时
    timer = setInterval(() => {
      time.value--
    }, 1000)
  } catch (error) {
    console.error(error)
  }
}
onUnmounted(() => {
  clearInterval(timer)
})

const qqUrl = `https://graph.qq.com/oauth2.0/authorize?client_id=102015968&response_type=token&scope=all&redirect_uri=${encodeURIComponent(
  import.meta.env.VITE_APP_CALLBACK + '/login/callback'
)}`
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="changeLoginMothod">
        <span>{{ !isPass ? '密码登录' : '短信验证码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form ref="form" autocomplete="off" @submit="login">
      <van-field
        v-model="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
        type="tel"
        name="mobile"
      ></van-field>
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        :type="showPassword ? 'text' : 'password'"
        name="password"
      >
        <template #button>
          <CpIcon
            :name="`login-eye-${showPassword ? 'on' : 'off'}`"
            @click="showPassword = !showPassword"
          ></CpIcon>
        </template>
      </van-field>
      <van-field
        v-else
        placeholder="短信验证码"
        :rules="codeRules"
        v-model="code"
      >
        <template #button>
          <span
            class="btn-send"
            :class="{ active: time > 0 }"
            @click="getMobileCode"
            >{{ time > 0 ? `${time}后重试` : '发送验证码' }}</span
          >
        </template>
      </van-field>
      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <a
        @click="store.setReturnUrl($route.query.returnUrl as string)"
        :href="qqUrl"
      >
        <img src="@/assets/qq.svg" alt="" />
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
