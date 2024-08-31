<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { ElMessageBox, ElMessage } from 'element-plus';
import * as echarts from 'echarts';
onMounted(async function () {
    // 基于准备好的dom，初始化echarts实例
    var myChart1 = echarts.init(document.getElementById('borrow'));
    var myChart2 = echarts.init(document.getElementById('maintenance'));
    const result1 = await api.get("api/borrowcharts");
    const result2 = await api.get("api/maintenancecharts");

    const names = result1.data.names;
    const counts = result1.data.counts;

    const data = result2.data;

    // 绘制图表
    myChart1.setOption({
        title: {
            text: '物品借出统计'
        },
        tooltip: {},
        xAxis: {
            data: names
        },
        yAxis: {},
        series: [
            {
                name: '借出次数',
                type: 'bar',
                data: counts
            }
        ]
    });



    myChart2.setOption({
        title: {
            text: '维修占比',

            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: '50%',
                data: data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]

    });

});

</script>

<template>
    <h1 style="text-align: center; font-size: 30px">物品借用和维修统计</h1>

    <div style="display: flex; justify-content: center; align-items: center; margin-top: 80px; ">
        <div id="borrow" style="width: 600px;height:400px;"></div>
        <div id="maintenance" style="width: 600px;height:400px; "></div>
    </div>

</template>

<style></style>