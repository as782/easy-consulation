<script setup lang="ts">
import { useRouter } from 'vue-router'
const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()
const emit = defineEmits<{
  (e: 'click-right'): void
}>()
const router = useRouter()
const onClickLeft = () => {
  // 如果有自定义的返回逻辑，优先使用
  if (props.back) {
    props.back()
    return
  }
  // 有历史记录就退
  if (history.state?.back) {
    history.back()
  } else {
    router.push('/')
  }
}
const onClickRight = () => {
  emit('click-right')
}
</script>

<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }

    &__text {
      font-size: 15px;
      color: var(--cp-primary);
    }

    &__title {
      font-size: 20px;
      font-weight: 700;
    }
  }
}
</style>
