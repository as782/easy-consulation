<script setup lang="ts">
import {
  addPatient,
  delPatient,
  editPatient,
  getPatientList
} from '@/services/user'
import type { PatientList, Patient } from '@/types/user'
import { computed, onMounted, ref } from 'vue'
import { nameRules, idCardRules } from '@/utils/rules'
import {
  showConfirmDialog,
  showSuccessToast,
  showToast,
  type FormInstance
} from 'vant'
import { useRoute, useRouter } from 'vue-router'
import { useConsultStore } from '@/stores'

// -----------------------选择患者时操作---------------
const route = useRoute()
const isChange = computed(() => route.query.isChange === '1')
// 点击选中效果
const patientId = ref<string>()
/**选中患者卡片 */
const selectedPatient = (item: Patient) => {
  if (isChange.value) {
    patientId.value = item.id
  }
}

const store = useConsultStore()
const router = useRouter()
// 是否来自药品咨询
const fromMedicineConsultFlag = computed(
  () => route.query.from === 'medicineConsult'
)

// 选完患者后下一步
const next = async () => {
  if (!patientId.value) return showToast('请选择患者')
  store.setPatient(patientId.value)
  if (fromMedicineConsultFlag.value) {
    router.push('/consult/choose')
  } else {
    router.push('/consult/pay')
  }
}

// --------------家庭档案时的操作----------
//  页面初始化加载数据
const list = ref<PatientList>([])
const loadList = async () => {
  const res = await getPatientList()
  list.value = res.data

  // 是选择患者模式时
  // 设置默认选中的ID，当你是选择患者的时候，且有患者信息的时候
  if (isChange.value && list.value.length) {
    const defPatient = list.value.find((item) => item.defaultFlag === 1)
    if (defPatient) patientId.value = defPatient.id
    else patientId.value = list.value[0].id // 没有默认选第一个
  }
}
onMounted(() => {
  loadList()
})

const options = [
  {
    label: '男',
    value: 0
  },
  {
    label: '女',
    value: 1
  }
]

// 添加患者弹窗
const show = ref(false)
const showPopup = (item?: Patient) => {
  if (item) {
    // 如果点的是编辑，解构出后台需要的数据
    const { id, gender, name, idCard, defaultFlag } = item
    patient.value = { id, gender, name, idCard, defaultFlag }
  } else {
    form.value?.resetValidation() // 重置表单校验
    patient.value = { ...initPatient }
  }
  show.value = true
}
/** 初始化患者信息 */
const initPatient: Patient = {
  name: '',
  idCard: '',
  gender: 1,
  defaultFlag: 0
}
/** 患者信息 */
const patient = ref<Patient>({ ...initPatient })
// 默认值需要转换
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1 ? true : false
  },
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
  }
})

/** 处理添加患者  */
const form = ref<FormInstance>()
const onSubmit = async () => {
  try {
    await form.value?.validate()
    // 身份证倒数第二位，单数是男，双数是女
    const gender = +patient.value.idCard.slice(-2, -1) % 2
    if (gender !== patient.value.gender) {
      await showConfirmDialog({
        title: '温馨提示',
        message: '填写的性别和身份证号中的不一致\n您确认提交吗？'
      })
    }
    // 添加 & 修改
    patient.value.id
      ? await editPatient(patient.value)
      : await addPatient(patient.value)
    show.value = false
    loadList()
    showSuccessToast(patient.value.id ? '编辑成功' : '添加成功')
  } catch (error) {
    console.error(error)
  }
}
// 处理删除患者
const remove = async () => {
  if (patient.value.id) {
    await showConfirmDialog({
      title: '温馨提示',
      message: `您确认要删除 ${patient.value.name} 患者信息吗 ？`
    })
    await delPatient(patient.value.id)
    show.value = false
    loadList()
    showSuccessToast('删除成功')
  }
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar :title="isChange ? '选择患者' : '家庭档案'"></cp-nav-bar>
    <div class="patient-change" v-if="isChange">
      <h3>请选择患者信息</h3>
      <p>以便医生给出更准确的治疗，信息仅医生可见</p>
    </div>
    <div class="patient-list">
      <div
        class="patient-item"
        v-for="item in list"
        :key="item.id"
        @click="selectedPatient(item)"
        :class="{ selected: patientId === item.id }"
      >
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div @click.stop="showPopup(item)" class="icon">
          <cp-icon name="user-edit" />
        </div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>

      <div class="patient-tip">最多可添加 6 人</div>

      <!-- 侧边栏 -->
      <van-popup v-model:show="show" position="right">
        <CpNavBar
          :title="patient.id ? '编辑患者' : '添加患者'"
          right-text="保存"
          @click-right="onSubmit"
          :back="() => (show = false)"
        ></CpNavBar>
        <van-form autocomplete="off" ref="form">
          <van-field
            v-model="patient.name"
            label="真实姓名"
            placeholder="请输入真实姓名"
            :rules="nameRules"
          />
          <van-field
            v-model="patient.idCard"
            label="身份证号"
            placeholder="请输入身份证号"
            :rules="idCardRules"
          />
          <van-field label="性别" class="pb4">
            <!-- 单选按钮组件 -->
            <template #input>
              <cp-radio-btn
                v-model="patient.gender"
                :options="options"
              ></cp-radio-btn>
            </template>
          </van-field>
          <van-field label="默认就诊人">
            <template #input>
              <van-checkbox v-model="defaultFlag" :icon-size="18" round />
            </template>
          </van-field>
        </van-form>
        <van-action-bar v-if="patient.id">
          <van-action-bar-button @click="remove">删除</van-action-bar-button>
        </van-action-bar>
      </van-popup>

      <!-- 选择患者时的 底部按钮 -->
      <div class="patient-next" v-if="isChange">
        <van-button @click="next" type="primary" round block>下一步</van-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;

  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
      transition: 0.4 ease;
    }
  }
}
// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}

.patient-list {
  padding: 15px;
}

.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;

  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;

    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;

      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }

      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }

  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }

  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);

    .icon {
      color: var(--cp-primary);
    }
  }
}

.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;

  .cp-icon {
    font-size: 24px;
  }
}

.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}

.pb4 {
  padding-bottom: 4px;
}

.patient-change {
  padding: 15px;
  > h3 {
    font-weight: normal;
    margin-bottom: 5px;
  }
  > p {
    color: var(--cp-text3);
  }
}
.patient-next {
  padding: 15px;
  background-color: #fff;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 80px;
  box-sizing: border-box;
}
</style>
