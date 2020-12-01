<template>
    <div class="chat_room">
        <div class="floating" v-if="$store.state.showChatRoom" @click="showRoom = !showRoom"></div>


        <el-dialog v-dialogDrag center :visible.sync="showRoom" width="65%">
            <div id="service" v-if="showRoom">
                <div class="box">
                    <div class="people_list">
                        <ul>
                            <li :class="active==i?'active':''" @click="getChat(item,i)" v-for="(item,i) in userList" :key="i">
                                {{item.name}}
                            </li>
                        </ul>
                    </div>
                    <div class="chat" v-if="now_user.userId">
                        <div class="record">
                            <div class="username">{{now_user.name}}</div>
                            <div class="chat_list">
                                <div class="cli">
                                    <div class="cmsg" v-for="(item,i) in msgArr" :key="i">
                                        <div class="msg_list" v-if="item.sender == now_user.userId">
                                            <div class="headImg">
                                                <img src="img/4.jpg" alt="">
                                            </div>
                                            <div class="msg">
                                                <div>{{item.body.txt}}</div>
                                            </div>
                                        </div>
                                        <div class="msg_list self" v-else>
                                            <div class="msg self_msg">
                                                <div>{{item.body.txt}}</div>
                                            </div>
                                            <div class="headImg self_img">
                                                <img src="img/3.jpg" alt="">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text_box">
                            <!-- @keyup.enter='send()' -->
                            <textarea class="textarea" v-model="sendText" name="" id=""></textarea>
                            <div class="btn_oper">
                                <el-button type="primary" @click="send()">发送</el-button>
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
            </div>
        </el-dialog>


    </div>
