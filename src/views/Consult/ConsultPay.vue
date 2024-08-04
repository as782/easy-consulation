<script setup lang="ts">
import {
  createConsultOrder,
  getConsultOrderPayUrl,
  getConsultOrderPre
} from '@/services/consult'
import { getPatientDetail } from '@/services/user'
import { useConsultStore } from '@/stores'
import type { ConsultOrderPreData, PartialConsult } from '@/types/consult'
import type { Patient } from '@/types/user'
import {
  showConfirmDialog,
  showDialog,
  showLoadingToast,
  showToast
} from 'vant'
import { onMounted, ref } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'

const store = useConsultStore()

// 获取订单预支付信息
const payInfo = ref<ConsultOrderPreData>()
const loadData = async () => {
  try {
    const res = await getConsultOrderPre({
      type: store.consult.type,
      illnessType: store.consult.illnessType
    })
    payInfo.value = res.data
    // 设置默认优惠券
    store.setCoupon(payInfo.value.couponId)
  } catch (error) {
    console.error(error)
  }
}
// 获取患者信息
const patient = ref<Patient>()
const loadPatient = async () => {
  try {
    if (!store.consult.patientId) return
    const res = await getPatientDetail(store.consult.patientId)
    patient.value = res.data
  } catch (error) {
    console.error(error)
  }
}

// 处理支付
const agree = ref(false)
const show = ref(false)
/**支付方式 0:微信 1:支付宝*/
const paymentMethod = ref<0 | 1>()
const loading = ref(false)
/** 订单id */
const orderId = ref('')
/** 支付逻辑 */
const submit = async () => {
  if (!agree.value) return showToast('请勾选我已同意支付协议')
  loading.value = true
  try {
    const res = await createConsultOrder(store.consult)
    orderId.value = res.data.id
    loading.value = false
    store.clear()
    // 打开
    show.value = true
  } catch (error) {
    loading.value = false
    showToast('订单创建失败，请稍后重试')
    console.error(error)
  }
}

// 生成订单后阻止用户返回 ，离开页面
onBeforeRouteLeave(() => {
  // 如果orderId存在，则阻止用户返回
  if (orderId.value) return false
})

// 处理关闭弹窗,生成订单后不可关闭支付抽屉
const router = useRouter()
const onClose = async () => {
  try {
    await showConfirmDialog({
      title: '关闭支付',
      message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
      cancelButtonText: '仍要关闭',
      confirmButtonText: '继续支付'
    })
    return false
  } catch {
    orderId.value = ''
    router.push('/user/consult')
    return true
  }
}
// 患者问诊信息类型中的键
type Key = keyof PartialConsult

onMounted(() => {
  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId'
  ]
  // 检验问诊记录中 ，问诊信息是否完整
  const valid = validKeys.every((key) => store.consult[key] !== undefined)
  if (!valid) {
    return showDialog({
      title: '温馨提示',
      message:
        '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付！',
      closeOnPopstate: false
    }).then(() => {
      router.push('/')
    })
  }

  loadData()
  loadPatient()
})
</script>

<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <div class="pay-info">
      <p class="tit">图文问诊 {{ payInfo.payment }} 元</p>
      <img class="img" src="@/assets/avatar-doctor.svg" />
      <p class="desc">
        <span>极速问诊</span>
        <span>自动分配医生</span>
      </p>
    </div>
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`¥${payInfo.actualPayment}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient.name} | ${patient.genderValue} | ${patient.age}岁`"
      ></van-cell>
      <van-cell title="病情描述" :label="store.consult.illnessDesc"></van-cell>
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
      @click="submit"
      :loading="loading"
    />
    <cp-pay-sheet
      v-model:show="show"
      :order-id="orderId"
      :actualPayment="payInfo.actualPayment"
      :onClose="onClose"
      payCallback="/room"
    />
  </div>
  <!-- 骨架屏-->
  <div class="consult-pay-page" v-if="!payInfo">
    <cp-nav-bar title="支付" />
    <van-skeleton title :row="10" style="margin-top: 18px"></van-skeleton>
  </div>
</template>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}
.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;
  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }
  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }
  .desc {
    flex: 1;
    > span {
      display: block;
      color: var(--cp-tag);
      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}
.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }
    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}
.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}
.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--cp-primary);
  }
}
::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
.pay-type {
  .amount {
    padding: 20px;
    text-align: center;
    font-size: 16px;
    font-weight: bold;
  }
  .btn {
    padding: 15px;
  }
  .van-cell {
    align-items: center;
    .cp-icon {
      margin-right: 10px;
      font-size: 18px;
    }
    .van-checkbox :deep(.van-checkbox__icon) {
      font-size: 16px;
    }
  }
}
</style>
