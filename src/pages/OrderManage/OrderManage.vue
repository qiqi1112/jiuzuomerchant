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
                <el-select clearable v-model="searchObj.searchPayStatus" placeholder="支付状态" class="handle-input mr10">
                    <el-option v-for="(item, index) in payStatusArr" :key="index" :label="item.label" :value="item.value"></el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="success" icon="el-icon-search" @click="seeSeatInfo">查看座位</el-button>
            </div>

            <!-- 表格部分 -->
            <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="ID" fixed type="index"></el-table-column>
                <el-table-column prop="createBy" label="订单发起人" min-width="150"></el-table-column>
                <el-table-column prop="contactName" label="预订用户"></el-table-column>
                <el-table-column label="座位号/包间号">
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.status == 4" @click="editSeat(scope.row)">{{ scope.row.seatCode }}</el-link>
                        <span v-else>{{ scope.row.seatCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="contactTel" label="预定手机"></el-table-column>
                <el-table-column prop="orderType" label="订单类型"></el-table-column>
                <el-table-column prop="orderNo" label="总订单号" min-width="160"></el-table-column>
                <el-table-column prop="orderId" label="订单号"></el-table-column>
                <el-table-column prop="payStatus" label="支付状态"></el-table-column>
                <el-table-column prop="payWay" label="支付类型"></el-table-column>
                <el-table-column prop="orderAmount" label="实付金额"></el-table-column>
                <el-table-column prop="payableAmount" label="商品原价"></el-table-column>
                <el-table-column prop="details" label="优惠券"></el-table-column>
                <el-table-column prop="remarks" label="备注信息"></el-table-column>
                <el-table-column prop="createTime" label="订单发起时间" min-width="140"></el-table-column>
                <el-table-column prop="paidTime" label="订单支付时间" min-width="140"></el-table-column>
                <el-table-column prop="storeName" label="订单信息" min-width="100">
                    <template slot-scope="scope">
                        <el-link icon="el-icon-edit" @click="handleLookInfo(scope.row)">查看订单</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="smsCode" label="验证码"></el-table-column>
                <el-table-column label="操作" fixed="right" min-width="350">
                    <template slot-scope="scope">
                        <el-button
                            :disabled="
                                scope.row.status == 2 ||
                                scope.row.status == 3 ||
                                scope.row.status == 4 ||
                                scope.row.status == 5 ||
                                scope.row.status == 6
                            "
                            :type="scope.row.status == 0 ? 'primary' : scope.row.status == 1 ? 'success' : 'info'"
                            @click="handleOper(scope.row, 1)"
                            >{{ scope.row.status == 1 ? '已接单' : '接单' }}</el-button
                        >
                        <el-button
                            :disabled="
                                scope.row.status == 1 ||
                                scope.row.status == 3 ||
                                scope.row.status == 4 ||
                                scope.row.status == 5 ||
                                scope.row.status == 6
                            "
                            :type="scope.row.status == 0 ? 'primary' : scope.row.status == 2 ? 'danger' : 'info'"
                            @click="handleOper(scope.row, 2)"
                            >{{ scope.row.status == 2 ? '已拒单' : '拒单' }}</el-button
                        >
                        <el-button
                            :disabled="
                                scope.row.status == 2 ||
                                scope.row.status == 3 ||
                                scope.row.status == 4 ||
                                scope.row.status == 5 ||
                                scope.row.status == 6
                            "
                            :type="
                                scope.row.status == 6
                                    ? 'info'
                                    : scope.row.status == 5
                                    ? 'info'
                                    : scope.row.status == 2
                                    ? 'info'
                                    : scope.row.status == 3
                                    ? 'danger'
                                    : scope.row.status == 4
                                    ? 'success'
                                    : 'primary'
                            "
                            @click="handleOperDialogShow(scope.row, 3)"
                            >{{
                                scope.row.status == 2
                                    ? '未到店'
                                    : scope.row.status == 5
                                    ? '已到店'
                                    : scope.row.status == 6
                                    ? '已到店'
                                    : scope.row.status == 3
                                    ? '未到店'
                                    : scope.row.status == 4
                                    ? '已到店'
                                    : '确认到店'
                            }}
                        </el-button>
                        <el-button
                            :disabled="scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 5 || scope.row.status == 6"
                            :type="
                                scope.row.status == 2
                                    ? 'info'
                                    : scope.row.status == 3
                                    ? 'info'
                                    : scope.row.status == 5
                                    ? 'danger'
                                    : scope.row.status == 6
                                    ? 'success'
                                    : 'primary'
                            "
                            @click="handleOperDialogShow(scope.row, 4)"
                            >{{
                                scope.row.status == 2
                                    ? '未消费'
                                    : scope.row.status == 3
                                    ? '未消费'
                                    : scope.row.status == 5
                                    ? '未消费'
                                    : scope.row.status == 6
                                    ? '已离开'
                                    : '确认消费'
                            }}</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>

            <!-- 修改座位/包间号对话框 -->
            <el-dialog title="修改座位号/包间号" :visible.sync="seatDia" class="seat-dialog" @close="handleCancel">
                <el-input v-model="seatNum" placeholder="请输入座位号/包间号"></el-input>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel">取 消</el-button>
                    <el-button type="primary" @click="handleEditSeat">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 是否到店与是否消费对话框 -->
            <el-dialog :visible.sync="perDialog">
                <div v-if="dialogStatus == 3">
                    <el-radio v-model="radio1" label="3">未到店</el-radio>
                    <el-radio v-model="radio1" label="4">已到店</el-radio>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="perDialog = false">取 消</el-button>
                        <el-button type="primary" @click="handleSurePer(1)">确 定</el-button>
                    </div>
                </div>
                <div v-if="dialogStatus == 4">
                    <el-radio v-model="radio2" label="5">未消费</el-radio>
                    <el-radio v-model="radio2" label="6">已离开</el-radio>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="perDialog = false">取 消</el-button>
                        <el-button type="primary" @click="handleSurePer(2)">确 定</el-button>
                    </div>
                </div>
            </el-dialog>

            <!-- 查看订单与查看座位对话框 -->
            <el-dialog :visible.sync="dialog">
                <!-- 订单详情 -->
                <span class="add-classify-title">{{ dialogStatus == 1 ? '订单信息' : '座位信息' }} </span>
                <div class="basic-info">
                    <el-form v-if="dialogStatus == 1" ref="form" class="info-wrap" :model="form" label-width="110px">
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
                                    <span>{{ form.orderType == 0 ? '预定桌' : 'AA拼单' }}</span>
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
                                    <el-form-item label="实付金额：">
                                        <el-input v-model="form.orderAmount" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>
                                </div>
                                <div>
                                    <el-form-item label="商品原价：">
                                        <el-input v-model="form.payableAmount" readonly>
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item label="优惠券优惠：">
                                        <el-input v-model="form.minAmount" readonly>
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
                                    <p class="title">座位信息</p>
                                    <div class="list-box">
                                        <p>
                                            <span>座位号</span>
                                            <span>{{ form.seatCode }}</span>
                                        </p>
                                        <p>
                                            <span>容纳人数</span>
                                            <span>{{ form.seatCapacity }}人</span>
                                        </p>
                                        <p>
                                            <span>保留时间</span>
                                            <span>最晚至{{ form.retentionTime }}</span>
                                        </p>
                                        <p>
                                            <span>抵消金额</span>
                                            <span>￥{{ form.discountFee }}</span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p class="title">酒水清单</p>
                                    <div class="list-box">
                                        <div class="drink-list" v-for="(item, index) in form.goodsList" :key="index">
                                            <div class="good-box">
                                                <div class="good-name">{{ item.goodsName }}</div>
                                                <span>x{{ item.quantity }}</span>
                                            </div>
                                            <div>
                                                <span>￥{{ item.activityPrice }}</span>
                                                <span class="unline">￥{{ item.originalPrice }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <p class="title">优惠券</p>
                                    <div class="list-box">
                                        <p>{{ form.details }}</p>
                                    </div>
                                </div>
                                <div class="change-seat" v-if="form.changeSeat && form.changeSeatTime">
                                    <p>
                                        <span>经商家换座：</span>
                                        <span>{{ form.changeSeat }}</span>
                                    </p>
                                    <p>
                                        <span>换座时间：</span>
                                        <span>{{ form.changeSeatTime }}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </el-form>
                </div>

                <!-- 座位详情图 -->
                <div v-if="dialogStatus == 2">
                    <div class="shop-seat">
                        <!-- 左边座位展示 -->
                        <div class="left-box">
                            <!-- 座位属性标题 -->
                            <div class="seat-title">
                                <p v-for="(item, index) in seatAttOpt" :key="index">
                                    <span :class="item.class"></span>
                                    {{ item.name }}
                                </p>
                            </div>
                            <!-- 回显的座位图 -->
                            <div
                                v-if="x && y"
                                class="seat-box"
                                ref="seatBox"
                                :style="{ width: 32 * y + 30 + 'px' }"
                                style="overflow: hidden"
                            >
                                <div v-for="(itemY, indexY) in Number(y)" :key="indexY">
                                    <div v-for="(itemX, indexX) in Number(x)" :key="indexX">
                                        <span
                                            ref="seatSpan"
                                            :data-indexX="indexX + 1"
                                            :data-indexY="indexY + 1"
                                            class="seat"
                                            @click="changeStauts"
                                        ></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- 座位属性 -->
                        <div class="right-box" v-if="isClickSeat">
                            <p class="seat-detail">座位详情</p>
                            <!-- 座位号 -->
                            <div>
                                <span>座位号：</span>
                                <el-input
                                    v-model="presentSeatInfo.seatCode"
                                    placeholder="座位号"
                                    style="width: 50%"
                                    :readonly="isReadonly"
                                ></el-input>
                            </div>
                            <!-- 座位类型 -->
                            <div>
                                <span>座位类型：</span>
                                <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="1">软座</el-radio>
                                <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="2">硬座</el-radio>
                            </div>
                            <!-- 容纳人数 -->
                            <div>
                                <span>容纳人数：</span>
                                <el-input
                                    v-model="presentSeatInfo.numberOfPeople"
                                    placeholder="容纳人数"
                                    style="width: 50%; margin-right: 6px"
                                    :readonly="isReadonly"
                                ></el-input
                                >人
                            </div>
                            <!-- 最晚保留时间 -->
                            <div class="lon-retain">
                                <span>保留最晚时间：</span>
                                <el-time-select
                                    style="width: 50%"
                                    v-model="presentSeatInfo.seatLatestReservationTime"
                                    :readonly="isReadonly"
                                    :picker-options="{ start: '00:00', step: '00:10', end: '23:50' }"
                                ></el-time-select>
                            </div>
                            <!-- 最低消费 -->
                            <div class="min-charge">
                                <span class="min-con">最低消费：</span>
                                <div class="day-mincom">
                                    <p v-for="(item, index) in presentSeatInfo.weekPriceList" :key="index">
                                        <span>星期{{ item.weekIndex | weekIdxToWord }}</span>
                                        <el-input
                                            v-model="item.price"
                                            placeholder="最低消费"
                                            style="width: 47%; margin-right: 6px"
                                            :readonly="isReadonly"
                                        >
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialog = false">确 定</el-button>
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

            dialog: false,
            perDialog: false,
            seatDia: false,

            tableData: [],

            form: {},

            dialogStatus: 1,

            radio1: '',
            radio2: '',

            statusId: '',

            upSeatId: '', //当前要修改的id
            seatNum: '', //当前要修改的座位号

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
                },
                {
                    label: '会员卡',
                    value: '3'
                },
                {
                    label: '线下添单',
                    value: '4'
                }
            ],

            //支付状态
            payStatusArr: [
                {
                    label: '未支付',
                    value: '0'
                },
                {
                    label: '已支付',
                    value: '1'
                }
            ],

            isReadonly: true, //编辑信息开关

            x: 0, //座位行数
            y: 0, //座位列数

            //座位属性数组
            seatAttOpt: [
                {
                    name: '不可预订',
                    style: 'notBook',
                    class: 'not-book'
                },
                {
                    name: '可预订',
                    style: 'canBook',
                    class: 'can-book'
                },
                {
                    name: '舞台',
                    style: 'stageBook',
                    class: 'stage-book'
                },
                {
                    name: '过道',
                    style: 'aisleBook',
                    class: 'aisle-book'
                }
            ],

            allSeatDetailInfo: [], //所有座位详细信息
            presentSeatInfo: {}, //当前座位对应的详细信息
            isClickSeat: false //展示当前座位的详细信息开关
        };
    },

    methods: {
        //修改座位号/包间号
        editSeat(row) {
            this.seatDia = true;
            this.upSeatId = row.id;
        },

        //确认修改座位号/包间号
        handleEditSeat() {
            if (this.seatNum) {
                (async () => {
                    let data = {
                        id: this.upSeatId,
                        value: this.seatNum
                    };

                    let res = await this.$put('/merchant/store/order/seatOrRoom', data);

                    if (res.code == 0) {
                        this.$message.success('修改成功');
                        this.getOrderInfo();
                        this.seatDia = false;
                    } else {
                        this.$message.error('修改失败');
                    }

                    console.log('zzz', res);
                })();
            } else {
                this.$message.error('请输入要修改的座位号/包间号');
            }
        },

        //取消修改座位号/包间号
        handleCancel() {
            this.seatDia = false;
            this.seatNum = '';
        },

        //查看座位信息
        seeSeatInfo() {
            this.dialogStatus = 2;
            this.dialog = true;

            (async () => {
                try {
                    let result = await this.$get('/merchant/store/order/layoutList');

                    if (result.code == 0) {
                        let res = result.data;

                        let cassette = res.cassette;
                        this.allSeatDetailInfo = res.layoutList;

                        //回显店铺卡座数量
                        this.getShopSeat(cassette);

                        //对座位信息进行相关转换
                        this.changeLayoutList(this.allSeatDetailInfo);

                        //座位属性回显
                        this.showSeatAtt();
                    }
                } catch (error) {
                    console.log(error);
                }
            })();
        },

        //查看当前座位信息
        lookSeatInfo(e) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            //匹配当前座位信息
            this.allSeatDetailInfo.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    this.presentSeatInfo = item;

                    console.log('xxxxx', this.presentSeatInfo);
                }
            });
        },

        //座位点击事件
        changeStauts(e, style) {
            this.isClickSeat = true; //展示当前点击的座位的详细信息
            this.lookSeatInfo(e); //查看当前座位信息
            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
            e.target.classList.add('border'); //定位当前座位
        },

        //清空座位外边框（定位当前座位）
        clearSeatBorder() {
            if (this.$refs.seatSpan) {
                this.$refs.seatSpan.forEach((item) => {
                    item.classList.remove('border');
                });
            }
        },

        //对座位信息进行相关转换
        changeLayoutList(arr) {
            arr.forEach((item) => {
                //将数值型转为字符型（软硬座）
                if (item.softHardStatus || item.haveToilet) {
                    item.softHardStatus = item.softHardStatus.toString();
                }
            });
        },

        //回显店铺卡座数量（行和列数量）
        getShopSeat(seat) {
            seat = seat.split('x');
            this.x = seat[0];
            this.y = seat[1];
        },

        //座位属性回显
        showSeatAtt() {
            this.$nextTick(() => {
                if (this.$refs.seatSpan) {
                    //遍历所有座位
                    this.$refs.seatSpan.forEach((item) => {
                        let x = item.dataset.indexx; //行
                        let y = item.dataset.indexy; //列
                        //根据返回的座位数组进行匹配，并替换当前座位的属性
                        this.allSeatDetailInfo.forEach((item2) => {
                            if (item2.seatRow == x && item2.seatColumn == y) {
                                //不可预订
                                if (item2.seatAttribute == 1) {
                                    item.classList.add('notBook');
                                }
                                //可预订
                                if (item2.seatAttribute == 2) {
                                    item.classList.add('canBook');
                                }
                                //过道
                                if (item2.seatType == 3) {
                                    item.classList.add('aisleBook');
                                }
                                //舞台
                                if (item2.seatType == 4) {
                                    item.classList.add('stageBook');
                                }
                            }
                        });
                    });
                }
            });
        },

        //查看订单信息
        handleLookInfo(row) {
            this.dialogStatus = 1;
            this.dialog = true;

            (async () => {
                let res = await this.$get(`/merchant/store/order/${row.orderNo}/info`);

                this.form = res.data;

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
                    if (res.code == 0) {
                        this.tableData = res.data.list;
                        this.searchObj.dataListCount = res.data.total;
                    } else {
                        this.$message.error(res.msg);
                    }

                    console.log(res.data);

                    console.log(res.data.list[0].status);
                } catch (err) {
                    this.$message.error(err.msg);
                }
            })();
        },

        //搜索操作
        handleSearch() {
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
            if (row.status !== 1 && row.status !== 2) {
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

                            res.code == 0 && this.getOrderInfo();
                        })();
                    })
                    .catch(() => {});
            }
        },

        //操作里的对话框的确认按钮
        handleSurePer(index) {
            (async () => {
                let data = {
                    id: this.statusId,
                    status: index === 1 ? this.radio1 : this.radio2
                };

                let res = await this.$put('/merchant/store/order/status', data);

                if (res.code == 0) {
                    this.perDialog = false;
                    this.getOrderInfo();
                }
            })();
        },

        //操作显示对话框
        handleOperDialogShow(row, status) {
            if (row.status == 0) {
                this.$message.error('请先选择是否接单');
            } else {
                this.statusId = row.id;
                this.dialogStatus = status;
                this.perDialog = true;
            }
        }
    },

    mounted() {
        this.getOrderInfo();
    }
};
</script>

 <style scoped lang='less'>
