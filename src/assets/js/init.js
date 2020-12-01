export default function init(userInfo,callbacks) {
    if (!userInfo.appKey || !userInfo.token){
        return false;
    }

    //公有云初始化
    RongIMLib.RongIMClient.init(userInfo.appKey);
    var instance = RongIMClient.getInstance();

    //连接状态监听器
    RongIMClient.setConnectionStatusListener({
        onChanged: function (status) {
            // status 标识当前连接状态
            switch (status) {
                case RongIMLib.ConnectionStatus.CONNECTED:
                    console.log('链接成功');
                    break;
                case RongIMLib.ConnectionStatus.CONNECTING:
                    console.log('正在链接');
                    break;
                case RongIMLib.ConnectionStatus.DISCONNECTED:
                    console.log('断开连接');
                    break;
                case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                    console.log('其他设备登录');
                    break;
                case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                    console.log('域名不正确');
                    break;
                case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                    console.log('网络不可用');
                    break;
            }
        }
    });

    // 消息监听器
    RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
            // 判断消息类型
            switch(message.messageType){
                case RongIMClient.MessageType.TextMessage:
                    // message.content.content => 文字内容
                    break;
                case RongIMClient.MessageType.VoiceMessage:
                    // message.content.content => 格式为 AMR 的音频 base64
                    break;
                case RongIMClient.MessageType.ImageMessage:
                    // message.content.content => 图片缩略图 base64
                    // message.content.imageUri => 原图 URL
                    break;
                case RongIMClient.MessageType.LocationMessage:
                    // message.content.latiude => 纬度
                    // message.content.longitude => 经度
                    // message.content.content => 位置图片 base64
                    break;
                case RongIMClient.MessageType.RichContentMessage:
                    // message.content.content => 文本消息内容
                    // message.content.imageUri => 图片 base64
                    // message.content.url => 原图 URL
                    break;
                case RongIMClient.MessageType.InformationNotificationMessage:
                    // do something
                    break;
                case RongIMClient.MessageType.ContactNotificationMessage:
                    // do something
                    break;
                case RongIMClient.MessageType.ProfileNotificationMessage:
                    // do something
                    break;
                case RongIMClient.MessageType.CommandNotificationMessage:
                    // do something
                    break;
                case RongIMClient.MessageType.CommandMessage:
                    // do something
                    break;
                case RongIMClient.MessageType.UnknownMessage:
                    // do something
                    break;
                default:
                    // do something
            }
        }
    });


    //开始链接
    RongIMClient.connect(userInfo.token, {
        onSuccess: function (id) {

            console.log('Connect successfully. ' + userId);
            callbacks.Success && callbacks.Success(id);
        },
        onTokenIncorrect: function () {
            console.log('token无效');
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
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                    info = '不可接受的协议版本';
                    break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                    info = 'appkey不正确';
                    break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                    info = '服务器不可用';
                    break;
            }
            console.log(info);
        }
    });

    //重连
    var callback = {
        onSuccess: function(userId) {
            console.log('Reconnect successfully. ' + userId);
        },
        onTokenIncorrect: function() {
            console.log('token无效');
        },
        onError: function(errorCode){
            console.log(errorcode);
        }
    };
    var config = {
        // 默认 false, true 启用自动重连，启用则为必选参数
        auto: true,
        // 网络嗅探地址 [http(s)://]cdn.ronghub.com/RongIMLib-2.2.6.min.js 可选
        url: 'cdn.ronghub.com/RongIMLib-2.2.6.min.js',
        // 重试频率 [100, 1000, 3000, 6000, 10000, 18000] 单位为毫秒，可选
        rate: [100, 1000, 3000, 6000, 10000]
    };
    RongIMClient.reconnect(callback, config);

}