<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'


// 定义绑定数据
const tableData = ref([]);
const total = ref(90);

// 查询数据的文本
const checkObj = ref({
    page: 1,
    size: 10
});


// 挂载页面时查询未归还数据
onMounted(async function () {
    getUnreturnedData();
});



const getUnreturnedData = async function (val) {
    if (typeof val == 'number') {
        checkObj.value.page = val;
    }
    let result = await api.get("/api/unreturned", checkObj.value);
    tableData.value = result.data.list;
    total.value = result.data.count;
}
//下拉菜单开始
const remoteMethodItems = async () => {
    console.log("============远程查询分类remoteMethod==========")
    let result = await api.get("/api/items")
    optionsItems.value = result.data.list;
    console.log(optionsItems.value);
}
const optionsItems = ref([]);

const remoteMethodOperators = async () => {
    console.log("============远程查询分类remoteMethod==========")
    let result = await api.get("/api/operators")
    optionsOperators.value = result.data.list;
    console.log(optionsOperators.value);
}
const optionsOperators = ref([]);

const remoteMethodEmployees = async () => {
    console.log("============远程查询分类remoteMethod==========")
    let result = await api.get("/api/employees")
    optionsEmployees.value = result.data.list;
    console.log(optionsEmployees.value);
}
const optionsEmployees = ref([]);

//下拉菜单结束

</script>

<template>
    <el-select v-model="checkObj.itemId" remote placeholder="请选择物品名称" multiple-limit="1" clearable="true"
        @click="remoteMethodItems" style="width: 150px; margin-left: 10px;">
        <el-option v-for="item in optionsItems" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-select v-model="checkObj.itemId" remote placeholder="请选择物品编号" multiple-limit="1" clearable="true"
        @click="remoteMethodItems" style="width: 150px; margin-left: 10px;">
        <el-option v-for="item in optionsItems" :key="item.id" :label="item.code" :value="item.id" />
    </el-select>
    <el-select v-model="checkObj.operatorId" remote placeholder="请选择操作人员名称" multiple-limit="1" clearable="true"
        @click="remoteMethodOperators" style="width: 150px; margin-left: 10px;">
        <el-option v-for="operator in optionsOperators" :key="operator.id" :label="operator.name"
            :value="operator.id" />
    </el-select>
    <el-select v-model="checkObj.employeeId" remote placeholder="请选择员工名称" multiple-limit="1" clearable="true"
        @click="remoteMethodEmployees" style="width: 150px; margin-left: 10px;">
        <el-option v-for="employee in optionsEmployees" :key="employee.id" :label="employee.name"
            :value="employee.id" />
    </el-select>

    <el-date-picker v-model="checkObj.borrowTime" type="date" placeholder="借出时间" :size="size" value-format="YYYY-MM-DD"
        style="width: 150px;margin-left: 10px;" />
    <el-date-picker v-model="checkObj.expectedReturnTime" type="date" placeholder="预计归还时间" :size="size"
        value-format="YYYY-MM-DD" style="width: 150px;margin-left: 10px;" />


    <el-button type="success" @click="getUnreturnedData" style="margin-left: 10px;">查询</el-button>

    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="借还ID" width="180" />
        <el-table-column prop="items.code" label="物品编号" width="180px" />
        <el-table-column prop="items.name" label="物品名称" />
        <el-table-column prop="operators.name" label="操作员" />
        <el-table-column prop="employees.name" label="员工" />
        <el-table-column prop="borrowTime" label="借出时间" />
        <el-table-column prop="expectedReturnTime" label="预期归还时间" />
    </el-table>

    <!-- current-page 分页组件初始显示的页码 size:每页的条数-->
    <el-pagination :page-size="checkObj.size" :current-page="checkObj.page" background layout="prev, pager, next"
        :total="total" @current-change="getUnreturnedData" />

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