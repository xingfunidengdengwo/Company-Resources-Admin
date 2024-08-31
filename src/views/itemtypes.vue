<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { ElMessageBox, ElMessage } from 'element-plus';

// 定义绑定数据
const tableData = ref([]);
// 控制新增信息窗口是否显示
const addWinVisible = ref(false);
// 控制编辑信息窗口是否显示
const editWinVisible = ref(false);
// 新增数据绑定对象
const addObject = ref({});
// 编辑数据绑定对象
const editObject = ref({});
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

    checkData();
});

const del = function (index, row) {
    ElMessageBox.confirm(
        "确定要删除该行数据吗?",
        "提示框",
        {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(async function () {
        // 提交数据
        let result = await api.del("/api/itemtypes", row.id);
        if (result.code == 200) {
            // 刷新表格数据
            tableData.value.splice(index, 1);
            // 提示删除成功
            ElMessage({
                type: 'success',
                message: '删除成功'
            })
        } else {
            ElMessage({
                type: 'info',
                message: result.message
            })
        }
    })
}
// 保存新增数据
const addSave = async function () {
    // 进行表单验证
    if (!validateForm(addObject.value)) {
        return;
    }
    // 发送请求
    let result = await api.postJson("/api/itemtypes", addObject.value);
    if (result.code == 200) {
        // 表格数据变更
        tableData.value.unshift(result.data);
        ElMessage({
            type: 'success',
            message: '保存成功'
        })
        // 提示
        closeAddWin();
    } else {
        ElMessage({
            type: 'warning',
            message: result.message
        })
    }
}
// 保存编辑数据
const editSave = async function () {
    // 进行表单验证
    if (!validateForm(editObject.value)) {
        return;
    }
    // 发送请求
    let result = await api.putJson("/api/itemtypes", editObject.value);
    if (result.code == 200) {
        // 刷新表格
        tableData.value[editIndex] = result.data;
        // 提示
        ElMessage({
            type: 'success',
            message: '保存成功'
        });
        editWinVisible.value = false;
    } else {
        ElMessage({
            type: 'warning',
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
    // 打开对话框
    editWinVisible.value = true;
}
// 显示窗口
const openAddWin = () => {
    addObject.value = {};
    addWinVisible.value = true;
}
const closeAddWin = () => {
    addWinVisible.value = false;
}

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
    let result = await api.get("/api/itemtypes", checkObj.value);
    // result  {code,data,message}   data-->{list,count}
    // 更新表格中的数据
    tableData.value = result.data.list;
    total.value = result.data.count;
}

// 表单验证
const validateForm = (formData) => {
    let isValid = true;

    // 验证分类名称
    if (!formData.name || formData.name.trim() === '') {
        ElMessage.error('请输入分类名称');
        isValid = false;
        return isValid;

    }

    return isValid;
};

</script>

<template>
    <el-input v-model="checkObj.name" style="width: 150px" placeholder="输入名称查询" />
    <el-button type="success" @click="checkData" style="margin-left: 10px;">查询</el-button>
    <el-button type="success" @click="openAddWin">新增</el-button>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="分类ID" width="180" />
        <el-table-column prop="name" label="分类名称" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
                <el-button type="warning" @click="edit(scope.$index, scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- current-page 分页组件初始显示的页码 size:每页的条数-->
    <el-pagination :page-size="checkObj.size" :current-page="checkObj.page" background layout="prev, pager, next"
        :total="total" @current-change="checkData" />

    <!-- 新增信息的弹出框 -->
    <el-dialog v-model="addWinVisible" title="新增" width="500">

        <el-form :model="addObject">
            <el-form-item label="分类名称" label-width="80">
                <el-input v-model="addObject.name" autocomplete="off" />
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
    </el-dialog>
    <!-- 编辑信息的弹出框 -->
    <el-dialog v-model="editWinVisible" title="编辑" width="500">

        <el-form :model="editObject">
            <el-form-item label="分类名称" label-width="80">
                <el-input v-model="editObject.name" autocomplete="off" />
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
.avatar-uploader.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader.el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader.el-upload:hover {
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