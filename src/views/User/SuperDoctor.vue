<script setup lang="ts"></script>
<template>
  <div class="super-doctor">
    <iframe
      src="https://consult-doc-client.itheima.net/grab"
      frameborder="0"
      width="100%"
      height="100%"
      min-height="100vh"
    >
    </iframe>
    <!-- home -->
    <van-button class="btn" to="/home">home</van-button>
  </div>
</template>
<style scoped lang="scss">
.super-doctor {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
}
.btn {
  position: fixed;
  bottom: 50%;
  left: 0;
  width: 60px;
  height: 60px;

  background-color: #dbcacaa4;
}
</style>
