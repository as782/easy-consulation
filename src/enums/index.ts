/**问诊类型 找医生| 快速问诊 | 开药问诊*/
export enum ConsultType {
  /** 找医生 */
  Doctor = 1,
  /** 快速问诊 */
  Fast = 2,
  /** 开药问诊 */
  Medication = 3
}
/** 问诊时间，以1自增可以省略 , 一周内 |一月内  |半年内 |半年以上 */
export enum IllnessTime {
  /** 一周内 */
  Week = 1,
  /** 一月内 */
  Month,
  /** 半年内 */
  HalfYear,
  /** 半年以上 */
  More
}
