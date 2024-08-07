<script setup lang="ts">
import { ref, watch } from 'vue'
import DoctorCard from './DoctorCard.vue'
import type { DoctorList, DoctorParams, DoctorOrderType } from '@/types/consult'
import { getFindDoctorPage } from '@/services/consult'
import type { PositionalTitles, PriceRange } from '@/enums'

const props = defineProps<{
  depId: string
  order?: DoctorOrderType
  provinceId?: string
  grade?: string
  positionalTitles?: PositionalTitles
  priceRange?: PriceRange
}>()

watch(
  [
    () => props.order,
    () => props.provinceId,
    () => props.grade,
    () => props.positionalTitles,
    () => props.priceRange
  ],
  ([order, provinceId, grade, positionalTitles, priceRange]) => {
    // console.log(val)
    list.value = []
    params.value.order = order || 'default_ascend'
    params.value.provinceId = provinceId || '100000'
    params.value.grade = grade
    params.value.positionalTitles = positionalTitles
    params.value.priceRange = priceRange
    params.value.current = 1
    onLoad()
  }
)
const params = ref<DoctorParams>({
  current: 1,
  pageSize: 10,
  depId: props.depId,
  order: props.order || 'default_ascend',
  provinceId: props.provinceId || '100000' // +
})

const list = ref<DoctorList>([])
const loading = ref(false)
const finished = ref(false)

const onLoad = async () => {
  const { data } = await getFindDoctorPage(params.value)
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
  <div class="doctor-list">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <doctor-card
        v-for="item in list"
        :key="item.id"
        :item="item"
      ></doctor-card>
    </van-list>
  </div>
</template>

<style scoped lang="scss">
.doctor-list {
  padding: 15px;
}
</style>
