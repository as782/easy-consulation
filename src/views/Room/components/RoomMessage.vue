<script setup lang="ts">
import type { Message, Prescription } from '@/types/room'
import { MsgType, PrescriptionStatus } from '@/enums'
import type { Image } from '@/types/consult'
import { showImagePreview, showToast } from 'vant'
import dayjs from 'dayjs'
import { useUserStore } from '@/stores'

import EvaluateCard from './EvaluateCard.vue'
import { useShowPrescription } from '@/composables'
import {
  getConsultFlagText,
  getIllnessTimeText,
  getLiverFunctionText,
  getRenalFunctionText,
  getAllergicHistoryText,
  getFertilityStatusText
} from '@/utils/filter'
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const { list } = defineProps<{
  list: Message[]
}>()
const store = useUserStore()

// 病情图片预览
const onPreviewImage = (pictures?: Image[]) => {
  if (pictures && pictures.length)
    showImagePreview(pictures.map((item) => item.url))
}

// 时间格式
const formatTime = (time: string) => dayjs(time).format('HH:mm')

// 点击处方的跳转
const router = useRouter()
const buy = (pre?: Prescription) => {
  if (pre) {
    if (pre.status === PrescriptionStatus.Invalid)
      return showToast('处方已失效')
    if (pre.status === PrescriptionStatus.NotPayment && !pre.orderId)
      return router.push(`/order/pay?id=${pre.id}`)
    router.push(`/order/${pre.orderId}`)
  }
}

const { onShowPrescription } = useShowPrescription()

const route = useRoute()
// 区分开药问诊| 极速问诊| 问医生 跳转过来的
const fromPage = computed(() => route.query.from)
</script>
<!-- http://localhost:5173/room?orderId=7055990719692800&payResult=true&type=2 -->
<template>
  <div v-for="item in list" :key="item.id">
    <!-- 患者卡片 -->
    <div class="msg msg-illness" v-if="item.msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ item.msg.consultRecord?.patientInfo.name }}
          {{ item.msg.consultRecord?.patientInfo.genderValue }}
          {{ item.msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p v-if="item.msg.consultRecord">
          <span v-if="fromPage === 'medicine'">
            肝功能
            {{ getLiverFunctionText(item.msg.consultRecord.liverFunction) }} |
            肾功能
            {{ getRenalFunctionText(item.msg.consultRecord.renalFunction) }} |
            过敏史
            {{ getAllergicHistoryText(item.msg.consultRecord.allergicHistory) }}
            | 生育状态
            {{ getFertilityStatusText(item.msg.consultRecord.fertilityStatus) }}
          </span>

          <span v-else>
            {{ getIllnessTimeText(item.msg.consultRecord?.illnessTime) }} |
            {{ getConsultFlagText(item.msg.consultRecord?.consultFlag) }}
          </span>
        </p>
      </div>
      <van-row>
        <van-col span="6" v-if="fromPage === 'medicine'">用药需求</van-col>
        <van-col span="18" v-if="fromPage === 'medicine'">
          {{
            item.msg.consultRecord?.medicines
              .map(
                (item) => `${item.name}
  ${item.specs} X${item.quantity}`
              )
              .join(',')
          }}
        </van-col>

        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ item.msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col
          span="18"
          @click="onPreviewImage(item.msg.consultRecord?.pictures)"
          >点击查看</van-col
        >
      </van-row>
    </div>
    <!-- 通知-通用 -->
    <div class="msg msg-tip" v-if="item.msgType === MsgType.Notify">
      <div class="content">
        <span>{{ item.msg.content }}</span>
      </div>
    </div>
    <!-- 通知-温馨提示 -->
    <div class="msg msg-tip" v-if="item.msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ item.msg.content }}</span>
      </div>
    </div>
    <!-- 通知-结束 -->
    <div
      class="msg msg-tip msg-tip-cancel"
      v-if="item.msgType === MsgType.NotifyCancel"
    >
      <div class="content">
        <span>{{ item.msg.content }}</span>
      </div>
    </div>
    <!-- 发送文字 -->
    <div
      class="msg msg-to"
      v-if="item.msgType === MsgType.MsgText && item.from === store.user?.id"
    >
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <div class="pao">{{ item.msg.content }}</div>
      </div>
      <van-image :src="item.fromAvatar" />
    </div>
    <!-- 发送图片 -->
    <div
      class="msg msg-to"
      v-if="item.msgType === MsgType.MsgImage && item.from === store.user?.id"
    >
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <van-image fit="contain" :src="item.msg.picture?.url" />
      </div>
      <van-image :src="item.fromAvatar" />
    </div>
    <!-- 接收文字 -->
    <div
      class="msg msg-from"
      v-if="item.msgType === MsgType.MsgText && item.from !== store.user?.id"
    >
      <van-image :src="item.fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <div class="pao">{{ item.msg.content }}</div>
      </div>
    </div>
    <!-- 接收图片 -->
    <div
      class="msg msg-from"
      v-if="item.msgType === MsgType.MsgImage && item.from !== store.user?.id"
    >
      <van-image :src="item.fromAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(item.createTime) }}</div>
        <van-image fit="contain" :src="item.msg.picture?.url" />
      </div>
    </div>
    <!-- 处方卡片 -->
    <div class="msg msg-recipe" v-if="item.msgType === MsgType.CardPre">
      <div class="content" v-if="item.msg.prescription">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="onShowPrescription(item.msg.prescription?.id)">
              显示原始处方
            </p>
          </div>
          <p>
            {{ item.msg.prescription.name }}
            {{ item.msg.prescription.genderValue }}
            {{ item.msg.prescription.age }}岁
            {{ item.msg.prescription.diagnosis }}
          </p>
          <p>开方时间：{{ item.msg.prescription.createTime }}</p>
        </div>
        <div class="body">
          <div
            class="body-item"
            v-for="med in item.msg.prescription.medicines"
            :key="med.id"
          >
            <div class="durg">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot">
          <span @click="buy(item.msg.prescription)">购买药品</span>
          <!-- <span>购买药平</span> -->
        </div>
      </div>
    </div>
    <!-- 评价卡片  -->
    <div
      class="msg msg-comment"
      v-if="
        item.msgType === MsgType.CardEva || item.msgType === MsgType.CardEvaForm
      "
    >
      <evaluate-card :evaluateDoc="item.msg.evaluateDoc"></evaluate-card>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>
