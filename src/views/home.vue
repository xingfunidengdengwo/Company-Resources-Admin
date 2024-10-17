<script lang="ts" setup>
import { ElConfigProvider, ElMessage } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 菜单开始
import { ref, onMounted } from 'vue'
import {
    Document,
    Menu as IconMenu,
    User, Notebook, OfficeBuilding, Histogram, ArrowLeft
} from '@element-plus/icons-vue'
import { Header } from 'element-plus/es/components/table-v2/src/components/index.mjs';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();


const isCollapse = ref(false)
const handleOpen = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
    console.log(key, keyPath)
}
// 菜单结束
// 页头开始
const goBack = () => {
    console.log('go back');
    if (route.path != "/charts") {
        router.go(-1);
    } else {
        ElMessage.error("已经为首页，无法再返回")
    }
}
// 页头结束
const logout = function () {
    sessionStorage.removeItem("token")
    location.reload();//刷新页面 
}

//获取当前登录的用户名
const user = sessionStorage.getItem("user");
//获取当前登录的头像地址
const avatar = sessionStorage.getItem("avatar");

onMounted(function () {
    //打印当前用户名
    console.log(user);
    //打印当前头像地址
    console.log(avatar);

})

</script>

<template>
    <el-config-provider :locale="zhCn">
        <div class="common-layout">
            <el-container>
                <el-header>
                    <!-- 页头开始 -->

                    <el-page-header :icon="ArrowLeft" @back='goBack' style="margin-top: 8px;">
                        <template #content>
                            <div class="flex items-center">
                                <el-avatar :size="32" class="mr-3" :src=avatar />
                                <span class="text-large font-600 mr-3"> 您好 </span>
                                <span class="text-sm mr-2" style="color: var(--el-text-color-regular)">
                                    <span class="text-large font-600 mr-3"> {{ user }} </span>
                                </span>
                                <el-tag>管理员</el-tag>
                            </div>
                        </template>
                        <template #extra>
                            <div class="flex items-center">
                                <el-button type="primary" class="ml-2" @click="logout">退出登录</el-button>
                            </div>
                        </template>
                    </el-page-header>

                    <!-- 页头结束 -->
                </el-header>
                <el-container>
                    <el-aside width="200px">
                        <!-- 菜单开始 -->
                        <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
                            <el-radio-button :value="false">展开</el-radio-button>
                            <el-radio-button :value="true">折叠</el-radio-button>
                        </el-radio-group>
                        <el-menu default-active="1" class="el-menu-vertical" :collapse="isCollapse" @open="handleOpen"
                            @close="handleClose" router="true">

                            <el-sub-menu index="1">
                                <template #title>
                                    <el-icon>
                                        <Notebook />
                                    </el-icon>
                                    <span>借还与维修</span>
                                </template>
                                <el-menu-item-group title="物品信息">
                                    <el-menu-item index="1-1" route="items">物品管理</el-menu-item>
                                    <el-menu-item index="1-2" route="itemtypes">物品分类</el-menu-item>
                                </el-menu-item-group>

                                <el-menu-item-group title="物品借还管理">
                                    <el-menu-item index="1-3" route="borrowreturn">借还记录</el-menu-item>
                                    <el-menu-item index="1-4" route="unreturned">当前未归还</el-menu-item>
                                </el-menu-item-group>

                                <el-menu-item-group title="物品维修管理">
                                    <el-menu-item index="1-5" route="maintenance">维修记录</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>

                            <el-sub-menu index="2">
                                <template #title>
                                    <el-icon>
                                        <OfficeBuilding />
                                    </el-icon>
                                    <span>部门与员工</span>
                                </template>
                                <el-menu-item-group title="员工管理">
                                    <el-menu-item index="2-1" route="employees">员工信息</el-menu-item>
                                </el-menu-item-group>
                                <el-menu-item-group title="部门管理">
                                    <el-menu-item index="2-2" route="departments">部门信息</el-menu-item>
                                </el-menu-item-group>
                            </el-sub-menu>

                            <el-menu-item index="3" route="operators">
                                <el-icon>
                                    <User />
                                </el-icon>
                                <template #title>操作人员信息</template>
                            </el-menu-item>

                            <el-menu-item index="4" route="charts">
                                <el-icon>
                                    <Histogram />
                                </el-icon>
                                <template #title>图表统计</template>
                            </el-menu-item>

                        </el-menu>
                        <!-- 菜单结束 -->
                    </el-aside>

                    <el-main style="margin: 20px 0 0 0;">
                        <router-view></router-view>

                    </el-main>
                </el-container>
            </el-container>
        </div>
    </el-config-provider>
</template>

<style scoped>
.el-header {
    position: relative;
    background-color: var(--el-color-primary-light-7);
    color: var(--el-text-color-primary);
}

/* .el-aside {
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
} */

.el-menu {
    border-right: none;
}

.el-main {
    padding: 0;
}

/* .toolbar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    right: 20px;
} */

/* 菜单开始 */
.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
}

/* 菜单结束 */
</style>