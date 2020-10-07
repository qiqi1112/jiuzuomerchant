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
                    //{userId,name,onlineTime,offlineTime}
                ],
                oneList: [
                    '你好，请问有什么问题呢？', '阿发发士大夫胜多负少', '手动阀手动阀手动阀'
                ]
        };
    },
    created(){
        this.$socket.disconnect();
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
        hall_connection_push(result) {
            let {
                code,
                msg,
                data,
            } = result;
            if(code!==200){
                return console.error(msg);
            }
            let {user,history} = data;
            //若为JSON对象数据
            this.mySelf = user;
            for(let msgObj of history){
                if(!!msgObj && msgObj.body){
                    msgObj.body = JSON.parse(msgObj.body);
                }
                this.msgArr.push(msgObj);
            }
        },
        //新用户加入
        hall_new_user_push(result) {
            console.log('新用户加入', result);
            let {
                code,
                msg,
                data,
            } = result;
            if(code!==200){
                return console.error(msg);
            }
            let {user} = data;
            this.userList.push(user);
        },
        //收到消息
        hall_single_push(result) {
            console.log('收到消息', result);
            let {
                code,
                msg,
                data,
            } = result;
            if(code!==200){
                return console.error(msg);
            }
            //放入历史消息
            //TODO 可以在消息内容加入未读字段 例如data.isRead = false
            if(!!data && data.body){
                data.body = JSON.parse(data.body);
            }
            this.msgArr.push(data);
        },
        //用户离线
        hall_offline_push(result) {
            console.log('用户下线', result);
            let {
                code,
                msg,
                data,
            } = result;
            if(code!==200){
                return console.error(msg);
            }
            //TODO 处理用户数据
        },
        //加入房间
        hall_join_push(result) {
            console.log('加入房间', result);
            let {
                code,
                msg,
                data,
            } = result;
            if(code!==200){
                return console.error(msg);
            }

            //TODO 处理用户数据
        },
        //离开房间
        hall_leave_push(result) {
            console.log('离开房间', result);
            let {
                code,
                msg,
                data,
            } = result;
            if(code!==200){
                return console.error(msg);
            }

            //TODO 处理用户数据
        },
        //错误消息
        hall_error_push(result) {
            console.log('操作异常', result);
            let {
                code,
                msg,
                data,
            } = result;
            if(code!==200){
                return console.error(msg);
            }
        }

    },
    methods: {
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

            this.$socket.emit('hall_single', data);
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
        this.$socket.connect();
    },
    beforeDestroy(){
        this.$socket.disconnect();
    },
};
</script>
<style scoped lang='less'>
.chat_room{
    .floating{
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background: blueviolet;
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
