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
// const addObject = ref({});

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
        let result = await api.del("/api/maintenance", row.id);
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
    // 发送请求
    let result = await api.postJson("/api/maintenance", addObject.value);
    tableData.value.unshift(result.data);
    // 表格数据变更
    ElMessage({
        type: 'success',
        message: '保存成功'
    })
    // 提示
    closeAddWin();
}
// 保存编辑数据
const editSave = async function () {
    // 发送请求
    let result = await api.putJson("/api/maintenance", editObject.value);
    // 刷新表格
    tableData.value[editIndex] = result.data;
    // 提示
    ElMessage({
        type: 'success',
        message: '保存成功'
    });
    editWinVisible.value = false;
}

// 点击编辑按钮执行的方法
const edit = function (index, row) {
    // 记录修改数据的下标
    editIndex = index;
    // 绑定要修改的数据
    editObject.value.id = row.id;
    editObject.value.itemId = row.itemId;
    editObject.value.startTime = row.startTime;
    editObject.value.endTime = row.endTime;
    editObject.value.description = row.description;
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
    let result = await api.get("/api/maintenance", checkObj.value);
    // result  {code,data,message}   data-->{list,count}
    // 更新表格中的数据
    tableData.value = result.data.list;
    total.value = result.data.count;
}
//下拉菜单开始
const remoteMethod = async () => {
    console.log("============远程查询分类remoteMethod==========")
    let result = await api.get("/api/items")
    options.value = result.data.list;
    console.log(options.value);
}
const options = ref([]);
//下拉菜单结束

</script>

<template>
    <el-select v-model="checkObj.itemId" remote placeholder="请选择物品名称" multiple-limit="1" clearable="true"
        @click="remoteMethod" style="width: 150px; margin-left: 10px;">
        <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-select v-model="checkObj.itemId" remote placeholder="请选择物品编号" multiple-limit="1" clearable="true"
        @click="remoteMethod" style="width: 150px; margin-left: 10px;">
        <el-option v-for="item in options" :key="item.id" :label="item.code" :value="item.id" />
    </el-select>
    <el-input v-model="checkObj.description" style="width: 150px;margin-left: 10px;" placeholder="输入描述查询" />
    <el-date-picker v-model="checkObj.startTime" type="date" placeholder="开始时间" :size="size" value-format="YYYY-MM-DD"
        style="width: 150px;margin-left: 10px;" />
    <el-date-picker v-model="checkObj.endTime" type="date" placeholder="结束时间" :size="size" value-format="YYYY-MM-DD"
        style="width: 150px; margin-left: 10px;" />
    <el-button type="success" @click="checkData" style="margin-left: 10px;">查询</el-button>
    <!-- <el-button type="success" @click="openAddWin">新增</el-button> -->
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="维修ID" width="180" />
        <el-table-column prop="items.code" label="物品编号" width="180px" />
        <el-table-column prop="items.name" label="物品名称" />
        <el-table-column prop="startTime" label="开始时间" />
        <el-table-column prop="endTime" label="结束时间" />
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="danger" @click="del(scope.$index, scope.row)"
                    :disabled="scope.row.endTime == null">删除</el-button>
                <!-- <el-button type="warning" @click="edit(scope.$index, scope.row)">编辑</el-button> -->
            </template>
        </el-table-column>
    </el-table>
    <!-- current-page 分页组件初始显示的页码 size:每页的条数-->
    <el-pagination :page-size="checkObj.size" :current-page="checkObj.page" background layout="prev, pager, next"
        :total="total" @current-change="checkData" />

    <!-- 新增信息的弹出框 -->
    <!-- <el-dialog v-model="addWinVisible" title="新增" width="500">

        <el-form :model="addObject">
            <el-form-item label="物品 ID" label-width="80">
                <el-input v-model="addObject.itemId" autocomplete="off" />
            </el-form-item>
            <el-form-item label="开始时间" label-width="80">
                <el-date-picker v-model="addObject.startTime" type="date" placeholder="结束时间" :size="size"
                    value-format="YYYY-MM-DD" style="width: 100%" />

            </el-form-item>
            <el-form-item label="结束时间" label-width="80">
                <el-date-picker v-model="addObject.endTime" type="date" placeholder="结束时间" :size="size"
                    value-format="YYYY-MM-DD" style="width: 100%" />

            </el-form-item>
            <el-form-item label="描述" label-width="80">
                <el-input v-model="addObject.description" autocomplete="off" />
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
    <!-- <el-dialog v-model="editWinVisible" title="编辑" width="500">

        <el-form :model="editObject">
            <el-form-item label="物品 ID" label-width="80">
                <el-input v-model="editObject.itemId" autocomplete="off" />
            </el-form-item>
            <el-form-item label="开始时间" label-width="80">
                <el-date-picker v-model="editObject.startTime" type="date" placeholder="结束时间" :size="size"
                    value-format="YYYY-MM-DD" style="width: 100%" />

            </el-form-item>
            <el-form-item label="结束时间" label-width="80">
                <el-date-picker v-model="editObject.endTime" type="date" placeholder="结束时间" :size="size"
                    value-format="YYYY-MM-DD" style="width: 100%" />

            </el-form-item>
            <el-form-item label="描述" label-width="80">
                <el-input v-model="editObject.description" autocomplete="off" />
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
    </el-dialog> -->
    <div id="box" style="height:400px;width:400px"></div>
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