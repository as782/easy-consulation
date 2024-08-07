import type CpIcon from '@/components/CpIcon.vue'
import CpNavBar from '@/components/CpNavBar.vue'
import CpPaySheet from '@/components/CpPaySheet.vue'
import type CpUpload from '@/components/CpUpload.vue'
declare module 'vue' {
  interface GlobalComponents {
    CpNavBar: typeof CpNavBar
    CpIcon: typeof CpIcon
    CpPaySheet: typeof CpPaySheet
    CpUpload: typeof CpUpload
  }
}
