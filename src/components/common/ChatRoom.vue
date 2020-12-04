<template>
    <div class="chat_room" id="chat_room">
        <div v-drag class="floating" v-if="$store.state.showChatRoom" @click="showChat"></div>


        <el-dialog v-dialogDrag center :visible.sync="showRoom" width="65%" >
            <div id="service" v-if="showRoom">
                <div class="box">
                    <div class="people_list">
                        <ul>
                            <li class="userList" :class="active==i?'active':''" @click="getChat(item,i)" v-for="(item,i) in userList" :key="i">
                                <img class="head_portrait"  :src="item.portrait" alt="">
                                <span>{{item.name}}</span>
                                <span class="not_read" v-show="item.unreadMessageCount>0 && active != i">{{item.unreadMessageCount}}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="chat" v-if="now_user">
                        <div class="record">
                            <div class="username">{{now_user.name}}</div>
                            <div class="chat_list">
                                <div class="cli">
                                    <div class="cmsg" v-for="(item,i) in msgArr" :key="i">
                                        <div class="msg_list" v-if="item.messageDirection==2">
                                            <div class="headImg">
                                                <img v-if="item.content" :src="imgHead+item.content.portrait" alt="">
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
                                                <img v-if="item.content" :src="imgHead + item.content.portrait" alt="">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="text_box">
                            <!-- @keyup.enter='send()' -->
                            <div class="icons">
                                <div class="flexo">
                                    <img class="send_icon" @click="showEmoji" style="height:20px" src="../../assets/img/emoji.png" alt="">
                                    <div class="emoji_box" v-show="emojiShow">
                                        <div class="emojiItem" v-for="emList in emoji" :key="emList.unicode" v-html="emList.node.outerHTML" @click="selectEmoji(emList)"></div>
                                    </div>
                                </div>
                                <div class="flexo">
                                    <img class="send_icon" style="height:20px" src="../../assets/img/tupian.png" alt="">
                                </div>
                            </div>
                            <!-- @keyup.enter='send()' -->
                            <textarea ref="focusTextarea" class="textarea"  v-html="selectEmojiHtml" v-model="sendText" id=""></textarea>
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

                            <div class="operating_btn">
                                <el-button type="primary" @click="clearConversation" class="btn">清空所有会话列表</el-button>
                                <!-- <el-button type="primary" @click="clearConverHis" class="btn">清除所有会话历史</el-button> -->
                            </div>
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
            selectEmojiHtml: "",
            now_user: "",
            mySelf: { //我的信息
                // {userId,name,onlineTime,offlineTime}
            },
            // active:null,//默认需要点击
            active: null,
            sendText: '',//发送的消息
            msgArr: [ //历史消息
                // { userId, msgType, sender, receiver,bodyType,body{txt,imgIndex,jsonObj,url,lng,lat,address} }
            ],
            moreHistory:true,
            userList: [],
            oneList: [
                '你好，请问有什么问题呢？', 'yuo can do this', 'OK'
            ],
            selfInfo:'',
            emoji:[],
            emojiShow: false,
            hasHistoryMsg:true,
        };
    },


    directives:{
        drag(el,bindings){
            let firstTime = ''
            let lastTime = ''
            el.onmousedown = function(e){
                document.querySelector('.chat_room').setAttribute('drag-flag', false)
                firstTime = new Date().getTime()
                var disx = e.pageX - el.offsetLeft;
                var disy = e.pageY - el.offsetTop;
                document.onmousemove = function (e){
                    el.style.left = e.pageX - disx+'px';
                    el.style.top = e.pageY - disx+'px';
                    lastTime = new Date().getTime()
                    if (lastTime - firstTime > 200) {
                        // console.log('拖拽')
                        document.querySelector('.chat_room').setAttribute('drag-flag', true)
                    }else{
                    }
                }
                document.onmouseup = function(){
                    document.onmousemove = document.onmouseup = null;
                }
            }
        }
    },
    created(){
        this.selfInfo = JSON.parse(localStorage.getItem('userInfo')) 
    },

    computed:{
        watchMsgNum(){
            return this.$store.state.newMsgNum
        }
    },
    watch: {
        watchMsgNum: {
            handler(newValue, oldValue) {
                let that = this
                let arr = [],lastObj=''
                arr = this.$store.state.newMsgArr
                lastObj = arr[arr.length-1]
                // 自定义 更新会话列表 
                let newUser = true  //如果是true   则 是新用户  会话列表中 还没有出现
                for(let i=0;i<this.userList.length;i++){
                    if(this.userList[i].targetId == lastObj.senderUserId){
                        newUser = false   //找到一个相同  证明是已出现过
                        break
                    }
                }
               
                if(newUser){
                    this.$get(`/merchant/store/im/getUserById/${lastObj.targetId}`).then((res) => {
                        if(res.code == 0){
                            lastObj['id'] = res.data.userId
                            lastObj['name'] = res.data.nickname
                            lastObj['portrait'] = this.imgHead + res.data.headPortrait
                            // 获取未读消息条数
                            var conversationType = RongIMLib.ConversationType.PRIVATE;
                            var targetId = lastObj.targetId;
                            RongIMLib.RongIMClient.getInstance().getUnreadCount(conversationType, targetId, {
                                onSuccess: function(count){
                                    lastObj['unreadMessageCount'] = count
                                    that.userList.unshift(lastObj)    
                                },
                                onError: function(){
                                    // that.$message({ message: res.msg, type: 'warning' });
                                }
                            });
                        }else{
                            this.$message({ message: res.msg, type: 'warning' });
                        }
                    });
                    return
                }

                this.$get(`/merchant/store/im/getUserById/${lastObj.senderUserId}`).then((res) => {
                    if(res.code == 0){
                        lastObj.content['id'] = res.data.userId
                        lastObj.content['name'] = res.data.nickname
                        lastObj.content['portrait'] = res.data.headPortrait
                        this.msgArr.push(lastObj)
                        this.$nextTick(this.scrollEnd);
                        // 当前聊天等于消息发送人  清空未读
                        if(lastObj.senderUserId == this.now_user.targetId){
                            this.clearUnreadNum(lastObj.targetId)
                        }
                    }else{
                        this.$message({ message: res.msg, type: 'warning' });
                    }
                   
                });
            },
            deep:true
        }
    },

    methods: {
        showChat(){
            let isClick = document.querySelector('.chat_room').getAttribute('drag-flag');
            if(isClick == 'true') {
                return 
            }       
            this.showRoom = !this.showRoom
            // this.conversation()
        },
        getChat(val, i) {
            this.now_user = val;
            this.active = i;
            this.emojiShow = false;
            this.getAssignHis()
        },
        // 会话列表
        conversation(){
            let that = this
            RongIMClient.getInstance().getConversationList({
                onSuccess: function(list) {
                    let userId = ''
                    list.forEach(v=>{
                        userId = v.targetId 
                        that.$get(`/merchant/store/im/getUserById/${userId}`).then((res) => {
                            if(res.code == 0){
                                v['id'] = res.data.userId
                                v['name'] = res.data.nickname
                                v['portrait'] = that.imgHead + res.data.headPortrait
                                that.userList.push(v)
                            }else{
                                that.$message({ message: '获取会话列表失败，请刷新', type: 'warning' });
                            }
                        });
                    })
                    
                },
                onError: function(error) {
                    // do something
                }
            }, null);
        },
        // 清除 未读消息条数
        clearUnreadNum(userId){
            // 成功获取对话历史后 清空 未读条数
            var conversationType = RongIMLib.ConversationType.PRIVATE;
            var targetId = userId;
            RongIMClient.getInstance().clearUnreadCount(conversationType, targetId, {
                onSuccess: function(){
                    // 清除未读消息成功
                },
                onError: function(error){
                    // that.$message({ message: res.msg, type: 'warning' });
                    // error => 清除未读消息数错误码
                }
            });
        },

        // 获取指定用户的 会话历史
        getAssignHis(){
            let that = this
            // that.msgArr = []
            var conversationType = RongIMLib.ConversationType.PRIVATE; //单聊, 其他会话选择相应的会话类型即可
            var targetId = this.now_user.targetId; // 想获取自己和谁的历史消息，targetId 赋值为对方的 Id
            // RongIMClient.getInstance().resetGetHistoryMessages(RongIMLib.ConversationType.PRIVATE,targetId);
            var timestrap = null; // 默认传 null，若从头开始获取历史消息，请赋值为 0, timestrap = 0;    
            var count = 20; // 每次获取的历史消息条数，范围 0-20 条，可以多次获取
            RongIMLib.RongIMClient.getInstance().getHistoryMessages(conversationType, targetId, timestrap, count, {
                onSuccess: function(list, hasMsg) {
                    console.log(list)
                    that.hasHistoryMsg = hasMsg;
                    let html = "";
                    that.getAssignInfo(that.now_user.targetId,list)
                    that.clearUnreadNum(that.now_user.targetId)
                    // list => Message 数组。
                    // hasMsg => 是否还有历史消息可以获取。
                },
                onError: function(error) {
                    console.log('GetHistoryMessages, errorcode:' + error);
                }
            });
        },

        // 获取指定用户信息
        getAssignInfo(userId,list){
            this.$get(`/merchant/store/im/getUserById/${userId}`).then((res) => {
                if(res.code == 0){
                    let userInfo = res.data
                    list.forEach(v=>{
                        if(v.messageDirection == 2){
                            v.content['id'] = userInfo.id
                            v.content['name'] = userInfo.nickname
                            v.content['portrait'] = userInfo.headPortrait
                        }else if(v.messageDirection == 1){
                            v.content['id'] = this.selfInfo.storeId
                            v.content['name'] = this.selfInfo.storeName
                            v.content['portrait'] = this.selfInfo.logo
                        }
                        this.msgArr.push(v)
                    })
                    this.$nextTick(this.scrollEnd);
                }else{
                    this.$message({ message: res.msg, type: 'warning' });
                }
                
            });
        },

        send() {
            this.emojiShow = false;
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
                        id:this.selfInfo.storeId,
                        name:this.selfInfo.storeName,
                        portrait:this.selfInfo.logo,
                    }
                }
            );
            RongIMClient.getInstance().sendMessage(conversationType, targetId, msg, {
                onSuccess: function (message) {
                    that.sendText = '';
                    message.content['id'] = message.content.user.id
                    message.content['name'] = message.content.user.name
                    message.content['portrait'] = message.content.user.portrait
                    that.msgArr.push(message);
                    that.$nextTick(that.scrollEnd);
                },
                onError: function (errorCode) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default :
                            info = x;
                            break;
                    }
                    console.log('发送失败:' + info);
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

        // 选择表情
        selectEmoji(emoji){
            this.sendText += emoji.emoji;
            // this.emojiShow = false;
        },
        // 展示表情
        showEmoji(){
            this.emojiShow = !this.emojiShow
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
            this.$refs.focusTextarea.focus();
            this.sendText = val;
        },
        clearConversation(){
            let that = this
            this.$confirm('确认清空所有会话', '提示', {
                type: 'warning'
            })
                .then(() => {
                    RongIMClient.getInstance().clearConversations({
                        onSuccess: function() {
                            that.userList = []
                        },
                        onError: function(error) {
                            that.$message({ message: '系统繁忙，请刷新后重试', type: 'warning' });
                        }
                    });
                })
                .catch(() => {});
        },
        // clearConverHis(){
        //     let that = this
        //     this.$confirm('确认清除所有会话消息', '提示', {
        //         type: 'warning'
        //     })
        //         .then(() => {
        //             RongIMClient.getInstance().clearConversations({
        //                 onSuccess: function() {
        //                     that.now_user = ''
        //                 },
        //                 onError: function(error) {
        //                     that.$message({ message: '系统繁忙，请刷新后重试', type: 'warning' });
        //                 }
        //             });
        //         })
        //         .catch(() => {});
        // }
    },
    mounted() {
        let rToken = JSON.parse(localStorage.getItem('userInfo')).rToken 

        if(!JSON.parse(localStorage.getItem('userInfo'))){
            return
        }
        var userInfo = {
            appKey: "82hegw5u8vgdx",
            token:rToken
        };
        // // 获取会话列表
        var callbacks = {};
        init(userInfo, callbacks);

        setTimeout(()=>{
            this.conversation()
            this.emoji = RongIMLib.RongIMEmoji.list
        },1000)
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
        position: relative;
        .not_read{
            position: absolute;
            right: 8px;
            background: #ff4e4e;
            padding: 0 4px;
            border-radius: 50%;
            display: inline-block;
            height: 16px;
            font-size: 12px;
            line-height: 16px;
            color: white;
            top: calc(50% - 8px);
        }
        .head_portrait{
            height: 40px;
            width: 40px;
            object-fit: cover;
            border-radius: 4px;
            margin-right: 10px;
            font-size: 0;
            vertical-align: middle;
        }
    }
    .box {
        height: 730px;
        display: flex;
        background: white;
        .people_list {
            flex: .2;
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
            flex: .52;
            .record {
                height: 72%;
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
                height: 28%;
                padding: 0 10px;
                .icons{
                    padding-top: 10px;
                    font-size: 0;
                    .flexo{
                        display: inline-block;
                        margin-right: 10px;
                        position: relative;
                        .emoji_box{
                            background: #fff;
                            z-index: 20;
                            border-radius: 4px;
                            box-shadow: 0 0 2px #bbbbbb;
                            width: 310px;
                            height: 100px;
                            position: absolute;
                            left: 0;
                            top: -132px;
                            overflow-y: scroll;
                            font-size: 14px;
                            padding: 12px;
                            .emojiItem{
                                display: inline-block;
                                cursor: pointer;
                                margin: 0 2px;
                            }
                        }
                        .emoji_box::-webkit-scrollbar {
                            display: none;
                        }
                        .emoji_box {
                            scrollbar-width: none;
                        }
                        .emoji_box {
                            -ms-overflow-style: none;
                        }
                    }
                }
                .send_icon{
                    height: 20px;
                    width: 20px;
                    object-fit: cover;
                    cursor: pointer;
                }
                .textarea {
                    width: 100%;
                    padding-top: 10px;
                    height: calc(75% - 30px);
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
                .operating_btn{
                    padding-left:10px ;
                    button{
                        margin-bottom: 12px;
                        margin-left: 0;
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
