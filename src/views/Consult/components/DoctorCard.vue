<script setup lang="ts">
import { useConsultStore } from '@/stores'
import type { Doctor } from '@/types/consult'
import { useRouter } from 'vue-router'

const props = defineProps<{
  item: Doctor
  grade?: string
}>()

const consultStore = useConsultStore()
const router = useRouter()

const askDoctor = () => {
  consultStore.setDocId(props.item.id)
  // 父传子grade
  if (props.grade === '9') {
    consultStore.setIllnessType(1)
  } else {
    consultStore.setIllnessType(0)
  }
  router.push(`/consult/illness`)
}

const goDoctorDetail = () => {
  if (props.grade === '9') {
    consultStore.setIllnessType(1)
  } else {
    consultStore.setIllnessType(0)
  }
  router.push(`/doctorDetail/${props.item.id}`)
}
</script>

<template>
  <div class="doctor-card" @click="goDoctorDetail">
    <img :src="item.avatar" class="avator" alt="" />
    <div class="detail">
      <p>
        <span class="doctor-name">{{ item.name }}</span
        ><span class="doctor-other-info"
          >{{ item.depName }} | {{ item.positionalTitles }}</span
        >
      </p>
      <p class="hospital-info">
        <span class="hospital-grade">{{ item.gradeName }}</span
        ><span class="hospital-name">{{ item.hospitalName }}</span>
      </p>
      <p class="skill-list">{{ item.major }}</p>
      <p class="record-list">
        <van-icon name="star" color="#fea116" />
        <span class="score">{{ item.score }}</span
        ><span> / 接诊数 </span
        ><span class="count">{{ item.consultationNum }}</span>
      </p>
      <p class="bottom-content">
        <span class="price">¥{{ item.serviceFee }}</span
        ><span class="btn" @click.stop="askDoctor">问医生</span>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.doctor-card {
  display: flex;
  flex-direction: row;
  padding: 20px 0;
  position: relative;
  .avator {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
    border-style: none;
  }
  .detail {
    flex: 1 1;
    .doctor-name {
      font-size: 18px;
      font-weight: 500;
      color: #3c3e42;
      margin-right: 7.5px;
    }
    .doctor-other-info {
      font-size: 12px;
      color: #6f6f6f;
    }
    .hospital-info {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      .hospital-grade {
        display: inline-block;
        width: 26px;
        height: 14px;
        background: #677fff;
        border-radius: 2px;
        font-size: 9px;
        color: #ffffff;
        line-height: 14px;
        text-align: center;
        margin-right: 3px;
      }
      .hospital-name {
        font-size: 12px;
        color: #3c3e42;
      }
    }
    .skill-list {
      font-size: 12px;
      color: #6f6f6f;
      margin-bottom: 10px;
    }
    .record-list {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #979797;
      .score,
      .count {
        font-size: 12px;
        font-family: Avenir, Avenir-Book;
        color: #fea116;
      }
    }
    .bottom-content {
      margin-top: 11px;
      padding-right: 11px;
      display: flex;
      justify-content: space-between;
      .price {
        font-size: 18px;
        font-family:
          DIN Alternate,
          DIN Alternate-Bold;
        font-weight: 700;
        color: #2cb5a5;
      }
      .btn {
        display: inline-block;
        width: 70px;
        height: 29px;
        background: rgba(44, 181, 165, 0.1);
        border-radius: 27px;
        font-size: 14px;
        font-family:
          PingFang SC,
          PingFang SC-Regular;
        color: #2cb5a5;
        line-height: 29px;
        text-align: center;
      }
    }
  }
  :after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    border-top: 1px solid rgba(237, 237, 237, 0.9);
    width: 200%;
    transform: scale(0.5);
    transform-origin: left top;
  }
}
</style>
