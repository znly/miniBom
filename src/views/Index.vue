<template>
  <div class="common-layout">
    <el-container>
      <el-header style="--el-header-padding: 0px;background-color: #FFF;box-shadow: 0 2px 8px 0 rgb(174 186 208 / 27%)">
        <IndexHeader></IndexHeader>
      </el-header>
      <el-main style="--el-main-padding: 20px;">
        <div>
          <h1>欢迎使用</h1>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import IndexHeader from '../components/IndexHeader.vue';
export default {
  name: 'index',
  components:{
    IndexHeader
  }

}
</script>

<style></style>