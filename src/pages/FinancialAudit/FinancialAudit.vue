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
                <el-button type="primary" @click="activeChange('tradeOrder')">交易订单</el-button>
                <el-button type="primary" @click="activeChange('tradeRecord')">交易记录</el-button>
                <el-button type="primary" @click="activeChange('myAccount')">我的账户</el-button>
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="searchName"
                    placeholder="请输入关键词"
                    class="handle-input mr10"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary">Excel导出</el-button>
                <el-button v-if="activeName == 'tradeOrder'" type="primary" class="audit-all">一键审核</el-button>
            </div>

            <trade-order v-if="activeName == 'tradeOrder'"></trade-order>
            <trade-record v-if="activeName == 'tradeRecord'"></trade-record>
            <my-account v-if="activeName == 'myAccount'"></my-account>

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
            searchName: '', //用户昵称
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

<style>
.el-table td,
.el-table th {
    text-align: center !important;
}

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

.el-dialog__header {
    padding: 0;
}

.add-classify-title {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.add-classify-title::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    margin-right: 10px;
    background-color: #999;
}

.basic-info div {
    display: flex;
}

.basic-info div p {
    margin-bottom: 20px;
    display: flex;
    min-width: 230px;
}

.basic-info div p span:first-child {
    display: block;
    min-width: 100px;
}

.tabs-box li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed #ddd;
    padding: 14px 0;
}

.tabs-box li p {
    width: 33.3333%;
}

.tabs-box li p:last-child {
    text-align: right;
}

.visit-tab.tabs-box li p:last-child {
    width: 100%;
    text-align: right;
}

.tabs-box li p span:first-child {
    margin-right: 10px;
}

.audit-all {
    float: right;
}
</style>