import { IllnessTime } from '@/enums'

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
export const payCallbackUrl = 'http://localhost:5173/room'

// 获取支付地址 ，完成支付
// 测试账号：askgxl8276@sandbox.com 或者 scobys4865@sandbox.com
// 登录密码：111111
// 支付密码：111111
