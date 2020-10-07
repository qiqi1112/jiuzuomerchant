<template>
    <div>
        <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="ID" fixed type="index"></el-table-column>
            <el-table-column prop="petName" label="总订单号"></el-table-column>
            <el-table-column prop="aaMakeUpATableTimes" label="订单号" min-width="90"></el-table-column>
            <el-table-column prop="reserveConsumptionTimes" label="收款时间" min-width="110"></el-table-column>
            <el-table-column prop="numberOfTimes" label="到账金额"></el-table-column>
            <el-table-column label="收款方式" min-width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.vip | yesOrNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" min-width="80">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="lookInfo(scope.$index, scope.row)">确认无误</el-button>
                    <el-button type="primary" size="mini" @click="lookInfo(scope.$index, scope.row)">有误上报</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [], //表格数据

            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 10 //默认每页要显示多少条数据
        };
    },

    methods: {
        //表格数据页码发生变化后
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getClientInfo(); //请求翻页后的数据
        },

        //获取客户信息
        getClientInfo() {
            let data = {
                pageNo: this.currentPage,
                pageSize: this.pagesize,
                petName: this.searchName,
                collectionMerchantStatus: this.collectVal,
                vip: this.isVipVal
            };

            this.$post('/merchant/store/customer/customerLimit', data).then((res) => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.dataListCount = res.data.total; //总数据条数
                }
            });
        }
    },

    created() {
        this.getClientInfo();
    }
};
</script>