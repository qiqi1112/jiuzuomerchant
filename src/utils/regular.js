import Message from "element-ui/packages/message/index.js";
// 手机号码验证
function phone(val) {
    if (!(/^1[3456789]\d{9}$/.test(val))) {
        Message.error('手机号格式不正确，请重新输入');
        return false;
    }
}

//验证金额
function money(val) {
    if (!/^\d+(\.\d{1,2})?$/.test(val)) {
        Message.error("金额有误，请重新输入");
        return false;
    }
}


//身份证验证
function idCard(val) {
    if (!(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(val))) {
        Message.error("身份证号码有误，请重新输入");
        return false;
    }
}

// 邮箱验证
function email(val) {
    if (!(/^([a-zA-Z0-9]+[-_\.]?)+@[a-zA-Z0-9]+\.[a-z]+$/.test(val))) {
        Message.error("邮箱不规范，请重新输入");
        return false;
    }
}
// url验证
function urlText() {
    var sUrl = location.search.toLowerCase();
    var sQuery = sUrl.substring(sUrl.indexOf("=") + 1);
    console.log(sQuery)
    let re = /select|update|delete|truncate|join|union|exec|insert|drop|count|’|"|;|>|<|%/i;
    if (re.test(sQuery)) {
        Message.error("请勿输入非法字符");
        location.href = sUrl.replace(sQuery, "");
    }
}

// input验证
function inputText(oField) {
    let re = /select|update|delete|exec|count|’|"|=|;|>|<|%/i;
    if (re.test(oField.value)) {
        //Message.error("请您不要在参数中输入特殊字符和SQL关键字！"); //注意中文乱码
        oField.value = "";
        oField.className = "errInfo";
        oField.focus();
        return false;
    }
}

// 时间格式化
function timeData(timestamp, type = 1) {
    /* type
        1.年月日时分秒
        2.年月日
        3.年月日时分
        4.时分
        5.年月
    */
    var date = new Date(timestamp); //10位*1000
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (type == 1) return Y + '-' + M + '-' + addZero(D) + ' ' + addZero(h) + ':' + addZero(m) + ':' + addZero(s);
    if (type == 2) return Y + '-' + M + '-' + addZero(D);
    if (type == 3) return Y + '-' + M + '-' + addZero(D) + ' ' + addZero(h) + ':' + addZero(m);
    if (type == 4) return addZero(h) + ':' + addZero(m);
    if (type == 5) return Y + '-' + M;
}

function addZero(num) {
    return num < 10 ? '0' + num : num
}


export default {
    phone,
    idCard,
    email,
    timeData,
    inputText,
}