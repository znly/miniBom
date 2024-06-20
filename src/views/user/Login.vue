<template>
    <div class="main">
        <div class="banner">
            <div class="header-menu">
                <div style="margin: 0 30px;">
                    <img style="width: 100px;height: 56.24px;" :src="require('@/assets/logo.jpg')" alt="Element logo" />
                </div>
            </div>
        </div>
        <div class="main-content">
            <div class="ng-scope">
                <el-image
                    src="https://res-static.hc-cdn.cn/cloudbu-site/china/zh-cn/advertisement/Smart%20for%20login/2024-04/1713316607874788693.png">
                </el-image>
            </div>
            <div class="login-area">
                <div class="login-title">
                    <span>用户登录</span>
                </div>
                <div class="login-form">
                    <el-form :model="loginForm" label-width="80px" label-position="right" size="large">
                        <el-form-item label="用户名:">
                            <el-input v-model="loginForm.username">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="用户密码:">
                            <el-input v-model="loginForm.userpwd" show-password style="width: 300px;">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-checkbox v-model="remeberPwd" label="记住密码" size="large" />
                            <span style="color: rgba(0,0,0,.5);cursor: pointer;margin-left: 100px;"
                                @click="registerDialog = true">注册用户</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" style="width: 300px" @click="login">登录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <!-- 用户注册弹窗 -->
        <el-dialog v-model="registerDialog" title="用户注册" draggable>
            <div>
                <el-form :model="registerForm" ref="registerFormRef" :rules="formRules" label-width="100px"
                    label-position="right">
                    <el-form-item label="用户名" prop="username">
                        <el-input style="width: 300px;" v-model="registerForm.username" />
                    </el-form-item>
                    <el-form-item label="用户密码" prop="password">
                        <el-input style="width: 300px;" v-model="registerForm.password" type="password" show-password/>
                    </el-form-item>
                </el-form>
            </div>
            <div>
                <el-button type="primary" @click="register">注册</el-button>
                <el-button @click="registerDialog = false">取消</el-button>
            </div>
            <div>

            </div>

        </el-dialog>

    </div>
</template>

<script>
import { reactive, ref, } from 'vue'
import { ElMessage } from 'element-plus'
import userapi from '@/api/userapi'
import router from '@/router'
import store from '@/store'
import encryption from '@/utils/Encryption'
export default {
    name: 'login',
    mounted() {
        //获取本地存储
        let user = JSON.parse(localStorage.getItem('userinfo'));
        if (user) {
            this.loginForm.username = user.username;
            this.loginForm.userpwd = user.userpwd;
            this.remeberPwd = true;
        }

    },
    setup() {
        //用户登录表单
        const loginForm = reactive({
            username: '',
            userpwd: '',
        })
        //用户记住密码选项
        const remeberPwd = ref(false);

        //用户登录
        function login() {
            //1.先校验输入是否为空
            if (loginForm.username == '') {
                ElMessage({ type: 'warning', message: '用户名不能为空' });
                return;
            }
            if (loginForm.userpwd == '') {
                ElMessage({ type: 'warning', message: '密码不能为空' });
                return;
            }
            //2.请求api获取数据 其中密码进行加密
            userapi.login(loginForm.username, encryption.encryptdata(loginForm.userpwd)).then(res => {
                // console.log(res);
                if (res.code == 200) {
                    //登录成功提醒
                    ElMessage({ type: 'success', message: res.msg });
                    //如果记住密码就存储到本地存储
                    if (remeberPwd) {
                        localStorage.setItem('userinfo', JSON.stringify(loginForm));
                    }
                    //存入vuex
                    store.state.user = res.data;
                    //跳转主页
                    router.push('/main');
                } else {
                    ElMessage({ type: 'error', message: res.msg });
                }
            })

        }

        //用户注册弹窗
        const registerDialog = ref(false);
        //用户注册表单
        const registerForm = reactive({
            username: '',
            password: '',
        })
        //注册表单校验
        //表单校验
        const formRules = {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
                { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
            ],
            password: [
                { required: true, message: '请输入密码', trigger: 'blur' },
                { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
            ],
        }
        // TODO 表单整体校验 + 登录
        const registerFormRef = ref(null);
        //用户注册方法
        const register = () => {
            //表单校验
            registerFormRef.value.validate((valid) => {
                if (valid) {
                    // console.log('注册表单校验通过');
                    //调用注册api
                    userapi.register(registerForm.username, registerForm.password).then(res => {
                        console.log('注册回调', res);
                        if (res.code == 200) {
                            ElMessage({ type: 'success', message: '注册成功' });
                            //延时关闭
                            setTimeout(() => {
                                registerDialog.value = false;
                            }, 1500);
                        } else {
                            ElMessage({ type: 'error', message: res.msg });
                        }
                    })
                } else {
                    //校验不通过
                    ElMessage({ type: 'warning', message: '请输入必填字段' });
                }
            })


        }

        //返回数据
        return {
            loginForm, login, remeberPwd, registerDialog, registerForm, register, formRules,
            registerFormRef,
        }
    },

}
</script>

<style scoped>
.main {
    background-image: url(https://console-static.huaweicloud.com/static/authui/20240418100141/public/hws/images/background_login.jpg);
    background-size: cover;
    margin: 0;
    padding: 0;
    height: 100%;
    min-width: 1200px;
}

.banner {
    background-color: #FFF;
    position: fixed;
    top: 0;
    box-shadow: 0 2px 8px 0 rgb(174 186 208 / 27%);
    width: 100%;

}

.header-menu {
    display: flex;
    align-items: center;
}

.main-content {
    margin-top: 30px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    height: 100%;
}

.login-area {
    margin-top: 40px;
    background: #fff;
    border-radius: 4px;
    height: 515px;
}

.login-form {
    width: 376px;
    display: flex;
    align-items: center;
    background: #fff;
    border-radius: 4px;
    flex-direction: column;
    padding: 32px 44px;

}

.login-title {
    font-size: 24px;
    font-weight: 400;
    line-height: 32px;
    margin-top: 20px;
    margin-bottom: 20px;
}

.ng-scope {
    width: 800px;
    margin-top: 40px;
    height: 515px;
}
</style>