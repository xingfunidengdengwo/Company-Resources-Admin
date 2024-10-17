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
        let result = await api.del("/api/items", row.id);
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
    if (!validateForm(addObject.value, 'addObject')) {
        return;
    }

    //发送请求
    // api.postForm("/api/items", addObject.value);
    let result = await api.postJson("/api/items", addObject.value);
    if (result.code == 200) {
        //表格数据变更----
        tableData.value.unshift(result.data);
        //提示
        ElMessage({
            type: 'success',
            message: '保存成功'
        })

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
    if (!validateForm(editObject.value, 'editObject')) {
        return;
    }
    //发送请求
    let result = await api.putJson("/api/items", editObject.value);
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
    let result = await api.get("/api/itemtypes")
    options.value = result.data.list;

    //记录修改数据的下标
    editIndex = index;
    //绑定要修改的数据
    editObject.value.id = row.id;
    editObject.value.code = row.code;
    editObject.value.name = row.name;
    editObject.value.typeId = row.itemTypes.id;
    editObject.value.status = row.status;

    //打开对话框
    editWinVisible.value = true;
}
// 显示窗口
const openAddWin = () => {
    addObject.value = { status: '空闲' };
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
    let result = await api.get("/api/items", checkObj.value);
    //result  {code,data,message}   data-->{list,count}
    //更新表格中的数据
    console.log(checkObj.value);

    tableData.value = result.data.list;
    total.value = result.data.count;
}
//下拉菜单开始
const remoteMethod = async () => {
    console.log("============远程查询分类remoteMethod==========")
    let result = await api.get("/api/itemtypes")
    options.value = result.data.list;
    console.log(options.value);
}
const options = ref([]);

const remoteMethodEmployees = async () => {
    console.log("============远程查询分类remoteMethod==========")
    let result = await api.get("/api/employees")
    optionsEmployees.value = result.data.list;
    console.log(optionsEmployees.value);
}
const optionsEmployees = ref([]);
//下拉菜单结束


//借出模块====================开始
//点击借出按钮执行的方法
var borrowIndex = -1;
const borrowItem = function (index, row) {
    //记录修改数据的下标
    borrowIndex = index;

    console.log(row)
    console.log("=====================")
    //绑定要新增的数据

    //此id用于插入borrow_return表的itemId
    addBorrowObject.value.itemId = row.id;

    //打开借出对话框
    openAddBorrowWin();
}
//借出绑定数据
const userId = sessionStorage.getItem("userId");
console.log(userId);

const addBorrowWinVisible = ref(false);
const addBorrowObject = ref({});
// 显示借出窗口
const openAddBorrowWin = () => {

    addBorrowObject.value.operatorId = userId;
    addBorrowObject.value.borrowTime = new Date();

    addBorrowWinVisible.value = true;

    console.log(addBorrowObject.value)
    console.log("==========xxxx=========")
}
//关闭借出窗口
const closeBorrowAddWin = () => {
    addBorrowWinVisible.value = false;
}
// 保存借出数据
const addBorrowSave = async function () {
    // 进行表单验证
    if (!validateForm(addBorrowObject.value, 'addBorrowObject')) {
        return;
    }
    addBorrowObject.value.status = "借出";
    // 发送请求
    let result = await api.postJson("/api/borrowreturn", addBorrowObject.value);
    // 表格数据变更
    //tableData.value.unshift(result.data);
    checkData();

    ElMessage({
        type: 'success',
        message: '保存成功'
    })
    // 提示
    closeBorrowAddWin();
}
//借出模块====================结束


//维修模块++++++++++++++++++++++++++++++++++++++++++开始
//点击维修按钮执行的方法
var maintenanceIndex = -1;
const StartMaintenanceItem = function (index, row) {
    //记录修改数据的下标
    maintenanceIndex = index;

    console.log(row)
    console.log("=====================")
    //绑定要新增的数据

    //此id用于插入maintenance表的itemId
    addMaintenanceObject.value.itemId = row.id;


    //打开维修对话框
    openAddMaintenanceWin();
}
//维修绑定数据
const addMaintenanceWinVisible = ref(false);
const addMaintenanceObject = ref({});
// 显示维修窗口
const openAddMaintenanceWin = () => {

    addMaintenanceObject.value.startTime = new Date();

    addMaintenanceWinVisible.value = true;

    console.log(addMaintenanceObject.value)
    console.log("==========xxxx=========")
}
//关闭维修窗口
const closeMaintenanceAddWin = () => {
    addMaintenanceWinVisible.value = false;
}
// 保存维修数据
const addMaintenanceSave = async function () {
    // 进行表单验证
    if (!validateForm(addMaintenanceObject.value, 'addMaintenanceObject')) {
        return;
    }
    addMaintenanceObject.value.status = "维修";
    // 发送请求
    let result = await api.postJson("/api/maintenance", addMaintenanceObject.value);
    // 表格数据变更
    //tableData.value.unshift(result.data);
    checkData();

    // 提示
    ElMessage({
        type: 'success',
        message: '保存成功'
    })

    closeMaintenanceAddWin();
}
//维修模块++++++++++++++++++++++++++++++++++++++++++结束

