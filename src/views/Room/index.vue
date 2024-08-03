<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'

import type { Socket } from 'socket.io-client'
import { io } from 'socket.io-client'
import { nextTick, onMounted, onUnmounted, provide, ref } from 'vue'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { useRoute } from 'vue-router'
import { MsgType } from '@/enums'
import type { Message, TimeMessages } from '@/types/room'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { getConsultOrderDetail } from '@/services/consult'
import { OrderType } from '@/enums'
import { showToast } from 'vant'
import dayjs from 'dayjs'

const store = useUserStore()
const route = useRoute()

// 建立链接，创建 socket.io 实例
let socket: Socket
/** 初始化链接*/
const initSocketConnect = () => {
  // 建立链接，创建 socket.io 实例
  socket = io(baseURL, {
    auth: {
      token: `Bearer ${store.user?.token}`
    },
    query: {
      orderId: route.query.orderId
    }
  })

  socket.on('connect', () => {
    // 建立连接成功
    console.log('connect')
    // 新的链接清除聊天记录
    list.value = []
  })

  socket.on('error', (event) => {
    // 错误异常消息
    console.log('error', event)
  })

  socket.on('disconnect', () => {
    // 已经断开连接
    console.log('disconnect')
  })
}
/** 问诊单详情 */
const consult = ref<ConsultOrderItem>()
// 注入问诊单信息
provide('consult', consult)
/** 加载问诊订单信息 */
const loadConsult = async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
}

/** 消息列表*/
const list = ref<Message[]>([])
/** 处理接收聊天记录，并且转换处理添加到消息渲染列表*/
const handleChatRecord = ({ data }: { data: TimeMessages[] }) => {
  // 准备转换常规消息列表
  const arr: Message[] = []
  data.forEach((item, i) => {
    if (i === 0) time.value = item.createTime
    arr.push({
      msgType: MsgType.Notify,
      msg: { content: item.createTime },
      createTime: item.createTime,
      id: item.createTime
    })
    arr.push(...item.items)
  })
  // 追加到聊天消息列表
  list.value.unshift(...arr)
  // 下拉刷新关闭
  loading.value = false
  // 判断是否有数据？没有提示 没有聊天记录了
  if (!data.length) {
    return showToast('没有聊天记录了')
  }
  // 如果是（进入问诊室）初次获取的聊天，需要滚动到最底部
  nextTick(() => {
    if (initialMsg.value) {
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      window.scrollTo(0, document.body.scrollHeight)
      initialMsg.value = false
    }
  })
}

/** 接收的信息加入到消息列表 并且滚动到 最新消息位置*/
const handleReceiveMsg = async (event: Message) => {
  list.value.push(event)
  await nextTick()
  // 在问诊室，收到消息就设为已读
  socket.emit('updateMsgStatus', event.id)
  window.scrollTo(0, document.body.scrollHeight)
}

onMounted(async () => {
  // 初始化连接
  initSocketConnect()

  // 订单状态
  socket.on('statusChange', loadConsult)

  // 监听聊天记录（聊天记录默认获取一次记录）
  socket.on('chatMsgList', handleChatRecord)

  // 监听接收消息
  socket.on('receiveChatMsg', handleReceiveMsg)
})
onUnmounted(() => {
  socket.close()
})

onMounted(async () => {
  const res = await getConsultOrderDetail(route.query.orderId as string)
  consult.value = res.data
})

// 处理发送消息
/** 文字信息发送 */
const sendText = (text: string) => {
  // 发送信息需要  发送人  收消息人  消息类型  消息内容
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}
/** 图片信息发送 */
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

// 消息列表的下拉刷新，处理
const loading = ref(false)
// 是否初次获取消息
const initialMsg = ref(true)

// 下拉刷新获取消息的时间起点
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))

const onRefresh = () => {
  // 触发下拉
  //向socket服务端发送数据 参数：pageSize: number, lastTime: string, orderId: string
  // socket.emit('getChatMsgList', 20, '2022-08-26 ', '276027147277')
  socket.emit('getChatMsgList', 20, time.value, route.query.orderId)
}

/** 提供修改评价的函数 */
const completeEva = (score: number) => {
  const item = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (item) {
    item.msg.evaluateDoc = { score }
    item.msgType = MsgType.CardEva
  }
}
provide('completeEva', completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown" />

    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message :list="list" />
    </van-pull-refresh>

    <room-action
      :disabled="consult?.status !== OrderType.ConsultChat"
      @send-text="sendText"
      @send-image="sendImage"
    ></room-action>
  </div>
</template>

<style lang="scss" scoped>
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);

  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150px);
  }
}
</style>