.not-book {
    background-color: #e6a23c !important;
    border: 1px solid transparent !important;
}

.can-book {
    background-color: #fff !important;
}

.in-book {
    background-color: #409eff !important;
    border: 1px solid transparent !important;
}

.has-book {
    background-color: #f56c6c !important;
    border: 1px solid transparent !important;
}

.stage-book {
    background-color: #008000 !important;
    border: 1px solid transparent !important;
}

.aisle-book {
    background-color: #ddd !important;
    border: 1px solid transparent !important;
}

.seat {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 10px;
    margin-right: 10px;
    cursor: pointer;
    border: 1px solid #ddd;
}

.border {
    border: 1px solid #f00 !important;
}

.notBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid transparent;
    background-color: #e6a23c !important;
    cursor: pointer;
}

.canBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid #ddd;
    background-color: #fff !important;
    cursor: pointer;
}

.stageBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid transparent;
    background-color: #008000 !important;
    cursor: pointer;
}

.aisleBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid transparent;
    background-color: #ddd !important;
    cursor: pointer;
}

.shop-seat {
    display: flex;

    .left-box {
        margin-right: 30px;

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
                padding: 16px 20px;
                width: 80%;

                > p {
                    margin-bottom: 16px;
                    font-size: 14px;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    > span {
                        margin-right: 10px;
                    }
                }

                > p:last-child {
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
            width: 50%;

            .info1 {
                display: flex;
                justify-content: space-between;
                margin-bottom: 18px;
            }

            .info2 {
                display: flex;
                justify-content: space-between;
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
                        }
                    }

                    .unline {
                        text-decoration: line-through;
                        color: #bcbcbc;
                        margin-left: 10px;
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
</style>
