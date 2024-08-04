<script setup lang="ts">
/*global QC*/
import { onMounted, ref } from 'vue'
import { bindMobile, loginByQQ } from '@/services/user'
import { mobileRules, codeRules } from '@/utils/rules'
import { useSendMobileCode } from '@/composables'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import type { User } from '@/types/user'
import { showSuccessToast } from 'vant'
const openId = ref('')
// 是否需要绑定手机
const isNeedBind = ref(false)
onMounted(() => {
  if (QC.Login.check()) {
    QC.Login.getMe((id) => {
      openId.value = id
      // QQ，登录
      loginByQQ(id)
        .then((res) => {
          // 登录成功
          loginSuccess(res)
        })
        .catch(() => {
          // 登录失败
          isNeedBind.value = true
        })
    })
  }
})

// 登录成功
const store = useUserStore()
const router = useRouter()
const loginSuccess = (res: { data: User }) => {
  store.setUser(res.data)

  // 如果有回跳地址就进行回跳，没有跳转到个人中心
  router.replace(store.returnUrl || '/user')
  showSuccessToast('登录成功')
  store.setReturnUrl('')
}
// 绑定手机
const mobile = ref('')
const code = ref('')
const bind = async () => {
  const res = await bindMobile({
    mobile: mobile.value,
    code: code.value,
    openId: openId.value
  })
  loginSuccess(res)
}
// 发送验证码
const { form, time, onSend } = useSendMobileCode(mobile, 'bindMobile')
</script>

<template>
  <div class="login-page" v-if="isNeedBind">
    <cp-nav-bar></cp-nav-bar>
    <div class="login-head">
      <h3>手机绑定</h3>
    </div>
    <van-form autocomplete="off" @submit="bind" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
      ></van-field>
      <van-field
        v-model="code"
        name="code"
        :rules="codeRules"
        placeholder="请输入验证码"
      >
        <template #button>
          <span class="btn-send" :class="{ active: time > 0 }" @click="onSend">
            {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}
          </span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button
          style="margin-top: 50px"
          block
          round
          type="primary"
          native-type="submit"
        >
          立即绑定
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>
