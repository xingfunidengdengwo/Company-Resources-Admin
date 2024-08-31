<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../api'
import { ElMessageBox, ElMessage, ElAvatar } from 'element-plus';
import { Plus } from '@element-plus/icons-vue';
import type { UploadProps } from 'element-plus'


const user = sessionStorage.getItem("user");

// 定义绑定数据
const tableData = ref([]);
// 控制新增信息窗口是否显示
// const addWinVisible = ref(false);
// 控制编辑信息窗口是否显示
const editWinVisible = ref(false);
// 上传头像窗口控制
const uploadImgWinVisible = ref(false);
// 新增数据绑定对象
// const addObject = ref({});
// 编辑数据绑定对象
const editObject = ref({});
// 上传头像绑定的数据
const imageUrl = ref({});
// 查询数据的文本
const checkObj = ref({
    page: 1,
    size: 10
});
const total = ref(90);
// 记录修改数据的下标
var editIndex = -1;

// 挂载页面时查询数据
onMounted(async function () {

    checkData(editObject.value.name);

});

const del = function (index, row) {
    ElMessageBox.confirm(
        "确定要注销该账户吗，该操作不可恢复?",
        "提示框",
        {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(async function () {
        // 提交数据
        let result = await api.del("/api/operators", row.id);
        if (result.code == 200) {
            // 刷新表格数据
            tableData.value.splice(index, 1);
            // 提示删除成功
            ElMessage({
                type: 'success',
                message: '注销成功，请重新登陆'
            })
            sessionStorage.removeItem("token");
            setTimeout(() => {
                location.reload();
            }, 2000);

        } else {
            ElMessage({
                type: 'info',
                message: result.message
            })
        }
    })
}

// 保存新增数据
// const addSave = async function () {
//     // 发送请求
//     let result = await api.postJson("/api/operators", addObject.value);
//     if (result.code == 200) {
//         // 表格数据变更
//         tableData.value.unshift(result.data);
//         // 提示
//         ElMessage({
//             type: 'success',
//             message: '注册成功'
//         })

//         closeAddWin();
//     }
//     else if (result.code == 400) {

//         ElMessage({
//             type: 'warning',
//             message: '用户名已存在'
//         });
//     }
// }

// 保存编辑数据
const editSave = async function () {

    // 发送请求
    let result = await api.putJson("/api/operators", editObject.value);
    // 刷新表格
    tableData.value[editIndex] = result.data;
    // 提示
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '保存成功，请重新登陆'
        });
        editWinVisible.value = false;
        sessionStorage.removeItem("token");
        setTimeout(() => {
            location.reload();
        }, 2000);
    } else {
        ElMessage({
            type: 'info',
            message: result.message
        })

    }

}

// 点击编辑按钮执行的方法
const edit = function (index, row) {
    // 记录修改数据的下标
    editIndex = index;
    // 绑定要修改的数据
    editObject.value.id = row.id;
    editObject.value.name = row.name;
    editObject.value.password = row.password;
    // editObject.value.email = row.email;

    // 打开对话框
    editWinVisible.value = true;
}
// 显示窗口
// const openAddWin = () => {
//     addObject.value = {};
//     addWinVisible.value = true;
// }
// const closeAddWin = () => {
//     addWinVisible.value = false;
// }

// const changePage = function (val) {
//   //val 就是点击的页码
//   pageObj.value.page = val;
// }

const checkData = async function (val) {
    // 点击分页按钮
    if (typeof val == 'number') {
        checkObj.value.page = val;
    }
    // 查询数据
    let result = await api.get("/api/operators", checkObj.value);
    // result  {code,data,message}   data-->{list,count}
    // 更新表格中的数据
    tableData.value = result.data.list;
    total.value = result.data.count;
}


const uploadimg = function (index, row) {
    uploadImgWinVisible.value = true;
    // 显示该用户已经上传的头像

    editIndex = index;
    editObject.value = row;
    console.log(row);
}

