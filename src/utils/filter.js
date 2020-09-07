import Vue from 'vue';

//手机号
Vue.filter("phoneNum", function (oldVal) {
    let newVal = oldVal.replace(oldVal.slice(3, 7), "****");
    return newVal;
});

//店铺类型
Vue.filter("shopType", function (oldVal) {
    let newVal = "";
    switch (oldVal) {
        case 1:
            newVal = "夜店";
            break;
        case 2:
            newVal = "清吧";
            break;
        case 3:
            newVal = "ktv";
            break;
    }
    return newVal;
});

//座位类型
Vue.filter("seatType", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 0:
            newVal = '无要求';
            break;
        case 1:
            newVal = '软座';
            break;
        case 2:
            newVal = '硬座';
            break;
    }
    return newVal;
})

//星期几
Vue.filter("dayOfWeek", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 1:
            newVal = '星期一';
            break;
        case 2:
            newVal = '星期二';
            break;
        case 3:
            newVal = '星期三';
            break;
        case 4:
            newVal = '星期四';
            break;
        case 5:
            newVal = '星期五';
            break;
        case 6:
            newVal = '星期六';
            break;
        case 7:
            newVal = '星期日';
            break;
    }
    return newVal;
})

//座位类型
Vue.filter("conType", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 0:
            newVal = '预定桌';
            break;
        case 1:
            newVal = 'AA拼单';
            break;
    }
    return newVal;
})

//是否为会员与收藏本店
Vue.filter("yesOrNo", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 0:
            newVal = '否';
            break;
        case 1:
            newVal = '是';
            break;
    }
    return newVal;
})

//支付方式
Vue.filter("payType", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 0:
            newVal = '支付宝支付';
            break;
        case 1:
            newVal = '微信支付';
            break;
        case 2:
            newVal = '会员卡支付';
            break;
        case 3:
            newVal = '优惠券支付';
            break;
        case 4:
            newVal = '现金支付';
            break;
    }
    return newVal;
})