//归还==============================================开始
const returnItem = function (index, row) {
    ElMessageBox.confirm(
        "确定要归还吗?",
        "提示框",
        {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(async function () {
        //提交数据
        let result = await api.putJson("/api/borrowreturn", {
            itemId: row.id,
            status: "空闲",
            actualReturnTime: new Date()
        });
        if (result.code == 200) {
            //刷新表格数据
            checkData();
            //提示成功
            ElMessage({
                type: 'success',
                message: '归还成功'
            })
        } else {
            ElMessage({
                type: 'info',
                message: result.message
            })
        }

    });
}
//归还==============================================结束

//维修结束==============================================开始
const EndMaintenanceItem = function (index, row) {
    ElMessageBox.confirm(
        "确定维修结束吗?",
        "提示框",
        {
            confirmButtonText: "确认",
            cancelButtonText: "取消",
            type: 'warning'
        }
    ).then(async function () {
        //提交数据
        let result = await api.putJson("/api/maintenance", {
            itemId: row.id,
            status: "空闲",
            endTime: new Date()
        });
        if (result.code == 200) {
            //刷新表格数据
            checkData();
            //提示成功
            ElMessage({
                type: 'success',
                message: '操作成功'
            })
        } else {
            ElMessage({
                type: 'info',
                message: result.message
            })
        }

    });
}
//维修结束==============================================结束

// 表单验证
const validateForm = (formData, formType) => {
    let isValid = true;

    if (formType === 'addObject' || formType === 'editObject') {
        // 验证编号
        if (!formData.code || formData.code === '') {
            ElMessage.error('请输入编号');
            isValid = false;
            return isValid;

        }

        // 验证物品名称
        if (!formData.name || formData.name.trim() === '') {
            ElMessage.error('请输入物品名称');
            isValid = false;
            return isValid;
        }

        // 验证分类选择
        if (!formData.typeId) {
            ElMessage.error('请选择分类名称');
            isValid = false;
            return isValid;

        }
    }

    if (formType === 'addBorrowObject') {
        // 验证员工选择
        if (!formData.employeeId) {
            ElMessage.error('请选择员工名称');
            isValid = false;
            return isValid;

        }

        // 验证预期归还时间
        if (!formData.expectedReturnTime) {
            ElMessage.error('请输入预期归还时间');
            isValid = false;
            return isValid;

        }
    }

    if (formType === 'addMaintenanceObject') {
        // 验证维修描述
        if (!formData.description || formData.description.trim() === '') {
            ElMessage.error('请输入维修描述');
            isValid = false;
            return isValid;
        }
    }

    return isValid;
};

</script>

<template>
    <el-input v-model="checkObj.code" style="width: 150px; " placeholder="输入编号查询" />
    <el-input v-model="checkObj.name" style="width: 150px; margin-left: 10px;" placeholder="输入名称查询" />

    <el-select v-model="checkObj.status" autocomplete="off" clearable="true" placeholder="请选择状态"
        style="width: 150px; margin-left: 10px;">
        <el-option label="借出" value="借出"></el-option>
        <el-option label="空闲" value="空闲"></el-option>
        <el-option label="维修" value="维修"></el-option>
    </el-select>

    <el-select v-model="checkObj.typeId" remote placeholder="请选择分类" multiple-limit="1" clearable="true"
        @click="remoteMethod" style="width: 150px; margin-left: 10px;">
        <el-option v-for="itemTypes in options" :key="itemTypes.id" :label="itemTypes.name" :value="itemTypes.id" />
    </el-select>

    <el-button type="success" @click="checkData" style="margin-left: 10px;">查询</el-button>
    <el-button type="success" @click="openAddWin">新增</el-button>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="code" label="编号" width="180px" />
        <el-table-column prop="name" label="物品名称" width="180px" />
        <el-table-column prop="itemTypes.name" label="分类名称" width="180px" />
        <el-table-column prop="status" label="状态" width="180px" />
        <el-table-column label="操作">
            <template #default="scope">
                <div style="display: flex; ">
                    <el-button type="danger" @click="del(scope.$index, scope.row)">删除</el-button>
                    <el-button type="warning" @click="edit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="primary" @click="borrowItem(scope.$index, scope.row)"
                        :disabled="scope.row.status != '空闲'">借出</el-button>
                    <el-button type="success" @click="returnItem(scope.$index, scope.row)"
                        :disabled="scope.row.status != '借出'">归还</el-button>
                    <el-button type="info" @click="StartMaintenanceItem(scope.$index, scope.row)"
                        :disabled="scope.row.status != '空闲'">维修</el-button>
                    <el-button type="success" @click="EndMaintenanceItem(scope.$index, scope.row)"
                        :disabled="scope.row.status != '维修'">维修结束</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
    <!-- current-page分页组件初始显示的页码 size:每页的条数-->
    <el-pagination :page-size="checkObj.size" :current-page="checkObj.page" background layout="prev, pager, next"
        :total="total" @current-change="checkData" />

    <!-- start 新增信息的弹出框 -->
    <el-dialog v-model="addWinVisible" title="新增" width="500">

        <el-form :model="addObject">
            <el-form-item label="编号" label-width="80">
                <el-input v-model="addObject.code" autocomplete="off" />
            </el-form-item>
            <el-form-item label="物品名称" label-width="80">
                <el-input v-model="addObject.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="分类名称" label-width="80">
                <!-- <el-input v-model="addObject.itemtTypes" autocomplete="off" /> -->
                <el-select v-model="addObject.typeId" remote placeholder="请选择分类" multiple-limit="1" clearable="true"
                    @click="remoteMethod">
                    <el-option v-for="itemType in options" :key="itemType.id" :label="itemType.name"
                        :value="itemType.id" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="状态" label-width="80">
                <el-input v-model="addObject.status" autocomplete="off" />
            </el-form-item> -->

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
            <el-form-item label="编号" label-width="80">
                <el-input v-model="editObject.code" autocomplete="off" />
            </el-form-item>
            <el-form-item label="物品名称" label-width="80">
                <el-input v-model="editObject.name" autocomplete="off" />
            </el-form-item>
            <el-form-item label="分类名称" label-width="80">
                <el-select v-model="editObject.typeId" remote placeholder="请选择分类" multiple-limit="1" clearable="true"
                    @click="remoteMethod">
                    <el-option v-for="itemTypes in options" :key="itemTypes.id" :label="itemTypes.name"
                        :value="itemTypes.id" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="状态" label-width="80">
                <el-select v-model="editObject.status" autocomplete="off">
                    <el-option label="借出" value="借出"></el-option>
                    <el-option label="空闲" value="空闲"></el-option>
                    <el-option label="维修" value="维修"></el-option>
                </el-select>
            </el-form-item> -->
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

    <!-- 借出的弹出框开始 -->
    <el-dialog v-model="addBorrowWinVisible" title="借出" width="500">

        <el-form :model="addBorrowObject">
            <el-form-item label="员工" label-width="80">
                <el-select v-model="addBorrowObject.employeeId" remote placeholder="请选择员工名称" multiple-limit="1"
                    clearable="true" @click="remoteMethodEmployees" style="width: 150px; margin-left: 10px;">
                    <el-option v-for="employee in optionsEmployees" :key="employee.id" :label="employee.name"
                        :value="employee.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="预期归还时间" label-width="100">
                <el-date-picker v-model="addBorrowObject.expectedReturnTime" type="date" placeholder="预计归还时间"
                    :size="size" value-format="YYYY-MM-DD" style="width: 100%" />
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addBorrowWinVisible = false">取消</el-button>
                <el-button type="primary" @click="addBorrowSave">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 借出的弹出框结束 -->

    <!-- 维修的弹出框开始 -->
    <el-dialog v-model="addMaintenanceWinVisible" title="维修" width="500">

        <el-form :model="addMaintenanceObject">

            <el-form-item label="维修描述" label-width="80">
                <el-input v-model="addMaintenanceObject.description" autocomplete="off" />
            </el-form-item>

        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="addMaintenanceWinVisible = false">取消</el-button>
                <el-button type="primary" @click="addMaintenanceSave">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>
    <!-- 维修的弹出框结束 -->


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