//验证整形
function isInteger(rule, value, callback) {
    if (!Number.isInteger(value)) {
        callback(new Error('请输入整数值'));
    } else {
        callback();
    }
}

function issmoney(price) {
    if (this.$regular.money(price) === false) {
        this.$message.error('请输入正确格式的金额');
    }
}

//验证电话
function isPhone(rule, value, callback) {
    if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号'));
    } else {
        callback();
    }
}

//验证金额
function isMoney(rule, value, callback) {
    if (!/^\d+(\.\d{1,2})?$/.test(value.trim())) {
        callback(new Error('请输入正确的金额（最多保留两位有效小数）'));
    } else {
        callback();
    }
}

//表单验证规则函数
let checkNumber = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('用户手机不能为空'));
        } else {
            callback();
        }
    }
    isPhone(rule, value, callback);
};

let checkMoney = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('消费金额不能为空'));
        } else {
            callback();
        }
    }
    isMoney(rule, value, callback);
};

let checkIsVip = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('是否为本店会员不能为空'));
        } else {
            callback();
        }
    }
    isInteger(rule, value, callback);
};

let checkAANum = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('AA拼单次数不能为空'));
        } else {
            callback();
        }
    }
    isInteger(rule, value, callback);
};

let checkReserveNum = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('预定桌消费次数不能为空'));
        } else {
            callback();
        }
    }
    isInteger(rule, value, callback);
};

let checkRowNum = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('排号次数不能为空'));
        } else {
            callback();
        }
    }
    isInteger(rule, value, callback);
};

let checkVaildNum = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('生效排号次数不能为空'));
        } else {
            callback();
        }
    }
    isInteger(rule, value, callback);
};

let checkCancelNum = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('取消排号次数不能为空'));
        } else {
            callback();
        }
    }
    isInteger(rule, value, callback);
};

let checkEvalNum = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('评价次数不能为空'));
        } else {
            callback();
        }
    }
    isInteger(rule, value, callback);
};

let checkVisitNum = (rule, value, callback) => {
    if (!value) {
        if (value !== 0) {
            return callback(new Error('访问店铺次数不能为空'));
        } else {
            callback();
        }
    }
    isInteger(rule, value, callback);
};

export default {
    issmoney
}