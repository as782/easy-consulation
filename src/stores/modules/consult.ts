// 用于存储患者的问诊情况仓库

import type { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'cp-consult',
  () => {
    const consult = ref<PartialConsult>({})
    /**
     * 设置问诊类型
     * @param type ConsultType
     * @returns
     */
    const setType = (type: ConsultType) => (consult.value.type = type)

    /**
     * 设置极速问诊类型
     * @param type 快速问诊类型，0 普通 1 三甲
     * @returns
     */
    const setIllnessType = (type: 0 | 1) => (consult.value.illnessType = type)

    /**
     * // 设置科室
     * @param id 科室id
     * @returns
     */
    const setDep = (id: string) => (consult.value.depId = id)
    /**
     * // 设置病情描述
     */
    const setIllness = (
      illness: Pick<
        PartialConsult,
        'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures'
      >
    ) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    /**
     * // 设置患者
     * @param id 患者id
     * @returns
     */
    const setPatient = (id: string) => (consult.value.patientId = id)
    /**
     *  // 设置优惠券
     * @param id 优惠券id
     * @returns
     */
    const setCoupon = (id?: string) => (consult.value.couponId = id)
    /**
     * // 清空记录
     * @returns
     */
    const clear = () => (consult.value = {})
    return {
      consult,
      setType,
      setIllnessType,
      setDep,
      setIllness,
      setPatient,
      setCoupon,
      clear
    }
  },
  {
    persist: true
  }
)
