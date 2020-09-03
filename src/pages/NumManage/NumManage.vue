<template>
    <div id="numeral">
        <div class="container">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item>
                        <i class="el-icon-lx-cascades"></i> 排号管理
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>

            <div class="tit_top">
                <span class="li_text">当前排号总数<span>24</span></span>
                <span class="li_text">成功排号数<span>24</span></span>
                <span class="li_text">今日取消排号数<span>24</span></span>
                <span class="li_text">今日排号总数<span>24</span></span>
            </div>

            <div><el-button @click="call()" type="primary" icon="el-icon-search">呼叫下一位</el-button></div>

            <div class="numeral_list">
                
                <div class="fl_box">
                    <div class="column">
                        <span class="line lw2"></span>
                        <span>当前排号</span>
                    </div>
                    <ul class="scl_box">
                        <li class='li_n now_num' v-for="(item,index) in nowNumList" :key="index">
                            <div class="now_l">
                                <div>
                                    <i class="el-icon-s-custom"></i>
                                    <span class="info">预计人数</span>
                                    <span>{{item.num}}人</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-marketing"></i>
                                    <span class="info">预约座位</span>
                                    <span>{{item.seat_type==1?'沙发软座':'硬座'}}</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-release"></i>
                                    <span class="info">手机号码</span>
                                    <span>{{item.tel | phoneNum}}</span>
                                </div>
                            </div>
                            <div class="now_r">
                                <div>当前位于第<span class="num"> {{index+1}} </span>位 （{{item.seat_num}}）</div>
                                <div>取号时间 <span class="tl">{{item.take_time}}</span></div>
                                <div>等待时常 <span class="tl"> {{item.wait_time}}</span></div>
                                <div v-if="index==0 && callNext">
                                    <span class="stat">处于呼叫中....</span>
                                    <span class="btn" @click="ensure(item)">确定</span>
                                    <span class="btn" @click="nextOne(item)">续牌</span>
                                    <span class="btn" @click="fail(item)">取消</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="fl_box">
                    <div class="column" >
                        <span class="line lw2"></span>
                        <span>成功排号记录</span>

                        <div class="time-ch">
                            <el-date-picker
                                v-model="time_now"
                                :clearable="false"
                                type="date"
                                @focus="focSta=true"
                                :editable="false"
                                @blur="focSta=false"
                                :time-arrow-control='true'
                                placeholder="请选择时间">
                            </el-date-picker>
                            <i class="jt " :class="focSta?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                        </div>
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
                        <div class="time-ch">
                            <el-date-picker
                                v-model="time_now_no"
                                :clearable="false"
                                type="date"
                                @focus="focSta=true"
                                :editable="false"
                                @blur="focSta=false"
                                :time-arrow-control='true'
                                placeholder="请选择时间">
                            </el-date-picker>
                            <i class="jt " :class="focSta?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                        </div>
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
            time_now_no:'',
            focSta:false,
            callNext:false,
            nowNumList:[
                {
                    id:1,
                    num:7, 
                    seat_type:1,   
                    tel:'18281910541',
                    take_time:'2020-11-19  23:54:03',
                    wait_time:'01:09:12',
                    seat_num:'A03'
                },
                {
                    id:2,
                    num:2, 
                    seat_type:2,   
                    tel:'18281910541',
                    take_time:'2020-11-19  23:54:03',
                    wait_time:'01:09:12',
                    seat_num:'B03'
                },
                {
                    id:3,
                    num:11, 
                    seat_type:1,   
                    tel:'18281910541',
                    take_time:'2020-11-19  23:54:03',
                    wait_time:'01:09:12',
                    seat_num:'C103'
                }
            ],
        };
    },
    created(){
        this.time_now_no = this.time_now = new Date()
    },
    methods:{
        ensure(val){
            this.callNext = false
            for(let i=0;i<this.nowNumList.length;i++){
                if(val.id == this.nowNumList[i].id){
                    this.nowNumList.splice(i,1)
                }
            }
        },
        nextOne(val){
            this.callNext = false
            this.nowNumList[0] = this.nowNumList.splice(1,1,this.nowNumList[0])[0]
        },
        fail(val){
            this.callNext = false
            for(let i=0;i<this.nowNumList.length;i++){
                if(val.id == this.nowNumList[i].id){
                    this.nowNumList.splice(i,1)
                }
            }
        },
        call(){
            if(this.callNext){
                this.$message.error({
                    message: '当前排号订单未处理',
                    center: true
                });
                return
            }
            this.callNext = true
        }
    }
};
</script>

<style scoped lang='less'>
@media screen and (max-width: 1300px) {
    @font-size:12px;
}
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
                font-size: 1.2rem;
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
            .time-ch{
                margin: auto;
                margin-right: 7%;
            }
            .now_num{
                display: flex;
                .now_l{
                    flex: .45;
                    div{
                        margin-bottom: 10px;
                        i{
                            font-size: 22px;
                        }
                    }
                    .info{
                        margin: 0 10% 0 10px;
                    }
                }
                .now_r{
                    flex: .55;
                    div{
                        margin-bottom: 6px;
                    }
                    div:last-child{
                        margin-bottom: 0;
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
                        margin-right: 7%;
                    }
                    .tel{
                        margin-right: 11%;
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
                         margin-right: 11%;
                    }
                    .fai_lab{
                         margin-right: 10px;
                    }
                }
            }
            .jt{
                margin-top: 3px;
            }
        }
        .scl_box{
            overflow-y: scroll;
            height: 700px;
        }
        .scl_box::-webkit-scrollbar {display:none}
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
    font-size: 15px;
    color: #000;
    height: 20px;
    line-height: 20px;
    padding-right: 0;
}
/deep/ .el-date-editor{
    width: 114px;
}
/deep/ .el-input__prefix{
    display: none;
}
</style>