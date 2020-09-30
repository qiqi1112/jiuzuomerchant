<template>
    <!-- <div id="order_msg">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 订单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input
                    v-model="query.name"
                    placeholder="用户名"
                    clearable
                    class="handle-input mr10"
                ></el-input>
                <el-input v-model="query.tel" placeholder="手机号" clearable class="handle-input mr10"></el-input>
                <el-input
                    v-model="query.orderNum"
                    placeholder="订单号"
                    clearable
                    class="handle-input mr10"
                ></el-input>
                <el-select
                    v-model="query.orderType"
                    placeholder="订单类型"
                    class="mr10"
                    style="width:100px"
                    clearable
                >
                    <el-option
                        v-for="item in orderTypeOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>

                <el-select
                    v-model="query.payStatus"
                    placeholder="支付状态"
                    class="mr10"
                    style="width:100px"
                    clearable
                >
                    <el-option
                        v-for="item in payStatusOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>

                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                <el-button type="primary" class="handle-del mr10" @click="lookSeat">查看座位</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-download"
                    class="handle-del mr10"
                    @click="exportTable"
                >Excel导出</el-button>
            </div>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @row-dblclick="lineDb"
            >
                <el-table-column prop="id" label="ID" fixed width="80" align="center"></el-table-column>
                <el-table-column prop="order_id" min-width="120" label="订单发起人"></el-table-column>
                <el-table-column prop="order_id" min-width="120" label="预定用户"></el-table-column>
                <el-table-column prop="tel" min-width="120" label="预定手机">
                    <template slot-scope="scope">
                        <span>{{scope.row.tel | phoneNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="order_type" min-width="100" label="订单类型"></el-table-column>
                <el-table-column prop="order_state" min-width="200" label="总订单号"></el-table-column>
                <el-table-column prop="user_name" min-width="180" label="订单号"></el-table-column>
                <el-table-column prop="creat_time" min-width="150" label="支付状态"></el-table-column>
                <el-table-column prop="order_state" min-width="100" label="支付类型"></el-table-column>
                <el-table-column prop="remark" min-width="200" label="实付金额"></el-table-column>
                <el-table-column prop="remark" min-width="200" label="商品原价"></el-table-column>
                <el-table-column prop="pay_type" min-width="200" label="优惠卷"></el-table-column>
                <el-table-column prop="pay_time" min-width="200" label="备注信息"></el-table-column>
                <el-table-column prop="total" min-width="150" label="订单发起时间"></el-table-column>
                <el-table-column prop="order_detail" min-width="150" label="订单支付时间"></el-table-column>
                <el-table-column prop="is_coupons" min-width="200" label="订单信息"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            :disabled="scope.row.stateUsing==3"
                            :type="scope.row.stateUsing==1?'success':(scope.row.stateUsing==2?'danger':'info')"
                            @click="stateEdit(scope.$index, scope.row)"
                        >{{scope.row.stateUsing==1?'已到店':(scope.row.stateUsing==2?'使用中':'已离开')}}</el-button>
                        <el-button
                            size="mini"
                            type="primary"
                            @click="handleLook(scope.$index, scope.row)"
                        >查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="query.pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <el-dialog :visible.sync="editVisible" width="32%">
            <el-form ref="form" :model="form" label-width="100px">
                <div class="column">
                    <span class="line lw2"></span>
                    <span>订单信息</span>
                </div>

                <div class="order_detail">
                    <div class="ol">
                        <div class="or_li">
                            <span class="or_lab">预定用户：</span>
                            <span class="or_info">张十周年</span>
                        </div>
                        <div class="or_li">
                            <span class="or_lab">预定手机：</span>
                            <span class="or_info">19999999999</span>
                        </div>
                        <div class="or_li">
                            <span class="or_lab">预定备注信息：</span>
                            <span class="or_info">帮我提前打理好卫生吧，我这里来的是比较重要的领导，会早点来</span>
                        </div>
                        <div class="or_li">
                            <span class="or_lab">订单号：</span>
                            <span class="or_info">Mugabsj587416594KSJD54</span>
                        </div>
                        <div>
                            <span>订单类型：&nbsp;</span>
                            <span class="ors">预定桌</span>
                            <span>支付状态：&nbsp;</span>
                            <span class="ors sta">已支付</span>
                            <span>支付方式：&nbsp;</span>
                            <span>微信</span>
                        </div>

                        <div>
                            <div class="dl">
                                <span>支付金额：</span>
                                <span class="total">￥1298.00</span>
                                <span class="old_t">商品原价：</span>
                                <span class="total">￥1298.00</span>
                            </div>
                            <div class="dl tr">
                                <span>优惠券优惠：</span>
                                <span class="total">￥1298.00</span>
                            </div>
                        </div>

                        <div class="or_li">
                            <span class="or_lab">下单时间：</span>
                            <span class="or_t">2020-09-23 09:56:28 星期三</span>
                        </div>
                        <div class="or_li">
                            <span class="or_lab">支付时间：</span>
                            <span class="or_t">2020-09-23 09:56:28 星期三</span>
                        </div>
                    </div>
                    <div class="or">
                        <div class="orl">清单详情：</div>
                        <div class="orr">
                            <div class="seat">
                                <p class="tit">座位信息</p>
                                <div class="oli">
                                    <span class="olil">座位号</span>
                                    <span class="olir">K5座</span>
                                </div>
                                <div class="oli">
                                    <span class="olil">容纳人数</span>
                                    <span class="olir">8人</span>
                                </div>
                                <div class="oli">
                                    <span class="olil">保留时间</span>
                                    <span class="olir">最晚至 20：30</span>
                                </div>
                                <div class="oli">
                                    <span class="olil">抵消金额</span>
                                    <span class="olir">￥ 1000.00</span>
                                </div>
                            </div>
                            <div class="coupons">
                                <p class="tit">优惠卷</p>
                                <div class="oli">满1000减50</div>
                            </div>
                            <div class="drinks">
                                <p class="tit">酒水清单</p>
                                <div class="oli">
                                    <span class="olil">商品名称</span>
                                    <span class="olir">
                                        ￥246.00
                                        <span>￥246.00</span>
                                    </span>
                                </div>
                                <div class="onu">
                                    <span class="olil">*1</span>
                                </div>
                                <div class="oli">
                                    <span class="olil">抵消金额</span>
                                    <span class="olir">
                                        ￥246.00
                                        <span>￥246.00</span>
                                    </span>
                                </div>
                                <div class="onu">
                                    <span class="olil">*2</span>
                                </div>
                            </div>
                            <div class="save">
                                <el-button type="primary">返回</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form>
        </el-dialog>
    </div> -->

    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 入驻申请 </el-breadcrumb-item>
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
                <el-table-column prop="createBy" label="订单发起人"></el-table-column>
                <el-table-column prop="contactName" label="预订用户"></el-table-column>
                <el-table-column prop="contactTel" label="预定手机"></el-table-column>
                <el-table-column prop="orderType" label="订单类型"></el-table-column>
                <el-table-column prop="orderNo" label="总订单号"></el-table-column>
                <el-table-column prop="orderId" label="订单号"></el-table-column>
                <el-table-column prop="payStatus" label="支付状态"></el-table-column>
                <el-table-column prop="payWay" label="支付类型"></el-table-column>
                <el-table-column prop="orderAmount" label="实付金额"></el-table-column>
                <el-table-column prop="payableAmount" label="商品原价"></el-table-column>
                <el-table-column prop="details" label="优惠券"></el-table-column>
                <el-table-column prop="remarks" label="备注信息"></el-table-column>
                <el-table-column prop="createTime" label="订单发起时间"></el-table-column>
                <el-table-column prop="paidTime" label="订单支付时间"></el-table-column>
                <el-table-column prop="storeName" label="订单信息">
                    <template slot-scope="scope">
                        <el-link icon="el-icon-edit" @click="handleLookInfo(scope.row)">查看订单</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="smsCode" label="验证码"></el-table-column>
                <el-table-column label="操作" fixed="right" min-width="350">
                    <template slot-scope="scope">
                        <!-- :disabled="scope.row.status !== 0" -->
                        <el-button :type="scope.row.status == 0 ? 'primary' : 'info'" @click="handleOper(scope.row, 1)">{{
                            scope.row.status == 1 ? '已接单' : '接单'
                        }}</el-button>
                        <el-button :type="scope.row.status == 0 ? 'primary' : 'info'" @click="handleOper2(scope.row, 2)">{{
                            scope.row.status == 2 ? '已拒单' : '拒单'
                        }}</el-button>
                        <el-button
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
                                    ? 'info'
                                    : 'primary'
                            "
                            @click="handleOper3(scope.row)"
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
                            :type="
                                scope.row.status == 2
                                    ? 'info'
                                    : scope.row.status == 3
                                    ? 'info'
                                    : scope.row.status == 5
                                    ? 'danger'
                                    : scope.row.status == 6
                                    ? 'danger'
                                    : 'primary'
                            "
                            @click="handleOper4(scope.row)"
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

            <el-dialog :visible.sync="perDialog">
                <div v-if="dialogStatus == 3">
                    <el-radio v-model="radio1" label="3">未到店</el-radio>
                    <el-radio v-model="radio1" label="4">已到店</el-radio>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="perDialog = false">取 消</el-button>
                        <el-button type="primary" @click="handleSurePer1">确 定</el-button>
                    </div>
                </div>
                <div v-if="dialogStatus == 4">
                    <el-radio v-model="radio2" label="5">未消费</el-radio>
                    <el-radio v-model="radio2" label="6">已离开</el-radio>
                    <div slot="footer" class="dialog-footer">
                        <el-button @click="perDialog = false">取 消</el-button>
                        <el-button type="primary" @click="handleSurePer2">确 定</el-button>
                    </div>
                </div>
            </el-dialog>

            <!-- 查看对话框 -->
            <!-- <el-dialog :visible.sync="dialog">
                <span class="add-classify-title">订单信息</span>
                <div class="basic-info"></div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialog = false">取 消</el-button>
                    <el-button type="primary" @click="handleSureEdit">确 定</el-button>
                </div>
            </el-dialog> -->

            <el-dialog :visible.sync="dialog">
                <el-form v-if="dialogStatus == 1" ref="form" :model="form" label-width="100px">
                    <div class="column">
                        <span class="line lw2"></span>
                        <span>订单信息</span>
                    </div>
                    <div class="order_detail">
                        <div class="ol">
                            <div class="or_li">
                                <span class="or_lab">预定用户：</span>
                                <span class="or_info">{{ form.contactName }}</span>
                            </div>
                            <div class="or_li">
                                <span class="or_lab">预定手机：</span>
                                <span class="or_info">{{ form.contactTel }}</span>
                            </div>
                            <div class="or_li">
                                <span class="or_lab">预定备注信息：</span>
                                <span class="or_info">{{ form.remarks }}</span>
                            </div>
                            <div class="or_li">
                                <span class="or_lab">订单号：</span>
                                <span class="or_info">{{ form.orderNo }}</span>
                            </div>
                            <div>
                                <span>订单类型：&nbsp;</span>
                                <span class="ors">{{ form.orderType == 0 ? '预定桌' : 'AA拼单' }}</span>
                                <span>支付状态：&nbsp;</span>
                                <span class="ors sta">{{ form.payStatus | payStatus }}</span>
                                <span>支付方式：&nbsp;</span>
                                <span>{{ form.payWay | payWay }}</span>
                            </div>

                            <div>
                                <div class="dl">
                                    <span>实付金额：</span>
                                    <span class="total">{{ form.orderAmount }}</span>
                                    <span class="old_t">商品原价：</span>
                                    <span class="total">{{ form.payableAmount }}</span>
                                </div>
                                <div class="dl tr">
                                    <span>优惠券优惠：</span>
                                    <span class="total">{{ form.couponAmount }}</span>
                                </div>
                            </div>

                            <div class="or_li">
                                <span class="or_lab">下单时间：</span>
                                <span class="or_t">{{ form.createTime }}</span>
                            </div>
                            <div class="or_li">
                                <span class="or_lab">支付时间：</span>
                                <span class="or_t">{{ form.payTime }}</span>
                            </div>
                        </div>
                        <div class="or">
                            <div class="orl">清单详情：</div>
                            <div class="orr">
                                <div class="seat">
                                    <p class="tit">座位信息</p>
                                    <div class="oli">
                                        <span class="olil">座位号</span>
                                        <span class="olir">{{ form.seatCode }}</span>
                                    </div>
                                    <div class="oli">
                                        <span class="olil">容纳人数</span>
                                        <span class="olir">{{ form.seatCapacity }}</span>
                                    </div>
                                    <div class="oli">
                                        <span class="olil">保留时间</span>
                                        <span class="olir">{{ form.retentionTime }}</span>
                                    </div>
                                    <div class="oli">
                                        <span class="olil">抵消金额</span>
                                        <span class="olir">{{ form.discountFee }}</span>
                                    </div>
                                </div>
                                <div class="coupons">
                                    <p class="tit">优惠卷</p>
                                    <div class="oli">{{ form.details }}</div>
                                </div>
                                <div class="drinks">
                                    <p class="tit">酒水清单</p>
                                    <div v-for="(item, index) in form.goodsList" :key="index">
                                        <div class="oli">
                                            <span class="olil">{{ item.goodsName }}</span>
                                            <span class="olir">
                                                {{ item.activityPrice }}
                                                <span>{{ item.originalPrice }}</span>
                                            </span>
                                        </div>
                                        <div class="onu">
                                            <span class="olil">x{{ item.quantity }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="save">
                                    <el-button @click="dialog = false">取 消</el-button>
                                    <el-button type="primary" @click="dialog = false">确 定</el-button>
                                </div>
                                <!-- <div slot="footer" class="dialog-footer">
                                    <el-button @click="dialog = false">取 消</el-button>
                                    <el-button type="primary" @click="handleSureEdit">确 定</el-button>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </el-form>

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
    // name: 'basetable',
    // data() {
    //     return {
    //         query: {
    //             payStatus: '',
    //             name: '',
    //             pageIndex: 1,
    //             pageSize: 10,
    //             pageTotal: 0,
    //             tel: '',
    //             orderType: '',
    //             orderNum: ''
    //         },

    //         //订单类型
    //         orderTypeOpt: [
    //             {
    //                 label: '预定',
    //                 value: '预定'
    //             },
    //             {
    //                 label: 'AA拼单',
    //                 value: 'AA拼单'
    //             }
    //         ],

    //         //支付状态
    //         payStatusOpt: [
    //             {
    //                 label: '已支付',
    //                 value: '已支付'
    //             },
    //             {
    //                 label: '未支付',
    //                 value: '未支付'
    //             }
    //         ],

    //         tableData: [],

    //         editVisible: false,
    //         form: {},
    //         index: -1,
    //         rules: {
    //             user_name: [
    //                 { required: true, message: '请输入活动名称', trigger: 'blur' }
    //                 // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
    //             ],
    //             order_id: [{ required: true, message: '请输入订单号', trigger: 'change' }],
    //             order_type: [{ type: 'date', required: true, message: '请选择订单类型', trigger: 'change' }],
    //             tel: [{ type: 'date', required: true, message: '请输入手机号', trigger: 'change' }],
    //             creat_time: [{ type: 'array', required: true, message: '请选择创建订单时间', trigger: 'change' }],
    //             order_state: [{ required: true, message: '请选择订单状态', trigger: 'change' }],
    //             pay_type: [{ required: true, message: '请选择支付状态', trigger: 'blur' }],
    //             pay_time: [{ required: true, message: '请选择实付时间', trigger: 'blur' }],
    //             total: [{ required: true, message: '请输入金额', trigger: 'blur' }],
    //             remark: [{ required: true, message: '请填写备注', trigger: 'blur' }],
    //             order_detail: [{ required: true, message: '请输入订单内容', trigger: 'blur' }],
    //             is_coupons: [{ required: true, message: '请选择优惠券类型', trigger: 'blur' }],
    //             coupons_total: [{ required: true, message: '请输入优惠券金额', trigger: 'blur' }]
    //         }
    //     };
    // },

    // created() {},

    // methods: {
    //     // 搜索
    //     handleSearch() {},

    //     // 双击某一行
    //     lineDb(row, column, event) {
    //         this.form = {};
    //         if (row) {
    //             // this.index = index;
    //             this.form = row;
    //         }
    //         this.editVisible = true;

    //         console.log(row, column, event);
    //     },

    //     // 编辑操作
    //     handleLook(index = '', row = '') {
    //         this.form = {};
    //         if (row) {
    //             this.index = index;
    //             this.form = row;
    //         }
    //         this.editVisible = true;
    //         console.log(row);
    //     },

    //     // 修改当前状态 已到店/使用中/已离开
    //     stateEdit(index, row) {
    //         this.$confirm('确定要修改当前订单状态吗？', '温馨提示', {
    //             type: 'warning'
    //         })
    //             .then(() => {
    //                 this.$message.success('订单状态修改成功');
    //                 row.stateUsing++;
    //                 if (row.stateUsing > 3) {
    //                     row.stateUsing = 1;
    //                 }
    //             })
    //             .catch(() => {});
    //     },

    //     //分页
    //     handlePageChange(val) {},

    //     //查看座位
    //     lookSeat() {},

    //     //导出Excel
    //     exportTable() {}
    // }

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

            tableData: [],

            form: {},

            dialogStatus: 1,

            radio1: '',
            radio2: '',

            statusId: '',

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

                        // console.log(this.allSeatDetailInfo);
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

        //查看信息
        handleLookInfo(row) {
            this.dialogStatus = 1;
            this.dialog = true;

            (async () => {
                let res = await this.$get(`/merchant/store/order/${row.orderNo}/info`);

                this.form = res.data;

                // console.log('详细信息', this.form);
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

                    console.log(res);
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

        handleSurePer1() {
            (async () => {
                let data = {
                    id: this.statusId,
                    status: this.radio1
                };

                let res = await this.$put('/merchant/store/order/status', data);

                res.code == 0 && console.log(res);
            })();
        },
        handleSurePer2() {
            (async () => {
                let data = {
                    id: this.statusId,
                    status: this.radio2
                };

                let res = await this.$put('/merchant/store/order/status', data);

                res.code == 0 && console.log(res);
            })();
        },

        handleOper(row, status) {
            if (row.status !== 1) {
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

                            res.code == 0 && console.log(res);
                        })();
                    })
                    .catch(() => {});
            }
        },
        handleOper2(row, status) {
            if (row.status !== 2) {
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

                            res.code == 0 && console.log(res);
                        })();
                    })
                    .catch(() => {});
            }
        },
        handleOper3(row, status) {
            this.statusId = row.id;
            this.dialogStatus = 3;
            this.perDialog = true;
        },
        handleOper4(row, status) {
            this.statusId = row.id;
            this.dialogStatus = 4;
            this.perDialog = true;
        }
    },

    mounted() {
        this.getOrderInfo();
    }
};
</script>

 <style scoped lang='less'>
