<script setup lang="ts">
import { evaluateConsultOrder } from '@/services/user'
import type { ConsultOrderItem } from '@/types/consult'
import type { EvaluateDoc } from '@/types/room'
import { showToast } from 'vant'
import { computed, inject, ref, type Ref } from 'vue'

defineProps<{
  evaluateDoc?: EvaluateDoc
}>()
// 获取问诊信息
const consult = inject<Ref<ConsultOrderItem>>('consult')
/** 修改评分*/
const completeEva = inject<(score: number) => void>('completeEva')

// 收集评价信息
const score = ref(0)
// 是否匿名
const anonymousFlag = ref(false)
// 评价内容
const content = ref('')
// 按钮是否启用
const disabled = computed(() => !score.value || !content.value)
/** 提交评分 */
const onSubmit = async () => {
  if (!score.value) return showToast('请选择评分')
  if (!content.value) return showToast('请输入评价')
  if (!consult?.value) return showToast('未找到订单')
  if (consult.value.docInfo?.id) {
    try {
      await evaluateConsultOrder({
        docId: consult.value?.docInfo?.id,
        orderId: consult.value?.id,
        score: score.value,
        content: content.value,
        anonymousFlag: anonymousFlag.value ? 1 : 0
      })
      showToast('评价成功')
      // 修改问诊状态
      completeEva && completeEva(score.value)
    } catch (error) {
      console.log(error)
      showToast('提交失败')
    }
  }
}
</script>

<template>
  <div class="evaluate-card" v-if="evaluateDoc">
    <p class="title">医生服务评价</p>
    <p class="desc">我们会更加努力提升服务质量</p>
    <van-rate
      :modelValue="evaluateDoc.score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
  </div>
  <div class="evaluate-card" v-else>
    <p class="title">感谢您的评价</p>
    <p class="desc">本次在线问诊服务您还满意吗？</p>
    <van-rate
      v-model="score"
      size="7vw"
      gutter="3vw"
      color="#FADB14"
      void-icon="star"
      void-color="rgba(0,0,0,0.04)"
    />
    <van-field
      v-model="content"
      type="textarea"
      maxlength="150"
      show-word-limit
      rows="3"
      placeholder="请描述您对医生的评价或是在医生看诊过程中遇到的问题"
    ></van-field>
    <div class="footer">
      <van-checkbox v-model="anonymousFlag">匿名评价</van-checkbox>
      <van-button
        @click="onSubmit"
        type="primary"
        size="small"
        :class="{ disabled }"
        round
      >
        提交评价
      </van-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.evaluate-card {
  width: 100%;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  text-align: center;
  padding: 15px;
  .title {
    font-size: 15px;
    margin-bottom: 5px;
  }
  .desc {
    font-size: 12px;
    margin-bottom: 15px;
    color: var(--cp-tip);
  }
  .van-field {
    background-color: var(--cp-bg);
    margin: 15px 0;
    border-radius: 8px;
  }
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    :deep() {
      .van-checkbox {
        height: 16px;
        .van-icon {
          font-size: 12px;
        }
        &__label {
          font-size: 12px;
          color: var(--cp-tip);
        }
      }
      .van-button {
        padding: 0 16px;
        &.disabled {
          opacity: 1;
          background: #fafafa;
          color: #d9dbde;
          border: #fafafa;
        }
      }
    }
  }
}
</style>
