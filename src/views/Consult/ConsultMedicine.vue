<script setup lang="ts">
import {
  liverFunctionOptions,
  allergicHistoryOptions,
  fertilityStatusOptions,
  renalFunctionOptions
} from '@/services/constants'
import { useConsultStore } from '@/stores'
import type { Image, MedicineIllness } from '@/types/consult'
import { showToast, type UploaderFileListItem } from 'vant'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
const form = ref<MedicineIllness>({
  illnessDesc: '',
  liverFunction: undefined,
  renalFunction: undefined,
  allergicHistory: undefined,
  fertilityStatus: undefined,
  pictures: []
})
const store = useConsultStore()
const router = useRouter()
// 上传
const cpUploadRef = ref()
const onUploadSuccess = (image: Image) => {
  form.value.pictures?.push(image)
}
const onDeleteSuccess = (item: UploaderFileListItem) => {
  form.value.pictures = form.value.pictures?.filter(
    (pic) => pic.url !== item.url
  )
}

// 下一步
const disabled = computed(
  () =>
    !form.value.illnessDesc ||
    form.value.liverFunction === undefined ||
    form.value.renalFunction === undefined ||
    form.value.allergicHistory === undefined ||
    form.value.fertilityStatus === undefined
)
const next = () => {
  if (!form.value.illnessDesc) return showToast('请输入病情描述')
  if (form.value.liverFunction === undefined)
    return showToast('请选择肝功能情况')
  if (form.value.renalFunction === undefined)
    return showToast('请选择肾功能情况')
  if (form.value.allergicHistory === undefined)
    return showToast('请选择过敏史情况')
  if (form.value.fertilityStatus === undefined)
    return showToast('请选择生育状态及计划')

  //  记录病情
  store.setMedicineIlness(form.value)
  // 跳转，携带标识
  router.push('/user/patient?isChange=1&from=medicineConsult')
}
</script>

<template>
  <div class="consult-medicine-page">
    <cp-nav-bar
      title="开药门诊"
      right-text="问诊记录"
      @click-right="$router.push('/user/consult')"
    ></cp-nav-bar>
    <van-notice-bar text="请如实填写资料以便医生了解您的病情和用药需求" />
    <div class="illness-form">
      <div class="adm-list-header">症状描述</div>
      <van-field
        type="textarea"
        rows="3"
        placeholder="请输入所患疾病名称"
        v-model="form.illnessDesc"
      ></van-field>
      <div class="adm-list-header">用药人身体情况</div>
      <div class="item">
        <p>肝功能</p>
        <cp-radio-btn
          :options="liverFunctionOptions"
          v-model="form.liverFunction"
        ></cp-radio-btn>
      </div>
      <div class="item">
        <p>肾功能</p>
        <cp-radio-btn
          :options="renalFunctionOptions"
          v-model="form.renalFunction"
        ></cp-radio-btn>
      </div>
      <div class="item">
        <p>过敏史</p>
        <cp-radio-btn
          :options="allergicHistoryOptions"
          v-model="form.allergicHistory"
        ></cp-radio-btn>
      </div>
      <div class="item">
        <p>生育状态及计划</p>
        <cp-radio-btn
          :options="fertilityStatusOptions"
          v-model="form.fertilityStatus"
        ></cp-radio-btn>
      </div>
      <div class="adm-list-header">补充病例信息</div>
      <!-- 上传组件 -->
      <div class="illness-img">
        <cp-upload
          ref="cpUploadRef"
          @upload-success="onUploadSuccess"
          @delete-success="onDeleteSuccess"
        ></cp-upload>
      </div>
      <!-- 下一步 -->
      <van-button
        :class="{ disabled }"
        type="primary"
        block
        round
        @click="next"
      >
        下一步
      </van-button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.consult-medicine-page {
  padding-top: 46px;
  .van-button {
    font-size: 16px;
    margin-bottom: 30px;
    &.disabled {
      opacity: 1;
      background: #fafafa;
      color: #d9dbde;
      border: #fafafa;
    }
  }
  .illness-form {
    padding: 0 15px 15px 15px;
    .adm-list-header {
      padding-bottom: 5px;
      font-size: 16px;
      font-weight: 500;
      color: #121826;
      border-bottom: none;
      margin-top: 30px;
    }
    .van-field {
      padding: 0;
      &::after {
        border-bottom: none;
      }
    }
    .item {
      > p {
        color: var(--cp-text3);
        padding: 15px 0;
      }
    }
  }
}
</style>
