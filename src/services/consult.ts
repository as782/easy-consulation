import type {
  Area,
  ConsultOrderItem,
  ConsultOrderListParams,
  ConsultOrderPage,
  ConsultOrderPreData,
  ConsultOrderPreParams,
  Doctor,
  DoctorPage,
  DoctorParams,
  FollowType,
  Image,
  KnowledgePage,
  KnowledgeParams,
  MedicineDetail,
  MedicinePage,
  MedicineParams,
  PageParams,
  PartialConsult,
  TopDep
} from '@/types/consult'

import { request } from '@/utils/request'

/**  获取知识文章 */
export const getKnowledgePage = (params: KnowledgeParams) =>
  request<KnowledgePage>('/patient/home/knowledge', 'GET', params)

/** 推荐医生 */
export const getDoctorPage = (params: PageParams) =>
  request<DoctorPage>('/home/page/doc', 'GET', params)

/** 关注医生 */
export const followOrUnfollow = (id: string, type: FollowType = 'doc') =>
  request('/like', 'POST', { id, type })

/** 获取医生详情*/
export const getDoctorDetail = (id: string) => {
  return request<Doctor>(`doc/detail`, 'GET', {
    docId: id
  })
}

/** 获取科室列表 */
export const getAllDep = () => request<TopDep[]>('/dep/all')

/** 上传图片 */
export const uploadImage = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return request<Image>('/upload', 'POST', fd)
}

/** 拉取预支付订单信息*/
export const getConsultOrderPre = (params: ConsultOrderPreParams) =>
  request<ConsultOrderPreData>('/patient/consult/order/pre', 'GET', params)

/**  生成订单*/
export const createConsultOrder = (data: PartialConsult) =>
  request<{ id: string }>('/patient/consult/order', 'POST', data)

/**  获取支付地址  0 是微信  1 支付宝*/
export const getConsultOrderPayUrl = (params: {
  paymentMethod: 0 | 1
  orderId: string
  payCallback: string
}) => request<{ payUrl: string }>('/patient/consult/pay', 'POST', params)

/** 获取问诊订单详情*/
export const getConsultOrderDetail = (orderId: string) =>
  request<ConsultOrderItem>('/patient/consult/order/detail', 'GET', { orderId })

/**查看处方*/
export const getPrescriptionPic = (id: string) =>
  request<{ url: string }>(`/patient/consult/prescription/${id}`)

/** 获取问诊订单列表*/
export const getConsultOrderList = (params: ConsultOrderListParams) =>
  request<ConsultOrderPage>('/patient/consult/order/list', 'GET', params)

/** 取消订单*/
export const cancelOrder = (id: string) =>
  request(`/patient/order/cancel/${id}`, 'PUT')
/** 删除订单*/
export const deleteOrder = (id: string) =>
  request(`/patient/order/${id}`, 'DELETE')

// 获取药品列表
export const getMedicinePage = (params: MedicineParams) => {
  return request<MedicinePage>('patient/medicine', 'GET', params)
}

// 获取药品详情
export const getMedicineDetail = (id: string) => {
  return request<MedicineDetail>(`patient/medicine/${id}`)
}

/**找医生*/
export const getFindDoctorPage = (params: DoctorParams) => {
  return request<DoctorPage>('/patient/search/doc', 'GET', params)
}

/**获取地区区*/
export const getAllBasicArea = () => {
  return request<Area[]>('basicArea/all')
}
