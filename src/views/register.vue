<template>
    <div class="register-container">
        <h3>欢迎注册！</h3>
        <h2> 公司公共资源管理系统</h2>
        <el-form ref="formRef" :model="registerForm" :rules="registerRules" label-width="100px"
            @submit.prevent="validate">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="registerForm.name" />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="registerForm.password" />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="registerForm.confirmPassword" />
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email" />
            </el-form-item>
            <el-form-item label="验证码" prop="emailVcode">
                <el-input v-model="registerForm.emailVcode" autocomplete="off" style="width: 180px;" />
                <el-button class="sendMsg" @click="sendRegisterMsg" :disabled="!registerForm.email"
                    style="margin-left: 20px;">发送验证码</el-button>
            </el-form-item>
            <div class="el-form-item" style="display: block ;margin-left: 100px; ">
                <el-button type="primary" @click="validate(formRef)">注册</el-button>
                <el-button type="default" @click="$router.go(-1)">返回</el-button>
            </div>
        </el-form>
    </div>
</template>

<script lang="ts" setup>

import { ref, reactive, computed, onMounted } from 'vue';
import api from '../api';
import { useRouter } from 'vue-router';
import { ElMessageBox, ElMessage } from 'element-plus';
import { ElForm } from 'element-plus';
//定义路由对象
const router = useRouter();

// const formRef = ref({});

// 注册表单数据
const registerForm = ref({
    name: '',
    password: '',
    email: '',
    emailVcode: '',
    confirmPassword: ''
});

// 表单验证规则
const registerRules = {
    name: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, message: '密码长度至少为 6 位', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    confirmPassword: [
        { required: true, message: '请再次输入密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ],
    emailVcode: [
        { required: true, message: '请输入验证码', trigger: 'blur' }
    ],
};

// 验证确认密码是否与密码一致
function validateConfirmPassword(rule, value, callback) {
    if (value === registerForm.value.password) {
        callback();
    } else {
        callback(new Error('两次输入的密码不一致'));
    }
}

// 发送邮件验证码
const sendRegisterMsg = async function () {
    // 发送邮件
    console.log(registerForm.value)
    let result = await api.postJson("/api/sendregistermsg", registerForm.value);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '注册邮件已发送，请查收您的邮箱'
        })
    } else {
        ElMessage({
            type: 'info',
            message: result.message
        })
    }
}

const formRef = ref<FormInstance>()

// 表单验证函数
const validate = async (formEl: FormInstance | undefined) => {

    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            let result = await api.postJson("/api/operators", registerForm.value);
            if (result.code == 200) {
                ElMessage({
                    type: 'success',
                    message: '注册成功'
                });
                // 进行页面跳转
                setTimeout(function () {
                    router.push("/login");
                }, 2000);
            } if (result.code == 400) {

                ElMessage({
                    type: 'warning',
                    message: result.message
                });
            } if (result.code == 401) {
                ElMessage({
                    type: 'warning',
                    message: result.message
                });
            }
        }

        else {
            ElMessage({
                type: 'warning',
                message: '请填写正确的注册信息'
            });
        }
    });
}

</script>

<style scoped>
.register-container {
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

.el-form-item label {
    font-weight: bold;
    text-align: center;
    display: flex;
}

.el-button {
    width: 100px;
}
</style>