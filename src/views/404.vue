<!-- eslint-disable vue/multi-word-component-names -->

<template>
    <div class="py-18" style="margin-top: 100px;">
        <el-result icon="warning" title="页面找不到了" sub-title="你找的页面还在开发中哦~">
            <template #extra>
                <el-button type="primary" size="medium" @click="$router.back()">返回</el-button>
            </template>
        </el-result>
    </div>
</template>

<script>


</script>

<style scoped>
</style>