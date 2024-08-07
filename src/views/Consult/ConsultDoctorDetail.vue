<script setup lang="ts">
import { useFollow } from '@/composables'
import { getDoctorDetail } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { Doctor } from '@/types/consult'
import { onMounted } from 'vue'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const doctorId = route.params.id as string
const doctor = ref<Doctor>()
const loadData = async () => {
  const { data } = await getDoctorDetail(doctorId)
  doctor.value = data
}
onMounted(() => {
  loadData()
})

// 关注
const { loading, follow } = useFollow('doc')

// 问诊
const consultStore = useConsultStore()
const router = useRouter()
const askDoctor = () => {
  consultStore.setDocId(doctor.value!.id)
  router.push(`/consult/illness`)
}
</script>

<template>
  <div class="doctor-detail-page" v-if="doctor">
    <cp-nav-bar title="医生详情"></cp-nav-bar>
    <div class="basic-info-bg">
      <div class="basic-info-content">
        <p class="avator-line">
          <img alt="" class="doctor-avator" :src="doctor.avatar" />
          <van-button
            class="follow-btn"
            round
            size="small"
            type="primary"
            @click="follow(doctor!)"
            :loading="loading"
          >
            {{ doctor.likeFlag === 1 ? '已关注' : '+ 关注' }}
          </van-button>
        </p>
        <p class="doctor-line">
          <span class="doctor-name">{{ doctor.name }}</span
          ><span class="dep-info">{{ doctor.depName }} | </span
          ><span class="dep-info">{{ doctor.positionalTitles }}</span>
        </p>
        <p class="hospital-line">
          <span class="grade-name">{{ doctor.gradeName }}</span
          ><span class="hospital-name">{{ doctor.hospitalName }}</span>
        </p>
        <p class="record-list">
          <img src="" alt="" /><span class="score">{{ doctor.score }}</span
          ><span> / 接诊数 </span
          ><span class="score">{{ doctor.consultationNum }}</span>
        </p>
      </div>
    </div>
    <div class="intro-content">
      <p class="intro-title">个人简介</p>
      <p class="intro-pre-title">擅长领域</p>
      <div class="adm-ellipsis intro-desc">
        {{ doctor.major }}
      </div>
    </div>

    <div class="banner-content">
      <div class="banner-box">
        <van-icon name="chat-o" class="banner-icon" size="33px" color="#fff" />
        <div>
          <p>
            <span class="inquire-type">图文问诊</span
            ><span class="price">¥{{ doctor.serviceFee }}/次</span>
          </p>
          <p class="tips">最长24小时图文多次沟通</p>
        </div>
        <span class="consult-btn" @click="askDoctor">去咨询</span>
      </div>
    </div>

    <div class="evaluate-content">
      <div class="evaluate-header">
        <p>
          <span class="evaluate-title">患者评价</span>
          <!-- <span class="evaluate-total">(0)</span> -->
        </p>
        <p>
          <span class="rate-title">评分</span
          ><span class="rate-text">{{ doctor.score }}</span>
        </p>
      </div>
      <!-- <div class="no-evaluate">暂无</div> -->
    </div>

    <div class="article-list">
      <p class="intro-title">他的文章</p>
    </div>

    <div class="bottom-content">
      <van-button type="primary" round size="large" @click="askDoctor"
        >咨询医生</van-button
      >
    </div>
  </div>
</template>

