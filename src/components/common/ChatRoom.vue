<template>
    <div class="chat_room">
        <div class="floating" v-if="$store.state.showChatRoom" @click="showChat"></div>


        <el-dialog v-dialogDrag center :visible.sync="showRoom" width="65%">

            
            <div id="service" v-if="showRoom">
                <div class="box">
                    <div class="people_list">
                        <ul>
                            <li class="userList" :class="active==i?'active':''" @click="getChat(item,i)" v-for="(item,i) in userList" :key="i">
                                <template v-if="item.latestMessage.content.user">
                                    {{item.latestMessage.content.user.name}}
                                </template>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="chat" v-if="now_user != {}">
                        <div class="record">
                            <div class="username" v-if="now_user_name">{{now_user_name}}</div>
                            <div class="chat_list">
                                <div class="cli">
                                    <div class="cmsg" v-for="(item,i) in msgArr" :key="i">
                                        <div class="msg_list" v-if="item.messageDirection==2">
                                            <div class="headImg">
                                                <img v-if="item.content.user" :src="item.content.user.portrait" alt="">
                                            </div>
                                            <!-- 文本消息 -->
                                            <div class="msg" v-if="item.messageType == 'TextMessage'">
                                                <div>{{item.content.content}}</div>
                                            </div>
                                            <!-- 图片 -->
                                            <div class="msg" v-if="item.messageType == 'ImageMessage'">
                                                <img class="msg_picture" v-if="item.content" :src="item.content.imageUri" alt="">
                                            </div>
                                        </div>
                                        <div class="msg_list self" v-else>
                                            <div class="msg self_msg"  v-if="item.messageType == 'TextMessage'">
                                                <div>{{item.content.content}}</div>
                                            </div>
                                            <div class="msg self_msg"  v-if="item.messageType == 'ImageMessage'">
                                                <img class="msg_picture" v-if="item.content" :src="item.content.imageUri" alt="">
                                            </div>
                                            <div class="headImg self_img">
                                                <img v-if="item.content.user" :src="imgHead + item.content.user.portrait" alt="">
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
                                <el-tab-pane label="快捷回答" name="first">
                                    <ul class="one">
                                        <li @click="quickRrep(item)" v-for="(item,i) in oneList" :key="i">{{item}}</li>
                                    </ul>
                                </el-tab-pane>
                                <!-- <el-tab-pane label="香槟" name="second">清吧</el-tab-pane>
                                <el-tab-pane label="啤酒" name="third">KTV</el-tab-pane> -->
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
            imgHead: this.$imgHead,
            showRoom:false,
            activeName: 'first',
            now_user: {
                // 当前对话框内用户
                // {userId,name,onlineTime,offlineTime}
            },
            now_user_name:'',
            mySelf: { //我的信息
                // {userId,name,onlineTime,offlineTime}
            },
            // active:null,//默认需要点击
            active: null,
            sendText: null,//发送的消息
            msgArr: [ //历史消息
                // { userId, msgType, sender, receiver,bodyType,body{txt,imgIndex,jsonObj,url,lng,lat,address} }
            ],
            moreHistory:true,
            userList: [],
            oneList: [
                '你好，请问有什么问题呢？', 'yuo can do this', '好的，亲'
            ],
            selfInfo:'',

            num:this.$store.state.newMsgNum,
            // {{$store.state.newMsgArr}}
            
        };
    },
    created(){
        this.selfInfo = JSON.parse(localStorage.getItem('userInfo')) 
    },
    watch: {
        num: {
            handler(newValue, oldValue) {
                console.log(this.$store.state.newMsg)
            }
        }
    },

    methods: {
        showChat(){
            this.showRoom = !this.showRoom
            this.conversation()
        },
        getChat(val, i) {
            this.now_user = val.latestMessage;
            this.now_user_name = val.latestMessage.content.user.name
            this.active = i;
            this.getAssignHis()
        },

        // 获取指定用户的 会话历史
        getAssignHis(){
            let that = this
            // if(!this.moreHistory)return
            var conversationType = RongIMLib.ConversationType.PRIVATE; //单聊, 其他会话选择相应的会话类型即可
            var targetId = this.now_user.targetId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
            var timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;
            var count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
            RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
                onSuccess: function(list, hasMsg) {
                    console.log(list)
                    that.moreHistory = hasMsg
                    list.forEach(v=>{
                        that.msgArr.push(v)
                    })

                    that.$nextTick(that.scrollEnd);
                    // console.log(that.msgArr)
                   
                    // list => Message 数组。
                    // hasMsg => 是否还有历史消息可以获取。
                },
                onError: function(error) {
                    console.log('GetHistoryMessages, errorcode:' + error);
                }
            });
        },

        send() {
            let that = this
            if (!this.sendText) {
                this.$message('发送消息不能为空');
                return;
            }
            // var msg = new RongIMLib.TextMessage({
            //     content: this.sendText,
            //     extra: "附加信息"
            // });
            // 自定义消息
            var messageName = 'PersonMessage'; // 消息名称
            var objectName = 'RC:TxtMsg'; // 消息内置名称，请按照此格式命名
            var isCounted = true; // 消息计数
            var isPersited = true; // 消息保存
            var mesasgeTag = new RongIMLib.MessageTag(isCounted, isPersited); // 消息是否保存是否计数，true true 计数且保存，false false 不计数不保存
            var prototypes = ['content', 'extra', 'messageName','user']; // 消息类中的属性名
            RongIMClient.registerMessageType(messageName, objectName, mesasgeTag, prototypes);


            var conversationType = RongIMLib.ConversationType.PRIVATE; //单聊, 其他会话选择相应的会话类型即可
            var targetId = this.now_user.targetId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
            var msg = new RongIMClient.RegisterMessage.PersonMessage(
                { 
                    content: this.sendText, 
                    extra: '',
                    messageName:'TextMessage',
                    user:{
                        id:this.selfInfo.storeId || 123456,
                        name:this.selfInfo.storeName,
                        portrait:this.selfInfo.logo,
                    }
                }
            );
            RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                onSuccess: function (message) {
                    that.sendText = '';
                    that.msgArr.push(message);
                    that.$nextTick(that.scrollEnd);
                },
                onError: function (errorCode) {
                    console.log('发送自定义消息失败');
                }
            });
            // 自定义消息 end
            return
            // var conversationType = RongIMLib.ConversationType.PRIVATE;
            // var targetId = this.now_user.userId;
            // RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
            //     // 发送消息成功
            //     onSuccess: function(message) {
            //         that.sendText = '';
            //         that.msgArr.push(message);
            //         that.$nextTick(that.scrollEnd);
            //     },
            //     onError: function (errorCode,message) {
            //         showResult("发送文字消息 失败",message,start);
            //     }
            // });
        },
        scrollEnd: function() {
            var list = document.querySelectorAll(".cmsg");
            if (list.length > 1) {
                var last = list[list.length - 1];
                last.scrollIntoView();
            }
        },
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        // 点击快捷回复
        quickRrep(val) {
            this.sendText = val;
        },
        // 会话列表
        conversation(){
            let that = this
            RongIMClient.getInstance().getConversationList({
                onSuccess: function(list) {
                    that.userList = list 
                    console.log(that.userList)
                },
                onError: function(error) {
                    // do something
                }
            }, null);
        },
    },
    mounted() {
        let rToken = JSON.parse(localStorage.getItem('userInfo')).rToken 
        var userInfo = {
            appKey: "82hegw5u8vgdx",
            token:rToken
        };
        // // 获取会话列表
        var callbacks = {};
        init(userInfo, callbacks);

//         RongIMClient.getInstance().clearConversations({
//     onSuccess: function() {
//       // 清除会话成功
//     },
//     onError: function(error) {
//       // error => 清除会话错误码
//     }
// });
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
    .msg_picture{
        width: 200px;
        height: auto;
    }
}
@border-color: #e2e2e2;
#service {
    .userList{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
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
                            min-width: 50px;
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
