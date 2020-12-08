<template>
    <div class="container" v-loading="wrapLoading">
        <div class="Begintabledetails">
            <div class="crumbs">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item> <i class="el-icon-lx-text"></i> 开台详情 </el-breadcrumb-item>
                </el-breadcrumb>
                <div>
                    <b>楼层</b>
                </div>
                <span></span>
            </div>
            <div>
                <div class="shop-seat">
                    <!-- 左边座位展示 -->
                    <div class="left-box">
                        <!-- 座位行数和列数 -->
                        <p class="input-seat">
                            <label style="margin-right: 30px">
                                座位行数：
                                <el-input-number
                                    :step="1"
                                    step-strictly
                                    :disabled="isReadonly"
                                    v-model="x"
                                    :min="6"
                                    style="width: 120px"
                                    label="行数"
                                    @blur="checkNull(x, '座位行数')"
                                    @change="changeSeatNum"
                                ></el-input-number>
                            </label>
                            <label style="margin-right: 30px">
                                座位列数：
                                <el-input-number
                                    :step="1"
                                    step-strictly
                                    :disabled="isReadonly"
                                    v-model="y"
                                    :min="6"
                                    style="width: 120px"
                                    label="列数"
                                    @blur="checkNull(y, '座位列数')"
                                    @change="changeSeatNum"
                                ></el-input-number>
                            </label>
                        </p>
                        <!-- 座位属性标题 -->
                        <div class="seat-title">
                            <p v-for="(item, index) in seatAttOpt" :key="index">
                                <span :class="item.class"></span>
                                {{ item.name }}
                            </p>
                        </div>
                        <!-- 回显的座位图 -->
                        <div v-if="x && y" class="seat-box" ref="seatBox" :style="{ width: 32 * y + 30 + 'px' }" style="overflow: hidden">
                            <div v-for="(itemY, indexY) in Number(y)" :key="indexY">
                                <div v-for="(itemX, indexX) in Number(x)" :key="indexX">
                                    <span
                                        ref="seatSpan"
                                        :data-indexX="indexX + 1"
                                        :data-indexY="indexY + 1"
                                        class="seat"
                                        @click="changeStauts($event, seatStyle)"
                                        @contextmenu.prevent="changeStauts($event, 'canBook')"
                                    ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 座位属性 -->
                    <div class="right-box">
                        <h4 class="title">开台详情</h4>
                        <div class="padd">
                            <span>预定用户:</span>
                            <el-input :disabled="isReadonly" v-model="presentSeatInfos.contactName" placeholder="预定用户"></el-input>
                        </div>
                        <div class="padd">
                            <span>预定手机:</span>
                            <el-input :disabled="isReadonly" v-model="presentSeatInfos.contactTel" placeholder="预定手机"></el-input>
                        </div>
                        <div class="padd">
                            <span>预定类型:</span>
                            <span>{{ presentSeatInfos.orderType | orderType }}</span>
                        </div>
                        <div class="padd">
                            <span class="small-span">实付金额:</span>
                            <el-input
                                class="smallInp"
                                :disabled="isReadonly"
                                v-model="presentSeatInfos.orderAmount"
                                placeholder="实付金额"
                            ></el-input>
                            <span class="smallSpan">商品原价:</span>
                            <el-input
                                class="smallInps"
                                :disabled="isReadonly"
                                v-model="presentSeatInfos.payableAmount"
                                placeholder="商品原价"
                            ></el-input>
                            <span class="small_span">优惠卷优惠:</span>
                            <el-input
                                class="smallInp"
                                :disabled="isReadonly"
                                v-model="presentSeatInfos.couponAmount"
                                placeholder="优惠卷优惠"
                            ></el-input>
                        </div>
                        <div class="moneyTime time-margin">
                            <span>下单时间:</span>
                            <span>{{ presentSeatInfo.paidTime }}</span>
                        </div>
                        <div class="moneyTime">
                            <span>支付时间:</span>
                            <span>{{ presentSeatInfo.payTime }}</span>
                        </div>
                        <div class="inventory-details" v-if="clickFlag">
                            <span>清单详情:</span>
                            <div class="details">
                                <span class="header"> 座位信息 </span>
                                <div style="display: flex">
                                    <div class="left">
                                        <p>座位号：</p>
                                        <p>容纳人数：</p>
                                        <p>保留时间：</p>
                                        <p>抵消金额：</p>
                                    </div>
                                    <div class="right">
                                        <p>{{ presentSeatInfo.seatCode }}座</p>
                                        <p>{{ presentSeatInfo.numberOfPeople }}人</p>
                                        <p>最晚至 {{ presentSeatInfo.seatLatestReservationTime }}</p>
                                        <p>{{ presentSeatInfo.minAmount | returnFloat }}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="details-two">
                                <span class="header" style="display: inline-block; margin-bottom: 15px"> 酒水清单 </span>
                                <div style="display: flex" v-for="(item, index) in presentSeatInfo.goodsList" :key="index">
                                    <div class="left">
                                        <p>
                                            <span>{{ item.goodsName }}</span>
                                            <span>{{ item.quantity }}</span>
                                        </p>
                                    </div>
                                    <div class="right">
                                        <p>
                                            <span>{{ item.activityPrice | returnFloat }}</span>
                                            <span style="text-decoration: line-through; color: #888; margin-left: 10px">{{
                                                item.originalPrice | returnFloat
                                            }}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="details-two">
                                <span class="header" style="display: inline-block; margin-bottom: 5px"> 优惠卷 </span>
                                <div style="display: flex">
                                    <div class="left">
                                        <p>
                                            <span>{{ presentSeatInfo.details }}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div class="details-two">
                                <div style="display: flex; margin-top: 30px">
                                    <div class="left">
                                        <p>经商家换座：</p>
                                        <p>换座时间：</p>
                                    </div>
                                    <div class="right">
                                        <p>{{ presentSeatInfos.changeSeatStatus }}座</p>
                                        <p>{{ presentSeatInfos.changeSeatTime }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            x: 6, //座位行数
            y: 6, //座位列数
            seatAttOpt: [
                {
                    name: '不可预订',
                    style: 'notBook',
                    class: 'not-book'
                },
                {
                    name: '可预订',
                    style: 'canBook',
                    class: 'can-book'
                },
                {
                    name: '舞台',
                    style: 'stageBook',
                    class: 'stage-book'
                },
                {
                    name: '过道',
                    style: 'aisleBook',
                    class: 'aisle-book'
                }
            ],
            seatStyle: 'canBook', //默认的选座样式
            allSeatDetailInfo: [], //所有座位详细信息
            presentSeatInfo: {}, //当前座位对应的详细信息
            presentSeatInfos: {}, //当前座位对应的详细信息
            isClickSeat: false, //展示当前座位的详细信息开关
            isReadonly: true, //编辑信息开关
            startBussTime: '', //开始营业时间
            endBussTime: '', //结束营业时间
            input: '',
            clickFlag: false
        };
    },
    created() {
        this.getStoreInfo(); //回显所有店铺数据
    },
    methods: {
        //座位行数/列数改变
        changeSeatNum() {
            if (!this.isReadonly && this.x % 1 == 0 && this.y % 1 == 0) {
                this.isClickSeat = false;
                this.createSeatFn(); //创建座位
            } else {
                this.$message.error('请输入整数的列数和行数');
            }
        },
        //座位点击事件
        changeStauts(e, style) {
            this.isClickSeat = true; //展示当前点击的座位的详细信息

            let seatType = style; //座位属性 1-不可预定 2-可预定
            let stageCode = 1; //座位类型 1-普通座位 3-过道 4-舞台

            this.lookEditSeatInfo(e); //查看当前座位信息

            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
            e.target.classList.add('border'); //定位当前座位
        },
        //清空座位外边框（定位当前座位）
        clearSeatBorder() {
            if (this.$refs.seatSpan) {
                this.$refs.seatSpan.forEach((item) => {
                    item.classList.remove('border');
                });
            }
        },
        //查看或编辑当前座位信息
        lookEditSeatInfo(e, seatType, stageCode) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列
            //匹配当前座位信息
            this.allSeatDetailInfo.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    //查看当前座位信息
                    this.presentSeatInfo = item;
                }
            });
            let newObj = this.presentSeatInfo;
            let code = this.presentSeatInfo.seatCode;
            this.$get(`/merchant/store/getInfoBySeat/${code}`).then((res) => {
                if (res.code == 0) {
                    console.log(res)
                    res.data.orderAmount = this.price(res.data.orderAmount);
                    res.data.payableAmount = this.price(res.data.payableAmount);
                    res.data.couponAmount = this.price(res.data.couponAmount);
                    this.presentSeatInfos =  res.data, newObj;
                    this.clickFlag = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },
        //座位属性回显
        showSeatAtt() {
            this.$nextTick(() => {
                if (this.$refs.seatSpan) {
                    //遍历所有座位
                    this.$refs.seatSpan.forEach((item) => {
                        let x = item.dataset.indexx; //行
                        let y = item.dataset.indexy; //列
                        //根据返回的座位数组进行匹配，并替换当前座位的属性
                        this.allSeatDetailInfo.forEach((item2) => {
                            if (item2.seatRow == x && item2.seatColumn == y) {
                                //不可预订
                                if (item2.seatAttribute == 1) {
                                    item.classList.add('notBook');
                                }
                                //可预订
                                if (item2.seatAttribute == 2) {
                                    item.classList.add('canBook');
                                }
                                //过道
                                if (item2.seatType == 3) {
                                    item.classList.add('aisleBook');
                                }
                                //舞台
                                if (item2.seatType == 4) {
                                    item.classList.add('stageBook');
                                }
                            }
                        });
                    });
                }
            });
        },
        //回显店铺数据
        getStoreInfo() {
            this.wrapLoading = true;
            this.$get('/merchant/store/getStoreInfo').then((res) => {
                if (res.code == 0) {
                    console.log(res);
                    let result = res.data;
                    // this.shopId = result.id;
                    let cassette = result.cassette;
                    // this.shopLocaIndex = result.storeLocation;
                    // this.shopTypeArr = result.type.split(',');
                    this.allSeatDetailInfo = result.layoutList;

                    // //获取店铺类型
                    // this.getShopType(result.storeLocation);

                    //回显店铺卡座数量
                    this.getShopSeat(cassette);

                    //对座位信息进行相关转换
                    this.changeLayoutList(this.allSeatDetailInfo);

                    //座位属性回显
                    this.showSeatAtt();

                    this.wrapLoading = false;

                    console.log('当前店铺数据', res.data);
                } else if (res.code === 600) {
                    this.$confirm(res.msg, '提示', {
                        confirmButtonText: '添加门店',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            this.isReadonly = false;
                            this.isLookKtvInfo = true;
                            this.isUpdate = false;

                            //如果有缓存就用缓存里的数据，否则就重新创建座位
                            if (localStorage.getItem('storageInfo')) {
                                this.getStorageInfo(); //获取缓存数据
                            } else {
                                this.createSeatFn(); //创建座位
                            }
                            this.wrapLoading = false;
                        })
                        .catch(() => {
                            this.$router.push('/index');
                        });
                } else if (res.code === 660 || res.code === 700) {
                    this.wrapLoading = false;
                    localStorage.removeItem('userInfo');
                    this.$message.error(res.msg);
                    this.$router.push('/login');
                }
            });
        },
        //回显店铺卡座数量（行和列数量）
        getShopSeat(seat) {
            seat = seat.split('x');
            this.x = seat[0];
            this.y = seat[1];
        },
        //对座位信息进行相关转换
        changeLayoutList(arr) {
            arr.forEach((item) => {
                //将数值型转为字符型（软硬座）
                if (item.softHardStatus) {
                    item.softHardStatus = item.softHardStatus.toString();
                }
            });
        },
        //修改当前座位属性
        setSeatInfo(e, style) {
            e.target.className = style;
        },
        price(value) {
            if (value) {
                var value = Math.round(parseFloat(value) * 100) / 100;
                var xsd = value.toString().split('.');
                if (xsd.length == 1) {
                    value = '￥' + value.toString() + '.00';
                    return value;
                }
                if (xsd.length > 1) {
                    if (xsd[1].length < 2) {
                        value = '￥' + value.toString() + '0';
                    } else {
                        value = '￥' + value.toString();
                    }
                    return value;
                }
            } else {
                return '￥' + 0 + '.' + '00';
            }
        }
    }
};
</script>
<style scoped lang='less'>
.crumbs {
    display: flex;
    justify-content: space-between;
    .el-breadcrumb {
        display: inline-block;
    }
    b {
        font-size: 14px;
        font-weight: normal;
        margin: 0 auto;
    }
}
.el-input {
    width: 160px;
    height: 20px;
}
.time-margin {
    margin-top: 45px;
    margin-bottom: 30px;
}
.moneyTime {
    padding-left: 19px;
    font-size: 14px;
    span {
        &:nth-child(1) {
            margin-right: 55px;
        }
    }
}
.inventory-details {
    font-size: 14px;
    padding-left: 19px;
    display: flex;
    margin-top: 35px;
    flex-wrap: wrap;
    .details {
        margin-left: 57px;
        .header {
            color: #e6a23c;
            background-color: #f0f0f0;
        }
        .left {
            p {
                margin-bottom: 10px;
            }
        }
        .right {
            margin-left: 70px;
            p {
                margin-bottom: 10px;
            }
        }
    }
    .details-two {
        &:nth-child(3) {
            width: 440px;
        }
        &:nth-child(4) {
            width: 440px;
        }
        margin-left: 117px;
        .header {
            color: #e6a23c;
            background-color: #f0f0f0;
        }
        .left {
            p {
                margin-bottom: 10px;
            }
        }
        .right {
            margin-left: 70px;
            p {
                margin-bottom: 10px;
            }
        }
    }
}
.shop-seat {
    display: flex;
    justify-content: center;
    .left-box {
        margin-right: 30px;

        .seat-title {
            display: flex;
            justify-content: space-between;
            width: 400px;
            margin-bottom: 20px;

            > p {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }

            p span {
                display: block;
                width: 20px;
                height: 20px;
                border-radius: 4px;
                background-color: #ddd;
                margin-right: 6px;
                border: 1px solid #ddd;
            }
        }

        .seat-box {
            padding: 20px;
            box-sizing: border-box;
            background-color: #ddd;
            display: flex;

            > div {
                > div {
                    &:last-child {
                        > span {
                            margin-bottom: 0;
                        }
                    }
                }
            }
        }

        .input-seat {
            display: flex;
            margin-bottom: 20px;
        }
    }

    .right-box {
        width: 440px;
        // border: 1px solid #000;
        .title {
            border-left: 3px solid #409eff;
            padding-left: 16px;
        }
    }
    .padd {
        margin-top: 20px;
        padding-left: 19px;
        span {
            font-size: 14px;
            margin-right: 60px;
        }
        .small-span {
            margin-right: 30px;
        }
        .smallSpan {
            margin: 0 30px;
        }
        .smallInp {
            width: 100px;
            height: 40px;
        }
        .smallInps {
            width: 90px;
            margin-right: 20px;
        }
        .small_span {
            margin-right: 16px;
        }
    }
}
.border {
    border: 1px solid #f00 !important;
}
.seat {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: #fff;
    margin-bottom: 10px;
    margin-right: 10px;
    cursor: pointer;
    border: 1px solid #ddd;
}
.not-book {
    background-color: #e6a23c !important;
    border: 1px solid transparent !important;
}

.can-book {
    background-color: #fff !important;
}
.stage-book {
    background-color: #008000 !important;
    border: 1px solid transparent !important;
}

.aisle-book {
    background-color: #999 !important;
    border: 1px solid transparent !important;
}
.notBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid transparent;
    background-color: #e6a23c !important;
    cursor: pointer;
}

.canBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid #ddd;
    background-color: #fff !important;
    cursor: pointer;
}

.stageBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid transparent;
    background-color: #008000 !important;
    cursor: pointer;
}

.aisleBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid transparent;
    background-color: #999 !important;
    cursor: pointer;
}
</style>