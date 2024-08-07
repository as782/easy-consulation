import {
  AllergicHistory,
  FertilityStatus,
  IllnessTime,
  LiverFunction,
  PositionalTitles,
  PriceRange,
  RenalFunction
} from '@/enums'

export const timeOptions = [
  { label: '一周内', value: IllnessTime.Week },
  { label: '一月内', value: IllnessTime.Month },
  { label: '半年内', value: IllnessTime.HalfYear },
  { label: '大于半年', value: IllnessTime.More }
]
export const flagOptions = [
  { label: '就诊过', value: 1 },
  { label: '没就诊过', value: 0 }
]
/** 支付成功后的返回地址*/
export const payCallbackUrl = 'http://localhost:5173'

// 肝功能
export const liverFunctionOptions = [
  { label: '正常', value: LiverFunction.Normal },
  { label: '异常', value: LiverFunction.Abnormal },
  { label: '不清楚', value: LiverFunction.Unclear }
]
// 肾功能
export const renalFunctionOptions = [
  { label: '正常', value: RenalFunction.Normal },
  { label: '异常', value: RenalFunction.Abnormal },
  { label: '不清楚', value: RenalFunction.Unclear }
]
// 过敏史
export const allergicHistoryOptions = [
  { label: '正常', value: AllergicHistory.Normal },
  { label: '异常', value: AllergicHistory.Abnormal },
  { label: '不清楚', value: AllergicHistory.Unclear }
]
// 生育状态及计划
export const fertilityStatusOptions = [
  { label: '无', value: FertilityStatus.No },
  { label: '备孕中', value: FertilityStatus.TryingToConceive },
  { label: '已怀孕', value: FertilityStatus.AlreadyPregnant },
  { label: '哺乳期中', value: FertilityStatus.Breastfeeding }
]
/**医院等级*/
export const gradeOptions = [
  { label: '三级甲等', value: 9 }
  // { label: '特等', value: 10 }
]

// 医师职称
export const positionalTitlesOptions = [
  { label: '主任医师', value: PositionalTitles.ChiefPhysician },
  { label: '副主任医师', value: PositionalTitles.AssociateChiefPhysician },
  { label: '主治医师', value: PositionalTitles.AttendingPhysician },
  { label: '医师', value: PositionalTitles.Physician }
]

// 价格区间
export const priceRangeOptions = [
  { label: '0-19', value: PriceRange.ZeroToNineteen },
  { label: '20-49', value: PriceRange.TwentyToFortyNine },
  { label: '50-79', value: PriceRange.FiftyToSeventyNine },
  { label: '80以上', value: PriceRange.MoreThanEighty }
]

// 获取支付地址 ，完成支付
// 测试账号：askgxl8276@sandbox.com 或者 scobys4865@sandbox.com
// 登录密码：111111
// 支付密码：111111

// 提供了100个测试账号
// 手机号：13230000001 - 13230000100
// 密码：abc12345

// 110101198307212600
// 110101196107145504
// 11010119890512132X
// 110101196501023433
// 110101197806108758
// 110101198702171378
// 110101198203195893
// 如有雷同纯属巧合，可删除。
