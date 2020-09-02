<template>
    <div id="service">
        <div class="box">
            <div class="people_list">
                <ul>
                    <li :class="active==i?'active':''" @click="getChat(item,i)" v-for="(item,i) in userList" :key="i">{{item.loginName}}</li>
                </ul>
            </div>
            <div class="chat" v-if="now_user">
                <div class="record">
                    <div class="username">{{now_user.loginName}}</div>
                    <div class="chat_list">
                        <div class="cli">
                            <div class="cmsg" v-for="(item,i) in roomChatText" :key="i">
                                <div class="msg_list" v-if="item.from == now_user.id">
                                    <div class="headImg">
                                        <img  src="img/4.jpg" alt="">
                                    </div>
                                    <div class="msg">
                                        <span>{{item.msg.msg}}</span>
                                    </div>
                                </div>
                                <div class="msg_list self" v-else>
                                    <div class="msg">
                                        <span>{{item.msg.msg}}</span>
                                    </div>
                                    <div class="headImg">
                                        <img  src="img/3.jpg" alt="">
                                    </div>
                                </div>
                                <!-- <div class="msg_list" :class="item.from==now_user.id?'self':'other'">
                                    <div class="msg">
                                        <span>{{item.msg.msg}}</span>
                                    </div>
                                    <div class="headImg">
                                        <img  src="img/3.jpg" alt="">
                                    </div>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
                <div class="text_box">
                    <!-- @keyup.enter='send()' -->
                    <textarea class="textarea" v-model="sendText" name="" id="" ></textarea>
                    <div class="btn_oper">
                        <el-button type="primary"  @click="send()">发送</el-button>
                    </div>
                </div>
            </div>
            <div class="chat" v-else></div>
            <div class="quick">

                <div class="goods_list">
                    <el-tabs v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="套餐" name="first">
                            <ul class="one">
                                <li @click="quickRrep(item)" v-for="(item,i) in oneList" :key="i">{{item}}</li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="香槟" name="second">清吧</el-tab-pane>
                        <el-tab-pane label="啤酒" name="third">KTV</el-tab-pane>
                    </el-tabs>
                </div>

            </div>
        </div> 


        <!-- 
```
> 经纬度消息
```
    {
        "target_type": "users", //目标类型：用户users，群chatgroups，聊天室chatrooms
        "target": ["user2"],//目标数组，userId,groupId,roomId
        "msg": {
            "type": "loc", // 消息类型 文本txt 图片img 位置loc 语音audio 视频video 文件file
            "lat": "39.966",
            "lng":"116.322",
            "addr":"中国北京市海淀区中关村"
            },
        "from": "user1"
    }
```
> 文件消息
```
    {
        "target_type": "users", //目标类型：用户users，群chatgroups，聊天室chatrooms
        "target": ["user2"],//目标数组，userId,groupId,roomId
        "msg": {
            "type": "img", // 消息类型 文本txt 图片img 位置loc 语音audio 视频video 文件file
            "url": "http://oss.cdhqht.com/test.png"
            },
        "from": "user1"
    }
 -->
    
    </div>
</template>

