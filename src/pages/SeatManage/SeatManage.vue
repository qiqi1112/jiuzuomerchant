<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 座位管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="shop-seat">
                <!-- 左边座位展示 -->
                <div class="left-box">
                    <!-- 回显楼层切换的按钮 -->
                    <div>
                        <el-button
                            v-for="(item, index) in list"
                            :key="index"
                            :type="nowFloor == item.floor ? 'primary' : ''"
                            @click="changeShowFloor(item, index)"
                            class="add-floor"
                            >{{ item.floor }}</el-button
                        >
                    </div>

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
                                        @click="changeStauts($event, seatStyle)"
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
        return {};
    },

    methods: {
        //切换楼层，楼层对应的行列跟着切换
        changeShowFloor(item, index) {
            this.isClickSeat = false;
            this.nowFloor = item.floor; //当前操作的楼层
            this.nowFloorIndex = index; //当前操作的楼层的下标
            this.nowFloorPower = item.floorPower; //当前操作的楼层的权重

            if (item.floor == this.list[index].layoutList[0].floor) {
                this.getShopSeat(index);
                this.showSeatAtt(index);
            } else {
                this.$message.error('楼层数据异常，请联系平台');
            }
        },

        //改变座位状态按钮（改变点击的座位颜色）
        changeStyle(style) {
            this.seatStyle = style;
        },

        //座位点击事件
        changeStauts(e, style) {
            let seatType = style; //座位属性 1-不可预定 2-可预定
            let stageCode = 1; //座位类型 1-普通座位 3-过道 4-舞台

            //修改当前座位的属性（座位颜色）
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

        //回显店铺卡座数量（行和列数量）
        getShopSeat(index) {
            if (this.list.length !== 0) {
                let seat = this.list[index].cassettes.split('x');
                this.x = +seat[0];
                this.y = +seat[1];
            }
        },

        //座位属性回显
        showSeatAtt(index) {
            this.$nextTick(() => {
                if (this.$refs.seatSpan) {
                    //遍历所有座位
                    this.$refs.seatSpan.forEach((item) => {
                        let x = item.dataset.indexx; //行
                        let y = item.dataset.indexy; //列

                        //根据返回的楼层对应的座位数组进行匹配，并替换当前座位的属性
                        this.list[index].layoutList.forEach((item2) => {
                            if (item2.floor == this.nowFloor && item2.seatRow == x && item2.seatColumn == y) {
                                //不可预订
                                if (item2.seatAttribute == 1) {
                                    item.className = `seat notBook`;
                                }
                                //可预订
                                if (item2.seatAttribute == 2) {
                                    item.className = `seat canBook`;
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
            this.$get('/merchant/store/getStoreInfo').then((res) => {
                if (res.code === 0) {
                    let result = res.data;
                    this.shopId = result.id;
                    // this.appShopImageUrl = result.appListBigPicture;
                    this.cassette = result.cassette;
                    this.city = result.city;
                    this.servicePhoneArr = result.customerServicePhoneList;
                    this.district = result.district;
                    this.districtCode = result.districtCode;
                    this.endBussTime = result.endTime;
                    this.goodsBrief = result.goodsStoreSynopsis;
                    this.latestRetainTime = result.latestRetainTime;
                    this.dynamicTags = result.labels.split(',');
                    this.overallImageUrl = result.layoutPicture;
                    this.logoImageUrl = result.logo;
                    let lonlat = result.lonlat;
                    this.shopName = result.name;
                    this.perCon = result.perCapitaConsumption;
                    this.bannerShowBox = result.picture.split(',');
                    this.province = result.province;
                    this.rowNumImageUrl = result.rowNumberBanner;
                    this.searchAddress = result.searchAddress;
                    this.startBussTime = result.startTime;
                    this.shopLocaIndex = result.storeLocation;
                    this.shopBrief = result.synopsis;
                    this.trustAddress = result.trustAddress;
                    this.shopTypeArr = result.type.split(',');
                    this.ktvRoomList = result.ktvRoomList;
                    this.ktvList = result.list; //回显时根据楼层分类列表专用
                    this.list = result.list;

                    //回显第一楼店铺卡座数量
                    this.getShopSeat(0);

                    //默认展示的楼层为第一楼
                    if (this.list.length !== 0) {
                        this.nowFloor = result.list[0].floor;
                    }

                    //对座位信息进行相关转换
                    this.changeLayoutList();

                    //对ktv信息进行相关转换
                    this.changeKtvList(this.ktvRoomList);

                    //仅查看时对ktv相关信息进行转换
                    this.ktvList.forEach((item) => {
                        this.changeKtvList(item.ktvRoomList);
                    });

                    //座位属性回显
                    this.showSeatAtt(0);

                    //获取申请商家推荐状态
                    this.storeRecommendType();

                    //获取商家上架下架状态
                    this.getPutawayStatus();

                    //回显已经选择的店铺类型
                    this.submitShopType = result.type.split(',');

                    //回显每个座位号时，不要带上楼层号
                    this.substrSeatNum();

                    this.wrapLoading = false;

                    console.log('qweqwe', this.ktvList);

                    console.log('当前店铺数据', res.data);
                } else if (res.code === 600) {
                    if (!this.seatFloorDialog) {
                        this.$alert(res.msg, '创建店铺', {
                            confirmButtonText: '添加信息',
                            callback: (action) => {
                                this.isReadonly = false;
                                this.isLookKtvInfo = true;
                                this.isUpdate = false;
                                //如果有缓存就用缓存里的数据，否则就重新创建座位
                                if (localStorage.getItem('storageInfo')) {
                                    this.getStorageInfo(); //获取缓存数据
                                }
                                this.wrapLoading = false;
                            }
                        });
                    }
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
</style>