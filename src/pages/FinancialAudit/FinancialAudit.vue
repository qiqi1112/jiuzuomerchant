<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 财务审核 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 头部模块 -->
            <div class="handle-box">
                <el-button :type="activeName === 'tradeOrder' ? 'primary' : ''" @click="activeChange('tradeOrder')">交易订单</el-button>
                <el-button :type="activeName === 'tradeRecord' ? 'primary' : ''" @click="activeChange('tradeRecord')">交易记录</el-button>
                <!-- <el-button :type="activeName === 'myAccount' ? 'primary' : ''" @click="activeChange('myAccount')">我的账户</el-button> -->
                <template v-if="activeName !== 'myAccount'">
                    <el-input
                        clearable
                        @keydown.13.native="handleSearch"
                        v-model="searchName"
                        placeholder="请输入关键词"
                        class="handle-input mr10"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    <el-button type="primary">Excel导出</el-button>
                    <el-button v-if="activeName === 'tradeOrder'" type="primary" class="audit-all">一键审核</el-button>
                </template>
            </div>

            <trade-order v-if="activeName === 'tradeOrder'"></trade-order>
            <trade-record v-if="activeName === 'tradeRecord'"></trade-record>
            <!-- <my-account v-if="activeName === 'myAccount'"></my-account> -->

            <!-- 表格数据分页 -->
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="dataListCount"
                :current-page="currentPage"
                :page-size="pagesize"
                class="page"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import tradeOrder from './TradeOrder';
import tradeRecord from './TradeRecord';
import myAccount from './MyAccount';

export default {
    components: {
        tradeOrder,
        tradeRecord,
        myAccount
    },

    data() {
        return {
            searchName: '', //关键词
            tableData: [], //表格数据

            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 10, //默认每页要显示多少条数据

            dialogFormVisible: false, //对话框的开启与隐藏
            activeName: 'tradeOrder' //默认显示的标签页
        };
    },

    methods: {
        //表格数据页码发生变化后
        handleCurrentChange(val) {
            this.currentPage = val;
        },

        //搜索操作
        handleSearch() {
            //  if (!this.searchName) {
            //     this.$message.error('请输入关键字');
            //     return;
            // }
            this.currentPage = 1;
        },

        //标签页切换
        activeChange(activeName) {
            switch (activeName) {
                case 'tradeOrder':
                    this.activeName = 'tradeOrder';
                    break;
                case 'tradeRecord':
                    this.activeName = 'tradeRecord';
                    break;
                case 'myAccount':
                    this.activeName = 'myAccount';
                    break;
            }
        }
    },

    created() {}
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

.audit-all {
    float: right;
}
</style>