// @border-color: #7a7a7a;
// .handle-box {
//     margin-bottom: 20px;
// }

// .handle-select {
//     width: 120px;
// }

// .handle-input {
//     width: 300px;
//     display: inline-block;
// }
// .table {
//     width: 100%;
//     font-size: 14px;
// }
// .red {
//     color: #ff0000;
// }
// .mr10 {
//     margin-right: 10px;
// }
// .table-td-thumb {
//     display: inline-block;
//     margin: auto;
//     width: 40px;
//     height: 40px;
//     margin-right: 10px;
// }
// .table-td-thumb img {
//     width: 100%;
//     height: 100%;
// }
// /* /deep/ .beyond{
//     overflow:hidden;
//     text-overflow:ellipsis;
//     display:-webkit-box;
//     -webkit-box-orient:vertical;
//     -webkit-line-clamp:2;
// } */
// /* 弹窗 */
// .order_detail {
//     display: flex;
//     .ol {
//         flex: 1;
//         .or_li {
//             display: flex;
//             margin-bottom: 20px;
//         }
//         .or_lab {
//             flex: 0.3;
//             width: 100px;
//         }
//         .or_info {
//             flex: 0.7;
//             width: 100px;
//             border: 1px solid @border-color;
//             border-radius: 5px;
//             padding: 7px 10px;
//             box-sizing: border-box;
//         }
//         .ors {
//             margin-right: 41px;
//         }
//         .sta {
//             color: #488c05;
//         }
//         .total {
//             display: inline-block;
//             border: 1px solid @border-color;
//             padding: 5px 7px;
//             border-radius: 5px;
//             margin-left: 20px;
//         }
//         .or_t {
//             flex: 0.7;
//         }
//         .dl {
//             margin: 20px 0;
//             .old_t {
//                 margin-left: 75px;
//             }
//         }
//         .tr {
//             text-align: right;
//         }
//     }
//     .or {
//         flex: 1;
//         // text-indent: 50px;
//         display: flex;
//         .orl {
//             flex: 0.2;
//             padding-left: 50px;
//         }
//         .orr {
//             flex: 0.65;
//             .seat,
//             .coupons {
//                 border-bottom: 1px solid @border-color;
//                 margin-bottom: 10px;
//             }
//             .drinks {
//                 height: 220px;
//                 overflow-y: scroll;
//             }
//             .drinks::-webkit-scrollbar {
//                 display: none;
//             }
//             .tit {
//                 color: rgb(236, 126, 0);
//                 margin-bottom: 10px;
//             }
//             .oli {
//                 line-height: 32px;
//                 span {
//                     display: inline-block;
//                 }
//                 .olil {
//                     width: 42%;
//                 }
//                 .olir {
//                     width: 58%;
//                     span {
//                         text-decoration: line-through;
//                         color: rgb(138, 138, 138);
//                     }
//                 }
//             }
//             .save {
//                 text-align: right;
//             }
//             .onu {
//                 line-height: 20px;
//             }
//         }
//     }
// }

