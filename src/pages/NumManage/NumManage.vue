<template>
    <div id="numeral">
        <div class="container">
            <div class="position">
                <div class="crumbs">
                    <el-breadcrumb separator="/">
                        <el-breadcrumb-item>
                            <i class="el-icon-lx-cascades"></i> 排号管理
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
            
                <div class="tit_top">
                    <span class="li_text">今日排号总数<span>{{todayData.todayTotalLy}}</span></span>
                    <span class="li_text">今日成功排号数<span>{{todayData.totalSuccessLy}}</span></span>
                    <span class="li_text">今日当前排号总数<span>{{todayData.nowTotalLy}}</span></span>
                    <span class="li_text">今日取消排号数<span>{{todayData.todayCancelTotalLy}}</span></span>
                    <br>
                    <span class="li_text">今日当前抢座总数<span>{{todayData.nowTotalVie}}</span></span>
                    <span class="li_text">今日成功抢座数<span>{{todayData.todaySuccessTotalVie}}</span></span>
                    <span class="li_text">今日抢座总数<span>{{todayData.todayTotalVie}}</span></span>
                </div>
                
                <div>
                    <el-button @click="call()" type="primary" icon="el-icon-dish">呼叫下一位</el-button>
                    <el-button @click="RP()" type="primary" >设置参考价</el-button>
                    <!-- <el-button type="primary" icon="el-icon-download" class="handle-del mr10" @click="handleEdit()" >Excel导出</el-button> -->
                </div>
            </div>

            <div class="numeral_list">
                <div class="fl_box">
                    <div class="column">
                        <span class="line lw2"></span>
                        <span>当前抢座</span>
                    </div>
                    <ul class="scl_box">
                        <li class='li_n now_num' v-for="(item,index) in robList" :key="index">
                            <div class="now_l">
                                <div>
                                    <i class="el-icon-s-custom"></i>
                                    <span class="info">预计人数</span>
                                    <span>{{item.seatCapacity}}人</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-marketing"></i>
                                    <span class="info">预约座位</span>
                                    <span>{{item.seatType==0?'无要求':(item.seatType==1?'沙发软座':'硬座')}}</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-release"></i>
                                    <span class="info">手机号码</span>
                                    <span>{{item.contactTel | phoneNum}}</span>
                                </div>
                            </div>
                            <div class="now_r">
                                <div>
                                    当前位于第
                                    <span class="num"> {{index+1}} </span>
                                    位（{{item.codeNo}}）
                                    <span class="has_consum">(已消费:￥{{item.paidAmount}})</span> 
                                </div>
                                <div>取号时间 <span class="tl">{{item.createTime}}</span></div>
                                <div>等待时常 <span class="tl"> {{item.createTime | timeFormat}}</span></div>
                                <!-- <div v-if="index==0 && callNext"> -->
                                <div v-if="item.callStatus == 1">
                                    <span class="stat">处于呼叫中....</span>
                                    <span class="btn" @click="ensure(item,2)">确定</span>
                                    <span class="btn" @click="nextOne(item,2)">续牌</span>
                                    <span class="btn" @click="fail(item,2)">取消</span>
                                </div>
                            </div>
                        </li>
                    </ul>

                    <div class="column">
                        <span class="line lw2"></span>
                        <span>当前排号</span>
                    </div>
                    <ul class="scl_box">
                        <li class='li_n now_num' v-for="(item,index) in rowList" :key="index">
                            <div class="now_l">
                                <div>
                                    <i class="el-icon-s-custom"></i>
                                    <span class="info">预计人数</span>
                                    <span>{{item.seatCapacity}}人</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-marketing"></i>
                                    <span class="info">预约座位</span>
                                    <span>{{item.seatType==0?'无要求':(item.seatType==1?'沙发软座':'硬座')}}</span>
                                </div>
                                <div>
                                    <i class="el-icon-s-release"></i>
                                    <span class="info">手机号码</span>
                                    <span>{{item.contactTel | phoneNum}}</span>
                                </div>
                            </div>
                            <div class="now_r">
                                <div>当前位于第<span class="num"> {{index+1}} </span>位 （{{item.codeNo}}）</div>
                                <div>取号时间 <span class="tl">{{item.createTime}}</span></div>
                                <div>等待时常 <span class="tl"> {{item.createTime | timeFormat}}</span></div>
                                <!-- <div v-if="index==0 && callNext && robList.length==0"> -->
                                <div v-if="item.callStatus == 1">
                                    <span class="stat">处于呼叫中....</span>
                                    <span class="btn" @click="ensure(item,1)">确定</span>
                                    <span class="btn" @click="nextOne(item,1)">续牌</span>
                                    <span class="btn" @click="fail(item,1)">取消</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="fl_box">
                    <div class="column" >
                        <span class="line lw2"></span>
                        <span>成功记录</span>
                        <div class="time-ch">
                            <el-date-picker
                                v-model="time_now"
                                :clearable="false"
                                format='yyyy-MM-dd'
                                @change='scsVal'
                                :editable="false"
                                type="date"
                                placeholder="选择日期时间"
                                @focus="focSta=true"
                                @blur="focSta=false"
                                default-time="12:00:00">
                            </el-date-picker>

                            <i class="jt " :class="focSta?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                        </div>
                    </div>
                    <div class="btns">
                        <div class="tab_btn" @click="sucOrCan(1,1)" :class="suc_type==1?'on':'canc'">排号</div>
                        <div class="tab_btn" @click="sucOrCan(1,2)" :class="suc_type==2?'on':'canc'">抢座</div>
                    </div>
                    <ul class="succ_canc_box">
                        <li class='li_n suc_num' v-for="(item,index) in showSuccess" :key="index">
                            <div class="su_l">
                                <div class="atl">
                                    <i class="el-icon-s-release"></i>
                                    <span class="tel_lab">手机号码</span>
                                    <span class="tel">{{item.contactTel | phoneNum}}</span>
                                </div>
                                <div class="atl" v-show="suc_type==2">
                                    <span class="tel_lab">消费金额</span>
                                    <span class="tim">￥{{item.paidAmount}}</span>
                                </div>
                            </div>
                            <div class="su_l">
                                <div class="atl">
                                    <span class="fai_lab">{{suc_type==1?'排号时间':'抢座时间'}}</span>
                                    <span class="fai_tim">{{item.createTime}}</span>
                                </div>
                                <div class="atl">
                                    <span class="fai_lab">入座时间</span>
                                    <span class="fai_tim">{{item.callTime}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="fl_box">
                    <div class="column">
                        <span class="line lw2"></span>
                        <span>取消记录</span>
                        <div class="time-ch">
                            <el-date-picker
                                v-model="time_now_no"
                                :clearable="false"
                                type="date"
                                @change="cancelVal"
                                @focus="focSta=true"
                                :editable="false"
                                format='yyyy-MM-dd'
                                @blur="focSta=false"
                                placeholder="请选择时间">
                            </el-date-picker>
                            <i class="jt " :class="focSta?'el-icon-caret-top':'el-icon-caret-bottom'"></i>
                        </div>
                    </div>
                    <div class="btns">
                        <div class="tab_btn on">排号</div>
                        <!-- <div class="tab_btn" @click="sucOrCan(0,1)" :class="can_type==1?'on':'canc'">排号</div> -->
                        <!-- <div class="tab_btn" @click="sucOrCan(0,2)" :class="can_type==2?'on':'canc'">取消抢座记录</div> -->
                    </div>
                    <ul class="succ_canc_box">
                        <li class='li_n fail_num' v-for="(item,index) in cancelList" :key="index">
                            <div class="su_l">
                                <div class="atl">
                                    <i class="el-icon-s-release"></i>
                                    <span class="tel_lab">手机号码</span>
                                    <span class="tel">{{item.contactTel | phoneNum}}</span>
                                </div>

                                <div class="atl">
                                    <span class="tex">等待时常</span>
                                    <span class="tim">{{item.createTime | timeFormat(item.offTime)}}</span>
                                </div>
                            </div>
                            <div class="su_l">
                                <div class="atl">
                                    <span class="get_lab">取号时间</span>
                                    <span class="get_tim">{{item.createTime}}</span>
                                </div>
                                <div class="atl">
                                    <span class="fai_lab">取消时间</span>
                                    <span class="fai_tim">{{item.offTime}}</span>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { get } from '../../api';
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
            todayData:{},//头部展示信息
            robList:[],//抢座列表
            rowList:[],//排号列表
            successList:[],//成功排号列表
            successVieList:[],//成功抢座列表
            cancelList:[],//取消排号列表
            // cancelVieList:[],//取消抢座列表
            maxPrice:0,//最高竞价
            showSuccess:[],//成功数组 显示抢座/排号

            suc_type:1,
            can_type:1,

        };
    },
    created(){
        this.getData()
        this.time_now_no = this.time_now = new Date()
    },
    computed: {
        watchOnloadOrder() {
            return this.$store.state.onloadOrder;
        }
    },
    watch:{
        watchOnloadOrder: {
            handler(val) {
                this.getData()
                this.time_now_no = this.time_now = new Date()
            }
        },
        suc_type(val){
            val==1?this.showSuccess = this.successList : this.showSuccess = this.successVieList
        },
        // can_type(val){
        //     val==1?this.showCancel = this.cancelList : this.showCancel = this.cancelVieList
        // }
    },
    filters:{
        timeFormat(time,timeTwo){
            let diff;
            if(timeTwo){
                diff = new Date(timeTwo).getTime() - new Date(time).getTime()
            }else{
                diff = new Date().getTime() - new Date(time).getTime()
            }
            let getHours,minutes,seconds,leve1,leve2,leve3
            leve1 =  diff%(24*3600*1000) 
            getHours = Math.floor(leve1/(3600*1000))
            leve2 =  leve1%(3600*1000) 
            minutes = Math.floor(leve2/(60*1000))
            leve3 = leve2%(60*1000) 
            seconds = Math.floor(leve3/1000)
            if(getHours<10){
                getHours = '0' + getHours
            }
            if(minutes<10){
                minutes = '0' + minutes
            }
            if(seconds<10){
                seconds = '0' + seconds
            }
            return getHours + ':' + minutes + ':' + seconds
        }
    },
    methods:{
        getData(){
            this.$get('/merchant/store/ly/storeLyList').then(res=>{
                if(res.code == 0){
                    this.todayData = {
                        nowTotalLy:res.data.nowTotalLy,
                        nowTotalVie:res.data.nowTotalVie,
                        todayCancelTotalLy:res.data.todayCancelTotalLy,
                        todayTotalLy:res.data.todayTotalLy,
                        todayTotalVie:res.data.todayTotalVie,
                        totalSuccessLy:res.data.totalSuccessLy,
                        todaySuccessTotalVie:res.data.todaySuccessTotalVie,
                    }
                    this.maxPrice = res.data.money
                    this.robList = res.data.nowVieList
                    this.rowList = res.data.nowLyList
                    this.showSuccess = this.successList = res.data.successLyList
                    this.cancelList = res.data.cancelLyList
                    this.successVieList = res.data.successVieList
                    // this.cancelVieList = res.data.cancelLyList
                }else{
                    this.$message.error(res.data);
                }
            })
        },
        
        // 成功，取消 记录  按钮切换
        sucOrCan(isTrue,type){
            if(isTrue == 1){
                // 成功记录按钮切换
                type == 1?this.suc_type = 1 : this.suc_type = 2
            }else{
                // 取消记录按钮切换
                type == 1?this.can_type = 1 : this.can_type = 2
            }
        },

        // 成功/取消  列表查询
        scsVal(val){
            this.searchList(this.$regular.timeData(val,2),1)
        },
        cancelVal(val){
            this.searchList(this.$regular.timeData(val,2),2)
        },
        searchList(val,type){
            let data = {
                queryTime:val,
                type:type==1?1:2
            }
            this.$post(`/merchant/store/ly/storeLyListBySuccessOrOff`,data).then(res=>{
                if(res.code == 0){
                    if(type == 1){
                        this.successList = res.data.lyList
                        this.successVieList = res.data.vieList
                        this.suc_type == 1?this.showSuccess = this.successList : this.showSuccess = this.successVieList
                    }else{
                        this.cancelList = res.data.lyList
                    }
                }else{
                    this.$message.error(res.data);
                }
            })        
        },

        // 确定
        ensure(val,type){
            this.$get(`/merchant/store/ly/calling/${val.id}/${type}`).then(res=>{
                if(res.code == 0){
                    this.getData()
                }else{
                    this.$message.error(res.data);
                }
            })
            // this.callNext = false
            // for(let i=0;i<this.nowNumList.length;i++){
            //     if(val.id == this.nowNumList[i].id){
            //         this.nowNumList.splice(i,1)
            //     }
            // }
        },
        // 续牌
        nextOne(val,type){
            let nextId = null,nextType = null
            if(val.paidAmount){
                //当前时抢座
                if(this.robList[1]){
                    // 抢  有
                    nextId = this.robList[1].id
                    nextType = 2
                }else{
                    if(this.rowList[0]){
                        nextId = this.rowList[0].id
                        nextType = 1
                    }else{
                        nextId = null
                        nextType = null
                    }
                }
            }else{
                // 当前时排号
                if(this.robList[0]){
                    // 如果抢座还有订单
                    nextId = this.robList[0].id
                    nextType = 2
                }else if(this.rowList[1]){
                    nextId = this.rowList[1].id
                    nextType = 1
                }else{
                    nextId = null
                    nextType = null
                }
            }
            if(nextId == null || nextType == null){
                this.$message.error('当前是最后一个订单');
                return
            }
            let data = {
                id:val.id,
                type:+type,
                nextId:nextId,
                nextType:nextType
            }
            this.$post(`/merchant/store/ly/setContinuation`,data).then(res=>{
                if(res.code == 0){
                    this.getData()
                    // this.call()
                }else{
                    this.$message.error(res.data);
                }
            })  
            // this.callNext = false
            // this.nowNumList[0] = this.nowNumList.splice(1,1,this.nowNumList[0])[0]
        },
        // 取消
        fail(val,type){
            this.$get(`/merchant/store/ly/cancelCalling/${val.id}/${type}`).then(res=>{
                if(res.code == 0){
                    this.getData()
                }else{
                    this.$message.error(res.data);
                }
            })  
            // this.callNext = false
            // for(let i=0;i<this.nowNumList.length;i++){
                // if(val.id == this.nowNumList[i].id){
                //     this.nowNumList.splice(i,1)
                // }
            // }
        },
        // 根据时间排序
        sortArr(a,b){
            return a.continuationTime - b.continuationTime
        },
        // 呼叫下一位
        call(){
            let id = null,type = null,status=null,qz_time='',ph_time;
            let qiangzuo = this.robList
            let paihao = this.rowList
            /*
                判断robList>0  用于查看是否有抢座订单
                有点击续牌时  判断robList是否>=1  大于1 传值 抢座第2条数据 否则 传入排号第1条数据  没有排号则提示
                continuationStatus  续牌 1    未续牌  2
                callStatus  呼叫 1   未呼叫  2


                续牌之后  有   续牌时间
                当有2个续牌时  判断续牌时间点 
            */

            // console.log(qz_time,ph_time)
            let continuationTime = []
            for(let i=0;i<qiangzuo.length;i++){
                if(qiangzuo[i].continuationTime){
                    continuationTime.push(qiangzuo[i])
                }
            }

            let sort_time = continuationTime.sort(this.sortArr)

            if(sort_time.length<2){
                for(let j=0;j<paihao.length;j++){
                    if(paihao[j].continuationTime){
                        continuationTime.push(paihao[j])
                    }
                }
            }

            
            if(qiangzuo.length>0){
                if(qiangzuo.length == 1 && qiangzuo[0].continuationStatus == 1){
                    // 抢座长度=1且处于续牌状态  再次点击下一位时  传排号的第一条
                    if(paihao.length<1){
                        //排号没有订单时
                        id = qiangzuo[0].id
                        type = 2
                        status = qiangzuo[0].callStatus
                    }else{
                        // 排号有订单
                        id = paihao[0].id
                        type = 1
                        status = paihao[0].callStatus
                    }
                }else if(qiangzuo.length > 1 && qiangzuo[0].continuationStatus == 1){

                    // 抢座长度>1且 第一条处于续牌状态  再次点击下一位时  传抢座的第2条

                    if(qiangzuo[1].continuationStatus == 1){
                        id = qiangzuo[1].id
                        type = 2
                        status = qiangzuo[1].callStatus
                    }else{
                        id = qiangzuo[0].id
                        type = 2
                        status = qiangzuo[0].callStatus
                    }
                }
                else{
                    id = qiangzuo[0].id
                    type = 2
                    status = qiangzuo[0].callStatus
                }
            }else{
                // 进入这里 代表无抢座订单
                if(paihao.length>0){
                    if(paihao.length == 1 && paihao[0].continuationStatus == 1){
                        id = paihao[0].id
                        type = 1
                        status = paihao[0].callStatus
                    }else if(paihao.length > 1 && paihao[0].continuationStatus == 1){
                        id = paihao[1].id
                        type = 1
                        status = paihao[1].callStatus
                    }else{
                        id = paihao[0].id
                        type = 1
                        status = paihao[0].callStatus
                    }
                }
            }

            

            if(sort_time.length>1){
                //当已存在2条续牌状态时  传时间早的
                id = sort_time[0].id
                sort_time[0].paidAmount?type = 2:type = 1
                status = sort_time[0].callStatus
            }

            console.log(id,type)


            if(!id){
                this.$message.error({message: '当前没有订单'})
                return
            }
            if(status == 1){
                this.$message.error({message: '当前已有订单未处理'})
                return
            }
            
            this.$get(`/merchant/store/ly/setCall/${id}/${type}`).then(res=>{
                if(res.code == 0){
                    // this.callNext = true
                    this.getData()
                }else{
                    this.$message.error(res.data);
                }
            })    
        },
        RP(){
            this.$prompt('请设置最高竞价', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputValue: this.maxPrice,
                inputPattern: /^\d+(?=\.{0,1}\d+$|$)/,
                inputErrorMessage: '请输入正数'
            }).then(({ value }) => {
                this.$post(`/merchant/store/ly/setMoney`,{money:value}).then(res=>{
                    if(res.code == 0){
                        this.maxPrice = value
                        this.$message.success('保存成功');
                    }else{
                        this.$message.error(res.data);
                    }
                })  
            }).catch(() => {
            });        
        }
    }
};
</script>

