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
                    <span class="line lw2"></span> <span>今日客访数 <i class="xtc">527</i> 次，同比昨日<span>上涨</span> <i class="xtc"> 36 </i>次</span> 
                    </div>
                    <div class="comp">
                        <span class="line lw2"></span><span class="jg">今日新增访客 <i class="xtc">19</i> 人，同比昨日<span class="xj">下降</span> <i class="xtc"> 3 </i>人</span>
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
                        <div class="column">
                            <span class="line lw2"></span>
                            <span>开台数据统计</span>
                        </div>
                        <div ref='columnar' id="columnarLine" style="width: 90%;height: 500px;"></div> 
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
                                                <p class="good_ifo">{{item.ml}}ml/瓶&nbsp;&nbsp; 今日已售{{item.sold}}瓶</p>
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
                </div>
            </div>
        </div>
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
            // brokenline:'',
            // columnarLine:'',
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
        // console.log(this.$refs.day[this.active].innerText)
        this.brokenChart()
        this.columnarChart()
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
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210,120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310,120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410,120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        data: [320, 332, 301, 334, 390, 330, 320,120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
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
                // Declare several bar series, each will be mapped
                // to a column of dataset.source by default.
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
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        data: [
                            {value: 335, name: '排号数 25% （29座）'},
                            {value: 310, name: '取消排号数 25% （29座）'},
                            {value: 234, name: '生效排号数 25% （29座）'},
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
        }
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
/deep/ .el-input__prefix{
    display: none;
}
</style>