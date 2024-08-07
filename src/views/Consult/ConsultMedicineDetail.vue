<script setup lang="ts">
import { getMedicineDetail } from '@/services/consult'
import { useConsultStore } from '@/stores'
import type { MedicineDetail } from '@/types/consult'
import { ref } from 'vue'
import { onMounted } from 'vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import MedicineAction from './components/MedicineAction.vue'
const route = useRoute()
const id = computed(() => route.params.id)
const detail = ref<MedicineDetail>()
onMounted(() => {
  loadDetail()
})
const loadDetail = async () => {
  const { data } = await getMedicineDetail(id.value as string)
  detail.value = data
}

const consultStore = useConsultStore()
// 加入药箱5
const onAddToCart = () => {
  const medicines = consultStore.consult.medicines || []
  const medicine = medicines?.find((item) => item.id === detail.value?.id)
  if (medicine) {
    medicine.quantity += 1
  } else {
    medicines.push({
      amount: detail.value?.amount!,
      avatar: detail.value?.avatar!,
      id: detail.value?.id!,
      name: detail.value?.name!,
      prescriptionFlag: detail.value?.prescriptionFlag!,
      specs: detail.value?.specs!,
      usageDosag: detail.value?.usageDosag!,
      quantity: '1'
    })
  }
  consultStore.setMedicines(medicines)
}
</script>

<template>
  <div class="medicine-detail-page" v-if="detail">
    <cp-nav-bar :title="detail.name"></cp-nav-bar>
    <!-- 主图片 -->
    <van-swipe indicator-color="#fff">
      <van-swipe-item v-for="(item, index) in detail.mainPictures" :key="index">
        <img :src="item" alt="" />
      </van-swipe-item>
    </van-swipe>

    <div class="detail-top">
      <div class="info">
        <p class="name">
          <span>{{ detail.name }}</span>
        </p>
        <p class="size">
          <van-tag v-if="detail.prescriptionFlag === 1">处方药</van-tag>
          <span>{{ detail.specs }}</span>
        </p>
        <p class="price">￥{{ detail.amount }}</p>
      </div>
    </div>

    <div class="pay-space"></div>
    <MedicineAction from="detail" @addToCart="onAddToCart"></MedicineAction>
    <div class="detail-bottom">
      <div class="info-item">
        <div class="info-title">药品名称</div>
        <div class="info-desc">{{ detail.name }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">品牌</div>
        <div class="info-desc">{{ detail.brand }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">功能主治</div>
        <div class="info-desc">{{ detail.indicationsFunction }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">不良反应</div>
        <div class="info-desc">{{ detail.untowardReaction }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">禁忌</div>
        <div class="info-desc">{{ detail.contraindication }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">注意事项</div>
        <div class="info-desc">{{ detail.preparation }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">有效期</div>
        <div class="info-desc">{{ detail.expiration }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">执行标准</div>
        <div class="info-desc">{{ detail.standard }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">批准文号</div>
        <div class="info-desc">{{ detail.approvalNo }}</div>
      </div>
      <div class="info-item">
        <div class="info-title">生产企业</div>
        <div class="info-desc">{{ detail.manufacturer }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.medicine-detail-page {
  padding: 46px 0px 45px;

  .van-swipe {
    img {
      width: 100%;
    }
  }

  .detail-top {
    padding: 15px;
    .info {
      padding-left: 15px;
      width: 250px;
      .name {
        display: flex;
        font-size: 15px;
        margin-bottom: 5px;
        > span:first-child {
          width: auto;
        }
        > span:last-child {
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
  }
  .detail-bottom {
    padding: 15px;
    .info-item {
      margin-bottom: 30px;
      .info-title {
        font-size: 18px;
        font-family:
          PingFang SC,
          PingFang SC-Medium;
        font-weight: 500;
        color: #000000;
      }
      .info-desc {
        margin-top: 10px;
        font-size: 14px;
        font-family:
          PingFang SC,
          PingFang SC-Regular;
        font-weight: 400;
        color: #3c3e42;
      }
    }
  }
  .pay-space {
    height: 12px;
    background-color: var(--cp-bg);
  }
}
</style>
