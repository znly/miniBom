<template>
    <el-menu :default-active="$router.path" class="el-menu-demo" mode="horizontal" ellipsis="false"
        @select="handleSelect" router >
        <el-menu-item>
            <img style="width: 100px" src="@/assets/logo.jpg" alt="Element logo" />
        </el-menu-item>
        <!-- <el-menu-item index="">首页</el-menu-item> -->
        <div style="position: absolute;right: 20px;">
            <el-menu-item index="/home">个人中心</el-menu-item>
        </div>
    </el-menu>
</template>

<script>
export default {
    mounted(){
    }
}
</script>

<style scoped>
.el-menu-demo {
    position: relative;
}
</style>