<style scoped lang="scss">
.doctor-detail-page {
  padding-top: 46px;
  .van-nav-bar {
    background: #dff4f1;
  }

  .basic-info-bg {
    background: linear-gradient(180deg, #dff4f1 0%, rgba(44, 181, 165, 0) 100%);
    padding: 15px;
    .basic-info-content {
      position: relative;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 0 11px 0 rgba(229, 229, 229, 0.5);
      padding: 13px;
      .avator-line {
        position: relative;
        text-align: end;
        margin-bottom: 16px;
        .doctor-avator {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: -23px;
        }
        .follow-btn {
          display: inline-block;
          border: 1px solid #2cb5a5;
          border-radius: 14px;
          padding: 5px 15px;
          font-size: 11px;
          font-family:
            PingFang SC,
            PingFang SC-Regular;
          font-weight: 400;
          color: #dee6e5;
        }
      }
      .doctor-line {
        .doctor-name {
          font-size: 21px;
          font-weight: 500;
          color: #121826;
          margin-right: 5px;
        }
        .dep-info {
          font-size: 13px;
          font-family:
            PingFang SC,
            PingFang SC-Regular;
          font-weight: 400;
          color: #6f6f6f;
        }
      }
      .hospital-line {
        display: flex;
        align-items: center;
        margin: 5px 0;
        .grade-name {
          display: inline-block;
          background: #677fff;
          border-radius: 2px;
          padding: 1px 4px;
          font-size: 9px;
          font-family:
            PingFang SC,
            PingFang SC-Regular;
          font-weight: 400;
          color: #ffffff;
          margin-right: 3px;
        }
        .hospital-name {
          font-size: 13px;
          font-family:
            PingFang SC,
            PingFang SC-Regular;
          font-weight: 400;
          color: #121826;
        }
      }
      .record-list {
        font-size: 12px;
        color: #979797;
        display: flex;
        align-items: center;
        .score {
          color: #03bc8e;
          font-size: 16px;
          font-weight: 600;
          margin-right: 4px;
          margin-left: 4px;
        }
      }
    }
  }
  .intro-content {
    padding: 15px;
    .intro-title {
      font-size: 16px;
      font-family:
        PingFang SC,
        PingFang SC-Medium;
      font-weight: 500;
      color: #121826;
      margin-bottom: 10px;
    }
    .intro-pre-title {
      font-size: 14px;
      font-family:
        PingFang SC,
        PingFang SC-Regular;
      font-weight: 400;
      color: #000000;
      margin: 5px 0;
    }
    .intro-desc {
      font-size: 12px;
      font-family:
        PingFang SC,
        PingFang SC-Regular;
      font-weight: 400;
      color: #3c3e42;
    }
  }
  .banner-content {
    padding: 15px;
    .banner-box {
      padding: 12px 15px;
      background: linear-gradient(281deg, #16c2a3 0%, #1cabca 100%);
      border-radius: 20px;
      display: flex;
      position: relative;
      align-items: center;
      .banner-icon {
        margin-right: 11px;
      }
      .inquire-type {
        font-size: 16px;
        font-family:
          PingFang SC,
          PingFang SC-Medium;
        font-weight: 500;
        text-align: LEFT;
        color: #ffffff;
        margin-right: 10px;
      }
      .price {
        font-size: 12px;
        font-family:
          PingFang SC,
          PingFang SC-Medium;
        font-weight: 500;
        color: #fafafa;
      }
      .tips {
        opacity: 0.7;
        font-size: 12px;
        font-family:
          PingFang SC,
          PingFang SC-Regular;
        font-weight: 400;
        color: #ffffff;
      }
      .consult-btn {
        position: absolute;
        right: 15px;
        top: 22px;
        padding: 5px 14px;
        background: #ffffff;
        border-radius: 27px;
        font-size: 14px;
        font-family:
          PingFang SC,
          PingFang SC-Regular;
        font-weight: 400;
        color: #16c2a3;
      }
    }
  }
  .evaluate-content {
    padding: 0 15px;
    margin-top: 5px;
    .evaluate-header {
      display: flex;
      justify-content: space-between;
      .evaluate-title {
        font-size: 16px;
        font-weight: 500;
        color: #000000;
        margin-right: 6px;
      }
      .evaluate-total {
        font-size: 12px;
        font-family:
          PingFang SC,
          PingFang SC-Regular;
        font-weight: 400;
        color: #3c3e42;
      }
      .rate-title {
        font-size: 13px;
        font-family:
          PingFang SC,
          PingFang SC-Regular;
        font-weight: 400;
        color: #3c3e42;
        margin-right: 3px;
      }
      .rate-text {
        font-size: 20px;
        font-family: DIN, DIN-Medium;
        font-weight: 500;
        color: #16c2a3;
      }
    }
    .no-evaluate {
      margin-bottom: 11px;
    }
  }

  .article-list {
    margin-top: 11px;
    padding: 0 15px;
    .intro-title {
      font-size: 16px;
      font-family:
        PingFang SC,
        PingFang SC-Medium;
      font-weight: 500;
      color: #121826;
      margin-bottom: 10px;
    }
  }

  .bottom-content {
    box-sizing: border-box;
    padding: 15px;
    position: absolute;
    background-color: #ffffff;
    bottom: 0;
    width: 100%;
    height: 65px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .van-button {
      height: 44px;
    }
  }
}
</style>