<script>
    export default {
        data() {
            return {
                activeName: 'first',
                now_user:'',
                // active:null,//默认需要点击
                active:0,
                sendText:'',
                userList:[
                    {
                        "id":"1297081179142270977",
                        "loginName":"文雪峰",
                        "phone":"18200329369",
                        "loginPassword":"e10adc3949ba59abbe56e057f20f883e",
                        "token":null,
                        "roomIds":[],
                        "online":true,
                        "socketId":"1300745849701273600",
                        "serverId":"200000"
                    },
                    {
                        "id":"1297081179142277777",
                        "loginName":"小猫",
                        "phone":"18200329222",
                        "loginPassword":"e10adc3949ba59abbe56e057f20f883e",
                        "token":null,
                        "roomIds":[],
                        "online":true,
                        "socketId":"1300745849701273600",
                        "serverId":"200000"
                    },
                    // {
                    //     "id":"1297081179142278888",
                    //     "loginName":"小狗",
                    //     "phone":"18200329111",
                    //     "loginPassword":"e10adc3949ba59abbe56e057f20f883e",
                    //     "token":null,
                    //     "roomIds":[],
                    //     "online":true,
                    //     "socketId":"1300745849701273600",
                    //     "serverId":"200000"
                    // },
                ],
                roomChatText:[
                    {
                        "target_type": "users", //目标类型：用户users，群chatgroups，聊天室chatrooms
                        "target": ["user2"],//目标数组，userId,groupId,roomId
                        "msg": {
                            "type": "txt", // 消息类型 文本txt 图片img 位置loc 语音audio 视频video 文件file
                            "msg": "你好"
                        },
                        "from": "1297081179142270977"
                    },
                    {
                        "target_type": "users",
                        "target": ["user2"],
                        "msg": {
                            "type": "txt", 
                            "msg": "这是个什么东西这是个什么东西个什么东西这是个什么东西这是个什么东西这是个什么东西个什么东西这是个什么东西这是个什么东西这是个什么东西个什么东西这是个什么东西这是个什么东西这是个什么东西个什么东西这是个什么东西这是个什么东西这是个什么东西个什么东西这是个什么东西"
                        },
                        "from": "1297081179142270977"
                    },
                    {
                        "target_type": "users", 
                        "target": ["user2"],
                        "msg": {
                            "type": "txt", 
                            "msg": "这是个吃的"
                        },
                        "from": "user2"
                    },
                    {
                        "target_type": "users",
                        "target": ["user2"],
                        "msg": {
                            "type": "txt", 
                            "msg": "哦哦，知道了"
                        },
                        "from": "1297081179142270977"
                    },
                ],
                oneList:[
                    'asdasdasdasd','阿发发士大夫胜多负少','手动阀手动阀手动阀'
                ]
            }
        },
        created(){
            this.now_user = this.userList[0]
        },
        methods: {
            getChat(val,i){
                this.now_user = val
                this.active = i
                console.log(this.now_user.id)
                if(i==1){
                    this.roomChatText = 
                    [
                        {
                            "target_type": "users", 
                            "target": ["user2"],
                            "msg": {
                                "type": "txt", 
                                "msg": "哎呀，不会了"
                            },
                            "from": "1297081179142277777"
                        },
                        {
                            "target_type": "users",
                            "target": ["user2"],
                            "msg": {
                                "type": "txt", 
                                "msg": "你可以这样，你可以这样，你可以这样，你可以这样，你可以这样，你可以这样，你可以这样，你可以这样，你可以这样，"
                            },
                            "from": "uesr2"
                        },
                        {
                            "target_type": "users", 
                            "target": ["user2"],
                            "msg": {
                                "type": "txt", 
                                "msg": "噢噢噢噢噢噢噢噢噢噢噢噢噢"
                            },
                            "from": "user2"
                        },
                        {
                            "target_type": "users",
                            "target": ["user2"],
                            "msg": {
                                "type": "txt", 
                                "msg": "8888888"
                            },
                            "from": "1297081179142277777"
                        }
                    ]
                }else if(i == 0){
                    this.roomChatText =  [
                        {
                            "target_type": "users", //目标类型：用户users，群chatgroups，聊天室chatrooms
                            "target": ["user2"],//目标数组，userId,groupId,roomId
                            "msg": {
                                "type": "txt", // 消息类型 文本txt 图片img 位置loc 语音audio 视频video 文件file
                                "msg": "你好"
                            },
                            "from": "1297081179142270977"
                        },
                        {
                            "target_type": "users",
                            "target": ["user2"],
                            "msg": {
                                "type": "txt", 
                                "msg": "这是个什么东西这是个什么东西个什么东西这是个什么东西这是个什么东西这是个什么东西个什么东西这是个什么东西这是个什么东西这是个什么东西个什么东西这是个什么东西这是个什么东西这是个什么东西个什么东西这是个什么东西这是个什么东西这是个什么东西个什么东西这是个什么东西"
                            },
                            "from": "1297081179142270977"
                        },
                        {
                            "target_type": "users", 
                            "target": ["user2"],
                            "msg": {
                                "type": "txt", 
                                "msg": "这是个吃的"
                            },
                            "from": "user2"
                        },
                        {
                            "target_type": "users",
                            "target": ["user2"],
                            "msg": {
                                "type": "txt", 
                                "msg": "哦哦，知道了"
                            },
                            "from": "1297081179142270977"
                        },
                    ]
                }
            },
            send(){
                if(this.sendText ==''){
                    this.$message('发送消息不能为空')
                    return
                }
                alert(this.sendText)
            },
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            // 点击快捷回复
            quickRrep(val){
                this.sendText = val
            }
        },
        computed: {
            
        }
    }

