import type {
  CodeType,
  Patient,
  PatientList,
  User,
  UserInfo
} from '@/types/user'
import { request } from '@/utils/request'
/** 密码登录 */
export const loginByPassword = (mobile: string, password: string) => {
  return request<User>('/login/password', 'POST', { mobile, password })
}
/** 短信登录 */
export const loginByMobileCode = (mobile: string, code: string) => {
  return request<User>('/login', 'POST', { mobile, code })
}
/** 发送验证码 */
export const sendMobileCode = (mobile: string, type: CodeType) => {
  return request('/code', 'GET', { mobile, type })
}
// 获取个人信息
export const getUserInfo = () => request<UserInfo>('/patient/myUser')

// 获患者信息列表
export const getPatientList = () => request<PatientList>('/patient/mylist')

// 添加患者信息
export const addPatient = (patient: Patient) =>
  request('/patient/add', 'POST', patient)

// 编辑患者信息
export const editPatient = (patient: Patient) =>
  request('/patient/update', 'PUT', patient)

// 删除患者信息
export const delPatient = (id: string) =>
  request(`/patient/del/${id}`, 'DELETE')

// 查询患者详情
export const getPatientDetail = (id: string) =>
  request<Patient>(`/patient/info/${id}`)

/** 获取未读消息数目*/
export const getUnreadMessageCount = () =>
  request<number>('/patient/message/unread/all')

/**评价问诊*/
export const evaluateConsultOrder = (data: {
  docId: string
  orderId: string
  score: number
  content: string
  anonymousFlag: 0 | 1
}) => request<{ id: string }>('/patient/order/evaluate', 'POST', data)

// QQ 登录
export const loginByQQ = (openId: string) =>
  request<User>('/login/thirdparty', 'POST', { openId, source: 'qq' })

// 绑定手机
export const bindMobile = (data: {
  mobile: string
  code: string
  openId: string
}) => request<User>('/login/binding', 'POST', data)
