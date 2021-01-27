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
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="searchObj.searchNickName"
                    placeholder="预定用户"
                    class="handle-input mr10"
                ></el-input>
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="searchObj.searchPhone"
                    placeholder="预定手机"
                    class="handle-input mr10"
                ></el-input>
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="searchObj.searchOrderNum"
                    placeholder="订单号"
                    class="handle-input mr10"
                ></el-input>
                <el-select clearable v-model="searchObj.searchOrderType" placeholder="订单类型" class="handle-input mr10">
                    <el-option v-for="(item, index) in orderTypeArr" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <!-- <el-select clearable v-model="searchObj.searchPayStatus" placeholder="支付状态" class="handle-input mr10">
                    <el-option v-for="(item, index) in payStatusArr" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select> -->
                <!-- <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="searchObj.smsCode"
                    placeholder="验证码"
                    class="handle-input mr10"
                ></el-input> -->
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="warning" @click="aduitAll">批量审核</el-button>
            </div>

            <!-- 表格部分 -->
            <el-table
                border
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                style="width: 100%"
            >
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="ID" fixed type="index"></el-table-column>
                <el-table-column prop="creatorName" label="订单发起人" min-width="120"></el-table-column>
                <el-table-column prop="contactName" label="预订用户" min-width="120"></el-table-column>
                <el-table-column label="座位号/包间类型" min-width="110">
                    <template slot-scope="scope">
                        <span>{{ scope.row.seatCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="预定手机" min-width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.contactTel | phoneNum }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderType" label="订单类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orderType | orderType }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="orderNo" label="总订单号" min-width="150"></el-table-column>
                <!-- <el-table-column prop="orderId" label="订单号" min-width="150"></el-table-column> -->
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

                <el-table-column prop="payableAmount" label="订单原价"></el-table-column>
                <el-table-column prop="orderPresent" label="订单现价"></el-table-column>
                <el-table-column prop="orderDiscount" label="订单折扣价" min-width="90"></el-table-column>
                <el-table-column prop="pointsPay" label="积分支付"></el-table-column>
                <el-table-column prop="moneyPay" label="现金支付"></el-table-column>
                <el-table-column prop="commissionPay" label="商品佣金"></el-table-column>
                <el-table-column prop="adminCoupon" label="优惠券佣金" min-width="90"></el-table-column>

                <el-table-column prop="remarks" label="备注信息" min-width="140"></el-table-column>
                <el-table-column prop="createTime" label="订单发起时间" min-width="140"></el-table-column>
                <el-table-column prop="paidTime" label="订单支付时间" min-width="140"></el-table-column>
                <el-table-column label="订单状态" min-width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orderStatus | TradeOrderStatus }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="storeName" label="订单信息" min-width="100" fixed="right">
                    <template slot-scope="scope" v-if="scope.row.orderType !== 3">
                        <el-link icon="el-icon-edit" @click="handleLookInfo(scope.row.orderNo)">查看订单</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" min-width="110">
                    <template slot-scope="scope">
                        <el-button
                            :type="
                                scope.row.examine === 2
                                    ? 'warning'
                                    : scope.row.examine === 4
                                    ? 'success'
                                    : scope.row.examine === 1
                                    ? 'info'
                                    : 'primary'
                            "
                            :disabled="scope.row.examine !== 0 && scope.row.examine !== 2"
                            @click="handleAudit(scope.row)"
                            >{{ scope.row.examine | auditExamine }}</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>

            <!-- 查看订单对话框 -->
            <el-dialog :visible.sync="dialogFormVisible" class="search-seat">
                <!-- 订单详情 -->
                <span class="add-classify-title">订单信息</span>
                <div class="basic-info">
                    <el-form ref="form" class="info-wrap" :model="form" label-width="100px">
                        <div class="info-box left">
                            <el-form-item label="预定用户：">
                                <el-input v-model="form.contactName" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="预定手机：">
                                <el-input v-model="form.contactTel" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="预定备注信息：">
                                <el-input type="textarea" v-model="form.remarks" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="订单号：">
                                <el-input v-model="form.orderNo" readonly></el-input>
                            </el-form-item>

                            <div class="info1">
                                <div>
                                    订单类型：
                                    <span>{{ form.orderType | orderType }}</span>
                                </div>
                                <div>
                                    支付状态：
                                    <span>{{ form.payStatus | payStatus }}</span>
                                </div>
                                <div>
                                    支付方式：
                                    <span>{{ form.payWay | payWay }}</span>
                                </div>
                            </div>

                            <div class="info2">
                                <div>
                                    <el-form-item label="订单原价：">
                                        <el-input v-model="form.payableAmount" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="订单现价：">
                                        <el-input v-model="form.orderPresent" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="现金支付：">
                                        <el-input v-model="form.cashPay" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="订单折扣价">
                                        <el-input v-model="form.orderAmount" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item label="积分支付：">
                                        <el-input v-model="form.pointsPay" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item label="商品佣金：">
                                        <el-input v-model="form.commissionPay" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="优惠券佣金：">
                                        <el-input v-model="form.adminCoupon" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>
                                </div>
                            </div>

                            <div class="info3">
                                <div>
                                    下单时间：
                                    <span>{{ form.createTime }}</span>
                                    <span>{{ form.createTimeWeek | dayOfWeek }}</span>
                                </div>
                                <div>
                                    支付时间：
                                    <span>{{ form.payTime }}</span>
                                    <span>{{ form.payTimeWeek | dayOfWeek }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="info-box right">
                            <div class="right-info-title">
                                <span> 清单详情：</span>
                            </div>
                            <div class="right-list">
                                <div>
                                    <p class="title">座位信息/包间信息</p>
                                    <div class="list-box">
                                        <p>
                                            <span>座位号/包间类型</span>
                                            <span>{{ form.seatCode }}</span>
                                        </p>
                                        <p>
                                            <span>容纳人数</span>
                                            <span>{{ form.seatCapacity }}人</span>
                                        </p>
                                        <p>
                                            <span>保留时间</span>
                                            <span>{{ form.retentionTime }}</span>
                                        </p>
                                        <p>
                                            <span>低消金额</span>
                                            <span>￥{{ form.minAmount }}</span>
                                        </p>
                                    </div>
                                </div>
                                <!-- 默认下的酒水订单 -->
                                <div>
                                    <p class="title">酒水清单</p>
                                    <div class="list-box">
                                        <div class="drink-list" v-for="(item, index) in form.goodsList" :key="index">
                                            <div class="good-box">
                                                <div class="good-name">
                                                    <span>{{ item.goodsName }}</span>
                                                    <span class="num">x{{ item.quantity }}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <span>￥{{ item.activityPrice }}</span>
                                                <span class="unline">￥{{ item.originalPrice }}</span>
                                            </div>
                                        </div>
                                        <div class="drink-list" v-for="(item, index) in form.snacksList" :key="item.name + index">
                                            <div class="good-box">
                                                <div class="good-name">
                                                    <span>{{ item.name }}</span>
                                                    <span class="num">x{{ item.num }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 追加的酒水订单 -->
                                <div>
                                    <p class="title">追加酒水清单</p>
                                    <div class="list-box add-drinks">
                                        <div class="add-drink-list" v-for="(item, index) in form.groupGoods" :key="index">
                                            <div class="order-title">
                                                <span>{{ item.groupName }}</span>
                                                <span>{{ item.createTime }}</span>
                                            </div>

                                            <div class="drink-list" v-for="(item2, index2) in item.goodsList" :key="index2">
                                                <div class="good-box">
                                                    <div class="good-name">
                                                        <span>{{ item2.goodsName }}</span>
                                                        <span class="num">x{{ item2.quantity }}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span>￥{{ item2.activityPrice }}</span>
                                                    <span class="unline">￥{{ item2.originalPrice }}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <el-button v-if="item.servedStatus == 1" disabled type="primary">已上桌</el-button>
                                                <el-button v-if="item.servedStatus == 2" disabled type="danger">已售罄</el-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p class="title">优惠券</p>
                                    <div class="list-box">
                                        <p>商家优惠券：{{ form.storeDetails == '' ? '无' : form.storeDetails }}</p>
                                        <p>平台优惠券：{{ form.appDetails == '' ? '无' : form.appDetails }}</p>
                                    </div>
                                </div>
                                <div class="change-seat">
                                    <p v-if="form.changeSeat">
                                        <span>经商家换座：</span>
                                        <span>{{ form.changeSeat }}</span>
                                    </p>
                                    <p v-if="form.changeSeatTime">
                                        <span>换座时间：</span>
                                        <span>{{ form.changeSeatTime }}</span>
                                    </p>
                                    <p v-if="form.occupySeatTime">
                                        <span>占座时间：</span>
                                        <span>{{ form.occupySeatTime }}分钟</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>

                <div slot="footer" class="dialog-footer" @click="dialogFormVisible = false">
                    <el-button type="primary">确 定</el-button>
                </div>
            </el-dialog>

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
            searchObj: {
                searchPhone: '',
                searchOrderNum: '',
                searchOrderType: '',
                searchPayStatus: '',
                searchNickName: '',
                smsCode: ''
            },

            //订单类型
            orderTypeArr: [
                {
                    label: '预定桌',
                    value: '0'
                },
                {
                    label: 'AA拼单',
                    value: '1'
                },
                {
                    label: '抢座',
                    value: '2'
                }
                // {
                //     label: '会员卡',
                //     value: '3'
                // },
                // {
                //     label: '线下添单',
                //     value: '4'
                // }
            ],

            tableData: [], //表格数据
            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 10, //默认每页要显示多少条数据
            dialogFormVisible: false, //对话框的开启与隐藏
            form: {}, //订单详情表单
            auditIds: [], //要提交审核的数组

            multipleSelection: [] //多选的数组
        };
    },

    methods: {
        //多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        //一键审核
        aduitAll() {
            if (this.multipleSelection.length !== 0) {
                this.multipleSelection.forEach((item) => {
                    if (item.examine === 0 || item.examine === 2) {
                        this.auditIds.push(item.auditId);
                    }
                });

                if (this.auditIds.length !== 0) {
                    this.$confirm('确认审核选中的订单吗？', '提示', {
                        type: 'warning'
                    })
                        .then(() => {
                            this.requestAudit();
                        })
                        .catch(() => {
                            this.auditIds = [];
                        });
                } else {
                    this.$message.error('暂无可审核的订单');
                }
            } else {
                this.$message.error('请选择要审核的订单');
            }
        },

        //请求审核
        handleAudit(row) {
            if (row.examine === 0 || row.examine === 2) {
                this.auditIds.push(row.auditId);
                this.$confirm('确定提交审核吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.requestAudit();
                    })
                    .catch(() => {
                        this.auditIds = [];
                    });
            }
        },

        //审核请求
        requestAudit() {
            (async () => {
                let data = {
                    auditIds: this.auditIds
                };

                let res = await this.$post('/merchant/store/audit/status', data);

                if (res.code === 0) {
                    this.$message.success('提交成功');
                    this.auditIds = [];
                    this.getOrderInfo();
                } else {
                    this.$message.error(res.msg);
                }
            })();
        },

        //查看订单
        handleLookInfo(orderNo) {
            (async () => {
                let res = await this.$get(`/merchant/store/audit/${orderNo}/info`);
                if (res.code === 0) {
                    res.data.contactTel = res.data.contactTel.replace(res.data.contactTel.slice(3, 7), '****');
                    this.form = res.data;
                    this.dialogFormVisible = true;
                }
                console.log('详细信息', this.form);
            })();
        },

        //表格数据页码发生变化后
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getOrderInfo(); //请求翻页后的数据
        },

        //搜索操作
        handleSearch() {
            this.currentPage = 1;
            this.getOrderInfo();
        },

        //获取订单信息
        getOrderInfo() {
            let data = {
                pageNo: this.currentPage,
                pageSize: this.pagesize,
                contactTel: this.searchObj.searchPhone,
                orderNo: this.searchObj.searchOrderNum,
                orderType: this.searchObj.searchOrderType,
                paid: this.searchObj.searchPayStatus,
                contactName: this.searchObj.searchNickName,
                smsCode: this.searchObj.smsCode
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
.el-button--small {
    width: 80px;
}
.shop-seat {
    display: flex;

    .left-box {
        margin-right: 50px;

        .seat-title {
            display: flex;
            justify-content: space-between;
            width: 400px;
            margin-bottom: 20px;

            > p {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }

            p span {
                display: block;
                width: 20px;
                height: 20px;
                border-radius: 4px;
                background-color: #ddd;
                margin-right: 6px;
                border: 1px solid #ddd;
            }
        }

        .seat-box {
            padding: 20px;
            padding-bottom: 10px;
            box-sizing: border-box;
            background-color: #ddd;
            display: flex;
        }

        .input-seat {
            display: flex;
            margin-bottom: 20px;
        }
    }

    .right-box {
        .min-charge {
            align-items: flex-start;

            .day-mincom {
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                padding: 16px 0;
                width: 80%;
                white-space: nowrap;
                > div {
                    margin-bottom: 16px;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;

                    > span {
                        margin-right: 10px;
                    }
                }

                > div:last-child {
                    margin-bottom: 0;
                }
            }
        }

        > div {
            display: flex;
            align-items: center;
            margin-bottom: 30px;

            > span {
                margin-right: 0;
                width: 120px;
            }

            > span.snacks {
                width: 48px !important;
            }
        }

        > div.snacks {
            align-items: flex-start;
        }

        .seat-detail {
            margin-bottom: 30px;
        }

        .lon-retain {
            display: flex;
            align-items: center;
        }
    }
}

.handle-box {
    margin-bottom: 20px;

    .handle-input {
        width: 170px;
        display: inline-block;
    }

    .mr10 {
        margin-right: 10px;
    }
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
    .info-wrap {
        display: flex;
        justify-content: space-between;

        .info-box {
            width: 100%;

            .info1 {
                display: flex;
                justify-content: space-between;
                margin-bottom: 18px;
            }

            .info2 {
                display: flex;
                justify-content: space-between;

                & > div:first-child {
                    margin-right: 20px;
                }
            }

            .info3 {
                > div {
                    margin-bottom: 18px;
                }

                span {
                    margin-left: 30px;
                }
            }
        }

        .info-box.right {
            box-sizing: border-box;
            padding-left: 60px;
            display: flex;

            .right-info-title {
                margin-right: 20px;
            }

            .right-list {
                display: flex;
                flex-direction: column;

                .title {
                    color: #f00;
                    margin-bottom: 18px;
                }

                .list-box {
                    border-bottom: 1px solid #c0c4cc;
                    margin-bottom: 18px;

                    p {
                        display: flex;
                        margin-bottom: 18px;

                        :first-child {
                            width: 160px;
                        }
                    }
                }

                .drink-list {
                    display: flex;
                    margin-bottom: 18px;

                    .good-box {
                        width: 160px;

                        .good-name {
                            margin-bottom: 6px;
                            display: flex;
                            justify-content: space-between;
                            padding-right: 20px;

                            .num {
                                min-width: 20px;
                            }
                        }
                    }

                    .unline {
                        text-decoration: line-through;
                        color: #bcbcbc;
                        margin-left: 10px;
                    }
                }

                .add-drink-list {
                    margin-bottom: 20px;
                    border: 1px solid #c0c4cc;
                    border-radius: 6px;
                    padding: 20px;

                    .order-title {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                        color: #409eff;
                    }
                }

                .change-seat {
                    p {
                        margin-bottom: 18px;
                        display: flex;
                        :first-child {
                            width: 120px;
                        }
                    }
                }
            }
        }
    }
}

/deep/ .el-textarea__inner {
    resize: none !important;
    line-height: 2;
}

/deep/.seat-dialog {
    .el-dialog {
        width: 20% !important;
    }

    .el-dialog__header {
        padding: 20px 20px 40px;
    }
}

/deep/ .search-seat {
    .el-dialog {
        width: 72%;
    }
}

/deep/ .el-input-group__append {
    padding: 0 10px;
}

/deep/.el-dialog__header {
    padding: 20px 20px 10px;
}

/deep/.el-dialog__body {
    padding: 0px 20px 30px 20px;
}

/deep/.priNumber-dialog {
    .el-dialog {
        text-align: center;
        width: 30%;
    }
}

/deep/.el-form-item__label {
    text-align: left;
}
</style>