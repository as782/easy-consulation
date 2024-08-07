<script setup lang="ts">
import { useConsultStore } from '@/stores'
import type { SubDep, TopDep } from '@/types/consult'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  depts: TopDep[]
}>()

const showDepts = computed(() => props.depts[0]?.child || [])

const consultStore = useConsultStore()
const router = useRouter()
const goFindDoctorByDepId = (item: SubDep) => {
  consultStore.setDep(item.id)
  router.push(`/doctorList/${item?.id}?department=${item?.name}`)
}

const show = ref(false)
</script>

<template>
  <div class="department-content">
    <div class="department-header">
      <p class="title-text">按科室找医生</p>
      <p class="all-link" @click="show = true">
        全部科室
        <van-icon name="arrow" />
      </p>
    </div>
    <div class="department-list">
      <div
        class="department-item"
        v-for="item in showDepts"
        :key="item.id"
        @click="goFindDoctorByDepId(item)"
      >
        <img :src="item.avatar" alt="" class="department-icon" /><span
          class="department-name"
          >{{ item.name }}</span
        >
      </div>
    </div>
    <van-action-sheet v-model:show="show" title="全部科室">
      <div class="content">
        <div v-for="item in depts" :key="item.id">
          <div v-if="item.child.length > 0">
            <p class="department-header">{{ item.name }}</p>
            <div class="mb-20">
              <span
                @click="goFindDoctorByDepId(sub)"
                class="department-text"
                v-for="sub in item.child"
                :key="sub.id"
                >{{ sub.name }}</span
              >
            </div>
          </div>
        </div>
      </div>
    </van-action-sheet>
  </div>
</template>

<style scoped lang="scss">
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
        --icon-size: 70px;
        display: inline-block;
        width: var(--icon-size);
        height: var(--icon-size);
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
  .content {
    padding: 16px;
    height: 400px;
    .department-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-size: 16px;
      font-weight: 500;
      color: #121826;
    }
    .mb-20 {
      margin-bottom: 20px;
      .department-text {
        display: inline-block;
        height: 33px;
        padding: 0 20px;
        background: #fafafa;
        border-radius: 27px;
        font-size: 13px;
        color: #3c3e42;
        line-height: 33px;
        text-align: center;
        margin-right: 9px;
        margin-bottom: 9px;
      }
    }
  }
}
</style>
