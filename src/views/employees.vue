<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { ElMessageBox, ElMessage } from 'element-plus';

//定义绑定数据
const tableData = ref([]);
//控制新增信息窗口是否显示
const addWinVisible = ref(false);
//控制编辑信息窗口是否显示
const editWinVisible = ref(false);
//新增数据绑定对象
const addObject = ref({});
//编辑数据绑定对象
const editObject = ref({});
//查询数据的文本
const checkObj = ref({
    page: 1,
    size: 10
});
const total = ref(90);
//记录修改数据的下标
var editIndex = -1;

//挂载页面时查询数据
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
        //提交数据
        let result = await api.del("/api/employees", row.id);
        if (result.code == 200) {
            //刷新表格数据
            tableData.value.splice(index, 1);
            //提示删除成功
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
//保存新增数据  addObject
const addSave = async function () {
    // 进行表单验证
    if (!validateForm(addObject.value)) {
        return;
    }
    //发送请求
    // api.postForm("/api/employees", addObject.value);
    let result = await api.postJson("/api/employees", addObject.value);
    if (result.code == 200) {
        //表格数据变更----
        tableData.value.unshift(result.data);
        ElMessage({
            type: 'success',
            message: '保存成功'
        })
        //提示
        closeAddWin();
    } else {
        ElMessage({
            type: 'warning',
            message: result.message
        })
    }
}
//保存编辑数据
const editSave = async function () {

    // 进行表单验证
    if (!validateForm(editObject.value)) {
        return;
    }

    //发送请求
    let result = await api.putJson("/api/employees", editObject.value);
    if (result.code == 200) {
        //刷新表格
        tableData.value[editIndex] = result.data;
        //提示
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

//点击编辑按钮执行的方法
const edit = async function (index, row) {

    //提前加载编辑信息弹出框的下拉选择框数据，避免出现数据绑定后显示id的情况
    let result = await api.get("/api/departments")
    options.value = result.data.list;

    //记录修改数据的下标
    editIndex = index;
    //绑定要修改的数据
    editObject.value.id = row.id;
    editObject.value.name = row.name;
    editObject.value.departmentId = row.departments.id;

    //打开对话框
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
//   //val就是点击的页码
//   pageObj.value.page=val;
// }

const checkData = async function (val) {
    //点击分页按钮
    if (typeof val == 'number') {
        checkObj.value.page = val;
    }
    //查询数据
    let result = await api.get("/api/employees", checkObj.value);
    //result  {code,data,message}   data-->{list,count}
    //更新表格中的数据
    tableData.value = result.data.list;
    total.value = result.data.count;
}
//下拉菜单开始
const remoteMethod = async () => {
    console.log("============远程查询分类remoteMethod==========")
    let result = await api.get("/api/departments")
    options.value = result.data.list;
    console.log(options.value);
}
const options = ref([]);
//下拉菜单结束

// 表单验证
const validateForm = (formData) => {
    let isValid = true;

    // 验证姓名
    if (!formData.name || formData.name.trim() === '') {
        ElMessage.error('请输入姓名');
        isValid = false;
        return isValid;
    }

    // 验证部门选择
    if (!formData.departmentId) {
        ElMessage.error('请选择部门');
        isValid = false;
        return isValid;
    }

    return isValid;
};

</script>

<template>
    <el-input v-model="checkObj.name" style="width: 150px;margin-right: 10px;" placeholder="输入名称查询" />
    <el-select v-model="checkObj.departmentId" remote placeholder="请选择部门" multiple-limit="1" clearable="true"
        @click="remoteMethod" style="width: 150px;margin-right: 10px;">
        <el-option v-for="department in options" :key="department.id" :label="department.name" :value="department.id" />
    </el-select>
    <el-button type="success" @click="checkData">查询</el-button>
    <el-button type="success" @click="openAddWin">新增</el-button>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="ID" width="180" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="departments.name" label="部门" />
        <el-table-column label="操作">
            <template #default="scope">

                <el-button type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
                <el-button type="warning" @click="edit(scope.$index, scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- current-page分页组件初始显示的页码 size:每页的条数-->
    <el-pagination :page-size="checkObj.size" :current-page="checkObj.page" background layout="prev, pager, next"
        :total="total" @current-change="checkData" />

    <el-dialog v-model="uploadImgWinVisible" title="上传头像" width="500">
        <el-upload class="avatar-uploader" action="/api/staffimg/8" :show-file-list="false"
            :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
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
    <!-- start 新增信息的弹出框 -->
    <el-dialog v-model="addWinVisible" title="新增" width="500">

        <el-form :model="addObject">
            <el-form-item label="姓名" label-width="80">
                <el-input v-model="addObject.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="部门" label-width="80">
                <el-select v-model="addObject.departmentId" remote placeholder="请选择部门" multiple-limit="1"
                    clearable="true" @click="remoteMethod">
                    <el-option v-for="department in options" :key="department.id" :label="department.name"
                        :value="department.id" />
                </el-select>
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
    <!-- end 新增信息的弹出框 -->

    <!-- start 编辑信息的弹出框 -->
    <el-dialog v-model="editWinVisible" title="编辑" width="500">

        <el-form :model="editObject">
            <el-form-item label="姓名" label-width="80">
                <el-input v-model="editObject.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="部门" label-width="80">
                <el-select v-model="editObject.departmentId" remote placeholder="请选择部门" multiple-limit="1"
                    clearable="true" @click="remoteMethod">
                    <el-option v-for="department in options" :key="department.id" :label="department.name"
                        :value="department.id" />
                </el-select>
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
    <!-- end 编辑信息的弹出框 -->


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