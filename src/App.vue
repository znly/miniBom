<template>
  <el-container style="height: 100%;">
    <el-main style="padding: 0px;">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>


export default {
  name: 'App',
  components: {
  },
  setup() {

  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
  /* 一定要加 不然铺不满整个屏幕 */
  height: 100%;
}

body,
html {
  height: 100%;
  margin: 0;
}
</style>
