<template>
    <div id="service">
        <div class="box">
            <div class="people_list">
                <ul>
                    <li :class="active == i ? 'active' : ''" @click="getChat(item, i)" v-for="(item, i) in userList" :key="i">
                        {{ item.user.name }}
                    </li>
                </ul>
            </div>
            <div class="chat" v-if="now_user.user">
                <div class="record">
                    <div class="username">{{ now_user.user.name }}</div>
                    <div class="chat_list">
                        <div class="cli">
                            <div class="cmsg" v-for="(item, i) in msgArr" :key="i">
                                <div class="msg_list" v-if="item.sender == now_user.user.userId">
                                    <div class="headImg">
                                        <img src="img/4.jpg" alt="" />
                                    </div>
                                    <div class="msg">
                                        <div>{{ item.msgBody.str }}</div>
                                    </div>
                                </div>
                                <div class="msg_list self" v-else>
                                    <div class="msg self_msg">
                                        <div>{{ item.msgBody.str }}</div>
                                    </div>
                                    <div class="headImg self_img">
                                        <img src="img/3.jpg" alt="" />
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
                                <li @click="quickRrep(item)" v-for="(item, i) in oneList" :key="i">{{ item }}</li>
                            </ul>
                        </el-tab-pane>
                        <el-tab-pane label="香槟" name="second">清吧</el-tab-pane>
                        <el-tab-pane label="啤酒" name="third">KTV</el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import SocketIO from "socket.io-client";
