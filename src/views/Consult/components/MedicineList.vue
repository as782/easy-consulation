<script setup lang="ts">
import { ref, watch } from 'vue'
import MedicineCard from './MedicineCard.vue'
import type { MedicineList, MedicineParams } from '@/types/consult'
import { getMedicinePage } from '@/services/consult'
const props = defineProps<{
  keyword: string
}>()

const params = ref<MedicineParams>({
  keyword: props.keyword || '',
  pageSize: 10,
  current: 1
})

watch(
  () => props.keyword,
  (val) => {
    list.value = []
    params.value.keyword = val
    params.value.current = 1
    onLoad()
  }
)

// 获取药品列表
const list = ref<MedicineList>([])
const loading = ref(false)
const finished = ref(false)

const onLoad = async () => {
  const { data } = await getMedicinePage(params.value)
  list.value.push(...data.rows)
  loading.value = false
  if (params.value.current >= data.pageTotal) {
    finished.value = true
  } else {
    finished.value = false
    params.value.current++
  }
}
</script>

<template>
  <div class="medicine-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <medicine-card
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></medicine-card>
    </van-list>
  </div>
</template>

<style scoped lang="scss">
.medicine-list {
  background-color: #fff;
  padding: 0 15px 45px;
  .item {
    display: flex;
    flex-wrap: wrap;
    padding: 15px 0;
    .img {
      width: 80px;
      height: 70px;
      border-radius: 2px;
      overflow: hidden;
    }
    .info {
      padding-left: 15px;
      width: 250px;
      .name {
        display: flex;
        font-size: 15px;
        margin-bottom: 5px;
        > span:first-child {
          // width: 200px;
          // width: 300px;
          width: 40vw;
        }
        > span:last-child {
          // width: 50px;
          text-align: right;
        }
      }
      .size {
        margin-bottom: 5px;
        .van-tag {
          background-color: var(--cp-primary);
          vertical-align: middle;
        }
        span:not(.van-tag) {
          margin-left: 10px;
          color: var(--cp-tag);
          vertical-align: middle;
        }
      }
      .price {
        font-size: 16px;
        color: #eb5757;
      }
    }
    .desc {
      width: 100%;
      background-color: var(--cp-bg);
      border-radius: 4px;
      margin-top: 10px;
      padding: 4px 10px;
      color: var(--cp-tip);
    }
  }
}
</style>
