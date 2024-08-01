import type CpIcon from '@/components/CpIcon.vue'
import CpNavBar from '@/components/CpNavBar.vue'
declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
  }
}
