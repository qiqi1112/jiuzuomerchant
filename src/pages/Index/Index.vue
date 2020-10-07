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
                    <h2 class="title"> <span class="line lw1"></span><span>PlayHouse</span> </h2>
                    <div class="store_eva">
                        <div class="st">
                            <div>12717</div>
                            <div>本店收藏总数</div>
                        </div>
                        <div class="st">
                            <div>999</div>
                            <div>当前评论条数</div>
                        </div>
                        <div class="st star ">
                            <span>店铺评分</span>
                            <el-rate disabled-void-icon-class="not el-icon-star-on"  disabled-void-color='#b1b1b1!important' v-model="value" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
                        </div>
                    </div>
                </div>
                <div class="visitors">
                    <div class="comp">
                    <span class="line lw2"></span> <span>昨日客访数 <i class="xtc">527</i> 次，同比昨日<span>上涨</span> <i class="xtc"> 36 </i>次</span> 
                    </div>
                    <div class="comp">
                        <span class="line lw2"></span><span class="jg">昨日新增访客 <i class="xtc">19</i> 人，同比昨日<span class="xj">下降</span> <i class="xtc"> 3 </i>人</span>
                        <span class="line lw2"></span><span>店铺曝光量 <i class="xtc">234234 P</i></span>
                    </div>
                </div>
                <div class="to_view">
                    <div><span  :class="day_mon==1?'t_way':''" @click="dayOrMon(1)">按天数据统计</span></div>
                    <div><span  :class="day_mon==2?'t_way':''" @click="dayOrMon(2)">按月数据统计</span></div>
                </div>
            </div>
            <div class="main_box">
                <div class="m_l">
                    <div class="broken_box">
                        <div class="column">
                            <span class="line lw2"></span>
                            <span>营业额</span>
                        </div>
                        <div ref='broken' id="brokenline" style="width: 90%;height: 500px;"> </div>        
                    </div>

                    <div class="columnar_box">
                        <!-- <div class="column">
                            <span class="line lw2"></span>
                            <span>开台数据统计</span>
                        </div>
                        <div ref='columnar' id="columnarLine" style="width: 90%;height: 500px;"></div>  -->
                        <div class="column">
                            <span class="line lw2"></span>
                            <span>当前座位详情图</span>
                        </div>
                        <div class="seat">
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
                                    <!-- style="overflow: hidden" -->
                                    <div
                                        v-if="x && y"
                                        class="seat-box"
                                        ref="seatBox"
                                        :style="{ width: 32 * y + 30 + 'px' }"
                                    >
                                        <div v-for="(itemY, indexY) in Number(y)" :key="indexY">
                                            <div v-for="(itemX, indexX) in Number(x)" :key="indexX">
                                                <div
                                                    style="position:relative"
                                                    ref="seatSpan"
                                                    :data-indexX="indexX + 1"
                                                    :data-indexY="indexY + 1"
                                                    class="seat"
                                                    @mouseenter="changeStauts"
                                                    @mouseleave="isClickSeat = false"
                                                >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!-- 座位属性 -->
                                <div v-if="isClickSeat" class="seat_detail">
                                    <div class="right-box" >
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
                                        <!-- <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="2">硬座</el-radio> -->
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
                        </div>
                    </div>
                </div>
                <div class="m_m">
                    <div class="bread_box">
                        <div class="column">
                            <span class="line lw2"></span>
                            <span>排号统计 (2020-09-08)</span>
                        </div>
                        <div ref='bread' id="breadLine" style="width: 95%;height: 500px;"></div> 
                    </div>

                    <div class="Top_goods">
                        <div class="column">
                            <span class="line lw2"></span>
                            <span>热销TOP榜 (2020-09-08)</span>
                        </div>

                        <div class="goods_list">
                            <el-tabs v-model="activeName" @tab-click="handleClick">
                                <el-tab-pane label="套餐" name="first">
                                    <ul>
                                        <li class="top_li" v-for="(item,index) in good_list" :key="index">
                                            <div class="tl">
                                                <img src="../../assets/img/img.jpg" alt="">
                                            </div>
                                            <div class="tr">
                                                <p class="tit">{{item.title}}</p>
                                                <p class="good_ifo">{{item.ml}}ml/瓶&nbsp;&nbsp; 昨日已售{{item.sold}}瓶</p>
                                                <div class="pro" :style="{width:item.sold/10+'px'}"></div>
                                            </div>
                                        </li>
                                    </ul>
                                </el-tab-pane>
                                <el-tab-pane label="香槟" name="second">香槟</el-tab-pane>
                                <el-tab-pane label="啤酒" name="third">啤酒</el-tab-pane>
                                <el-tab-pane label="小吃" name="fourth">小吃</el-tab-pane>
                            </el-tabs>
                        </div>
                    </div>
                </div>
                <div class="m_r">
                    <div class="timeData">
                        <div class="block">
                            <el-date-picker
                                v-model="time_now"
                                type="month"
                                :clearable="false"
                                :editable="false"
                                @focus="focSta=true"
                                @blur="focSta=false"
                                :time-arrow-control='true'
                                :placeholder="time_now">
                            </el-date-picker>
                            <i class="jt " :class="focSta?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                        </div>
                        <div class="day_li" ref="day_li">
                            <ul>
                                <div class="choose" ref="choose" ></div>
                                <li ref="day"  :style="{top:scrollY * 30 +'px'}"  :class="active==index?'onAct':''" v-for="(day,index) in days" :key="index">{{day}}</li>
                            </ul>
                        </div>
                    </div>


                    <div class="excel">
                        <el-button type="primary" icon="el-icon-download" class="handle-del" @click="dialogVisible = true">一件生成Excel</el-button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 弹窗 -->
        <el-dialog :visible.sync="dialogVisible" width="30%" >
            <el-form ref="form" :model='form'  label-width="70px" label-position="left">
                <div class="column">
                    <span class="line lw2"></span>
                    <span>导出Excel</span>
                </div>
                <el-form-item label="类型" >
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
const echarts =  require('echarts');
export default {
    data() {
        return {
            day_mon:1,
            focSta:false,
            value: 2.6,
            dialogVisible: false,
            form:{
                radio_type:'1',
                excel_time:'',        
            },
            activeName: 'first',
            value2: '',
            time_now:'',
            days:'',
            active:7,
            good_list:[
                {
                    id:1,
                    title:'Dom Perignon法国唐培里侬香槟王',
                    img:'../../assets/img/img.jpg',
                    ml:'150',
                    sold:42,
                },
                {
                    id:2,
                    title:'Dom Perignon法国唐培里侬香槟王',
                    img:'../../assets/img/img.jpg',
                    ml:'80',
                    sold:1380,
                },
                {
                    id:3,
                    title:'Dom Perignon法国唐培里侬香槟王',
                    img:'../../assets/img/img.jpg',
                    ml:'170',
                    sold:2506,
                },
            ],
            currentId:1,
            i:0,
            scrollY:0,

            // 座位
            dialog: false,
            form: {},
            dialogStatus: 1,
            radio1: '',
            radio2: '',
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
    created(){
        this.time_now = this.$regular.timeData(new Date().getTime(),5)
        this.days = this.timeDay(this.time_now)
        this.$nextTick(() => {
            let day = this.$refs.day
            for(let i=0;i<day.length;i++){
                if(day[i].offsetTop == this.$refs.choose.offsetTop){
                    this.acitive = i
                    break;
                }
            }
        })
    },
    watch: {
        time_now(val) {
            this.time_now = this.$regular.timeData(val,5)
            this.days = this.timeDay(this.time_now)        
        }
    },
    mounted(){
        this.brokenChart()
        // this.columnarChart()
        this.seeSeatInfo()
        this.breadChart()
        this.$refs.day_li.addEventListener("wheel", this.myFunction,true);
    },
    methods:{
        myFunction(e){
            e.stopPropagation()
            e.preventDefault(); 
            if(e.wheelDelta>0){
                if(this.active == this.days-1){
                    this.active = this.days-1
                    return
                }
                this.scrollY -=1
                this.active +=1
            }else{
                if(this.active == 0){
                    this.active = 0
                    return
                }
                this.scrollY +=1
                this.active -=1
            }
        },
        // 日期选择
        timeDay(time){
            let trr = time.split('-')
            let day = new Date(trr[0],trr[1],0).getDate()
            return day
        },
        // 导出
        downEx(){
            if(!this.form.excel_time){
                this.$message({message: '请选择时间',type: 'warning'});
                return
            }
            this.dialogVisible = false
        },
        // 折现图
        brokenChart(){
            let brokenline = echarts.init(this.$refs.broken);
            let option = {
                dataZoom: {
                    type: 'inside',
                },
                tooltip: {
                    trigger: 'axis'
                },
                color: ['#0081ff','#1cbbb4','#e54d42','#a5673f','#39b54a','#f37b1d'],
                legend: {
                    // data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
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
                    data: ['6', '7', '8', '9', '10', '11', '12','13', '14', '15', '16', '17', '18', '19']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        data: [220, 182, 191, 234, 290, 330, 310,120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        data: [150, 232, 201, 154, 190, 330, 410,120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        data: [320, 332, 301, 334, 390, 330, 320,120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        data: [820, 932, 901, 934, 1290, 1330, 1320,120, 132, 101, 134, 90, 230, 210]
                    }
                ]
            };
    
            // 使用刚指定的配置项和数据显示图表。
            brokenline.setOption(option);
        },
        // 柱状图
        columnarChart(){
            let columnarLine = echarts.init(this.$refs.columnar)
            let option = {
                color:[ '#f0d264','#82c8a0','#7fccde', '#6698cb', '#cb99c5'],
                legend: {},
                tooltip: {},
                dataZoom: {
                    type: 'inside',
                },
                dataset: {
                    source: [
                        ['product', '开台数', '预定桌数', '访问记录'],
                        ['7', 43.3, 85.8, 93.7],
                        ['8', 83.1, 73.4, 55.1],
                        ['9', 86.4, 65.2, 82.5],
                        ['10', 72.4, 53.9, 39.1]
                    ]
                },
                xAxis: {type: 'category'},
                yAxis: {},
                series: [
                    {
                        type: 'bar',
                    },
                    {type: 'bar'},
                    {type: 'bar'}
                ]
            };
            columnarLine.setOption(option);
        },
        // 饼图
        breadChart(){
            let breadLine = echarts.init(this.$refs.bread)
            let option = {
                title: {
                    // text: '排号',
                    // subtext: '纯属虚构',
                    // left: 'center'
                },
                color:['#c23531','#2f4554', '#61a0a8','#61a0a8','#61a0a8'],
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    // orient: 'vertical',
                    // left: 'left',
                    // data: ['排号数 25% （29座）', '取消排号数', '生效排号数']
                },
                color:['#f37b1d','#1cbbb4','#6739b6','#e03997','#9c26b0'],
                series: [
                    {
                        name: ' ',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 335, name: '排号数（29座）'},
                            {value: 310, name: '取消排号数（29座）'},
                            {value: 234, name: '生效排号数（29座）'},
                        ],
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
        },
        // top
         handleClick(tab, event) {
            // console.log(tab, event);
        },
        // 切换统计方式
        dayOrMon(num){
            this.day_mon = num
        },
        
        // 座位相关信息
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

    }
};
</script>

<style scoped lang='less'>
@font-size:14px;
    @media screen and (max-width: 1300px) {
        @font-size:12px;
    }
@def-color:#000;
@line-bg-color:rgb(138, 143, 134);
.top_box{
    font-size: @font-size;
    height: 120px;
    border-bottom: 1px solid #000;
    display: flex;
    .evaluation{
        flex: .45;
        .title{
            height: 50%;
            display: flex;
            &>span:nth-child(2){
                margin-top: 3px
            }
        }
        .store_eva{
            display: flex;
            height: 50%;
            .star{
                width: 60%;
                height: auto;
                margin-top:24px ;
                position: relative;
                span{
                    position: absolute;
                    left: 20px;
                }
            }
        }
        .st{
            width: 20%;
            display: inline-block;
            text-align: center;
            height: 100%;
            div{
                height: 50%;
            }
        }
    }
    .visitors{
        flex: .4;
        &>div:nth-child(1){
            margin: 20px 0 25px 0;
        }
        .comp{
            display: flex;
            .jg{
                margin-right: 30px;
            }
        }
    }
    .to_view{
        flex: .15;
        div{
            span{
                color: @def-color;
                cursor: pointer;
            }
        }
        &>div:nth-child(1){
            margin: 20px 0 25px 0;
        }
        .t_way{
            border-bottom: 4px solid rgb(110, 109, 109);
        }
    }
}

.main_box{
    font-size: @font-size;
    display: flex;
    .m_l{
        flex: .45;
    }
    .m_m{
        flex: .35;
        .top_li{
            height: 120px;
            margin-bottom: 20px;
            display: flex;
            .tl{
                flex: .2;
                img{
                    width: 100%;
                    border-radius: 5px;
                }
            }
            .tr{
                flex: .8;
                padding: 20px 0 20px 20px;
                .tit{
                    font-weight: bold;
                }
                .good_ifo{
                    margin: 10px 0;
                }
                .pro{
                    width: 100px;
                    background: #8dc63f;
                    height: 15px;
                }
            }
        }
    }
    .m_r{
        flex: .2;
        position: relative;
        .excel{
            text-align: center;
            margin-top: 80px;
            
        }
        .timeData{
            width: 125px;
            margin:0 auto ;
            margin-top: 100px;
            .block{
                position: relative;
                .jt{
                    position: absolute;
                    top: 7px;
                    right: 18px;
                }
            }
            .day_li{
                height: 450px;
                overflow-y: scroll;
                ul{
                    // position: relative;
                }
                li{
                    height: 30px;
                    line-height: 30px;
                    text-align: center;
                    cursor: pointer;
                    position: relative;
                }
                .onAct{
                    color: #000;
                    font-weight: bold;
                }
            }
            .day_li::-webkit-scrollbar {display:none}
            .day_li {scrollbar-width: none;}
            .day_li {-ms-overflow-style: none;}
        }
    }
}

.xtc{
    color: rgb(255, 102, 0);
    font-weight: 600;
    font-size: 1.2rem;
}
.xj{
    color: rgb(55, 55, 177);
    font-weight: 600;
}
.choose{
    position: absolute;
    font-weight: bold;
    font-size: 16px;
    width:125px;
    height:30px;
    top: 340px;
}
.choose::before{
    content: '';
    width: 40px;
    height: 1px;
    border-bottom: 2px solid #676767;
    display: inline-block;
    position: absolute;
    left: 0;
    top: 14px;
}
.choose::after{
    content: '';
    width: 40px;
    height: 1px;
    border-bottom: 2px solid #676767;
    display: inline-block;
    position: absolute;
    right: 0;
    top: 14px;
}
.seat_detail{
    padding:20px;box-shadow: 0 0 5px #a5a5a5;border-radius:5px;z-index:1000;background:#fff
}
// element  
.el-rate{
    display: inline-block;
    position: absolute;
    left: 136px;
    top: -7px;
    /deep/.el-rate__icon{
        color: red!important;
        // font-size: 27px;
        font-size: 1.7rem;
    }
    /deep/ .el-rate__decimal{
        color: red!important;
    }
    /deep/ .el-rate__text{
        position: absolute;
        left: -48px;
        top: -2px;
        // font-size: 30px;
        font-size: 1.8rem;
        font-weight: bold;
        color: #000!important;
        
    }

}
/deep/ .el-tabs__active-bar{
    background-color: @line-bg-color;
}
/deep/ .el-tabs__item.is-active{
    color: #000;
    font-weight: bold;
    font-size: 16px;
}
/deep/ .el-tabs__nav-wrap::after{
    background: none;
}
/deep/ .el-tabs__item:hover{
    color: @line-bg-color;
}
/deep/ .el-tab-pane{
    height: 420px;
    overflow-y: scroll;
}
/deep/ .el-tab-pane::-webkit-scrollbar {display:none}
/deep/ .el-tab-pane {scrollbar-width: none;}
/deep/ .el-tab-pane {-ms-overflow-style: none;}

.m_r{
    /deep/ .el-input__inner{
        border: none;
        font-size: 16px;
        color: #000;
        height: 30px;
        line-height: 30px;
    }
    /deep/ .el-date-editor{
        width: 120px;
    }
}
/deep/ .el-input__prefix{
    display: none;
}
// 座位
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
</style>