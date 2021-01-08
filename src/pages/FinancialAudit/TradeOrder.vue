<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 交易订单 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 头部模块 -->
            <div class="handle-box">
                <template>
                    <el-input
                        clearable
                        @keydown.13.native="handleSearch"
                        v-model="searchName"
                        placeholder="请输入订单号"
                        class="handle-input mr10"
                    ></el-input>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    <!-- <el-button type="primary">Excel导出</el-button> -->
                    <el-button type="primary" class="audit-all">一键审核</el-button>
                </template>
            </div>

            <!-- 表格部分 -->
            <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="ID" fixed type="index"></el-table-column>
                <el-table-column prop="createBy" label="订单发起人" min-width="120"></el-table-column>
                <el-table-column prop="contactName" label="预订用户" min-width="120"></el-table-column>
                <el-table-column label="座位号" min-width="120">
                    <template slot-scope="scope">
                        <span>{{ scope.row.seatCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="预定手机" min-width="140">
                    <template slot-scope="scope">
                        <span>{{ scope.row.contactTel | phoneNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderType" label="订单类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orderType | orderType }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNo" label="总订单号" min-width="160"></el-table-column>
                <el-table-column prop="orderId" label="订单号"></el-table-column>
                <el-table-column prop="payStatus" label="支付状态">
                    <template slot-scope="scope">
                        <span>{{ scope.row.payStatus | payStatus }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="payWay" label="支付类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.payWay | payWay }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="paidAmount" label="实付金额"></el-table-column>
                <el-table-column prop="payableAmount" label="商品原价"></el-table-column>
                <el-table-column prop="details" label="优惠券"></el-table-column>
                <el-table-column prop="remarks" label="备注信息"></el-table-column>
                <el-table-column prop="createTime" label="订单发起时间" min-width="140"></el-table-column>
                <el-table-column prop="paidTime" label="订单支付时间" min-width="140"></el-table-column>
                <el-table-column prop="" label="订单状态" min-width="140"></el-table-column>
                <el-table-column prop="storeName" label="订单信息" min-width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-link icon="el-icon-edit" @click="handleLookInfo(scope.row.orderNo)">查看订单</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="110">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="handleAudit(scope.$index, scope.row)">请求审核</el-button>
                    </template>
                </el-table-column>
            </el-table>

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
export default {
    data() {
        return {
            searchName: '', //搜索关键词
            tableData: [], //表格数据
            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 10, //默认每页要显示多少条数据
            dialogFormVisible: false //对话框的开启与隐藏
        };
    },

    methods: {
        //请求审核
        handleAudit() {},

        //查看订单
        handleLookInfo() {},

        //表格数据页码发生变化后
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getOrderInfo(); //请求翻页后的数据
        },

        //关闭对话框
        handleClose() {
            this.dialogFormVisible = false;
        },

        //搜索操作
        handleSearch() {
            this.currentPage = 1;
            this.getOrderInfo();
        },

        //获取客户信息
        getOrderInfo() {
            let data = {
                pageNo: this.currentPage,
                pageSize: this.pagesize,
                orderNo: this.searchName
            };

            this.$post('/merchant/store/audit/auditLimit', data).then((res) => {
                if (res.code === 0) {
                    this.tableData = res.data.list;
                    this.dataListCount = res.data.total;
                }
            });
        }
    },

    created() {
        this.getOrderInfo();
    }
};
</script>

<style lang="less" scoped>
/deep/.el-dialog__header {
    padding: 0;
}

.page {
    text-align: right;
    margin-top: 20px;
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

.basic-info {
    div {
        display: flex;

        p {
            margin-bottom: 20px;
            display: flex;
            min-width: 230px;

            span:first-child {
                display: block;
                min-width: 100px;
            }
        }
    }
}

.handle-box {
    margin-bottom: 20px;
}

.handle-input {
    width: 170px;
    display: inline-block;
}

.mr10 {
    margin-right: 10px;
}

.audit-all {
    float: right;
}
</style>