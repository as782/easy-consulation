import type {
  AllergicHistory,
  FertilityStatus,
  IllnessTime,
  LiverFunction,
  RenalFunction
} from '@/enums'
import {
  allergicHistoryOptions,
  fertilityStatusOptions,
  flagOptions,
  liverFunctionOptions,
  renalFunctionOptions,
  timeOptions
} from '@/services/constants'

/** 病情时间 转换文字 */
export const getIllnessTimeText = (time: IllnessTime) =>
  timeOptions.find((item) => item.value === time)?.label
/** 就诊情况 转换文字 */
export const getConsultFlagText = (flag: 0 | 1) =>
  flagOptions.find((item) => item.value === flag)?.label

export const getLiverFunctionText = (val: LiverFunction) => {
  return liverFunctionOptions.find((item) => item.value === val)?.label
}

export const getAllergicHistoryText = (val: AllergicHistory) => {
  return allergicHistoryOptions.find((item) => item.value === val)?.label
}

export const getFertilityStatusText = (val: FertilityStatus) => {
  return fertilityStatusOptions.find((item) => item.value === val)?.label
}

export const getRenalFunctionText = (val: RenalFunction) => {
  return renalFunctionOptions.find((item) => item.value === val)?.label
}
