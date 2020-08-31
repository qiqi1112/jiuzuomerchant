<template>
    <div class="shop-seat">
        <div class="left-box">
            <p class="input-seat">
                <label style="margin-right:30px">
                    座位行数：
                    <el-input
                        :readonly="isReadonly"
                        v-model="x"
                        min="1"
                        placeholder="请输入行数"
                        type="number"
                        style="width:120px"
                    ></el-input>
                </label>
                <label>
                    座位列数：
                    <el-input
                        :readonly="isReadonly"
                        v-model="y"
                        min="1"
                        placeholder="请输入列数"
                        type="number"
                        style="width:120px"
                    ></el-input>
                </label>
            </p>
            <div class="seat-title">
                <p>
                    <span class="not-book"></span>
                    不可预订
                </p>
                <p>
                    <span class="can-book"></span>
                    可预订
                </p>
                <p>
                    <span class="in-book"></span>
                    预定中
                </p>
                <p>
                    <span class="has-book"></span>
                    已预订
                </p>
            </div>
            <!-- 回显的座位图 -->
            <div
                v-if="x&&y"
                class="seat-box"
                ref="seatBox"
                :style="{width:32 * y + 30 + 'px'}"
                style="overflow:hidden"
            >
                <div v-for="(itemY,indexY) in Number(y)" :key="indexY">
                    <div v-for="(itemX,indexX) in Number(x)" :key="indexX">
                        <span
                            ref="seatSpan"
                            :data-indexX="(indexX + 1)"
                            :data-indexY="(indexY + 1)"
                            class="seat"
                            @click="changeStauts($event,seatStyle)"
                            @contextmenu.prevent="changeStauts($event,'canBook')"
                        ></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-box">
            <p class="seat-detail">座位详情</p>
            <div class="seat-prop">
                <span class="seat-detail-span">包间属性：</span>
                <div class="prop-box">
                    <span
                        :class="item.style"
                        v-for="(item,index) in seatAttOpt"
                        :key="index"
                        :title="item.title"
                        @click="changeStyle(item.style)"
                    ></span>
                </div>
            </div>
            <div class="seat-num">
                <span class="seat-detail-span">包间号/名称：</span>
                <el-input
                    v-model="presentSeatInfo.seatCode"
                    placeholder="座位号"
                    style="width:50%"
                    :readonly="isReadonly"
                ></el-input>
            </div>
            <div class="acc-people">
                <span class="seat-detail-span">容纳人数：</span>
                <el-input
                    v-model="presentSeatInfo.numberOfPeople"
                    placeholder="容纳人数"
                    style="width:50%"
                    :readonly="isReadonly"
                ></el-input>
            </div>
            <div class="min-charge">
                <span class="seat-detail-span">最低消费：</span>
                <el-input
                    v-model="presentSeatInfo.minConsumption"
                    placeholder="最低消费"
                    style="width:34%;margin-right:6px"
                    :readonly="isReadonly"
                ></el-input>元/人
            </div>
            <div class="lon-retain">
                <span class="seat-detail-span">保留最晚时间：</span>
                <el-time-select
                    style="width:50%"
                    placeholder="请选择时间"
                    v-model="presentSeatInfo.seatLatestReservationTime"
                    :readonly="isReadonly"
                    :picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:45'
                                }"
                ></el-time-select>
            </div>
            <div class="seat-num">
                <span class="seat-detail-span">独立卫生间：</span>
                <el-radio :disabled="isReadonly" v-model="presentSeatInfo.haveToilet" label="1">有</el-radio>
                <el-radio :disabled="isReadonly" v-model="presentSeatInfo.haveToilet" label="2">无</el-radio>
            </div>
            <div class="min-charge">
                <span class="seat-detail-span">机麻：</span>
                <el-input
                    v-model="presentSeatInfo.mahjong"
                    placeholder="机麻数量"
                    style="width:34%;margin-right:6px"
                    :readonly="isReadonly"
                ></el-input>桌
            </div>
            <div class="snacks">
                <span class="seat-detail-span snacks">零嘴：</span>
                <div class="snacks-detail">
                    <ul>
                        <li v-for="(item,index) in presentSeatInfo.snacks" :key="index">
                            <span class="snacks-name" :title="item.name">{{item.name}}</span>
                            <span class="mult">
                                <i class="el-icon-close"></i>
                            </span>
                            <span>{{item.num}}</span>
                            <el-button type="danger">删除</el-button>
                        </li>
                    </ul>
                    <div class="snacks-form">
                        <el-input
                            style="width:90px"
                            v-model="snackName"
                            placeholder="名称"
                            :readonly="isReadonly"
                        ></el-input>
                        <span class="mult">
                            <i class="el-icon-close"></i>
                        </span>
                        <el-input
                            style="width:60px;margin-right:10px"
                            v-model="snackNum"
                            placeholder="数量"
                            :readonly="isReadonly"
                        ></el-input>
                        <el-button type="primary" @click="addSnacks">确定</el-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            x: 20, //座位行数
            y: 20, //座位列数

            //座位属性数组
            seatAttOpt: [
                {
                    title: '不可预订',
                    name: '不可预订',
                    style: 'notBook'
                },
                {
                    title: '可预订',
                    name: '可预订',
                    style: 'canBook'
                },
                {
                    title: '可预订',
                    name: '可预订',
                    style: 'hasBook'
                },
                {
                    title: '可预订',
                    name: '可预订',
                    style: 'inBook'
                }
            ],

            seatStyle: 'hasBook', //默认的选座样式

            //夜店/清吧对应的座位信息
            nightEnterSeatDetail: [],

              //当前座位对应的信息
            presentSeatInfo: {},

            //ktv对应的座位信息
            ktvSeatDetail: [],

            snackName: '', //零嘴名称
            snackNum: '', //零嘴数量
        };
    }
};
</script>