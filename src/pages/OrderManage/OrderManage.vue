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
                <!-- <el-button type="success" icon="el-icon-view" @click="seeSeatInfo" v-if="storeLocation !== 3 && storeLocation !== -1"
                    >查看座位</el-button
                > -->
            </div>

            <!-- 表格部分 -->
            <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="ID" fixed type="index"></el-table-column>
                <el-table-column prop="addGoodsDesc" label="追加订单" min-width="100">
                    <template slot-scope="scope">
                        <el-link v-if="scope.row.status == 4" @click="handleLookInfo(scope.row.orderNo)" type="primary">{{
                            scope.row.addGoodsDesc
                        }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="createBy" label="订单发起人" min-width="120"></el-table-column>
                <el-table-column prop="contactName" label="预订用户" min-width="120"></el-table-column>
                <el-table-column :label="storeLocation == 3 ? '包间类型' : '座位号'" min-width="120">
                    <template slot-scope="scope">
                        <el-button
                            v-if="
                                scope.row.orderType === 2 &&
                                scope.row.seatCode == '' &&
                                scope.row.closedStatus != 1 &&
                                scope.row.status == 4
                            "
                            @click="editSeat(scope.row)"
                            type="primary"
                            >设定座位</el-button
                        >
                        <el-link
                            v-else-if="scope.row.status == 4 && scope.row.closedStatus !== 1 && storeLocation != 3"
                            @click="editSeat(scope.row)"
                            type="primary"
                            >{{ scope.row.seatCode }}</el-link
                        >
                        <span v-else>{{ scope.row.seatCode }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="预定手机" min-width="140">
                    <template slot-scope="scope">
                        <el-link @click="getPhone(scope.row.orderNo)" type="primary"
                            >{{ scope.row.contactTel }}<i class="el-icon-phone el-icon--right" style="margin-left: 10px"></i>
                        </el-link>
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
                <el-table-column prop="storeName" label="订单信息" min-width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-link icon="el-icon-edit" @click="handleLookInfo(scope.row.orderNo)">查看订单</el-link>
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="smsCode" label="验证码"></el-table-column> -->
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

            <!-- 修改座位/包间号对话框 -->
            <el-dialog
                :title="storeLocation != 3 ? '修改座位号' : '修改包间号'"
                :visible.sync="seatDia"
                class="seat-dialog"
                @close="handleCancel"
            >
                <el-select
                    style="width: 100%"
                    v-model="seatNum"
                    filterable
                    remote
                    clearable
                    placeholder="请选择座位号"
                    v-if="storeLocation != 3"
                >
                    <el-option v-for="(item, index) in seatOrRoomList" :key="index" :label="item" :value="item"></el-option>
                </el-select>

                <el-select v-model="seatNum" placeholder="请选择包间号" v-if="storeLocation == 3" style="width: 100%">
                    <el-option-group v-for="item in seatOrRoomList" :key="item.roomTypeId" :label="item.roomTypeName">
                        <el-option
                            v-for="item in item.roomTimeIntervalList"
                            :key="item.roomTimeId"
                            :label="item.startTime + '-' + item.endTime"
                            :value="item.roomTimeId"
                        >
                        </el-option>
                    </el-option-group>
                </el-select>

                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel">取 消</el-button>
                    <el-button type="primary" @click="handleEditSeat">确 定</el-button>
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

            <!-- 查看订单与查看座位对话框 -->
            <el-dialog :visible.sync="dialog" class="search-seat">
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
                                    <el-form-item label="实付金额：">
                                        <el-input v-model="form.paidAmount" readonly>
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
                                        <el-input v-model="form.couponAmount" readonly>
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
                                    <p class="title">{{ storeLocation == 3 ? '包间信息' : '座位信息' }}</p>
                                    <div class="list-box">
                                        <p>
                                            <span>{{ storeLocation == 3 ? '包间类型' : '座位号' }}</span>
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
                                                    <span style="margin-right: 10px">{{ item.goodsName }}</span>
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
                                                    <span style="margin-right: 10px">{{ item.name }}</span>
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
                                                        <span style="margin-right: 10px">{{ item2.goodsName }}</span>
                                                        <span class="num">x{{ item2.quantity }}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span>￥{{ item2.activityPrice }}</span>
                                                    <span class="unline">￥{{ item2.originalPrice }}</span>
                                                </div>
                                            </div>

                                            <div>
                                                <el-button
                                                    @click="getTable(item.servedStatus, item.id, form.orderNo, 1)"
                                                    v-if="item.servedStatus == 0 || item.servedStatus == 1"
                                                    :disabled="item.servedStatus != 0"
                                                    type="primary"
                                                    >{{ item.servedStatus == 1 ? '已上桌' : '上桌' }}</el-button
                                                >
                                                <el-button
                                                    @click="getTable(item.servedStatus, item.id, form.orderNo, 2)"
                                                    v-if="item.servedStatus == 0 || item.servedStatus == 2"
                                                    :disabled="item.servedStatus != 0"
                                                    type="danger"
                                                    >{{ item.servedStatus == 2 ? '已售罄' : '售罄' }}</el-button
                                                >
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

                <!-- 座位详情图 -->
                <div v-if="dialogStatus == 2">
                    <div class="Begintabledetails">
                        <div class="crumbs">
                            <div>
                                <span>楼层</span>
                                <el-button
                                    v-for="(item, index) in list"
                                    :key="index"
                                    :type="nowFloor == item.floor ? 'primary' : ''"
                                    @click="changeShowFloor(item, index)"
                                    class="add-floor"
                                    >{{ item.floor }}</el-button
                                >
                            </div>
                            <span></span>
                        </div>
                        <div>
                            <div class="shop-seat">
                                <!-- 左边座位展示 -->
                                <div class="left-box">
                                    <!-- 座位行数和列数 -->
                                    <p class="input-seat">
                                        <label style="margin-right: 30px">
                                            座位行数：
                                            <el-input-number
                                                :step="1"
                                                step-strictly
                                                :disabled="isReadonly"
                                                v-model="x"
                                                :min="6"
                                                style="width: 120px"
                                                label="行数"
                                                @blur="checkNull(x, '座位行数')"
                                            ></el-input-number>
                                        </label>
                                        <label style="margin-right: 30px">
                                            座位列数：
                                            <el-input-number
                                                :step="1"
                                                step-strictly
                                                :disabled="isReadonly"
                                                v-model="y"
                                                :min="6"
                                                style="width: 120px"
                                                label="列数"
                                                @blur="checkNull(y, '座位列数')"
                                            ></el-input-number>
                                        </label>
                                    </p>
                                    <!-- 座位属性标题 -->
                                    <div class="seat-title">
                                        <p v-for="(item, index) in seatAttOpt" :key="index" @click="changeStyle(item.style)">
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
                                                    :title="itemX + '-' + itemY"
                                                    ref="seatSpan"
                                                    :data-indexX="indexX + 1"
                                                    :data-indexY="indexY + 1"
                                                    class="seat"
                                                    @click="changeStauts($event, seatStyle)"
                                                    @contextmenu.prevent="changeStauts($event, 'canBook')"
                                                ></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="right-box" v-if="list.length !== 0 && isClickSeat">
                                    <p class="seat-detail">座位详情</p>
                                    <!-- 座位属性 -->
                                    <div class="seat-prop" v-if="!isReadonly">
                                        <span>座位属性：</span>
                                        <div class="prop-box">
                                            <span
                                                :class="item.style"
                                                v-for="(item, index) in seatAttOpt"
                                                :key="index"
                                                :title="item.name"
                                                @click="changeStyle(item.style)"
                                            ></span>
                                        </div>
                                    </div>
                                    <!-- 座位号 -->
                                    <div>
                                        <span>座位号：</span>
                                        <el-input
                                            v-model="presentSeatInfo.seatCode"
                                            placeholder="座位号"
                                            style="width: 50%"
                                            :readonly="isReadonly"
                                            @blur="checkNull(presentSeatInfo.seatCode, '座位号')"
                                        ></el-input>
                                    </div>
                                    <!-- 座位类型 -->
                                    <div>
                                        <span>座位类型：</span>
                                        <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="1">卡座</el-radio>
                                        <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="2">散台</el-radio>
                                    </div>
                                    <!-- 容纳人数 -->
                                    <div>
                                        <span>容纳人数：</span>
                                        <el-input-number
                                            :step="1"
                                            step-strictly
                                            v-model="presentSeatInfo.numberOfPeople"
                                            controls-position="right"
                                            placeholder="容纳人数"
                                            style="width: 50%; margin-right: 6px"
                                            :disabled="isReadonly"
                                            :min="1"
                                            @blur="checkNull(presentSeatInfo.numberOfPeople, '容纳人数')"
                                        ></el-input-number>
                                    </div>
                                    <!-- 最晚保留时间 -->
                                    <div class="lon-retain">
                                        <span>保留最晚时间：</span>
                                        <el-time-select
                                            @change="checkNull(presentSeatInfo.seatLatestReservationTime, '保留最晚时间')"
                                            style="width: 50%"
                                            placeholder="最晚保留时间"
                                            v-model="presentSeatInfo.seatLatestReservationTime"
                                            :readonly="isReadonly"
                                            :picker-options="
                                                startBussTime.slice(0, 2) > endBussTime.slice(0, 2)
                                                    ? {
                                                          start: startBussTime,
                                                          step: '00:10',
                                                          end: '23:50'
                                                      }
                                                    : {
                                                          start: startBussTime,
                                                          step: '00:10',
                                                          end: endBussTime
                                                      }
                                            "
                                        ></el-time-select>
                                    </div>
                                    <!-- 最低消费 -->
                                    <div class="min-charge">
                                        <span class="min-con">最低消费：</span>
                                        <div class="day-mincom">
                                            <div v-for="(item, index) in presentSeatInfo.weekPriceList" :key="index">
                                                <div style="width: 40%">
                                                    <span>{{ item.weekIndex | dayOfWeek }}</span
                                                    ><br />
                                                    <el-input
                                                        @blur="checkPrice(item.price, 2, index)"
                                                        v-model="item.price"
                                                        style="width: 100%; margin-right: 6px"
                                                        :readonly="isReadonly"
                                                    >
                                                        <template slot="append">￥</template>
                                                    </el-input>
                                                </div>
                                                <div style="width: 50%">
                                                    <span>最晚保留时间</span><br />
                                                    <el-time-select
                                                        @change="checkLateTime(item.seatLatestReservationTime, index)"
                                                        style="width: 80%"
                                                        placeholder="最晚保留时间"
                                                        v-model="item.seatLatestReservationTime"
                                                        :readonly="isReadonly"
                                                        :picker-options="
                                                            startBussTime.slice(0, 2) > endBussTime.slice(0, 2)
                                                                ? {
                                                                      start: startBussTime,
                                                                      step: '00:10',
                                                                      end: '23:50'
                                                                  }
                                                                : {
                                                                      start: startBussTime,
                                                                      step: '00:10',
                                                                      end: endBussTime
                                                                  }
                                                        "
                                                    ></el-time-select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div slot="footer" class="dialog-footer" @click="dialog = false">
                    <el-button type="primary">确 定</el-button>
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
                smsCode: '',
                dataListCount: 0, //默认当前要显示的数据条数
                currentPage: 1, //默认显示的页码所在位置（第一页）
                pagesize: 10 //默认每页要显示多少条数据
            },
            list: [],
            storeLocation: -1, //店铺类型（如果是KTV就不展示查看座位按钮）
            seatStyle: 'canBook', //默认的选座样式
            dialog: false, //查看订单详情弹窗开关
            seatDia: false, //修改座位号弹窗开关
            seatOrRoomList: [], //修改座位号/包间号时，后台返回的选项列表
            tableData: [], //订单表格列表
            form: {}, //订单详情表单
            dialogStatus: 1, //根据操作显示不同的弹窗
            upSeatId: '', //当前要修改的id
            seatNum: '', //当前要修改的座位号
            nowFloor: '', //当前正在操作的楼层
            priNumber: '', //用户隐私号码
            priNumberDialog: false, //用户隐私号码弹窗开关

            reachStoreCode: '', //到店验证码
            reachStoreDialog: false, //输入到店验证码对话框
            startBussTime: '', //开始营业时间
            endBussTime: '', //结束营业时间
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

            //支付状态
            // payStatusArr: [
            //     {
            //         label: '未支付',
            //         value: '0'
            //     },
            //     {
            //         label: '已支付',
            //         value: '1'
            //     }
            // ],

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

        //修改座位号/包间号
        editSeat(row) {
            this.upSeatId = row.id;
            let data = {
                value: this.seatNum
            };
            this.$post('/merchant/store/order/seatOrRoomList', data).then((res) => {
                if (res.code === 0) {
                    //如果是非KTV
                    if (this.storeLocation != 3) {
                        if (res.data.seatName.length === 0) {
                            this.$message.error('暂无可修改的座位号');
                            return;
                        } else {
                            this.seatOrRoomList = res.data.seatName;
                            this.seatDia = true;
                        }
                    }

                    //如果是KTV店铺
                    if (this.storeLocation == 3) {
                        if (res.data.esKtvRoomDTOS.length === 0) {
                            this.$message.error('暂无可修改的包间号');
                            return;
                        } else {
                            this.seatOrRoomList = res.data.esKtvRoomDTOS;
                            this.seatDia = true;
                        }
                    }
                }
            });
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
                        this.$message.error(res.msg);
                    }
                })();
            } else {
                if (this.storeLocation == 3) {
                    this.$message.error('请输入要修改的包间号');
                } else {
                    this.$message.error('请输入要修改的座位号');
                }
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
            this.isClickSeat = false;
            this.$get('/merchant/store/getStoreInfo').then((result) => {
                console.log(result);
                if (result.code == 0) {
                    this.list = result.data.list;
                    this.dialog = true;
                    console.log(this.list);
                    //默认展示的楼层为第一楼
                    this.nowFloor = this.list[0].floor;
                    //回显店铺卡座数量
                    this.getShopSeat(0);
                    //座位属性回显
                    this.showSeatAtt(0);
                    //对座位信息进行相关转换
                    this.changeLayoutList();
                    //回显每个座位号时，不要带上楼层号
                    this.substrSeatNum();
                }
            });
        },

        //切换楼层，楼层对应的行列跟着切换
        changeShowFloor(item, index) {
            this.isClickSeat = false;
            this.nowFloor = item.floor; //当前操作的楼层
            this.getShopSeat(index);
            this.showSeatAtt(index);
            // this.clickFlag = false;
        },

        //查看当前座位信息
        lookEditSeatInfo(e, seatType, stageCode) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            this.list.forEach((item) => {
                if (item.floor === this.nowFloor) {
                    item.layoutList.forEach((item2) => {
                        if (item2.floor == item.floor && item2.seatRow == seatRow && item2.seatColumn == seatColumn) {
                            //查看当前座位信息
                            this.presentSeatInfo = item2;

                            //修改当前座位信息
                            if (!this.isReadonly) {
                                //修改当前座位的属性
                                this.presentSeatInfo.seatAttribute = seatType;
                                //修改当前座位为舞台/过道
                                this.presentSeatInfo.seatType = stageCode;
                            }
                        }
                    });
                }
            });
        },

        //座位点击事件
        changeStauts(e, style) {
            this.isClickSeat = true; //展示当前点击的座位的详细信息
            this.lookEditSeatInfo(e); //查看当前座位信息
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
        changeLayoutList() {
            this.list.forEach((item) => {
                item.layoutList.forEach((item2) => {
                    //将数值型转为字符型（软硬座）
                    if (item2.softHardStatus) {
                        item2.softHardStatus = item2.softHardStatus.toString();
                    }
                });
            });
        },

        //回显店铺卡座数量（行和列数量）
        getShopSeat(index) {
            let seat = this.list[index].cassettes.split('x');
            this.x = +seat[0];
            this.y = +seat[1];
        },

        //座位属性回显
        showSeatAtt(index) {
            this.$nextTick(() => {
                if (this.$refs.seatSpan) {
                    //遍历所有座位
                    this.$refs.seatSpan.forEach((item) => {
                        let x = item.dataset.indexx; //行
                        let y = item.dataset.indexy; //列
                        //根据返回的楼层对应的座位数组进行匹配，并替换当前座位的属性
                        this.list[index].layoutList.forEach((item2) => {
                            if (item2.floor == this.nowFloor && item2.seatRow == x && item2.seatColumn == y) {
                                //不可预订
                                if (item2.seatAttribute == 1) {
                                    item.className = `seat notBook`;
                                }
                                //可预订
                                if (item2.seatAttribute == 2) {
                                    item.className = `seat canBook`;
                                }
                                //过道
                                if (item2.seatType == 3) {
                                    item.className = `seat aisleBook`;
                                }
                                //舞台
                                if (item2.seatType == 4) {
                                    item.className = `seat stageBook`;
                                }
                            }
                        });
                    });
                }
            });
        },

        //查看订单信息
        handleLookInfo(orderNo) {
            this.dialogStatus = 1;

            (async () => {
                let res = await this.$get(`/merchant/store/order/${orderNo}/info`);
                if (res.code === 0) {
                    // res.data.contactTel = res.data.contactTel.replace(res.data.contactTel.slice(3, 7), '****');
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
                    contactName: this.searchObj.searchNickName,
                    smsCode: this.searchObj.smsCode
                };

                try {
                    let res = await this.$post('/merchant/store/order/list', data);
                    if (res.code === 0) {
                        this.storeLocation = res.data.storeLocation;
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
        //回显每个座位号时，不要带上楼层号
        substrSeatNum() {
            this.list.forEach((item) => {
                item.layoutList.forEach((item2) => {
                    const index = item2.seatCode.indexOf('-');
                    if (index !== -1) {
                        item2.seatCode = item2.seatCode.substr(index + 1);
                    }
                });
            });
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

            if (this.searchObj.smsCode) {
                if (!regular.pureNumber(this.searchObj.smsCode)) {
                    this.$message.error('验证码格式不正确');
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
        },

        //追加订单上桌/售罄操作
        getTable(status, id, orderNo, index) {
            if (status === 0) {
                let txt = '';
                if (index === 1) {
                    txt = '是否确认上桌?';
                }

                if (index === 2) {
                    txt = '是否确认售罄?';
                }

                this.$confirm(txt, '提示', {
                    distinguishCancelAndClose: true,
                    type: 'warning'
                })
                    .then(() => {
                        this.$put(`/merchant/store/order/updateServedStatus/${id}/${index}`).then((res) => {
                            if (res.code === 0) {
                                this.$message.success('操作成功');
                                this.handleLookInfo(orderNo);
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    })
                    .catch((action) => {});
            }
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
.add-floor {
    width: 60px;
    margin-left: 10px;
}
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
    background-color: #999 !important;
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
    background-color: #999 !important;
    cursor: pointer;
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
