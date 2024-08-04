import type CpIcon from '@/components/CpIcon.vue'
import CpNavBar from '@/components/CpNavBar.vue'
import CpPaySheet from '@/components/CpPaySheet.vue'
declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpPaySheet: typeof CpPaySheet
  }
}
