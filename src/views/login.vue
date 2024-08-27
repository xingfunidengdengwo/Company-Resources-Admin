<script lang="ts" setup>

import { ref, reactive, computed, onMounted } from 'vue';
import api from '../api';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';
import { ElNotification } from 'element-plus'
import Vcode from 'vue3-puzzle-vcode'

// 引用表单
const formRef = ref({});
// 路由对象
const router = useRouter();
// 登录对象
const loginObj = ref({});

// 登录界面表单验证规则
const loginRules = {
    name: [
        { required: true, message: '请输入姓名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    code: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
};

// 忘记密码状态
const editWinVisible = ref(false);
const editObject = ref({
    name: '',
    emailVcode: '',
    newPassword: '',
    confirmPassword: ''
});

// 打开忘记密码弹出框
const openWindow = async function () {
    editWinVisible.value = true;
}

// 发送邮件验证码
const sendMsg = async function () {
    // 发送邮件
    console.log(editObject.value)
    let result = await api.postJson("/api/sendmsg", editObject.value);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '重置密码的邮件已发送，请查收您的邮箱'
        })
    } else {
        ElMessage({
            type: 'info',
            message: result.message
        })
    }
}

// 忘记密码表单验证函数
const ruleFormRef1 = ref<FormInstance>()

// 忘记密码处理函数
const handleForgetPassword = async (formEl: FormInstance | undefined) => {
    // 进行表单验证
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            let result = await api.putJson("api/validatecode", editObject.value);
            console.log(editObject.value);
            console.log(result);
            if (result.code == 200) {
                editWinVisible.value = false;
                ElMessage({
                    type: 'success',
                    message: '重置密码成功'
                });
            } else {
                ElMessage({
                    type: 'warning',
                    message: result.message
                });
            }
        } else {
            ElMessage({
                type: 'warning',
                message: '表单验证不通过，请检查输入'
            });
        }
    })
}

// 注册处理函数
const doRegister = () => {
    // 跳转注册
    router.push("/register");
    console.log('注册');
};

// 登陆滑块验证
// 自定义背景图，自己准备一张图片，引入即可
import Img from '../assets/images/loginbackgroundimg.jpg'
// 引入'vue3-puzzle-vcode'插件
// 获取路由器
let $router = useRouter()
// 滑块验证模态框是否出现，默认不展示
const isShow = ref(false)
// 登录按钮
const login = () => {
    // 展现滑块验证码模态框
    isShow.value = true
}
// 用户通过了滑块验证
const success = (msg) => {
    isShow.value = false
    console.log('验证通过' + msg)
    formRef.value.validate(async (valid) => {
        if (identifyCode.value != loginObj.value.code) {
            ElMessage({
                type: 'warning',
                message: '验证码错误，请重新输入！'
            })
            return
        }
        if (valid) {
            let result = await api.postJson("/api/dologin", loginObj.value);
            console.log(result.value)
            if (result.code == 200 && result.data) {
                // 登录成功
                // 存放 token
                sessionStorage.setItem("token", result.data.token);
                if (result.data.operators != null) {
                    sessionStorage.setItem("userId", result.data.operators.id);
                }
                if (result.data.operators != null) {
                    sessionStorage.setItem("user", result.data.operators.name);
                }
                if (result.data.operators != null) {
                    sessionStorage.setItem("avatar", result.data.operators.img);
                    // 提示
                    ElMessage({
                        type: 'success',
                        message: result.message
                    });
                    // 获取当前登录的用户名
                    const user = sessionStorage.getItem("user");
                    // 用户登陆提示
                    loginNotify(user);
                    setTimeout(function () {
                        // js 代码跳转
                        router.push("/home");
                    }, 2000);
                } else {
                    ElMessage({
                        type: 'warning',
                        message: "用户名或密码不正确！"
                    });
                }
            }
        }
    });
}

// 用户点击滑块遮罩层，关闭模态框
const close = () => {
    isShow.value = false
}
// 用户滑块验证失败
const fail = () => {
    console.log('验证失败')
}

// 验证码开始
import dentify from "./code.vue";

