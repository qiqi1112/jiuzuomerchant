<template>
    <div class="container" v-loading="wrapLoading">
        <div class="Begintabledetails">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-text"></i> 开台详情 </el-breadcrumb-item>
            </el-breadcrumb>
            <div class="crumbs">
                <div>
                    <span>楼层</span>
                    <el-button
                        v-for="(item, index) in floorList"
                        :key="index"
                        :type="nowFloor == item.floor ? 'primary' : ''"
                        @click="changeShowFloor(item, index)"
                        class="add-floor"
                        >{{ item.floor }}</el-button
                    >
                </div>
                <span></span>
            </div>
            <div>
                <div class="shop-seat">
                    <!-- 左边座位展示 -->
                    <div class="left-box">
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
                                        :title="itemX + '-' + itemY"
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
                    <!-- v-if="clickFlag" -->
                    <div class="right-box">
                        <h4 class="title">开台详情:</h4>
                        <div class="middleBox">
                            <div class="newLeft">
                                <div class="padd">
                                    <span>预定用户:</span>
                                    <el-input
                                        :disabled="isReadonly"
                                        v-model="presentSeatInfos.contactName"
                                        placeholder="预定用户..."
                                    ></el-input>
                                </div>
                                <div class="padd">
                                    <span>预定手机:</span>
                                    <el-input
                                        :disabled="isReadonly"
                                        v-model="presentSeatInfos.contactTel"
                                        placeholder="预定手机..."
                                    ></el-input>
                                </div>
                                <div class="order-num">
                                    <span>订单号:</span>
                                    <el-input :disabled="isReadonly" v-model="presentSeatInfos.orderNo" placeholder="订单号..."></el-input>
                                </div>
                                <div class="order-num">
                                    <span>预定备注信息:</span>
                                    <el-input
                                        :disabled="isReadonly"
                                        v-model="presentSeatInfos.remarks"
                                        placeholder="预定备注信息..."
                                        type="textarea"
                                        resize="none"
                                        :rows="4"
                                    ></el-input>
                                </div>
                                <div class="padd">
                                    <span>预定类型:</span>
                                    <span>{{ presentSeatInfos.orderType | orderType }}</span>
                                </div>
                                <div class="padd">
                                    <span>支付状态:</span>
                                    <span>{{ presentSeatInfos.payStatus | payStatus }}</span>
                                </div>
                                <div class="padd">
                                    <span>支付方式:</span>
                                    <span>{{ presentSeatInfos.payWay | payWay }}</span>
                                </div>
                                <div class="padd">
                                    <div>
                                        <span class="small-span">实付金额:</span>
                                        <el-input
                                            class="smallInpss"
                                            :disabled="isReadonly"
                                            v-model="presentSeatInfos.paidAmount"
                                            placeholder="实付金额..."
                                        ></el-input>
                                    </div>
                                    <div>
                                        <span class="small-span">商品原价:</span>
                                        <el-input
                                            class="smallInps"
                                            :disabled="isReadonly"
                                            v-model="presentSeatInfos.payableAmount"
                                            placeholder="商品原价..."
                                        ></el-input>
                                    </div>
                                    <div>
                                        <span class="small_span">优惠券优惠:</span>
                                        <el-input
                                            class="smallInp"
                                            :disabled="isReadonly"
                                            v-model="presentSeatInfos.couponAmount"
                                            placeholder="优惠券优惠."
                                        ></el-input>
                                    </div>
                                </div>
                                <div class="moneyTime time-margin">
                                    <span>下单时间:</span>
                                    <span>{{ presentSeatInfos.createTime }}</span>
                                </div>
                                <div class="moneyTime">
                                    <span>支付时间:</span>
                                    <span>{{ presentSeatInfos.payTime }}</span>
                                </div>
                            </div>

                            <div class="inventory-details">
                                <h3>清单详情:</h3>
                                <div class="right-details">
                                    <div class="details">
                                        <span class="headers">座位信息</span>
                                        <div style="display: flex">
                                            <div class="left">
                                                <p>座位号：</p>
                                                <p>容纳人数：</p>
                                                <p>保留时间：</p>
                                                <p>低消金额：</p>
                                                <p>座位类型：</p>
                                            </div>
                                            <div class="right">
                                                <p>
                                                    <span v-show="presentSeatInfo.seatCode">{{ presentSeatInfo.seatCode + '座' }}</span>
                                                </p>
                                                <p>
                                                    <span v-show="presentSeatInfo.numberOfPeople">{{
                                                        presentSeatInfo.numberOfPeople + '人'
                                                    }}</span>
                                                </p>
                                                <p>
                                                    <span v-show="presentSeatInfo.seatLatestReservationTime">{{
                                                        '最晚至' + presentSeatInfo.seatLatestReservationTime
                                                    }}</span>
                                                </p>
                                                <p>{{ presentSeatInfos.minAmount || presentSeatInfo.minConsumption }}</p>
                                                <p>{{ presentSeatInfo.softHardStatus | seatType }}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="details-two WineList">
                                        <span class="headers" style="display: inline-block; margin-bottom: 15px">酒水清单</span>
                                        <div
                                            style="display: flex; justify-content: space-between; flex-wrap: nowrap"
                                            v-for="(item, index) in presentSeatInfos.goodsList"
                                            :key="index"
                                        >
                                            <div class="left water-left">
                                                <p>
                                                    <span>{{ item.goodsName }}</span>
                                                    <br />

                                                    <span>× {{ item.quantity }}</span>
                                                </p>
                                            </div>
                                            <div class="right">
                                                <p style="margin-left: -165px">
                                                    <span>{{ item.activityPrice | returnFloat }}</span>
                                                    <span style="text-decoration: line-through; color: #888; margin-left: 10px">
                                                        {{ item.originalPrice | returnFloat }}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="details-two">
                                        <span class="headers" style="display: inline-block; margin: 15px 0">追加酒水清单</span>
                                        <div class="list-box add-drinks">
                                            <div class="add-drink-list" v-for="(item, index) in presentSeatInfos.groupGoods" :key="index">
                                                <div class="order-title">
                                                    <span>{{ item.groupName }}</span>
                                                    <span>{{ item.createTime }}</span>
                                                </div>

                                                <div class="drink-list" v-for="(item2, index2) in item.goodsList" :key="index2">
                                                    <div class="good-box">
                                                        <div class="good-name">
                                                            <span>{{ item2.goodsName }}</span>
                                                            <br />
                                                            <span class="num">x{{ item2.quantity }}</span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span>￥{{ item2.activityPrice }}</span>
                                                        <span class="unline">￥{{ item2.originalPrice }}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <el-button
                                                        :disabled="true"
                                                        v-if="item.servedStatus == 0 || item.servedStatus == 1"
                                                        type="primary"
                                                        >{{ item.servedStatus == 1 ? '已上桌' : '上桌' }}</el-button
                                                    >
                                                    <el-button
                                                        :disabled="true"
                                                        v-if="item.servedStatus == 0 || item.servedStatus == 2"
                                                        type="danger"
                                                        >{{ item.servedStatus == 2 ? '已售罄' : '售罄' }}</el-button
                                                    >
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="details-two">
                                        <span class="headers" style="display: inline-block; margin-bottom: 5px">优惠券</span>
                                        <div style="display: flex">
                                            <div class="left omit" style="width: 100%">
                                                <p>
                                                    平台优惠券：
                                                    <span>{{ presentSeatInfos.appDetails || '暂无' }}</span>
                                                </p>
                                                <p>
                                                    商家优惠券：
                                                    <span>{{ presentSeatInfos.storeDetails || '暂无' }}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="details-two">
                                        <div style="display: flex; margin-top: 30px">
                                            <div class="left">
                                                <p style="white-space: nowrap">经商家换座：</p>
                                                <p>换座时间：</p>
                                                <p>占座时间：</p>
                                            </div>
                                            <div class="right" style="margin-left: 0">
                                                <p>{{ presentSeatInfos.changeSeat || '暂无' }}</p>
                                                <p>{{ presentSeatInfos.changeSeatTime || '暂无' }}</p>
                                                <p>{{ presentSeatInfos.occupySeatTime || '暂无' }}</p>
                                            </div>
                                        </div>
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
                    name: '禁用',
                    style: 'lock-book',
                    class: 'lock-book'
                },
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
                    name: '已预订',
                    style: 'isBook',
                    class: 'is-book'
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
            floorList: [],
            list: [],
            seatStyle: 'canBook', //默认的选座样式
            allSeatDetailInfo: [], //所有座位详细信息
            presentSeatInfo: {}, //当前座位对应的详细信息
            presentSeatInfos: {}, //当前座位对应的详细信息
            isClickSeat: false, //展示当前座位的详细信息开关
            isReadonly: true, //编辑信息开关
            startBussTime: '', //开始营业时间
            endBussTime: '', //结束营业时间
            input: '',
            // clickFlag: false,
            nowFloor: '', //当前正在操作的楼层
            wrapLoading: true
        };
    },
    watch: {
        watchOnloadOrder: {
            handler(val) {
                this.getStoreInfo();
            },
            deep: true
        }
    },

    computed: {
        watchOnloadOrder() {
            return this.$store.state.onloadOrder;
        }
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

            //修改当前座位的属性（座位颜色）
            if (!this.isReadonly) {
                switch (seatType) {
                    case 'notBook':
                        seatType = 1;
                        break;
                    case 'canBook':
                        seatType = 2;
                        break;
                    case 'stageBook':
                        seatType = 1;
                        stageCode = 4;
                        break;
                    case 'aisleBook':
                        seatType = 1;
                        stageCode = 3;
                        break;
                }
                this.setSeatInfo(e, style); //修改当前座位属性
                this.lookEditSeatInfo(e, seatType, stageCode); //编辑当前座位信息
            } else {
                this.lookEditSeatInfo(e); //查看当前座位信息
            }

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
        lookEditSeatInfo(e, seatType, stageCode) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            this.list.forEach((item) => {
                if (item.floor === this.nowFloor) {
                    // item.layoutList.forEach((item2) => {
                    if (item.floor == item.floor && item.seatRow == seatRow && item.seatColumn == seatColumn) {
                        //查看当前座位信息
                        console.log(item);
                        this.presentSeatInfo = item;
                        let newObj = this.presentSeatInfo;
                        let code = this.nowFloor + '-' + this.presentSeatInfo.seatCode;
                        this.$get(`/merchant/store/getInfoBySeat/${code}`).then((res) => {
                            // console.log(res);
                            if (res.code == 0) {
                                if (res.data) {
                                    res.data.paidAmount = this.price(res.data.paidAmount);
                                    res.data.payableAmount = this.price(res.data.payableAmount);
                                    res.data.couponAmount = this.price(res.data.couponAmount);
                                    (this.presentSeatInfos = res.data), newObj;
                                    // this.clickFlag = true;
                                    console.log(this.presentSeatInfos);
                                } else {
                                    this.presentSeatInfos = [];
                                }
                            } else {
                                this.$message.error(res.msg);
                            }
                        });
                    }
                    // });
                }
            });
        },
        //座位属性回显1
        showSeatAtt(index) {
            this.$nextTick(() => {
                if (this.$refs.seatSpan) {
                    //遍历所有座位
                    this.$refs.seatSpan.forEach((item) => {
                        let x = item.dataset.indexx; //行
                        let y = item.dataset.indexy; //列
                        //根据返回的楼层对应的座位数组进行匹配，并替换当前座位的属性
                        this.list.forEach((item2) => {
                            if (item2.floor == this.nowFloor && item2.seatRow == x && item2.seatColumn == y) {
                                //禁用
                                if (item2.seatAttribute == 0) {
                                    item.className = `seat lockBook`;
                                }
                                //不可预订
                                if (item2.seatAttribute == 1) {
                                    item.className = `seat notBook`;
                                }
                                //可预订
                                if (item2.seatAttribute == 2) {
                                    item.className = `seat canBook`;
                                }
                                //已预订
                                if (item2.seatAttribute == 3 || item2.seatAttribute == 4) {
                                    item.className = `seat isBook`;
                                }
                                //过道
                                if (item2.seatType == 3) {
                                    item.className = `seat aisleBook`;
                                }
                                //舞台
                                if (item2.seatType == 4) {
                                    item.className = `seat stageBook`;
                                }
                            }
                        });
                    });
                }
            });
        },
        //回显每个座位号时，不要带上楼层号1
        substrSeatNum() {
            this.list.forEach((item) => {
                const index = item.seatCode.indexOf('-');
                if (index !== -1) {
                    item.seatCode = item.seatCode.substr(index + 1);
                }
            });
        },
        //回显店铺数据
        getStoreInfo() {
            this.$post('/merchant/store/getStoreSeat').then((res) => {
                if (res.code == 0) {
                    console.log(res);
                    this.wrapLoading = false;
                    let result = res.data;
                    this.floorList = result.storeSeatFloorDTOS;
                    this.list = result.storeSeatDTOS;
                    //回显第一楼店铺卡座数量
                    this.getShopSeat(0);
                    //默认展示的楼层为第一楼
                    this.nowFloor = this.list[0].floor;
                    console.log(this.nowFloor);
                    //座位属性回显
                    this.showSeatAtt(0);
                    //回显每个座位号时，不要带上楼层号
                    this.substrSeatNum();
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
                            this.$router.push('/myshop');
                        });
                } else if (res.code === 660 || res.code === 700) {
                    this.wrapLoading = false;
                    localStorage.removeItem('userInfo');
                    this.$message.error(res.msg);
                    this.$router.push('/login');
                }
            });
        },
        //切换楼层，楼层对应的行列跟着切换1
        changeShowFloor(item, index) {
            this.wrapLoading = true;
            this.isClickSeat = false;
            this.nowFloor = item.floor; //当前操作的楼层
            this.$post('/merchant/store/getStoreSeat', { floor: this.nowFloor }).then((res) => {
                console.log(res);
                if (res.code === 0) {
                    this.wrapLoading = false;
                } else {
                    this.wrapLoading = false;
                    this.$message.error(res.msg);
                }
                let result = res.data;
                // this.floorList = result.storeSeatFloorDTOS
                this.list = result.storeSeatDTOS;
                //回显第一楼店铺卡座数量
                this.getShopSeat(index);
                //默认展示的楼层为第一楼
                this.nowFloor = this.list[0].floor;
                // console.log(this.nowFloor)
                //座位属性回显
                this.showSeatAtt(index);
                //回显每个座位号时，不要带上楼层号
                this.substrSeatNum();
            });
            // this.getShopSeat(index);
            // this.showSeatAtt(index);
            // this.clickFlag = false;
            this.presentSeatInfo = '';
            this.presentSeatInfos = '';
        },
        //回显店铺卡座数量（行和列数量）1
        getShopSeat(index) {
            this.x = this.list[this.list.length - 1].seatRow;
            this.y = this.list[this.list.length - 1].seatColumn;
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
.add-floor {
    margin-left: 10px;
}
.crumbs {
    display: flex;
    margin: 20px 0;
    // justify-content: space-between;
    align-items: center;
    .el-breadcrumb {
        display: inline-block;
    }

    span {
        font-size: 14px;
        margin: 0 auto;
    }
}
.el-input {
    width: 115px;
    height: 20px;
}
.time-margin {
    margin-top: 45px;
    margin-bottom: 5px;
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
    width: 435px;
    margin-top: -20px;
    h3 {
        display: inline-block;
        height: 18px;
    }
    .right-details {
        margin-top: 10px;
    }
    .details {
        // margin-left: 57px;
        .headers {
            color: #e6a23c;
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
                height: 19px;
            }
        }
    }
    .WineList {
        padding-bottom: 10px;
    }
    .details-two {
        width: 315px;
        .omit {
            p {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .water-left {
            height: 35px;
        }

        &:nth-child(3) {
            border-top: 1px solid #000;
            // border-bottom: 1px solid #000;
        }
        &:nth-child(3) {
            width: 315px;
        }
        &:nth-child(4) {
            width: 315px;
        }
        // margin-left: 117px;
        .headers {
            color: #e6a23c;
        }
        .left {
            width: 48%;
            overflow: hidden;
            p {
                margin-bottom: 10px;
                height: 19px;
                // white-space: nowrap;
            }
        }
        .right {
            margin-left: 70px;
            p {
                margin-bottom: 10px;
                white-space: nowrap;
                height: 19px;
            }
        }
        .list-box {
            margin-bottom: 18px;
            border-bottom: 1px solid #000;
            p {
                display: flex;
                margin-bottom: 18px;

                :first-child {
                    width: 160px;
                }
            }
        }
        .drink-list {
            display: flex;
            margin-bottom: 18px;
            .good-box {
                width: 160px;

                .good-name {
                    margin-bottom: 6px;
                    display: flex;
                    justify-content: space-between;
                    padding-right: 20px;
                    .num {
                        min-width: 20px;
                    }
                }
            }

            .unline {
                text-decoration: line-through;
                color: #bcbcbc;
                margin-left: 10px;
            }
        }
        .add-drink-list {
            margin-bottom: 20px;
            border: 1px solid #c0c4cc;
            border-radius: 6px;
            padding: 20px;

            .order-title {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
                color: #409eff;
            }
        }
    }
}
.container {
    // width: 100vw;
    height: auto;
}
::-webkit-scrollbar {
    width: 5px; /*对垂直流动条有效*/
    height: 10px;
}
::-webkit-scrollbar-track {
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #fff;
}
::-webkit-scrollbar-thumb {
    border-radius: 3px;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: rgb(36, 47, 66);
}

.shop-seat {
    width: 100%;
    height: 100%;
    display: flex;
    // justify-content: center;
    .left-box {
        margin-right: 30px;

        .seat-title {
            display: flex;
            justify-content: space-between;
            width: 500px;
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
        height: 74vh;
        overflow: auto;
        padding-right: 5px;
        .middleBox {
            display: flex;
        }
        .newLeft {
            margin-top: 10px;
            display: block;
            width: 310px;
        }
        .title {
            border-left: 3px solid #409eff;
            padding-left: 16px;
        }
    }
    .padd {
        margin-top: 20px;
        padding-left: 19px;
        width: 250px;
        span {
            font-size: 14px;
            margin-right: 60px;
        }
        .small-span {
            margin-right: 60px;
        }
        .smallSpan {
            margin: 0 30px 0 0;
        }
        .smallInpss {
            width: 100px;
            height: 40px;
            margin-top: 20px;
            margin-right: 30px;
        }
        .smallInp {
            width: 100px;
            height: 40px;
            margin-top: 20px;
        }
        .smallInps {
            width: 100px;
            margin-right: 20px;
        }
        .small_span {
            margin-right: 46px;
        }
    }
    .order-num {
        margin-top: 20px;
        padding-left: 19px;
        width: 280px;
        .el-input {
            width: 280px;
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

.lock-book {
    background-color: #800080 !important;
    border: 1px solid transparent !important;
}

.not-book {
    background-color: #e6a23c !important;
    border: 1px solid transparent !important;
}

.is-book {
    background-color: #409eff !important;
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

.lockBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid transparent;
    background-color: #800080 !important;
    cursor: pointer;
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

.isBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid transparent;
    background-color: #409eff !important;
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