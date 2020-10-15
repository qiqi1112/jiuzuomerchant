<template>
    <div>
        <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
            <el-table-column label="ID" fixed type="index"></el-table-column>
            <el-table-column prop="petName" label="总订单号"></el-table-column>
            <el-table-column prop="aaMakeUpATableTimes" label="订单号" min-width="90"></el-table-column>
            <el-table-column prop="reserveConsumptionTimes" label="订单发起人" min-width="110"></el-table-column>
            <el-table-column label="发起人手机" min-width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="numberOfTimes" label="订单备注用户"></el-table-column>
            <el-table-column prop="takeEffectNumberOfTimes" label="订单备注手机" min-width="100"></el-table-column>
            <el-table-column prop="cancelEffectNumberOfTimes" label="订单类型" min-width="100"></el-table-column>
            <el-table-column label="支付状态" min-width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.vip | yesOrNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="支付类型" min-width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.vip | yesOrNo }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="aaMakeUpATableTimes" label="实付金额" min-width="90"></el-table-column>
            <el-table-column prop="reserveConsumptionTimes" label="商品原价" min-width="110"></el-table-column>
            <el-table-column prop="numberOfTimes" label="优惠券使用"></el-table-column>
            <el-table-column label="订单详情" min-width="80">
                <template slot-scope="scope">
                    <el-button type="text">查看订单</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="cancelEffectNumberOfTimes" label="验证码" min-width="100"></el-table-column>
            <el-table-column prop="numberOfComments" label="订单发起时间"></el-table-column>
            <el-table-column prop="visitMerchantTimes" label="订单支付时间" min-width="100"></el-table-column>
            <el-table-column prop="lastConsumptionTime" label="订单结束时间" min-width="135"></el-table-column>
            <el-table-column label="操作" fixed="right" min-width="110">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="lookInfo(scope.$index, scope.row)">请求审核</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 对话框 -->
        <el-dialog :visible.sync="dialogFormVisible" @close="handleClose">
            <span class="add-classify-title">用户信息</span>
            <div class="basic-info">
                <div>
                    <p>
                        <span>昵称：</span>
                        <span>{{ userInfo.petName }}</span>
                    </p>
                    <p>
                        <span>手机：</span>
                        <span>{{ userInfo.phone }}</span>
                    </p>
                </div>
                <div>
                    <p>
                        <span>本店会员：</span>
                        <span>{{ userInfo.vip }}</span>
                    </p>
                    <p>
                        <span>收藏本店：</span>
                        <span>{{ userInfo.collectionMerchantStatus }}</span>
                    </p>
                    <p>
                        <span>累计消费：</span>
                        <span>{{ userInfo.totalConsumptionAmount }}</span>
                    </p>
                </div>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleClose">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            search: '', //用户昵称

            tableData: [], //表格数据

            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 10, //默认每页要显示多少条数据

            dialogFormVisible: false, //对话框的开启与隐藏

            //用户相关属性
            userInfo: {}
        };
    },

    methods: {
        //表格数据页码发生变化后
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getClientInfo(); //请求翻页后的数据
        },

        //查看按钮
        lookInfo(index, row) {
            this.dialogFormVisible = true;
            this.userInfo = row;
        },

        //关闭对话框
        handleClose() {
            dialogFormVisible = false;
            this.activeName = 'rowRecord';
        },

        //搜索操作
        handleSearch() {
            this.currentPage = 1;
            this.getClientInfo();
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