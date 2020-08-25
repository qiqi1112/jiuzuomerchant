<template>
    <div id="numeral">
        <div class="container">
            <div>排号管理</div>
            <div class="tit_top">
                <span class="li_text">当前排号总数<span>24</span></span>
                <span class="li_text">成功排号数<span>24</span></span>
                <span class="li_text">今日取消排号数<span>24</span></span>
                <span class="li_text">今日排号总数<span>24</span></span>
            </div>

            <div><el-button type="primary" icon="el-icon-search">呼叫下一位</el-button></div>

            <div class="numeral_list">
                <div class="fl_box">
                    <div class="column">
                        <span class="line lw2"></span>
                        <span>当前排号</span>
                    </div>
                    <ul>
                        <li class='li_n now_num'>
                            <div class="now_l">
                                <div>
                                    <i class="el-icon-s-custom"></i>
                                    <span class="info">预计人数</span>
                                    <span>7人</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-marketing"></i>
                                    <span class="info">预约座位</span>
                                    <span>沙发软座</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-release"></i>
                                    <span class="info">手机号码</span>
                                    <span>135****4726</span>
                                </div>
                            </div>
                            <div class="now_r">
                                <div>当前位于第<span class="num"> 1 </span>位 （A03）</div>
                                <div>取号时间 <span class="tl">2020-11-19  23:54:03</span></div>
                                <div>等待时常 <span class="tl"> 01:09:12</span></div>
                                <div>
                                    <span class="stat">处于呼叫中....</span>
                                    <span class="btn">确定</span>
                                    <span class="btn">续牌</span>
                                    <span class="btn">取消</span>
                                </div>
                            </div>
                        </li>
                        <li class='li_n now_num'>
                            <div class="now_l">
                                <div>
                                    <i class="el-icon-s-custom"></i>
                                    <span class="info">预计人数</span>
                                    <span>7人</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-marketing"></i>
                                    <span class="info">预约座位</span>
                                    <span>沙发软座</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-release"></i>
                                    <span class="info">手机号码</span>
                                    <span>135****4726</span>
                                </div>
                            </div>
                            <div class="now_r">
                                <div>当前位于第<span class="num"> 1 </span>位 （A03）</div>
                                <div>取号时间 <span class="tl">2020-11-19  23:54:03</span></div>
                                <div>等待时常 <span class="tl"> 01:09:12</span></div>
                                <div>
                                    <span class="stat">处于呼叫中....</span>
                                    <span class="btn">确定</span>
                                    <span class="btn">续牌</span>
                                    <span class="btn">取消</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="fl_box">
                    <div class="column">
                        <span class="line lw2"></span>
                        <span>成功排号记录</span>
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
                    <ul>
                        <li class='li_n suc_num'>
                            <div class="su_l">
                                <i class="el-icon-s-release"></i>
                                <span class="tel_lab">手机号码</span>
                                <span class="tel">135****4726</span>
                                <span class="tex">等待时常</span>
                                <span class="tim">00:01:10</span>
                            </div>
                            <div class="su_l">
                                <span class="get_lab">取号时间</span>
                                <span class="get_tim">2020-11-19  23:54:03</span>
                                <span class="fai_lab">取消时间</span>
                                <span class="fai_tim">2020-11-19  23:55:13</span>
                            </div>
                        </li>
                        <li class='li_n suc_num'>
                            <div class="su_l">
                                <i class="el-icon-s-release"></i>
                                <span class="tel_lab">手机号码</span>
                                <span class="tel">135****4726</span>
                                <span class="tex">等待时常</span>
                                <span class="tim">00:01:10</span>
                            </div>
                            <div class="su_l">
                                <span class="get_lab">取号时间</span>
                                <span class="get_tim">2020-11-19  23:54:03</span>
                                <span class="fai_lab">取消时间</span>
                                <span class="fai_tim">2020-11-19  23:55:13</span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="fl_box">
                    <div class="column">
                        <span class="line lw2"></span>
                        <span>取消排号记录</span>
                    </div>
                    <ul>
                        <li class='li_n fail_num'>
                            <div class="su_l">
                                <i class="el-icon-s-release"></i>
                                <span class="tel_lab">手机号码</span>
                                <span class="tel">135****4726</span>
                                <span class="tex">等待时常</span>
                                <span class="tim">00:01:10</span>
                            </div>
                            <div class="su_l">
                                <span class="get_lab">取号时间</span>
                                <span class="get_tim">2020-11-19  23:54:03</span>
                                <span class="fai_lab">取消时间</span>
                                <span class="fai_tim">2020-11-19  23:55:13</span>
                            </div>
                        </li>
                        <li class='li_n fail_num'>
                            <div class="su_l">
                                <i class="el-icon-s-release"></i>
                                <span class="tel_lab">手机号码</span>
                                <span class="tel">135****4726</span>
                                <span class="tex">等待时常</span>
                                <span class="tim">00:01:10</span>
                            </div>
                            <div class="su_l">
                                <span class="get_lab">取号时间</span>
                                <span class="get_tim">2020-11-19  23:54:03</span>
                                <span class="fai_lab">取消时间</span>
                                <span class="fai_tim">2020-11-19  23:55:13</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            time_now:'',
        };
    },
    created(){
        this.time_now = this.$regular.timeData(new Date(),2)
        console.log(this.time_now)
    },
    methods:{
        // 日期选择
        // timeDay(time){
        //     let trr = time.split('-')
        //     let day = new Date(trr[0],trr[1],0).getDate()
        //     return day
        // },
    }
};
</script>

