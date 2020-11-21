<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 设置 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!-- 头部模块 -->
            <div class="handle-box">
                <el-button :type="activeName === 'reserveSetting' ? 'primary' : ''" @click="activeChange('reserveSetting')"
                    >预定权限</el-button
                >
                <el-button :type="activeName === 'tradeRecord' ? 'primary' : ''" @click="activeChange('tradeRecord')">我要售票</el-button>

                <template v-if="activeName === 'tradeRecord'">
                    <el-input
                        clearable
                        @keydown.13.native="handleSearch"
                        v-model="searchName"
                        placeholder="请输入关键词"
                        class="handle-input mr10"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    <el-button type="primary">Excel导出</el-button>
                </template>
            </div>

            <reserve-setting v-if="activeName === 'reserveSetting'"></reserve-setting>
        </div>
    </div>
</template>

<script>
import reserveSetting from './ReserveSetting';

export default {
    components: {
        reserveSetting
    },

    data() {
        return {
            searchName: '', //关键词
            tableData: [], //表格数据

            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 10, //默认每页要显示多少条数据

            dialogFormVisible: false, //对话框的开启与隐藏
            activeName: 'reserveSetting' //默认显示的标签页
        };
    },

    methods: {
        //表格数据页码发生变化后
        handleCurrentChange(val) {
            this.currentPage = val;
        },

        //搜索操作
        handleSearch() {
            this.currentPage = 1;
        },

        //标签页切换
        activeChange(activeName) {
            switch (activeName) {
                case 'reserveSetting':
                    this.activeName = 'reserveSetting';
                    break;
                case 'tradeRecord':
                    this.activeName = 'tradeRecord';
                    break;
            }
        }
    }
};
</script>

<style lang="less" scoped>
.page {
    text-align: right;
    margin-top: 20px;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-input {
    width: 170px;
    display: inline-block;
}

.mr10 {
    margin: 0 10px 0 30px;
}
</style>