</script>

<style scoped lang='less'>
@border-color:#e2e2e2;
#service{
    .box{
        width: 80%;
        min-width: 1100px;
        height: 700px;
        display: flex;
        background: white;
        .people_list{
            flex: .12;
            border-right: 1px solid @border-color;
            box-sizing: border-box;
            background: #f7f7f7;
            overflow-y: scroll;
            ul{
                li{
                    height: 50px;
                    line-height: 50px;
                    padding: 0 10px;
                    cursor: pointer;
                }
                li:hover{
                    background: @border-color;
                }
            }
            &::-webkit-scrollbar {display:none}
            & {scrollbar-width: none;}
            & {-ms-overflow-style: none;}
        }
        .chat{
            flex:.6;
            .record{
                height: 75%;
                border-bottom: 1px solid @border-color;
                box-sizing: border-box;
                
                .username{
                    line-height: 50px;
                    text-align: center;
                    background: #eaeaea;
                }
                .chat_list{
                    overflow-y: scroll;
                    &::-webkit-scrollbar {display:none}
                    & {scrollbar-width: none;}
                    & {-ms-overflow-style: none;}
                    height: calc(100% - 50px);
                }
                .cli{
                    padding:10px 20px;
                    .cmsg{
                        .msg_list{
                            display: flex;
                            padding: 10px 0;
                            position: relative;
                        }
                        .self{
                            text-align: right;
                            // .headImg{
                            //     position: absolute;
                            //     left: 0;
                            //     flex: .08;
                            //     img{
                            //         height: 30px;
                            //         width: 30px;
                            //     }
                            // }
                            // .msg{
                            //     position: absolute;
                            //     flex: .92;
                            //     left: 50px;
                            // }
                            
                        }
                        // .other{
                        //     .headImg{
                        //         position: absolute;
                        //         right: 0;
                        //         flex: .08;
                        //         img{
                        //             height: 30px;
                        //             width: 30px;
                        //         }
                        //     }
                        //     .msg{
                        //         position: absolute;
                        //         flex: .92;
                        //         right: 50px;
                        //     }
                        // }
                        .headImg{
                            flex: .08;
                            img{
                                height: 30px;
                                width: 30px;
                            }
                        }
                        .msg{
                            flex: .92;
                        }
                    }
                }
            }
            
            .text_box{
                height: 25%;
                padding:0 10px;
                .textarea{
                    width: 100%;
                    padding-top: 10px;
                    height: calc(75% - 10px);
                    border: none;
                    resize: none;
                    outline: none;
                }
                .btn_oper{
                    height: 20%;
                    text-align: right;
                }
            }
        }
        /deep/.quick{
            flex: .28;
            background: #f5f5f5;
            border-left: 1px solid @border-color;
            box-sizing: border-box;
            .goods_list{
                height: 100%;
                .one{
                    li{
                        line-height: 40px;
                        cursor: pointer;
                        padding: 0 10px;
                        &:hover{
                            background: @border-color;
                        }
                    }

                }
            }
            // element
            .el-tab-pane{
                height: 420px;
                overflow-y: scroll;
            }
            .el-tab-pane::-webkit-scrollbar {display:none}
            .el-tab-pane {scrollbar-width: none;}
            .el-tab-pane {-ms-overflow-style: none;}
            .el-input__inner{
                border: none;
                font-size: 16px;
                color: #000;
                height: 30px;
                line-height: 30px;
            }
            .el-date-editor{
                width: 120px;
                
            }
            .el-input__prefix{
                display: none;
            }
            .el-tabs__item{
                height: 50px;
                line-height: 50px;
            }
            .el-tabs__nav-wrap{
                padding: 0 10px;
            }
        }
        .active{
            background: @border-color;
        }
    }
}





</style>

