<template>
    <div class="shop-seat">
        <div class="left-box">
            <p class="input-seat">
                <label style="margin-right:30px">
                    座位行数：
                    <el-input
                        :readonly="isReadonly"
                        v-model="x"
                        @focus="changeSeatAlert"
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
                <span class="seat-detail-span">座位属性：</span>
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
                <span class="seat-detail-span">座位号：</span>
                <el-input
                    v-model="presentSeatInfo.seatCode"
                    placeholder="座位号"
                    style="width:50%"
                    :readonly="isReadonly"
                ></el-input>
            </div>
            <div class="seat-num">
                <span class="seat-detail-span">座位类型：</span>
                <el-radio
                    :disabled="isReadonly"
                    v-model="presentSeatInfo.softHardStatus"
                    label="1"
                >软座</el-radio>
                <el-radio
                    :disabled="isReadonly"
                    v-model="presentSeatInfo.softHardStatus"
                    label="2"
                >硬座</el-radio>
            </div>
            <div class="acc-people">
                <span class="seat-detail-span">容纳人数：</span>
                <el-input
                    v-model="presentSeatInfo.numberOfPeople"
                    placeholder="容纳人数"
                    style="width:50%;margin-right:6px"
                    :readonly="isReadonly"
                ></el-input>人
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
                    v-model="presentSeatInfo.seatLatestReservationTime"
                    :readonly="isReadonly"
                    :picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:45'
                                }"
                ></el-time-select>
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
            snackNum: '' //零嘴数量
        };
    },

    methods: {
        //查看当前座位信息
        lookSeatInfo(e) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            //匹配当前座位信息
            this.nightEnterSeatDetail.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    this.presentSeatInfo = item;

                    console.log('vvvv', this.presentSeatInfo);
                }
            });
        },

        //座位点击事件
        changeStauts(e, style) {
            if (!this.isReadonly) {
                this.setSeatInfo(e, style);
            }

            this.lookSeatInfo(e); //查看当前座位信息
            // console.log(this.nightEnterSeatDetail);
        },

        //修改当前座位属性
        setSeatInfo(e, style) {
            e.target.className = style;
        },

        //改变座位状态按钮
        changeStyle(style) {
            this.seatStyle = style;
        },
    }
};
</script>