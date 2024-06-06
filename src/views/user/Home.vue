<!-- 用户个人主页 -->
<template>
    <div>
        <!-- 个人信息展示 -->

        <div class="userinfo">
            <el-card >
                <el-descriptions class="margin-top" title="个人信息" :column="3" border>
                    <template #extra>
                        <el-button type="primary">编辑</el-button>
                    </template>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <user />
                                </el-icon>
                                用户id
                            </div>
                        </template>
                        {{ $store.state.user.id }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <user />
                                </el-icon>
                                用户名
                            </div>
                        </template>
                        {{ $store.state.user.name }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <Platform />
                                </el-icon>
                                邮箱
                            </div>
                        </template>
                        {{ $store.state.user.email }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <Iphone />
                                </el-icon>
                                电话
                            </div>
                        </template>
                        {{ $store.state.user.telephone }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <tickets />
                                </el-icon>
                                Remarks
                            </div>
                        </template>
                        <el-tag size="small">平台用户</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon>
                                    <Comment />
                                </el-icon>
                                最后更新日期
                            </div>
                        </template>
                        {{ dateUtil.transformDate($store.state.user.lastUpdateTime) }}
                    </el-descriptions-item>
                </el-descriptions>
                <div>
                    <el-button type="danger" style="margin-top: 20px;" @click="logout">退出登录</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import store from '@/store';
import { ElMessage } from 'element-plus';
import dateUtil from '@/utils/DateUtil';
export default {

    name: 'home',
    mounted() {
    },

    setup() {
        //用户退出登录
        function logout(){
            //调用api退出登录

            ElMessage({type:'success',message:'退出登录成功'})
        }

        return {
           logout,dateUtil
        }
    },


    //前置路由守卫 未登录不允许访问
    beforeRouteEnter(to, from, next) {
        if (store.state.user == null) {
            ElMessage({type:'warning',message:'请先登录'});
            location.href = '/login';
            return;
        }
        next();
    }
}
</script>

<style scoped>
.el-descriptions {
    margin-top: 20px;
}

.cell-item {
    display: flex;
    align-items: center;
}

.margin-top {
    margin-top: 20px;
}

.userinfo {
    margin-top: 30px;
    margin-left: 100px;
    margin-right: 100px;
}
</style>