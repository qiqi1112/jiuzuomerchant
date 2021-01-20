<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 订单管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 头部模块 -->
            <div class="handle-box">
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="searchObj.searchNickName"
                    placeholder="用户姓名"
                    class="handle-input mr10"
                ></el-input>
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="searchObj.searchPhone"
                    placeholder="联系电话"
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
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <!-- 表格部分 -->
            <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="ID" fixed type="index"></el-table-column>
                <el-table-column prop="createBy" label="用户姓名" min-width="120"></el-table-column>
                <el-table-column prop="contactName" label="订单联系电话" min-width="120"></el-table-column>
                <el-table-column label="玖座APP注册手机" min-width="140">
                    <template slot-scope="scope">
                        <el-link @click="getPhone(scope.row.orderNo)" type="primary"
                            >{{ scope.row.contactTel | phoneNum }}<i class="el-icon-phone el-icon--right" style="margin-left: 10px"></i>
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="orderType" label="订单类型">
                    <template slot-scope="scope">
                        <span>{{ scope.row.orderType | orderType }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="租期" min-width="120"></el-table-column>
                <el-table-column prop="" label="距离" min-width="120"></el-table-column>
                <el-table-column prop="" label="预订车辆" min-width="120"></el-table-column>
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
                <el-table-column prop="createTime" label="订单发起时间" min-width="140"></el-table-column>
                <el-table-column prop="paidTime" label="订单支付时间" min-width="140"></el-table-column>
                <el-table-column prop="" label="取消订单图片" min-width="140"></el-table-column>
                <el-table-column prop="storeName" label="订单信息" min-width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-link icon="el-icon-edit" @click="handleLookInfo(scope.row.orderNo)">查看订单</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="270">
                    <template slot-scope="scope">
                        <!-- 如果订单有误，就报相关错误 -->
                        <template v-if="scope.row.closedStatus === 1">{{ scope.row.closedReason }}</template>

                        <!-- 如果顾客是抢座，且已到店 -->
                        <template v-else-if="scope.row.orderType === 2 && scope.row.status === 4">
                            <el-button disabled type="success">已接单</el-button>
                            <el-button disabled type="success">已到店</el-button>
                            <el-button
                                :disabled="scope.row.status == 6"
                                :type="scope.row.status == 6 ? 'success' : 'primary'"
                                @click="isConComplete(scope.row)"
                                >{{ scope.row.status == 6 ? '已离店' : '确认离店' }}</el-button
                            >
                        </template>

                        <!-- 如果顾客是抢座，但未到店 -->
                        <template v-else-if="scope.row.orderType === 2 && scope.row.status !== 4"></template>

                        <!-- 其他订单 -->
                        <template v-else-if="scope.row.closedStatus === 0">
                            <el-button
                                v-if="scope.row.status != 2"
                                :disabled="(scope.row.status != 0 && scope.row.status != 1) || scope.row.status == 1"
                                :type="scope.row.status == 0 ? 'primary' : scope.row.status != 2 ? 'success' : 'info'"
                                @click="handleOper(scope.row, 1)"
                                >{{ scope.row.status != 0 && scope.row.status != 2 ? '已接单' : '接单' }}</el-button
                            >
                            <el-button
                                v-if="scope.row.status == 2 || scope.row.status == 0"
                                :disabled="scope.row.status == 2"
                                :type="scope.row.status == 0 ? 'primary' : scope.row.status == 2 ? 'danger' : 'info'"
                                @click="handleOper(scope.row, 2)"
                                >{{ scope.row.status == 2 ? '已拒单' : '拒单' }}</el-button
                            >
                            <el-button
                                v-if="scope.row.status == 1 || scope.row.status == 3"
                                :type="scope.row.status == 3 ? 'info' : 'primary'"
                                @click="unReachStore(scope.row)"
                                >未到店
                            </el-button>
                            <el-button
                                :disabled="scope.row.status == 4 || scope.row.status == 5 || scope.row.status == 6"
                                v-if="scope.row.status != 2 && scope.row.status != 3 && scope.row.status != 0"
                                :type="scope.row.status == 1 ? 'primary' : 'success'"
                                @click="openReachStoreDialog(scope.row.id)"
                                >已到店
                            </el-button>
                            <el-button
                                v-if="scope.row.status != 2 && scope.row.status != 0 && scope.row.status != 3 && scope.row.status != 1"
                                :disabled="scope.row.status == 6"
                                :type="
                                    scope.row.status == 5
                                        ? 'info'
                                        : scope.row.status == 6
                                        ? 'success'
                                        : scope.row.status == 3
                                        ? 'info'
                                        : 'primary'
                                "
                                @click="isConComplete(scope.row)"
                                >{{
                                    scope.row.status == 2
                                        ? '未消费'
                                        : scope.row.status == 3
                                        ? '未消费'
                                        : scope.row.status == 5
                                        ? '未消费'
                                        : scope.row.status == 6
                                        ? '已离店'
                                        : '确认离店'
                                }}</el-button
                            >
                        </template>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 获取用户隐私号码 -->
            <el-dialog :visible.sync="priNumberDialog" class="priNumber-dialog">
                <span class="add-classify-title">动态号码</span>
                <h2 style="margin-bottom: 10px">用户动态号码请在2分钟内使用</h2>
                <h2>{{ priNumber }}</h2>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="priNumberDialog = false">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 查看订单对话框 -->
            <el-dialog :visible.sync="dialog" class="search-seat">
                <!-- 订单详情 -->
                <span class="add-classify-title">订单信息</span>
                <div class="basic-info">
                    <el-form ref="form" class="info-wrap" :model="form" label-width="110px">
                        <div class="info-box left">
                            <el-form-item label="用户姓名：">
                                <el-input v-model="form.contactName" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="联系电话：">
                                <el-input v-model="form.contactTel" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="总订单号：">
                                <el-input v-model="form.orderNo" readonly></el-input>
                            </el-form-item>
                            <el-form-item label="订单号：">
                                <el-input v-model="form.orderNo" readonly></el-input>
                            </el-form-item>
                            <div class="info2">
                                <div>
                                    <el-form-item label="实付金额：">
                                        <el-input v-model="form.paidAmount" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="info1">
                                <div>
                                    订单类型：
                                    <span>{{ form.orderType | orderType }}</span>
                                </div>
                                <div>
                                    租期：
                                    <span>{{ form.payStatus | payStatus }}</span>
                                </div>
                                <div>
                                    车辆名称：
                                    <span>{{ form.payWay | payWay }}</span>
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
                                <span> 订单详情：</span>
                            </div>
                            <div class="right-list">
                                <div>
                                    <p class="title">租车服务</p>
                                    <div class="list-box">
                                        <p>
                                            <span>取车地点</span>
                                            <span>{{ form.seatCode }}</span>
                                        </p>
                                        <p>
                                            <span>还车地点</span>
                                            <span>{{ form.seatCapacity }}人</span>
                                        </p>
                                    </div>
                                </div>
                                <!-- 默认下的酒水订单 -->
                                <div>
                                    <p class="title">接送时间</p>
                                    <div class="list-box">
                                        <p>2020/10/01 09:30 至 2020/10/05 09:30</p>
                                    </div>
                                </div>
                                <div>
                                    <p class="title">费用明细</p>
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

                <div slot="footer" class="dialog-footer" @click="dialog = false">
                    <el-button type="primary">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 到店输入验证码 -->
            <el-dialog title="验证码" :visible.sync="reachStoreDialog" class="seat-dialog" @close="handleCancelCode">
                <el-input v-model="reachStoreCode" placeholder="请输入验证码" autofocus></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancelCode">取 消</el-button>
                    <el-button type="primary" @click="reachStore">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 表格数据分页 -->
            <el-pagination
                v-if="tableData.length > 0"
                background
                layout="total,prev, pager, next"
                @current-change="handleCurrentChange"
                :total="searchObj.dataListCount"
                :current-page="searchObj.currentPage"
                :page-size="searchObj.pagesize"
                class="page"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import regular from '../../utils/regular';
export default {
    data() {
        return {
            searchObj: {
                searchPhone: '',
                searchOrderNum: '',
                searchOrderType: '',
                searchPayStatus: '',
                searchNickName: '',
                dataListCount: 0, //默认当前要显示的数据条数
                currentPage: 1, //默认显示的页码所在位置（第一页）
                pagesize: 10 //默认每页要显示多少条数据
            },
            dialog: false, //查看订单详情弹窗开关
            tableData: [], //订单表格列表
            form: {}, //订单详情表单
            upSeatId: '', //当前要修改的id
            priNumber: '', //用户隐私号码
            priNumberDialog: false, //用户隐私号码弹窗开关
            reachStoreCode: '', //到店验证码
            reachStoreDialog: false, //输入到店验证码对话框

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
            ]
        };
    },

    watch: {
        watchOnloadOrder: {
            handler(val) {
                this.getOrderInfo();
            }
        }
    },

    computed: {
        watchOnloadOrder() {
            return this.$store.state.onloadOrder;
        }
    },

    methods: {
        //获取用户隐私号码
        getPhone(orderNo) {
            this.$post(`/merchant/store/order/customer/${orderNo}`).then((res) => {
                if (res.code === 0) {
                    this.priNumber = res.data;
                    this.priNumberDialog = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        //查看订单信息
        handleLookInfo(orderNo) {
            (async () => {
                let res = await this.$get(`/merchant/store/order/${orderNo}/info`);
                if (res.code === 0) {
                    res.data.contactTel = res.data.contactTel.replace(res.data.contactTel.slice(3, 7), '****');
                    this.form = res.data;
                    this.dialog = true;
                }
                console.log('详细信息', this.form);
            })();
        },

        //获取订单信息列表
        getOrderInfo() {
            (async () => {
                let data = {
                    pageNo: this.searchObj.currentPage,
                    pageSize: this.searchObj.pagesize,
                    contactTel: this.searchObj.searchPhone,
                    orderNo: this.searchObj.searchOrderNum,
                    orderType: this.searchObj.searchOrderType,
                    paid: this.searchObj.searchPayStatus,
                    contactName: this.searchObj.searchNickName
                };

                try {
                    let res = await this.$post('/merchant/store/order/list', data);
                    if (res.code === 0) {
                        this.tableData = res.data.merchantOrderList.list;
                        this.searchObj.dataListCount = res.data.merchantOrderList.total;
                    } else {
                        this.$message.error(res.msg);
                    }
                } catch (err) {
                    this.$message.error(err.msg);
                }
            })();
        },

        //搜索操作
        handleSearch() {
            if (this.searchObj.searchPhone) {
                if (!regular.pureNumber(this.searchObj.searchPhone)) {
                    this.$message.error('手机号格式不正确');
                    return;
                }
            }

            if (this.searchObj.searchOrderNum) {
                if (!regular.pureNumber(this.searchObj.searchOrderNum)) {
                    this.$message.error('订单号格式不正确');
                    return;
                }
            }

            this.searchObj.currentPage = 1;
            this.getOrderInfo();
        },

        //翻页
        handleCurrentChange(val) {
            this.searchObj.currentPage = val;
            this.getOrderInfo(); //请求翻页后的数据
        },

        //接单/拒单操作
        handleOper(row, status) {
            if (row.status == 0) {
                this.$confirm('确定要执行此操作吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        (async () => {
                            let data = {
                                id: row.id,
                                status
                            };

                            let res = await this.$put('/merchant/store/order/status', data);

                            if (res.code === 0) {
                                this.$message.success('操作成功');
                                this.getOrderInfo();
                            } else {
                                this.$message.error(res.msg);
                            }
                        })();
                    })
                    .catch(() => {});
            }
        },

        //未到店操作
        unReachStore(row) {
            //如果当前是未到店，那么久切换为接单状态
            if (row.status == 3) {
                this.isHandleRequest(row.id, 1);
            }

            //如果当前是接单状态，那么久切换为未到店
            if (row.status == 1) {
                this.isHandleRequest(row.id, 3);
            }
        },

        //打开到店输入验证码对话框
        openReachStoreDialog(id) {
            this.upSeatId = id;
            this.reachStoreDialog = true;
        },

        //到店操作
        reachStore() {
            this.isHandleRequest(this.upSeatId, 4, this.reachStoreCode);
        },

        //到店操作对话框中的取消按钮
        handleCancelCode() {
            this.reachStoreDialog = false;
            this.reachStoreCode = '';
        },

        //是否到店与是否消费请求
        isHandleRequest(id, status, smsCode = '') {
            let data = {
                id,
                status,
                smsCode
            };

            this.$put('/merchant/store/order/status', data).then((res) => {
                if (res.code === 0) {
                    this.$message.success('操作成功');
                    this.getOrderInfo();
                    this.reachStoreDialog = false;
                } else {
                    this.$message.error(res.msg);
                }
                this.reachStoreCode = '';
            });
        },

        //是否离店确认
        isConComplete(row) {
            this.$confirm('是否确认离店?', '提示', {
                distinguishCancelAndClose: true,
                confirmButtonText: '已离店',
                // cancelButtonText: '未消费',
                type: 'warning'
            })
                .then(() => {
                    this.isHandleRequest(row.id, 6); //已离店
                })
                .catch((action) => {
                    // action === 'cancel' && this.isHandleRequest(row.id, 5); //未消费
                });
        }
    },

    mounted() {
        this.getOrderInfo();
    }
};
</script>

 <style scoped lang='less'>
.crumbs {
    margin: 20px 0;
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
            width: 50%;

            .info1 {
                display: flex;
                flex-wrap: wrap;
                justify-content: space-between;

                > div {
                    width: 33.3333%;
                    margin-bottom: 18px;
                }

                &::after {
                    width: 33.3333%;
                    content: '';
                }
            }

            .info2 {
                display: flex;
                justify-content: space-between;

                & > div:first-child {
                    width: 40%;
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
        width: 70%;
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

/deep/.handle-input {
    width: 150px;
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