// // element
// /deep/.el-dialog {
//     width: 46% !important;
//     min-width: 876px;
// }
// /deep/.el-dialog__header {
//     padding: 0;
// }
// /deep/ .el-dialog__body {
//     padding-top: 10px;
// }
// /deep/.handle-input {
//     width: 150px;
// }

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

@border-color: #7a7a7a;
/deep/ .el-dialog__header {
    padding: 0;
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

/* 弹窗 */
.order_detail {
    display: flex;
    .ol {
        flex: 1;
        .or_li {
            display: flex;
            margin-bottom: 20px;
        }
        .or_lab {
            flex: 0.3;
            width: 100px;
        }
        .or_info {
            flex: 0.7;
            width: 100px;
            border: 1px solid @border-color;
            border-radius: 5px;
            padding: 7px 10px;
            box-sizing: border-box;
        }
        .ors {
            margin-right: 41px;
        }
        .sta {
            color: #488c05;
        }
        .total {
            display: inline-block;
            border: 1px solid @border-color;
            padding: 5px 7px;
            border-radius: 5px;
            margin-left: 20px;
        }
        .or_t {
            flex: 0.7;
        }
        .dl {
            margin: 20px 0;
            .old_t {
                margin-left: 75px;
            }
        }
        .tr {
            text-align: right;
        }
    }
    .or {
        flex: 1;
        display: flex;
        .orl {
            flex: 0.2;
            padding-left: 50px;
        }
        .orr {
            flex: 0.65;
            .seat,
            .coupons {
                border-bottom: 1px solid @border-color;
                margin-bottom: 10px;
            }
            .drinks {
                height: 220px;
                overflow-y: scroll;
            }
            .drinks::-webkit-scrollbar {
                display: none;
            }
            .tit {
                color: rgb(236, 126, 0);
                margin-bottom: 10px;
            }
            .oli {
                line-height: 32px;
                span {
                    display: inline-block;
                }
                .olil {
                    width: 42%;
                }
                .olir {
                    width: 58%;
                    span {
                        text-decoration: line-through;
                        color: rgb(138, 138, 138);
                    }
                }
            }
            .save {
                text-align: right;
            }
            .onu {
                line-height: 20px;
            }
        }
    }
}

/deep/.el-dialog {
    width: 80% !important;
    // min-width: 876px;
}
/deep/.el-dialog__header {
    padding: 0;
}
/deep/.handle-input {
    width: 150px;
}
</style>
