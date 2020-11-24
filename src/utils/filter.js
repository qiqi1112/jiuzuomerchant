import Vue from 'vue';

Vue.filter('editorText', function (data) {
    return data.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ')
})

Vue.filter('removeBlank', function (data) {
    return data.replace(/\s[\x00-\xff]*/g, '')
})


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

//店铺定位
Vue.filter("shopLocaShow", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 1:
            newVal = '夜店';
            break;
        case 2:
            newVal = '清吧';
            break;
        case 3:
            newVal = 'ktv';
            break;
    }
    return newVal;
})

//包间所属
Vue.filter("roomAttr", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case '1':
            newVal = '预定桌';
            break;
        case '2':
            newVal = 'AA拼单';
            break;
    }
    return newVal;
})

//包间属性
Vue.filter("roomType", function (oldVal, ktvTypeOpt) {
    let newVal = '';
    ktvTypeOpt.forEach(item => {
        if (oldVal == item.id) {
            newVal = item.name;
        }
    })
    return newVal;
})

//支付状态
Vue.filter("payStatus", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 0:
            newVal = '已支付';
            break;
        case 1:
            newVal = '待支付';
            break;
        case 2:
            newVal = '未支付';
            break;
    }
    return newVal;
})

//支付类型
Vue.filter("payWay", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 0:
            newVal = '支付宝';
            break;
        case 1:
            newVal = '微信';
            break;
        case 2:
            newVal = '会员积分';
            break;
    }
    return newVal;
})

//订单状态
Vue.filter("orderStatus", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 1:
            newVal = '已接单';
            break;
        case 2:
            newVal = '已拒绝';
            break;
        case 3:
            newVal = '未到店';
            break;
        case 4:
            newVal = '已到店';
            break;
        case 5:
            newVal = '未消费';
            break;
        case 6:
            newVal = '已离开';
            break;
    }
    return newVal;
})

//申请商家推荐状态
Vue.filter("recoType", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 1:
            newVal = '申请商家推荐';
            break;
        case 2:
            newVal = '等待审核';
            break;
        case 3:
            newVal = '申请成功';
            break;
    }
    return newVal;
})

//APP要展示的商品分类
Vue.filter("showAppGoodsType", function (oldVal) {
    let newVal = '';
    switch (oldVal) {
        case 1:
            newVal = '套餐';
            break;
        case 2:
            newVal = '威士忌';
            break;
        case 3:
            newVal = '白兰地';
            break;
        case 4:
            newVal = '伏特加';
            break;
        case 5:
            newVal = '香槟';
            break;
        case 6:
            newVal = '红酒';
            break;
        case 7:
            newVal = '啤酒';
            break;
        case 8:
            newVal = '鸡尾酒';
            break;
        case 9:
            newVal = '小吃';
            break;
        case 10:
            newVal = '其它';
            break;
        case 11:
            newVal = '会员卡';
            break;
    }
    return newVal;
})