const identifyCodes = "1234567890abcdefjhijklinopqrsduvwxyz"; // 随机串内容, 从这里随机抽几个显示验证码
const identifyCode = ref(""); // 验证码图片内容

onMounted(() => {
    // 初始化验证码
    refreshCode();
});

const refreshCode = () => {
    identifyCode.value = "";
    makeCode(identifyCodes, 4);
};

const makeCode = (o, l) => {
    for (let i = 0; i < l; i++) {
        // 通过循环获取字符串内随机几位
        identifyCode.value += o[randomNum(0, o.length)];
    }
};

const randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
};
// 验证码结束

// 登录提示
const loginNotify = (user) => {
    ElNotification({
        title: '成功',
        message: '欢迎登陆' + user,
        type: 'success',
    })
}

// 忘记密码表单验证规则
const forgetPasswordRules = {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    emailVcode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为 6 位', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        {
            validator: (rule, value, callback) => {
                // 验证两次密码是否一致
                console.log(value, editObject.value.newPassword);
                if (value == '' || editObject.value.newPassword == value) {
                    callback();
                } else {
                    callback(new Error('两次输入的密码不一致'));
                }
            }, trigger: 'blur'
        }
    ]
};

</script>

<template>
    <div class="login-container">
        <h3>欢迎访问！</h3>
        <h2> 公司公共资源管理系统</h2>
        <el-form ref="formRef" :model="loginObj" :rules="loginRules" label-width="100px">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="loginObj.name" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="loginObj.password" />
            </el-form-item>
            <el-form-item label="验证码" prop="code">
                <el-input v-model="loginObj.code" style="width: 180px;" />
                <!-- 验证码 -->
                <span @click="refreshCode">
                    <dentify :identifyCode="identifyCode" style="height:38px;margin-left: 10px;" />
                </span>
            </el-form-item>
            <div class="el-form-item" style="display: block">
                <span class="inline-block">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="warning" @click="openWindow">忘记密码</el-button>
                    <el-button type="default" @click="doRegister">注册</el-button>
                    <Vcode :show="isShow" @success="success" @close="close" @fail="fail" :imgs="[Img]"></Vcode>
                </span>
            </div>
        </el-form>
    </div>

    <!-- 忘记密码弹出窗口开始 -->
    <el-dialog v-model="editWinVisible" title="重置密码" width="600">
        <el-form :model="editObject" :rules="forgetPasswordRules" ref="ruleFormRef1">
            <el-form-item label="用户名" label-width="80" prop="name">
                <el-input v-model="editObject.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="验证码" label-width="80" prop="emailVcode">
                <el-input v-model="editObject.emailVcode" autocomplete="off" style="width: 180px;" />
                <el-button class="sendMsg" @click="sendMsg" :disabled="!editObject.name"
                    style="margin-left: 20px;">发送验证码</el-button>
            </el-form-item>
            <el-form-item label="新密码" label-width="80" prop="newPassword">
                <el-input v-model="editObject.newPassword" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="确认密码" label-width="80" prop="confirmPassword">
                <el-input v-model="editObject.confirmPassword" type="password" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editWinVisible = false">取消</el-button>
                <el-button type="primary" @click="handleForgetPassword(ruleFormRef1)">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 忘记密码弹出窗口结束 -->

</template>

<style scoped>
.login-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background: url('../assets/images/loginbackgroundimg.jpg');
}

h2 {
    font-size: 30px;
    font-weight: bold;
    color: rgb(155, 0, 255);
    margin-bottom: 20px;
}

h3 {
    font-size: 20px;
    font-weight: bold;
    color: rgb(0, 120, 255);
    margin-bottom: 20px;
}

.el-form {
    width: 400px;
    padding: 50px;
    background-color: rgba(255, 255, 255, 0.8);
    border-radius: 20px;
}

span.inline-block {
    display: flex;
    align-items: center;
    text-align: center;
}

.el-form-item label {
    font-weight: bold;
    text-align: center;
    display: flex;
}

.el-button {
    width: 30%;
}
</style>