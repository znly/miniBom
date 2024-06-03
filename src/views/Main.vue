<template>
  <div class="common-layout">
    <el-container>
      <el-header style="--el-header-padding: 0px;background-color: #FFF;box-shadow: 0 2px 8px 0 rgb(174 186 208 / 27%)">
        <MainHeader></MainHeader>
      </el-header>
      <el-main style="--el-main-padding: 20px;">
        <div>
          <h1>主页</h1>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import MainHeader from '../components/MainHeader.vue';
export default {
  name: 'main',
  components:{
    MainHeader
  }

}
</script>

<style></style>