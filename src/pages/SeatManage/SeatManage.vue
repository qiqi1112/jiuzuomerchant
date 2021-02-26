<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 座位管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container" v-loading="wrapLoading">
            <div class="shop-seat" v-if="list.length > 0">
                <!-- 左边座位展示 -->
                <div class="left-box">
                    <!-- 回显楼层切换的按钮 -->
                    <div>
                        <el-button
                            v-for="(item, index) in floorList"
                            :key="index"
                            :type="nowFloor == item.floor ? 'primary' : ''"
                            @click="changeShowFloor(item)"
                            class="add-floor"
                            >{{ item.floor }}</el-button
                        >
                    </div>

                    <!-- 座位行数和列数 -->
                    <p class="input-seat">
                        <label style="margin-right: 30px">
                            座位行数：
                            <el-input-number
                                :step="1"
                                step-strictly
                                disabled
                                v-model="x"
                                :min="6"
                                style="width: 120px"
                                label="行数"
                            ></el-input-number>
                        </label>
                        <label style="margin-right: 30px">
                            座位列数：
                            <el-input-number
                                :step="1"
                                step-strictly
                                disabled
                                v-model="y"
                                :min="6"
                                style="width: 120px"
                                label="列数"
                            ></el-input-number>
                        </label>
                    </p>

                    <template v-if="list.length !== 0">
                        <!-- 座位属性标题 -->
                        <div class="seat-title">
                            <p v-for="(item, index) in seatAttOpt" :key="index" @click="changeStyle(item.style)">
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
                                        @click="changeStauts"
                                    ></span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            wrapLoading: false,
            x: 0, //座位行数
            y: 0, //座位列数
            //座位属性数组
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
            presentSeatInfo: {}, //当前正在操作的座位对应的详细信息
            list: [], //所有楼层中所有的座位
            floorList: [], //楼层号数组
            nowFloor: '' //当前正在操作的楼层名
        };
    },

    methods: {
        //切换楼层，楼层对应的行列跟着切换
        changeShowFloor(item) {
            this.wrapLoading = true;
            this.nowFloor = item.floor; //当前操作的楼层
            this.getStoreInfo();
        },

        //座位点击事件
        changeStauts(e) {
            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
            e.target.classList.add('border'); //定位当前座位

            this.lookEditSeatInfo(e); //查看当前点击座位的信息

            const seat = this.presentSeatInfo.seatCode; //座位号

            let txt = '', //弹窗文案
                status = -1, //座位要修改成的状态
                statusTxt; //座位要修改成的状态中文
            let nowStatus = this.presentSeatInfo.seatAttribute; //当前座位的状态

            if (nowStatus == 2) {
                status = 0;
                statusTxt = '禁用';
                txt = `座位号：${seat}，当前状态为：可预订，是否要修改为：${statusTxt}状态`;
            } else if (nowStatus == 0) {
                status = 2;
                statusTxt = '可预订';
                txt = `座位号：${seat}，当前状态为：禁用，是否要修改为：${statusTxt}状态`;
            } else if (nowStatus == 3 || nowStatus == 4) {
                txt = `座位号：${seat}，当前座位已被线上用户预定，不可修改`;
                this.alertFn(txt);
                return;
            } else {
                txt = `座位号：${seat}，当前座位不可修改，仅能修改可预订与禁用状态的座位`;
                this.alertFn(txt);
                return;
            }

            this.confirmFn(txt).then(() => {
                this.$put(`/merchant/store/storeSeatStatus/${seat}/${status}`).then((res) => {
                    if (res.code === 0) {
                        this.getStoreInfo();
                        this.$message.success('更改成功');
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            });
        },

        //confirm弹窗
        confirmFn(txt) {
            return new Promise((resolve, reject) => {
                this.$confirm(txt, '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        reject();
                    });
            });
        },

        //alert弹窗
        alertFn(txt) {
            return new Promise((resolve, reject) => {
                this.$alert(txt, '提示', {
                    confirmButtonText: '确定',
                    callback: (action) => {
                        resolve(action);
                    }
                });
            });
        },

        //查看或编辑当前座位信息
        lookEditSeatInfo(e) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            this.list.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    this.presentSeatInfo = item;
                }
            });
        },

        //清空座位外边框（定位当前座位）
        clearSeatBorder() {
            if (this.$refs.seatSpan) {
                this.$refs.seatSpan.forEach((item) => {
                    item.classList.remove('border');
                });
            }
        },

        //回显店铺卡座数量（行和列数量）
        getShopSeat() {
            if (this.list.length !== 0) {
                this.x = this.list[this.list.length - 1].seatRow;
                this.y = this.list[this.list.length - 1].seatColumn;
            }
        },

        //座位属性回显
        showSeatAtt() {
            this.$nextTick(() => {
                if (this.$refs.seatSpan) {
                    //遍历所有座位
                    this.$refs.seatSpan.forEach((item) => {
                        let x = item.dataset.indexx; //行
                        let y = item.dataset.indexy; //列

                        //根据返回的楼层对应的座位数组进行匹配，并替换当前座位的属性
                        this.list.forEach((item2) => {
                            if (item2.seatRow == x && item2.seatColumn == y) {
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

        //回显店铺数据
        getStoreInfo() {
            this.wrapLoading = true;

            let data = {
                floor: this.nowFloor
            };

            console.log(data);
            this.$post('/merchant/store/getStoreSeat', data)
                .then((res) => {
                    if (res.code === 0) {
                        let result = res.data;
                        this.floorList = result.storeSeatFloorDTOS;
                        this.list = result.storeSeatDTOS;

                        //回显当前楼层卡座数量
                        this.getShopSeat();

                        //获取当前楼层的楼层号
                        if (this.floorList.length !== 0) {
                            this.nowFloor = this.list[0].floor;
                        }

                        //座位属性回显
                        this.showSeatAtt();
                    } else if (res.code === 600) {
                        this.$alert(res.msg, '创建店铺', {
                            confirmButtonText: '添加信息',
                            callback: (action) => {
                                this.$router.push('/myshop');
                            }
                        });
                    }
                })
                .finally(() => {
                    this.wrapLoading = false;
                });
        }
    },

    mounted() {
        this.getStoreInfo();
    }
};
</script>

<style lang="less" scoped>
.shop-seat {
    display: flex;

    .left-box {
        margin-right: 30px;

        .seat-title {
            display: flex;
            justify-content: space-between;
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

        .add-floor {
            margin-bottom: 20px;
        }
    }

    .right-box {
        .min-charge {
            align-items: flex-start;
            .day-mincom {
                border: 1px solid #dcdfe6;
                border-radius: 4px;
                padding: 16px 0;
                width: 100%;
                white-space: nowrap;
                > div {
                    margin-bottom: 16px;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;

                    > span {
                        margin-right: 10px;
                        white-space: nowrap;
                    }
                }

                > div:last-child {
                    margin-bottom: 0;
                }
            }
        }

        > div {
            margin-bottom: 30px;

            > span {
                margin-right: 0;
                width: 120px;
                display: block;
            }

            > span.snacks {
                width: 48px !important;
            }
        }

        > div.snacks {
            align-items: flex-start;
        }

        .seat-detail {
            margin-bottom: 30px;
        }

        .seat-prop {
            display: flex;
            align-items: center;

            .prop-box {
                float: left;
                padding: 10px;
                padding-bottom: 0;
                border: 1px solid #ddd;

                .min-con {
                    float: left;
                    margin-right: 0px;
                }

                span {
                    float: left;
                    display: block;
                    width: 20px;
                    height: 20px;
                    border-radius: 4px;
                    background-color: #ddd;
                    margin-right: 10px;
                    border: 1px solid #ddd;
                }

                span:last-child {
                    margin-right: 0;
                }
            }
        }

        .lon-retain {
            display: flex;
            align-items: center;
        }
    }
}

.lock-book {
    background-color: #800080 !important;
    border: 1px solid transparent !important;
}

.not-book {
    background-color: #e6a23c !important;
    border: 1px solid transparent !important;
}

.can-book {
    background-color: #fff !important;
}

.is-book {
    background-color: #409eff !important;
    border: 1px solid transparent !important;
}

.has-book {
    background-color: #f56c6c !important;
    border: 1px solid transparent !important;
}

.stage-book {
    background-color: #008000 !important;
    border: 1px solid transparent !important;
}

.aisle-book {
    background-color: #999 !important;
    border: 1px solid transparent !important;
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

.border {
    border: 1px solid #f00 !important;
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