<style scoped lang='less'>
@font-size:14px;
@bor-color:rgb(97, 97, 97);
#numeral{
    font-size: @font-size;
    .tit_top{
        border-radius: 5px;
        border: 1px solid @bor-color;
        line-height: 40px;
        width: 600px;
        padding: 0 10px;
        margin: 20px 0;
        .li_text{
            margin-right: 32px;
            span{
                font-size: 18px;
                margin-left: 10px;
                color: rgb(255, 102, 0);
            }
        }
    }
    .numeral_list{
        margin-top: 20px;
        display: flex;
        .fl_box{
            flex: 1;
            .li_n{
                border: 1px solid @bor-color;
                border-radius: 5px;
                margin-bottom: 15px;
                padding: 10px;
                width: 90%;
            }
            .now_num{
                display: flex;
                .now_l{
                    flex: 1;
                    div{
                        margin-bottom: 10px;
                        i{
                            font-size: 22px;
                        }
                    }
                    .info{
                        margin: 0 30px 0 10px;
                    }
                }
                .now_r{
                    flex: 1;
                    div{
                        margin-bottom: 6px;
                    }
                    .num{
                        font-size: 18px;
                        color: rgb(255, 60, 0);
                    }
                    .tl{
                        margin-left: 10px;
                    }
                    .stat{
                        color: red;
                    }
                    .btn{
                        background: salmon;
                        color: #000;
                        padding: 5px 8px;
                        border-radius: 5px;
                        margin-left: 10px;
                        font-size: 12px;
                        cursor: pointer;
                    }
                }
            }
            .suc_num,.fail_num{
                .su_l{
                    margin-bottom: 10px;
                    i{
                        font-size: 18px;
                        margin-right: 15px;
                    }
                    .tel_lab{
                        margin-right: 30px;
                    }
                    .tel{
                         margin-right: 50px;
                    }
                    .tex{
                        margin-right: 10px;

                    }
                    .tim{
                         color: red;
                    }
                    .get_lab{
                         margin-right: 10px;
                    }
                    .get_tim{
                         margin-right: 50px;
                    }
                    .fai_lab{
                         margin-right: 10px;
                    }
                }
            }
        }
    }
}
ul,li{
    list-style: none;
}
.el-rate{
    display: inline-block;
    position: absolute;
    left: 136px;
    top: -7px;
    /deep/.el-rate__icon{
        color: red!important;
        font-size: 27px;
    }
    /deep/ .el-rate__decimal{
        color: red!important;
    }
    /deep/ .el-rate__text{
        position: absolute;
        left: -48px;
        top: -2px;
        font-size: 30px;
        font-weight: bold;
        color: #000!important;
        
    }

}
/deep/ .el-tabs__active-bar{
    background-color: @bor-color;
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
    color: @bor-color;
}
/deep/ .el-tab-pane{
    height: 420px;
    overflow-y: scroll;
}
/deep/ .el-tab-pane::-webkit-scrollbar {display:none}
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