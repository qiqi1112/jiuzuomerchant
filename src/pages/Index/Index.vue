<template>
    <div>
        <!-- <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 首页
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div> -->

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
                            <el-rate v-model="value" disabled show-score text-color="#ff9900" score-template="{value}"></el-rate>
                        </div>
                    </div>
                </div>
                <div class="visitors">
                    <div class="comp">
                    <span class="line lw2"></span> <span>今日客访数 <i class="xtc">527</i> 次，同比昨日<span>上涨</span> <i class="xtc"> 36 </i>次</span> 
                    </div>
                    <div class="comp">
                        <span class="line lw2"></span><span class="jg">今日客访数 <i class="xtc">19</i> 次，同比昨日<span class="xj">下降</span> <i class="xtc"> 3 </i>次</span>
                        <span class="line lw2"></span><span>店铺曝光量<i class="xtc"> 19538 </i> 次，同比昨日 <i class="xtc">234234 P</i></span>
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
                        <div class="column">营业额</div>
                        <div ref='broken' id="brokenline" style="width: 85%;height: 500px;"> </div>        
                    </div>

                    <div class="columnar_box">
                        <div class="column">开台数据统计</div>
                        <div ref='columnar' id="columnarLine" style="width: 100%;height: 500px;"> </div> 
                    </div>
                </div>
                <div class="m_m"></div>
                <div class="m_r"></div>
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
            value: 3.7,
            brokenline:'',
            columnarLine:'',
        };
    },
    created(){

    },
    mounted(){
        this.brokenChart()
        this.columnarChart()

    },
    methods:{
        // 折现图
        brokenChart(){
            this.brokenChart = echarts.init(this.$refs.broken);
            var option = {
                dataZoom: {
                    type: 'inside',
                
                },
                tooltip: {
                    trigger: 'axis'
                },
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
                    data: ['6', '7', '8', '9', '10', '11', '12']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };
    
            // 使用刚指定的配置项和数据显示图表。
            this.brokenChart.setOption(option);
        },
        // 柱状图
        columnarChart(){

        },
        // 饼图
        // 切换统计方式
        dayOrMon(num){
            this.day_mon = num
        }
    }
};
</script>

<style scoped lang='less'>
@font-14:14px;
@font-15:15px;
@def-color:#000;
.top_box{
    font-size: @font-14;
    height: 120px;
    border-bottom: 1px solid #000;
    display: flex;
    .evaluation{
        flex: .4;
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
                width: 50%;
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
            width: 25%;
            display: inline-block;
            text-align: center;
            height: 100%;
            div{
                height: 50%;
            }
        }
    }
    .visitors{
        flex: .45;
        &>div:nth-child(1){
            margin: 20px 0 25px 0;
        }
        .comp{
            display: flex;
            .jg{
                margin-right: 20px;
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
    font-size: @font-14;
    display: flex;
    .m_l{
        flex: .4;
    }
    .m_m{
        flex: .4;
    }
    .m_r{
        flex: .2;
    }
    .column{
        display: flex;
        margin: 20px 0;
    }





}
// 公用
.line{
    width: 5px;
    background: rgb(138, 143, 134);
    margin-right: 10px;
    display: inline-block;
}
.lw1{
    height: 30px;

}
.lw2{
    height: 20px;
    
}
.xtc{
    color: rgb(255, 102, 0);
    font-weight: 600;
    font-size: 18px;

}
.xj{
    color: rgb(55, 55, 177);
    font-weight: 600;
}
// element  
.el-rate{
    display: inline-block;
    // position: relative;
    position: absolute;
    left: 136px;
    /deep/.el-rate__icon{
        color: red!important;
    }
    /deep/ .el-rate__text{
        position: absolute;
        left: -48px;
        top: -8px;
        font-size: 30px;
        font-weight: bold;
        color: #000!important;
        
    }

}

</style>