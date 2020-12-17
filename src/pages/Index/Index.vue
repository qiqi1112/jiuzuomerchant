<template>
    <!-- 
    /*
    *author:xuxiao
    *date：2020-7-1
    *des：商家端后台展示首页
    */
 -->
    <div>
        <div class="container">
            <div class="top_box">
                <div class="evaluation">
                    <h2 class="title">
                        <span class="line lw1"></span><span>{{ storeName }}</span>
                    </h2>
                    <div class="store_eva">
                        <div class="st">
                            <div>{{ topData.collectionTotal }}</div>
                            <div>本店收藏总数</div>
                        </div>
                        <div class="st">
                            <div>{{ topData.commentTotal }}</div>
                            <div>当前评论条数</div>
                        </div>
                        <div class="st star">
                            <span>店铺评分</span>
                            <el-rate
                                disabled-void-icon-class="not el-icon-star-on"
                                disabled-void-color="#b1b1b1!important"
                                v-model="topData.score"
                                disabled
                                show-score
                                text-color="#ff9900"
                                score-template="{value}"
                            ></el-rate>
                        </div>
                    </div>
                </div>
                <div class="visitors">
                    <div class="comp">
                        <span class="line lw2"></span>
                        <span>
                            今日客访数 <i class="xtc">{{ topData.visitTimes }}</i> 次，同比昨日
                            <span class="sz" v-if="topData.visitorsML == '+'">上涨</span>
                            <span class="xj" v-if="topData.visitorsML == '-'">下降</span>
                            <i class="xtc"> {{ topData.yesterdayVisitors }} </i>人
                        </span>
                    </div>
                    <div class="comp">
                        <span class="line lw2"></span>
                        <span class="jg">
                            今日新增新用户 <i class="xtc">{{ topData.newUserTimes }}</i> 人，同比昨日
                            <span class="sz" v-if="topData.newUserML == '+'">上涨</span>
                            <span class="xj" v-if="topData.newUserML == '-'">下降</span>
                            <i class="xtc"> {{ topData.yesterdayNewUser }} </i>人
                        </span>
                        <span class="line lw2"></span
                        ><span
                            >店铺曝光量 <i class="xtc">{{ topData.exposureTotal }} P</i></span
                        >
                    </div>
                </div>
                <div class="to_view">
                    <div><span :class="day_mon == 1 ? 't_way' : ''" @click="day_mon = 1">按天数据统计</span></div>
                    <div><span :class="day_mon == 2 ? 't_way' : ''" @click="day_mon = 2">按月数据统计</span></div>
                </div>
            </div>
            <div class="main_box">
                <div class="m_l">
                    <div class="broken_box box_css">
                        <div class="column col_spe">
                            <span class="line lw2"></span>
                            <span>营业额</span>
                        </div>
                        <div ref="broken" id="brokenline" style="width: 98%; height: 500px"></div>
                    </div>

                    <div class="columnar_box box_css">
                        <div class="column col_spe">
                            <span class="line lw2"></span>
                            <span>开台数据统计</span>
                        </div>
                        <div ref="columnar" id="columnarLine" style="width: 98%; height: 500px"></div>
                    </div>
                </div>
                <div class="m_m">
                    <div class="bread_box box_css">
                        <div class="column col_spe">
                            <span class="line lw2"></span>
                            <span>排号统计 ({{ format_time }})</span>
                        </div>
                        <div ref="bread" id="breadLine" style="width: 98%; height: 500px"></div>
                    </div>

                    <div class="Top_goods box_css">
                        <div class="column col_spe">
                            <span class="line lw2"></span>
                            <span>热销TOP榜 ({{ format_time }})</span>
                        </div>
                        <div class="goods_list">
                            <el-tabs v-model="activeName" @tab-click="handleClick">
                                <el-tab-pane
                                    v-for="(item, i) in topList"
                                    :key="i"
                                    :label="item.typeName"
                                    :name="typeof item.type == 'string' ? item.type : item.type.toString()"
                                >
                                    <ul v-if="item.list != ''">
                                        <li class="top_li" v-for="(val, index) in item.list" :key="index">
                                            <div class="tl">
                                                <img :src="addUrl + val.listPicture" />
                                            </div>
                                            <div class="tr">
                                                <p class="tit">{{ val.name }}</p>
                                                <!-- <p class="good_ifo">{{val.ml}}ml/瓶&nbsp;&nbsp; 昨日已售{{val.sold}}瓶</p> -->
                                                <p class="good_ifo">
                                                    <span>{{ day_mon == 1 ? '今日' : '本月' }}</span
                                                    >已售{{ val.sellNum }}瓶
                                                </p>
                                                <div class="pro" :style="{ width: val.sellNum / 100 + 'px' }"></div>
                                            </div>
                                        </li>
                                    </ul>
                                    <div v-else>
                                        该类型<span>{{ day_mon == 1 ? '今日' : '本月' }}</span
                                        >暂无销量
                                    </div>
                                </el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
                <div class="m_r box_css">
                    <div class="timeData">
                        <div class="block">
                            <el-date-picker
                                v-model="time_now"
                                type="month"
                                :clearable="false"
                                :editable="false"
                                @focus="focSta = true"
                                @blur="focSta = false"
                                @change="DaysChange"
                                :time-arrow-control="true"
                            >
                            </el-date-picker>
                            <i class="jt" :class="focSta ? 'el-icon-caret-top' : 'el-icon-caret-bottom'"></i>
                        </div>
                        <div class="day_li" ref="day_li">
                            <ul>
                                <div class="choose" ref="choose"></div>
                                <li
                                    ref="day"
                                    :style="{ top: scrollY * 30 + 'px' }"
                                    :class="active == index ? 'onAct' : ''"
                                    v-for="(day, index) in days"
                                    :key="index"
                                >
                                    {{ day }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- <div class="excel">
                        <el-button type="primary" icon="el-icon-download" class="handle-del" @click="dialogVisible = true"
                            >一件生成Excel</el-button
                        >
                    </div> -->
                </div>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog :visible.sync="dialogVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px" label-position="left">
                <div class="column">
                    <span class="line lw2"></span>
                    <span>导出Excel</span>
                </div>
                <el-form-item label="类型">
                    <el-radio v-model="form.radio_type" label="1">营业额数据</el-radio>
                    <el-radio v-model="form.radio_type" label="2">商品销量数据</el-radio>
                </el-form-item>
                <el-form-item label="时间">
                    <div class="block">
                        <el-date-picker
                            v-model="form.excel_time"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="downEx()">导出</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
const echarts = require('echarts');
export default {
    data() {
        return {
            day_mon: 1,
            focSta: false,
            value: 2.6,
            dialogVisible: false,
            form: {
                radio_type: '1',
                excel_time: ''
            },
            activeName: '',
            value2: '',
            time_now: '',
            days: '',
            active: 7,
            good_list: [],
            currentId: 1,
            i: 0,
            scrollY: 0,
            topList: [],

            addUrl: this.$imgHead,

            topData: {},
            storeDate: [],
            // 座位
            dialog: false,
            form: {},
            allGraph: [], //图形统计数据 全部
            storeName: ''
        };
    },
    created() {
        this.storeName = JSON.parse(localStorage.getItem('userInfo')).storeName;
        this.time_now = this.$regular.timeData(new Date().getTime(), 5);
        this.scrollY = -(new Date().getDate() - 8);
        this.active = new Date().getDate() - 1;
        this.days = this.timeDay(this.time_now);
        this.$nextTick(() => {
            let day = this.$refs.day;
            for (let i = 0; i < day.length; i++) {
                if (day[i].offsetTop == this.$refs.choose.offsetTop) {
                    this.acitive = i;
                    break;
                }
            }
        });
    },
    watch: {
        // time_now(val) {
        //     this.time_now = this.$regular.timeData(val,5)
        //     this.days = this.timeDay(this.time_now)
        // }
        day_mon() {
            this.topThree();
            this.storeInfo();
        }
        // days(newVal,oldVal){
        //     let poor=''
        //     if(newVal < this.active+1){
        //         poor = this.active+1 - newVal
        //         this.scrollY = this.scrollY + poor
        //         this.active = newVal-1
        //     }
        //     this.topThree()
        // }
    },
    computed: {
        format_time() {
            return this.time_now + '-' + this.dayInit(this.active + 1);
        }
    },
    mounted() {
        // this.topThree();
        this.storeInfo();
        // this.seeSeatInfo();
        this.$refs.day_li.addEventListener('wheel', this.myFunction, true);
    },
    methods: {
        // top榜
        topThree() {
            let data = {
                localDate: this.time_now + '-' + this.dayInit(this.active + 1),
                timeType: this.day_mon
                // type: +this.activeName
            };
            this.$post('/merchant/store/getSell', data).then((res) => {
                if (res.code == 0) {
                    // let effective = [];
                    // res.data.forEach((i) => {
                    //     i.type = i.type.toString();
                    // });
                    this.activeName = typeof res.data[0].type == 'string' ? res.data[0].type : res.data[0].type.toString();
                    this.topList = res.data;
                    // this.good_list = effective;
                }
            });
        },

        storeInfo() {
            let data = {
                localDate: this.time_now + '-' + this.dayInit(this.active + 1),
                storeId: '',
                type: this.day_mon
            };
            this.$post('/merchant/store/getHomePage', data).then((res) => {
                this.topThree();
                if (res.code == 0) {
                    res.data[0].score = Number(res.data[0].score);
                    this.topData = res.data[0];

                    this.allGraph = res.data;
                    let yesterdayNewUser = '',
                        yesterdayVisitors = '';

                    if (res.data.length <= 1) {
                        yesterdayNewUser = res.data[0].newUserTimes;
                        yesterdayVisitors = res.data[0].visitTimes;
                    } else {
                        yesterdayNewUser = res.data[0].newUserTimes - res.data[1].newUserTimes; // 较昨日 新增 新用户
                        yesterdayVisitors = res.data[0].visitTimes - res.data[1].visitTimes; // 较昨日 新增 访客
                    }
                    if (yesterdayNewUser >= 0) {
                        yesterdayNewUser = '+' + yesterdayNewUser;
                    }
                    if (yesterdayVisitors >= 0) {
                        yesterdayVisitors = '+' + yesterdayVisitors;
                    }

                    this.$set(this.topData, 'yesterdayNewUser', yesterdayNewUser.toString().substring(1));
                    this.$set(this.topData, 'yesterdayVisitors', yesterdayVisitors.toString().substring(1));
                    this.$set(this.topData, 'newUserML', yesterdayNewUser.toString().substring(0, 1));
                    this.$set(this.topData, 'visitorsML', yesterdayVisitors.toString().substring(0, 1));
                    this.storeDate = res.data;

                    this.brokenChart();
                    this.breadChart();
                    this.columnarChart();
                } else if (res.code === 600) {
                    this.$router.push('/myshop');
                }
            });
        },

        debounce(fn, wait) {
            var timeout = null;
            if (this.fun !== null) {
                clearTimeout(this.fun);
            }
            this.fun = setTimeout(fn, wait);
        },
        // 日期选择
        timeDay(time) {
            let trr = time.split('-');
            let day = new Date(trr[0], trr[1], 0).getDate();
            return day;
        },
        // 天数加0
        dayInit(time) {
            if (time < 10) {
                time = '0' + time;
                return time;
            }
            return time;
        },
        // day切换
        myFunction(e) {
            e.stopPropagation();
            e.preventDefault();
            if (e.wheelDelta > 0) {
                if (this.active == this.days - 1) {
                    this.active = this.days - 1;
                    return;
                }
                this.scrollY -= 1;
                this.active += 1;
            } else {
                if (this.active == 0) {
                    this.active = 0;
                    return;
                }
                this.scrollY += 1;
                this.active -= 1;
            }
            this.debounce(this.storeInfo, 800);
        },
        // 年月切换
        DaysChange(val) {
            this.time_now = this.$regular.timeData(val, 5);
            this.days = this.timeDay(this.time_now);
            let poor = '';
            // 切换月份时  天数不够的  自动定位到选中月最后一天
            if (this.days < this.active + 1) {
                poor = this.active + 1 - this.days;
                this.scrollY = this.scrollY + poor;
                this.active = this.days - 1;
            }
            this.storeInfo();
            this.topThree();
        },
        // top类型切换
        handleClick(tab, event) {
            // this.topThree();
            this.activeName = typeof tab.name == 'string' ? tab.name : tab.name.toString();
        },

        // 导出
        downEx() {
            if (!this.form.excel_time) {
                this.$message({ message: '请选择时间', type: 'warning' });
                return;
            }
            this.dialogVisible = false;
        },
        // 折现图
        brokenChart() {
            let price = [],
                time = [];
            this.allGraph.forEach((i) => {
                price.unshift(i.businessPrice);
                time.unshift(i.time);
            });
            let brokenline = echarts.init(this.$refs.broken);
            window.addEventListener('resize', function () {
                brokenline.resize();
            });
            let option = {
                dataZoom: {
                    type: 'inside'
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#39b54a', '#f37b1d'],
                legend: {
                    // data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                grid: {
                    left: '3%',
                    bottom: '5%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        // saveAsImage: {}//隐藏下载图标
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: time
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '营业额',
                        type: 'line',
                        data: price
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            brokenline.setOption(option);
        },
        // 柱状图
        columnarChart() {
            let numeral = [];
            this.allGraph.forEach((i) => {
                numeral.unshift([i.time, i.openTableTimes, i.reserveTableTimes, i.visitTimes]);
            });
            numeral.unshift(['product', '开台数', '预定桌数', '访问记录']);

            let columnarLine = echarts.init(this.$refs.columnar);
            window.addEventListener('resize', function () {
                columnarLine.resize();
            });
            let option = {
                color: ['#f0d264', '#82c8a0', '#7fccde', '#6698cb', '#cb99c5'],
                legend: {},
                tooltip: {},
                dataZoom: {
                    type: 'inside'
                },
                grid: {
                    right: '4%',
                    bottom: '8%'
                },
                dataset: {
                    source: numeral
                },
                xAxis: { type: 'category' },
                yAxis: {},
                series: [{ type: 'bar' }, { type: 'bar' }, { type: 'bar' }]
            };
            columnarLine.setOption(option);
        },
        // 饼图
        breadChart() {
            let numeral = [];
            if (this.topData) {
                numeral = [
                    { value: this.topData.numberOfTimes, name: '排号数' },
                    { value: this.topData.grabQuantity, name: '抢座数' },
                    { value: this.topData.cancelEffectNumberOfTimes, name: '用户取消数' },
                    { value: this.topData.effectiveQuantity, name: '生效数' }
                ];
            } else {
                numeral = [
                    { value: 0, name: '排号数' },
                    { value: 0, name: '抢座数' },
                    { value: 0, name: '用户取消数' },
                    { value: 0, name: '生效数' }
                ];
            }

            let breadLine = echarts.init(this.$refs.bread);
            window.addEventListener('resize', function () {
                breadLine.resize();
            });
            let option = {
                title: {
                    // text: '排号',
                    // subtext: '纯属虚构',
                    // left: 'center'
                },
                color: ['#c23531', '#2f4554', '#61a0a8', '#61a0a8', '#61a0a8'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    // orient: 'vertical',
                    // left: 'left',
                    // data: ['排号数 25% （29座）', '取消排号数', '生效排号数']
                },
                color: ['#f37b1d', '#1cbbb4', '#6739b6', '#e03997', '#9c26b0'],
                series: [
                    {
                        name: ' ',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '55%'],
                        data: numeral,
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            breadLine.setOption(option);
        }
    }
};
</script>

<style scoped lang='less'>
@font-size: 14px;

@def-color: #000;
@line-bg-color:rgb (138, 143, 134);
.container {
    padding: 0;
}
.top_box {
    font-size: @font-size;
    height: 120px;
    border-bottom: 1px solid #000;
    display: flex;
    padding-left: 30px;
    padding-top: 15px;
    .evaluation {
        flex: 0.45;
        .title {
            height: 50%;
            display: flex;
            & > span:nth-child(2) {
                margin-top: 3px;
            }
        }
        .store_eva {
            display: flex;
            height: 50%;
            .star {
                width: 70%;
                height: auto;
                margin-top: 30px;
                position: relative;
                span {
                    position: absolute;
                    left: 20px;
                }
            }
            @media screen and (max-width: 1400px) {
                .star {
                    margin-top: 14px;
                }
            }
        }
        .st {
            width: 15%;
            display: inline-block;
            text-align: center;
            height: 100%;
            div {
                height: 50%;
            }
        }
    }
    .visitors {
        flex: 0.4;
        & > div:nth-child(1) {
            margin: 20px 0 25px 0;
        }
        .comp {
            display: flex;
            .jg {
                margin-right: 30px;
            }
        }
    }
    .to_view {
        flex: 0.15;
        div {
            span {
                color: @def-color;
                cursor: pointer;
            }
        }
        & > div:nth-child(1) {
            margin: 20px 0 25px 0;
        }
        .t_way {
            border-bottom: 4px solid rgb(110, 109, 109);
        }
    }
}

.main_box {
    font-size: @font-size;
    display: flex;
    background: #ececec;
    padding: 15px;
    .box_css {
        width: 98%;
        margin-bottom: 15px;
        background: #fff;
        -webkit-box-shadow: 0 0 4px #b5b5b5;
        box-shadow: 0 0 4px #b5b5b5;
        border-radius: 8px;
        .col_spe {
            margin: 0 0 20px 0;
            padding-left: 15px;
            padding-top: 15px;
        }
        .goods_list {
            padding-left: 15px;
            padding-top: 15px;
            height: 485px;
        }
    }
    .m_l {
        flex: 0.45;
    }
    .m_m {
        flex: 0.35;
        .top_li {
            height: 120px;
            margin-bottom: 20px;
            display: flex;
            .tl {
                flex: 0.2;
                img {
                    width: 100%;
                    border-radius: 5px;
                    height: 100%;
                }
            }
            .tr {
                flex: 0.8;
                padding: 20px 0 20px 20px;
                .tit {
                    font-weight: bold;
                }
                .good_ifo {
                    margin: 10px 0;
                }
                .pro {
                    width: 100px;
                    background: #8dc63f;
                    height: 15px;
                }
            }
        }
    }
    .m_r {
        flex: 0.2;
        position: relative;
        background: #fff;
        .excel {
            text-align: center;
            margin-top: 80px;
        }
        .timeData {
            width: 125px;
            margin: 0 auto;
            margin-top: 100px;
            .block {
                position: relative;
                .jt {
                    position: absolute;
                    top: 7px;
                    right: 18px;
                }
            }
            .day_li {
                height: 450px;
                overflow-y: scroll;
                ul {
                    // position: relative;
                }
                li {
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    cursor: pointer;
                    position: relative;
                }
                .onAct {
                    color: #000;
                    font-weight: bold;
                }
            }
            .day_li::-webkit-scrollbar {
                display: none;
            }
            .day_li {
                scrollbar-width: none;
            }
            .day_li {
                -ms-overflow-style: none;
            }
        }
    }
}

.xtc {
    color: rgb(255, 102, 0);
    font-weight: 600;
    font-size: 1.2rem;
}
.xj {
    color: rgb(55, 55, 177);
    font-weight: 600;
}
.sz {
    color: #ff6600;
    font-weight: 600;
}
.choose {
    position: absolute;
    font-weight: bold;
    font-size: 16px;
    width: 125px;
    height: 30px;
    top: 340px;
}
.choose::before {
    content: '';
    width: 40px;
    height: 1px;
    border-bottom: 2px solid #676767;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 14px;
}
.choose::after {
    content: '';
    width: 40px;
    height: 1px;
    border-bottom: 2px solid #676767;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 14px;
}
.seat_detail {
    padding: 20px;
    box-shadow: 0 0 5px #a5a5a5;
    border-radius: 5px;
    z-index: 1000;
    background: #fff;
}
// element
.el-rate {
    display: inline-block;
    position: absolute;
    left: 136px;
    top: -7px;
    /deep/.el-rate__icon {
        color: red !important;
        // font-size: 27px;
        font-size: 1.7rem;
    }
    /deep/ .el-rate__decimal {
        color: red !important;
    }
    /deep/ .el-rate__text {
        position: absolute;
        left: -48px;
        top: -2px;
        // font-size: 30px;
        font-size: 1.8rem;
        font-weight: bold;
        color: #000 !important;
    }
}
@media screen and (max-width: 1400px) {
    .top_box {
        font-size: 12px;
        display: inherit;
        height: auto;
        padding-bottom: 15px;
        .star {
            margin-top: 14px;
        }
        .visitors {
            display: inline-block;
        }
        .to_view {
            display: inline-block;
            margin-left: 15%;
        }
    }
    /deep/.el-rate .el-rate__text {
        font-size: 1.4rem;
    }
    /deep/.el-rate .el-rate__icon {
        font-size: 1.2rem;
    }
}

/deep/ .el-tabs__active-bar {
    background-color: rgb(138, 143, 134);
}
/deep/ .el-tabs__item.is-active {
    color: #000;
    font-weight: bold;
    font-size: 16px;
}
/deep/ .el-tabs__nav-wrap::after {
    background: none;
}
/deep/ .el-tabs__item:hover {
    color: rgb(138, 143, 134);
}
/deep/ .el-tab-pane {
    height: 420px;
    overflow-y: scroll;
}
/deep/ .el-tab-pane::-webkit-scrollbar {
    display: none;
}
/deep/ .el-tab-pane {
    scrollbar-width: none;
}
/deep/ .el-tab-pane {
    -ms-overflow-style: none;
}

.m_r {
    /deep/ .el-input__inner {
        border: none;
        font-size: 16px;
        color: #000;
        height: 30px;
        line-height: 30px;
    }
    /deep/ .el-date-editor {
        width: 120px;
    }
}
/deep/ .el-input__prefix {
    display: none;
}
</style>