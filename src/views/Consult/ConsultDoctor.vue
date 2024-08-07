<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import DepartmentContent from './components/DepartmentContent.vue'
import type { TopDep } from '@/types/consult'

import { getAllDep } from '@/services/consult'
import { useConsultStore } from '@/stores'
import { ConsultType } from '@/enums'

const depts = ref<TopDep[]>([])
const loadDepts = async () => {
  const { data } = await getAllDep()
  depts.value = data
}
onMounted(() => {
  loadDepts()
})
const allDepts = computed(() =>
  depts.value.map((item) => item?.child || []).flat()
)

const consultStore = useConsultStore()
</script>

<template>
  <div class="consult-doctor-page">
    <cp-nav-bar
      title="找医生"
      right-text="问诊记录"
      @click-right="$router.push('/user/consult')"
    ></cp-nav-bar>

    <div class="search">
      <cp-icon name="home-search" /> 搜一搜：医生/疾病名称
    </div>
    <div class="quick-inquary-banner">
      <div class="left-content">
        <van-icon name="chat-o" size="33" />
        <div>
          <p class="solgan">快速问医 无需等待</p>
          <p class="tips">2w+名医在线问诊</p>
        </div>
      </div>
      <span
        class="inquary-btn"
        @click="
          consultStore.setType(ConsultType.Fast) &&
            $router.push('/consult/fast')
        "
        >去咨询</span
      >
    </div>

    <!-- 科室搜索  -->
    <department-content :depts="depts"></department-content>
    <div class="famous-doctor-list">
      <div>
        <p class="title-text">名医推荐</p>
        <p class="sub-title">获取更多诊疗建议</p>
      </div>

      <van-tabs shrink sticky>
        <van-tab :title="item.name" v-for="item in allDepts" :key="item.id">
          {{ item.name }} 医生列表
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<style scoped lang="scss">
.consult-doctor-page {
  padding: 46px 15px 0;
  .search {
    margin-top: 10px;
    // border: 1px solid rgba(237, 237, 237, 0.9);
    height: 40px;
    border-radius: 20px;
    box-shadow: 0px 15px 22px -7px rgba(224, 236, 250, 0.8);
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: var(--cp-dark);
    font-size: 13px;
    .cp-icon {
      font-size: 16px;
      margin-right: 5px;
    }
  }
  .quick-inquary-banner {
    display: flex;
    align-items: center;
    margin: 15px 0;
    justify-content: space-between;
    height: 75px;
    background: #fafafa;
    border-radius: 18px;
    padding: 0 15px;
    .left-content {
      display: flex;
      align-items: center;
      .van-icon {
        margin-right: 10px;
      }
      .solgan {
        font-size: 16px;
        font-weight: 500;
        color: var(--cp-primary);
      }
      .tips {
        font-size: 12px;
        color: #848484;
      }
    }
    .inquary-btn {
      width: 70px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background: rgba(44, 181, 165, 0.1);
      border-radius: 25px;
      font-size: 14px;
      color: #2cb5a5;
    }
  }
  .department-content {
    .department-header {
      font-size: 16px;
      font-weight: 500;
      color: #121826;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .all-link {
        font-size: 13px;
        color: #c3c3c5;
        display: flex;
        align-items: center;
      }
    }
    .department-list {
      padding-top: 20px;
      background: #fafafa;
      border-radius: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .department-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 25%;
        margin-bottom: 20px;
        .department-icon {
          display: inline-block;
          width: 25px;
          height: 25px;
        }
        .department-name {
          font-size: 12px;
          margin-top: 6px;
          font-family:
            PingFang SC,
            PingFang SC-Medium;
          font-weight: 500;
          color: #121826;
        }
      }
    }
  }
  .famous-doctor-list {
    margin-top: 15px;
    position: relative;
    .title-text {
      font-size: 16px;
      font-weight: 500;
      color: #121826;
    }
    .sub-title {
      font-size: 12px;
      color: #c3c3c5;
    }
  }
}
</style>
