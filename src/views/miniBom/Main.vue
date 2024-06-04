<template>
    <div class="common-layout">
        <el-container style="height: 100%;">
            <el-header
                style="--el-header-padding: 0px;background-color: #FFF;box-shadow: 0 2px 8px 0 rgb(174 186 208 / 27%)">
                <MainHeader></MainHeader>
            </el-header>
            <el-container style="height: 100%;">
                <el-aside width="200px" style="height: 100%;">
                    <MainAsideVue></MainAsideVue>
                </el-aside>
                <el-main class="main" style="padding: 0;">
                    <keep-alive>
                        <router-view></router-view>
                    </keep-alive>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script>
import MainHeader from '@/components/MainHeader.vue';
import MainAsideVue from '@/components/MainAside.vue';
export default {
    name: 'main',
    components: {
        MainHeader, MainAsideVue
    },
    setup() {
        return {

        }
    },

    //未登录不允许访问
    beforeRouteEnter(to, from, next) {
        next();
    }
}
</script>

<style scoped>
.common-layout {
    height: 100%;
}

main {
    height: 100%;
    background: #f1f1f1 !important;
}
</style>