</template>
<script>
import init from "../../assets/js/init";
export default {
    data() {
        return {
            showRoom:false,
            activeName: 'first',
                now_user: {
                    // 当前对话框内用户
                    // {userId,name,onlineTime,offlineTime}
                },
                mySelf: { //我的信息
                    // {userId,name,onlineTime,offlineTime}
                },
                // active:null,//默认需要点击
                active: null,
                sendText: null,//发送的消息
                msgArr: [ //历史消息
                    // { userId, msgType, sender, receiver,bodyType,body{txt,imgIndex,jsonObj,url,lng,lat,address} }
                ],
                msgConf: { //消息配置
                    "MSG_TYPE": {
                        "ADMIN": {"VALUE": 0, "NAME": "系统消息"},
                        "USER": {"VALUE": 1, "NAME": "个人消息"},
                        "GROUP": {"VALUE": 2, "NAME": "群消息"}
                    },
                    "BODY_TYPE": {
                        "TXT": {"VALUE": 0, "NAME": "文本"},
                        "IMG_INDEX": {"VALUE": 1, "NAME": "表情索引"},
                        "JSON_OBJ": {"VALUE": 2, "NAME": "JSON"},
                        "URL_IMG": {"VALUE": 3, "NAME": "图片地址"},
                        "LNG_LAT": {"VALUE": 4, "NAME": "经纬度"},
                        "URL_AUDIO": {"VALUE": 5, "NAME": "音频地址"},
                        "URL_VIDEO": {"VALUE": 6, "NAME": "视频地址"},
                        "URL_FILE": {"VALUE": 7, "NAME": "文件地址"}
                    }
                },
                userList: [ //用户信息
                    {userId:1,name:'亮总'},
                    {userId:2,name:'亮总2号'},
                    {userId:3,name:'亮总3号'},


                ],
                oneList: [
                    '你好，请问有什么问题呢？', '阿发发士大夫胜多负少', '手动阀手动阀手动阀'
                ]
        };
    },
    created(){
        // console.log(init)
    },

    methods: {
        // init(){
        //     let rToken = JSON.parse(localStorage.getItem('userInfo')).rToken 
        //     var userInfo = {
        //         appKey: "82hegw5u8vgdx",
        //         token: rToken
        //     };
        // },
        getChat(val, i) {
            this.now_user = val;
            this.active = i;
        },
        send() {
            if (!this.sendText) {
                this.$message('发送消息不能为空');
                return;
            }
            let data = {
                //消息体,先看类型后取值
                receiver: this.now_user.userId,
                bodyType: this.msgConf.BODY_TYPE.TXT.VALUE,
                txt: this.sendText
                // imgIndex:null,
                // jsonObj:null,
                // lng:"104.069751",
                // lat:"30.652326",
                // address:"四川省成都市锦江区",
                // url:"test.png"
            };
            this.sendText = '';
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        // 点击快捷回复
        quickRrep(val) {
            this.sendText = val;
        }
    },
    mounted() {
        let rToken = JSON.parse(localStorage.getItem('userInfo')).rToken 
        var userInfo = {
            appKey: "82hegw5u8mqwx",
            token:rToken
        };
        console.log(rToken)
        var callbacks = {
            CONNECTED: function(instance) {
                //传入实例参数
                //获取历史消息
                var conversationType = RongIMLib.ConversationType.PRIVATE;
                var targetId = "user2";
                instance.getHistoryMessages(
                    conversationType,
                    targetId,
                    null,
                    20,
                    {
                        onSuccess(list, hasMsg) {
                            console.log(list);
                            //渲染会话列表
                            // this.stat.messageList = list;
                            // return (this.instance = instance);
                        }
                    },
                    null
                );
            },
            Success: function(id) {},
            Received: function(message) {}
        };
        init(userInfo, callbacks);
        // this.scrollEnd();
    },

};
</script>
<style scoped lang='less'>
.chat_room{
    .floating{
        height: 65px;
        width: 65px;
        border-radius: 50%;
        background: url('../../assets/img/kefu.jpg');
        background-size: 100% 100%;
        position: fixed;
        right: 100px;
        top: 80%;
        z-index: 20;
        cursor: pointer;
    }
}
@border-color: #e2e2e2;
#service {
    .box {
        height: 700px;
        display: flex;
        background: white;
        .people_list {
            flex: .12;
            border-right: 1px solid @border-color;
            box-sizing: border-box;
            background: #f7f7f7;
            overflow-y: scroll;
            ul {
                li {
                    height: 50px;
                    line-height: 50px;
                    padding: 0 10px;
                    cursor: pointer;
                }
                li:hover {
                    background: @border-color;
                }
            }
            &::-webkit-scrollbar {
                display: none
            }
            & {
                scrollbar-width: none;
            }
            & {
                -ms-overflow-style: none;
            }
        }
        .chat {
            flex: .6;
            .record {
                height: 75%;
                border-bottom: 1px solid @border-color;
                box-sizing: border-box;

                .username {
                    line-height: 50px;
                    text-align: center;
                    background: #eaeaea;
                }
                .chat_list {
                    overflow-y: scroll;
                    &::-webkit-scrollbar {
                        display: none
                    }
                    & {
                        scrollbar-width: none;
                    }
                    & {
                        -ms-overflow-style: none;
                    }
                    height: calc(100% - 50px);
                }
                .cli {
                    padding: 10px 20px;
                    .cmsg {
                        .msg_list {
                            display: flex;
                            padding: 10px 0;
                            position: relative;
                        }
                        .self {
                            text-align: right;
                        }
                        .headImg {
                            flex: .08;
                            img {
                                height: 35px;
                                width: 35px;
                                border-radius: 4px;
                            }
                        }
                        .msg {
                            flex: .92;
                            width: 200px;
                            div {
                                padding: 10px;
                                border-radius: 10px;
                                color: #f3f3f3;
                                max-width: 400px;
                                display: inline-block;
                                background: #f37b1d;
                            }
                        }
                        .self_img {
                            text-align: right;
                        }
                        .self_msg {
                            div {
                                margin: auto;
                                margin-right: 0;
                                text-align: left;
                                background: #39b54a;
                            }
                        }
                    }
                }
            }

            .text_box {
                height: 25%;
                padding: 0 10px;
                .textarea {
                    width: 100%;
                    padding-top: 10px;
                    height: calc(75% - 10px);
                    border: none;
                    resize: none;
                    outline: none;
                }
                .btn_oper {
                    height: 20%;
                    text-align: right;
                }
            }
        }
        /deep/ .quick {
            flex: .28;
            background: #f9f9f9;
            border-left: 1px solid @border-color;
            box-sizing: border-box;
            .goods_list {
                height: 100%;
                .one {
                    li {
                        line-height: 40px;
                        cursor: pointer;
                        padding: 0 10px;
                        &:hover {
                            background: @border-color;
                        }
                    }

                }
            }
            // element
            .el-tab-pane {
                height: 420px;
                overflow-y: scroll;
            }
            .el-tab-pane::-webkit-scrollbar {
                display: none
            }
            .el-tab-pane {
                scrollbar-width: none;
            }
            .el-tab-pane {
                -ms-overflow-style: none;
            }
            .el-input__inner {
                border: none;
                font-size: 16px;
                color: #000;
                height: 30px;
                line-height: 30px;
            }
            .el-date-editor {
                width: 120px;

            }
            .el-input__prefix {
                display: none;
            }
            .el-tabs__item {
                height: 50px;
                line-height: 50px;
            }
            .el-tabs__nav-wrap {
                padding: 0 10px;
            }
            
        }
        .active {
            background: @border-color;
        }
    }
}
/deep/.el-dialog{
    min-width:850px ;
}
</style>
