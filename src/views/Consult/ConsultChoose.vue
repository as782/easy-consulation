<script setup lang="ts">
import MedicineList from './components/MedicineList.vue'
import MedicineAction from './components/MedicineAction.vue'
import { ref } from 'vue'

// 搜索
const searchValue = ref('')
const keyword = ref('')
const onSearch = () => {
  keyword.value = searchValue.value
}
const onCancel = () => {
  keyword.value = ''
}
</script>

<template>
  <div class="consult-choose-page">
    <cp-nav-bar title="选择药品"></cp-nav-bar>
    <van-search
      v-model="searchValue"
      show-action
      placeholder="搜一搜: 药品名称"
      @search="onSearch"
      @cancel="onCancel"
    />
    <!-- 药品列表 -->
    <medicine-list :keyword="keyword"></medicine-list>
    <MedicineAction></MedicineAction>
  </div>
</template>

<style scoped lang="scss">
.consult-choose-page {
  padding-top: 46px;
  .van-search {
    position: sticky;
    top: 46px;
    z-index: 10;
    background-color: #fff;
  }
  .van-action-bar {
    border-top: 1px solid rgba(237, 237, 237, 0.9);
    .total-price {
      width: 200px;
      font-size: 24px;
      line-height: 18px;
      font-weight: 700;
      color: #121826;
    }
  }
  .content {
    --content-height: 400px;
    --content-header-height: 25px;
    padding: 16px;
    height: var(--content-height);
    .content-header {
      position: sticky;
      top: 0px;
      z-index: 10;
      background-color: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: var(--content-header-height);
      padding-bottom: 10px;
      &-left {
        span {
          font-size: 16px;
          color: #000000;
          margin-right: 10px;
        }
        span + span {
          font-size: 13px;
          color: var(--cp-primary);
        }
      }
      &-right {
        span {
          margin-left: 5px;
        }
      }
    }
    .medicine-list {
      padding-bottom: 45px;
    }
  }

  .van-stepper {
    position: absolute;
    right: 0;
    bottom: 15px;
    :deep() {
      .van-stepper__input {
        background: none;
      }
      .van-stepper__minus {
        background-color: #fff;
        border: 0.5px solid #16c2a3;
      }
      .van-stepper__plus {
        background-color: #eaf8f6;
      }
      .van-stepper__minus,
      .van-stepper__plus {
        width: 20px;
        height: 20px;
      }
    }
    &.hide {
      :deep() {
        .van-stepper__minus,
        .van-stepper__input {
          visibility: hidden;
        }
      }
    }
  }
}
</style>