export default {
    data() {
        return {
            activeName: 'first',
            now_user: {
                // 当前对话框内用户
                // user:{userId,name,phone,serverId},
                // room:{roomNo,maxUser,userCount,isTemp,name,announcement,allowShare,locked,closed,timestamp}
            },
            mySelf: {
                //我的信息
                // userId,name,phone,serverId
            },
            // active:null,//默认需要点击
            active: null,
            sendText: null, //发送的消息
            msgArr: [
                //历史消息
                // {sender, sendType, roomNo, msgBody:{msgType,str,jsonObj,lng,lat,address,url}, timestamp}
            ],
            msgConf: {
                //消息配置
                SEND_TYPE: { SINGLE: { VALUE: 0, NAME: '单聊' }, GROUP: { VALUE: 1, NAME: '群聊' } },
                MSG_TYPE: {
                    TXT: { VALUE: 0, NAME: '文本' },
                    JSON: { VALUE: 1, NAME: 'JSON' },
                    IMG: { VALUE: 2, NAME: '图片' },
                    LOC: { VALUE: 3, NAME: '位置' },
                    AUDIO: { VALUE: 4, NAME: '音频' },
                    VIDEO: { VALUE: 5, NAME: '视频' },
                    FILE: { VALUE: 6, NAME: '文件' }
                }
            },
            userList: [
                //用户信息
                // {
                //      user:{userId,name,phone,serverId},
                //      room:{roomNo,maxUser,userCount,isTemp,name,announcement,allowShare,locked,closed,timestamp}
                // }
            ],
            oneList: ['asdasdasdasd', '阿发发士大夫胜多负少', '手动阀手动阀手动阀']
        };
    },
    created() {
        // this.$socket.disconnect();
    },

    sockets: {
        connect() {
            console.log('连接成功');
        },
        error(reason) {
            console.error('连接错误', reason);
            try {
                reason = JSON.parse(reason);
            } catch (e) {}
            //TODO 重连？ this.$socket.reconnect();
        },
        reconnect() {
            console.log('重新连接');
        },
        disconnect(reason) {
            console.log('断开连接:', reason);
        },
        //当前延迟（毫秒）
        pong(delay) {},
        //登陆结果
        hall_connection_push(data) {
            let {
                sender, //发送者admin或用户id
                sendType, //发送类型0单聊1群聊
                roomNo, //房间号
                msgBody, //消息体
                timestamp //发送时间
            } = data;
            //若为JSON对象数据
            if (msgBody.msgType === this.msgConf.MSG_TYPE.JSON.VALUE) {
                //异常登陆
                if (!`${msgBody.jsonObj.code}`.startsWith('200')) {
                    return console.error(msgBody.jsonObj.msg);
                }
                this.mySelf = msgBody.jsonObj.user;
                //历史消息：注意消息格式{sender, sendType, roomNo, msgBody, timestamp}
                //TODO 可以在消息内容加入未读字段 例如 msgBody.jsonObj.msgArr.foreach(v=>{v.isRead = false});
                this.msgArr.concat(msgBody.jsonObj.msgArr);
            }
        },
        //新用户加入
        hall_user_push(data) {
            console.log('新用户加入', data);
            let {
                sender, //发送者admin或用户id
                sendType, //发送类型0单聊1群聊
                roomNo, //房间号
                msgBody, //消息体 注意判断msgBody.msgType
                timestamp //发送时间
            } = data;
            //若为JSON对象数据
            if (msgBody.msgType === this.msgConf.MSG_TYPE.JSON.VALUE) {
                //异常登陆
                if (`${msgBody.jsonObj.code}`.startsWith('200')) {
                    //TODO 处理用户数据：msgBody.jsonObj.user;
                    //TODO 处理房间数据：msgBody.jsonObj.room;
                    this.userList.push(msgBody.jsonObj);
                }
            }
        },
        //收到消息
        hall_broadcast_push(data) {
            console.log('收到消息', data);
            //放入历史消息
            //TODO 可以在消息内容加入未读字段 例如data.isRead = false
            this.msgArr.push(data);
            // this.roomChatText.push(data)
        },
        //用户离线
        hall_offline_push(data) {
            console.log('用户下线', data);
            let {
                sender, //发送者admin或用户id
                sendType, //发送类型0单聊1群聊
                roomNo, //房间号
                msgBody, //消息体 注意判断msgBody.msgType
                timestamp //发送时间
            } = data;
            //若为JSON对象数据
            if (msgBody.msgType === this.msgConf.MSG_TYPE.JSON.VALUE) {
                //异常登陆
                if (`${msgBody.jsonObj.code}`.startsWith('200')) {
                    //TODO 处理用户数据：msgBody.jsonObj.user;
                    //TODO 建议10秒后自动离开对应房间 this.$socket.emit("hall_leave",{roomNo}); 可释放服务器资源
                }
            }
        },
        //加入房间
        hall_join_push(data) {
            console.log('加入房间', data);
            let {
                sender, //发送者admin或用户id
                sendType, //发送类型0单聊1群聊
                roomNo, //房间号
                msgBody, //消息体 注意判断msgBody.msgType
                timestamp //发送时间
            } = data;
            //若为JSON对象数据
            if (msgBody.msgType === this.msgConf.MSG_TYPE.JSON.VALUE) {
                //异常登陆
                if (`${msgBody.jsonObj.code}`.startsWith('200')) {
                    //TODO 处理用户数据：msgBody.jsonObj.user;
                }
            }
        },
        //离开房间
        hall_leave_push(data) {
            console.log('离开房间', data);
            let {
                sender, //发送者admin或用户id
                sendType, //发送类型0单聊1群聊
                roomNo, //房间号
                msgBody, //消息体 注意判断msgBody.msgType
                timestamp //发送时间
            } = data;
            //若为JSON对象数据
            if (msgBody.msgType === this.msgConf.MSG_TYPE.JSON.VALUE) {
                //异常登陆
                if (`${msgBody.jsonObj.code}`.startsWith('200')) {
                    //TODO 处理用户数据：msgBody.jsonObj.user;
                }
            }
        },
        //错误消息
        hall_error_push(data) {
            let { sender, sendType, roomNo, msgBody, timestamp } = data;
            console.log('操作异常', data);
            if (msgBody.msgType === this.msgConf.MSG_TYPE.JSON.VALUE) {
                console.error(msgBody.jsonObj.msg);
            }
            if (msgBody.msgType === this.msgConf.MSG_TYPE.TXT.VALUE) {
                console.error(msgBody.str);
            }
        }
    },

    mounted() {
        // this.$socket.connect();
    },
    methods: {
        getChat(val, i) {
            this.now_user = val;
            this.active = i;
            console.log(this.mySelf.userId, val.room.roomNo);
        },
        send() {
            if (!this.sendText) {
                this.$message('发送消息不能为空');
                return;
            }
            let data = {
                //消息体,先看类型后取值
                roomNo: this.now_user.room.roomNo,
                msgType: this.msgConf.MSG_TYPE.TXT.VALUE,
                str: this.sendText
                // jsonObj:null,
                // lng:"104.069751",
                // lat:"30.652326",
                // address:"四川省成都市锦江区",
                // url:"test.png"
            };

            this.$socket.emit('hall_broadcast', data);
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
    beforeDestroy() {
        this.$socket.disconnect();
    },
    computed: {}
};
</script>

<style scoped lang='less'>
@border-color: #e2e2e2;
#service {
    .box {
        width: 80%;
        min-width: 1100px;
        height: 700px;
        display: flex;
        background: white;
        .people_list {
            flex: 0.12;
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
                display: none;
            }
            & {
                scrollbar-width: none;
            }
            & {
                -ms-overflow-style: none;
            }
        }
        .chat {
            flex: 0.6;
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
                        display: none;
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
                            flex: 0.08;
                            img {
                                height: 35px;
                                width: 35px;
                                border-radius: 4px;
                            }
                        }
                        .msg {
                            flex: 0.92;
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
            flex: 0.28;
            background: #f5f5f5;
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
                display: none;
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
</style>