<style scoped lang='less'>
@media screen and (max-width: 1300px) {
    @font-size:12px;
}
@font-size:12px;
@bor-color:rgb(97, 97, 97);
#numeral{
    .container{
        padding: 0;
        padding-top: 0;
    }
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
    .position{
        position: fixed;
        width: 90%;
        background: #f7f7f7;
        z-index: 100;
        padding: 20px 0;
        padding-left: 15px;
        box-shadow: 0 1px 3px #ececec;
    }
    .numeral_list{
        margin-top: 220px;
        // margin-top: 20px;
        padding: 15px;
        display: flex;
        min-width: 800px;
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
                    flex: .42;
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
                    flex: .58;
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
            @media screen and (max-width: 1500px) {
                .now_num{
                    display: inherit;
                }
            }
            .suc_num,.fail_num{
                .su_l{
                    display: flex;
                    .atl{
                        flex: 1;
                        margin-bottom: 10px;
                    }
                    i{
                        font-size: 18px;
                        margin-right: 15px;
                    }
                    .tel_lab{
                        margin-right: 7%;
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
                @media screen and (max-width: 1500px) {
                    .su_l{
                        display: inherit;
                    }
                }
            }
            .jt{
                margin-top: 3px;
            }
            .btns{
                margin-bottom:20px;
                .tab_btn{
                    display:inline-block;
                    padding:8px 30px;
                    color:white;
                    cursor: pointer;
                }   
                .on{
                    background:#409EFF;
                }
                .canc{
                    background:#c1c1c1;
                }
            }
        }
        .scl_box{
            overflow-y: scroll;
            height: 435px;
            .has_consum{
                color: red;
            }
        }
        .succ_canc_box{
            overflow-y: scroll;
            height: 920px;
        }
        .succ_canc_box::-webkit-scrollbar {display:none}
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
    width: 115px;
}
/deep/ .el-input__prefix{
    display: none;
}



</style>