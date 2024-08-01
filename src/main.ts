import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import 'virtual:svg-icons-register' // 注册svg图标

import 'vant/lib/index.css'
import './styles/main.scss'
import pinia from './stores'
const app = createApp(App)

app.use(pinia)
app.use(router)

app.mount('#app')