const handleAvatarSuccess: UploadProps['onSuccess'] = function (result, uploadFile) {
    console.log(result);
    console.log(uploadFile);
    imageUrl.value = "api" + result.data;
}
const beforeAvatarUpload: UploadProps['beforeUpload'] = function (rawFile) {
    if (rawFile.type !== 'image/jpeg') {
        ElMessage.error('必须是jpeg格式!')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('图片不能大于2M!')
        return false
    }
    return true
}

const saveimg = async function () {
    // 将文件的地址和数据 id 发送到后台保存
    editObject.value.img = imageUrl.value;
    let result = await api.putForm("/api/operatorsimg", editObject.value);
    uploadImgWinVisible.value = false;
    ElMessage({ type: 'success', message: '头像将在重新登陆后生效' })

}
</script>

<template>
    <!-- <el-button type="success" @click="openAddWin">注册新的管理员账户</el-button> -->
    <el-input v-model="checkObj.name" style="width: 150px;" placeholder="输入名称查询" />
    <el-input v-model="checkObj.email" style="width: 150px ;margin-left: 10px;" placeholder="输入邮箱查询" />
    <el-button type="success" @click="checkData" style="margin-left: 10px;">查询</el-button>

    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="150" />
        <el-table-column prop="img" label="头像" width="100px">
            <template #default="scope">
                <div class="demo-image_preview">
                    <el-image style="width: 50px;height: 50px" :src="scope.row.img" :zoom-rate="1.2" :max-scale="7"
                        :min-scale="0.2" :preview-src-list="scope.row.img" :initial-index="0" fit="cover" />
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="用户名" width=150px; />
        <el-table-column prop="email" label="邮箱" />

        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="danger" @click="uploadimg(scope.$index, scope.row)"
                    :disabled="scope.row.name != user">上传头像</el-button>
                <el-button type="warning" @click="edit(scope.$index, scope.row)"
                    :disabled="scope.row.name != user">修改用户信息</el-button>
                <el-button type="danger" @click="del(scope.$index, scope.row)"
                    :disabled="scope.row.name != user">注销账户</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- current-page 分页组件初始显示的页码 size:每页的条数-->
    <el-pagination :page-size="checkObj.size" :current-page="checkObj.page" background layout="prev, pager, next"
        :total="total" @current-change="checkData" />

    <!-- 上传头像的弹出框 -->
    <el-dialog v-model="uploadImgWinVisible" title="上传头像" width="500">
        <el-upload class="avatar-uploader" action="/api/operatorsimg/1" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="editObject.img" :src="editObject.img" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
                <Plus />
            </el-icon>
        </el-upload>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="saveimg">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>

    <!-- 新增信息的弹出框 -->
    <!-- <el-dialog v-model="addWinVisible" title="新增" width="500">

        <el-form :model="addObject">
            <el-form-item label="用户名" label-width="80">
                <el-input v-model="addObject.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="密码" label-width="80">
                <el-input v-model="addObject.password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="邮箱" label-width="80">
                <el-input v-model="addObject.email" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addWinVisible = false">取消</el-button>
                <el-button type="primary" @click="addSave">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog> -->

    <!-- 编辑信息的弹出框 -->
    <el-dialog v-model="editWinVisible" title="修改用户名和密码" width="500">

        <el-form :model="editObject">
            <el-form-item label="新用户名" label-width="80">
                <el-input v-model="editObject.name" autocomplete="off" />
            </el-form-item>
            <!-- <el-form-item label="邮箱" label-width="80">
                <el-input v-model="editObject.email" autocomplete="off" />
            </el-form-item> -->
            <el-form-item label="原密码" label-width="80">
                <el-input v-model="editObject.originalPassword" type="password" autocomplete="off" />
            </el-form-item>
            <el-form-item label="新密码" label-width="80">
                <el-input v-model="editObject.newPassword" type="password" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="editWinVisible = false">取消</el-button>
                <el-button type="primary" @click="editSave">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>

</template>

<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;

}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>