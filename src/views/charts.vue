<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { ElMessageBox, ElMessage } from 'element-plus';
import * as echarts from 'echarts';
onMounted(function () {
    // 基于准备好的dom，初始化echarts实例
    var myChart1 = echarts.init(document.getElementById('borrow'));
    var myChart2 = echarts.init(document.getElementById('maintenance'));


    // 绘制图表
    myChart1.setOption({
        title: {
            text: '物品借出记录'
        },
        tooltip: {},
        xAxis: {
            data: ['笔记本电脑', '平板', '打印机', '投影仪', '机械键盘', '鼠标垫']
        },
        yAxis: {},
        series: [
            {
                name: '借出次数',
                type: 'bar',
                data: [5, 2, 12, 10, 8, 6]
            }
        ]
    });



    myChart2.setOption({
        title: {
            text: '物品维修记录'
        },
        tooltip: {},
        xAxis: {
            data: ['笔记本电脑', '平板', '打印机', '投影仪', '机械键盘', '鼠标垫']
        },
        yAxis: {},
        series: [
            {
                name: '维修次数',
                type: 'bar',
                data: [5, 3, 3, 2, 3, 6]
            }
        ]
    });

});

</script>

<template>
    <div id="borrow" style="width: 600px;height:400px;"></div>
    <div id="maintenance" style="width: 600px;height:400px;"></div>

</template>

<style></style>