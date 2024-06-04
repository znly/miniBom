<template>
    <div style="height: 100%;">
        <el-menu active-text-color="#ffd04b"  class="el-menu-vertical-demo"  
            :default-active="$router.path" text-color="#666" router >
            <el-menu-item index="/main">
                <el-icon><House/></el-icon>
                <span>首页</span>
            </el-menu-item>
            <el-sub-menu index="1">
                <template #title>
                    <el-icon><Menu /></el-icon>
                    <span>属性管理</span>
                </template>
                <el-menu-item-group title="Group One">
                    <el-menu-item index="1-1">item one</el-menu-item>
                    <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                    <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                    <template #title>item four</template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>

            <el-sub-menu index="fenlei">
                <template #title>
                    <el-icon><Grid /></el-icon>
                    <span>分类管理</span>
                </template>
                <el-menu-item-group title="Group One">
                    <el-menu-item index="1-1">item one</el-menu-item>
                    <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                    <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                    <template #title>item four</template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>

            <el-sub-menu index="bom">
                <template #title>
                    <el-icon><Management /></el-icon>
                    <span>部件&BOM管理</span>
                </template>
                <el-menu-item-group title="Group One">
                    <el-menu-item index="1-1">item one</el-menu-item>
                    <el-menu-item index="1-2">item two</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group title="Group Two">
                    <el-menu-item index="1-3">item three</el-menu-item>
                </el-menu-item-group>
                <el-sub-menu index="1-4">
                    <template #title>item four</template>
                    <el-menu-item index="1-4-1">item one</el-menu-item>
                </el-sub-menu>
            </el-sub-menu>

            <el-menu-item index="/main/part">
                <template #title>
                    <el-icon><Management /></el-icon>
                    <span>部件&BOM管理</span>
                </template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.el-menu-vertical-demo{
    height: 100%;
    position: relative;
    box-shadow: 0 2px 4px #d7d7d7;
    background-color: #fff;
    overflow: auto;
}
</style>