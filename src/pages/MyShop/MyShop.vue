<template>
    <div class="con-wrap">
        <div class="container">
            <div class="left-wrap">
                <h4>店铺信息</h4>
                <div class="shop-info">
                    <div class="left-info">
                        <p>我的招牌logo</p>
                        <img src="img/img.jpg" alt />
                    </div>
                    <div class="right-info">
                        <p class="shop-name">
                            店名：
                            <span>PlayHouse</span>
                        </p>
                        <p class="shop-brief">
                            店铺简介：
                            <span>每一份属于夜晚的美丽心情，都不应该被雨水淋湿而打断——成都play house</span>
                        </p>
                    </div>
                </div>
                <div class="shop-label">
                    <p>店铺标签</p>
                    <el-tag
                        :key="tag"
                        closable
                        v-for="tag in dynamicTags"
                        :disable-transitions="false"
                        @close="handleClose(tag)"
                    >{{tag}}</el-tag>
                    <el-input
                        class="input-new-tag"
                        v-if="inputVisible"
                        v-model="inputValue"
                        ref="saveTagInput"
                        @keyup.enter.native="handleInputConfirm"
                        @blur="handleInputConfirm"
                    ></el-input>
                    <el-button v-else class="button-new-tag" @click="showInput">
                        <i class="el-icon-plus"></i>
                    </el-button>
                </div>
                <div class="bussiness-hours">
                    <p>营业时间</p>
                    <span>20:00</span> ~
                    <span>03:00</span>
                </div>
                <div class="shop-address">
                    <p>店铺地址</p>
                    <div>
                        <el-cascader
                            :options="options"
                            v-model="regionValue"
                            @change="handleChange"
                        ></el-cascader>
                    </div>
                    <div id="container" style="width:600px;height:500px;"></div>
                </div>
                <div class="service-phone">
                    <p>客服电话</p>
                    <span>028-0000 0000</span>
                </div>
                <p class="per-con">
                    小店人均消费：
                    <span>500</span>元/人
                </p>
                <div class="shop-type">
                    <p>
                        小店类型
                        <span class="red-font">（用于客户筛选出本店）</span>
                    </p>
                    <div class="type-box">
                        <el-row>
                            <el-button type="primary">酷嗨</el-button>
                            <el-button type="success">演奏</el-button>
                            <el-button type="info">蹦迪</el-button>
                            <el-button type="warning">歌手</el-button>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="right-wrap">
                <h4>店铺Banner展示图</h4>
                <div class="shop-info">
                    <!-- <p>
                        <img src="img/2.jpg" alt />
                    </p>
                    <p>
                        <img src="img/3.jpg" alt />
                    </p>
                    <p>
                        <img src="img/4.jpg" alt />
                    </p>
                    <p>
                        <img src="img/5.jpg" alt />
                    </p>
                    <p>
                        <img src="img/6.jpg" alt />
                    </p>-->
                    <!-- <p> -->
                    <el-upload
                        action="https://jsonplaceholder.typicode.com/posts/"
                        list-type="picture-card"
                        :on-preview="handlePictureCardPreview"
                        :on-remove="handleRemove"
                    >
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt />
                    </el-dialog>
                    <!-- </p> -->
                </div>
                <h4>店铺卡座</h4>
                <div class="shop-seat">
                    <div class="left-box">
                        <p class="input-seat">
                            <el-input v-model="y" min="1" placeholder="请输入行数" type="number"></el-input>
                            <el-input v-model="x" min="1" placeholder="请输入列数" type="number"></el-input>
                        </p>
                        <div class="seat-title">
                            <p>
                                <span class="not-book"></span>
                                不可预订
                            </p>
                            <p>
                                <span class="can-book"></span>
                                可预订
                            </p>
                            <p>
                                <span class="in-book"></span>
                                预定中
                            </p>
                            <p>
                                <span class="has-book"></span>
                                已预订
                            </p>
                        </div>
                        <div
                            class="seat-box"
                            ref="seatBox"
                            :style="{width:32 * x + 30 + 'px'}"
                            style="overflow:hidden"
                        >
                            <div v-for="(itemX,index) in Number(x)" :key="index">
                                <div v-for="(itemY,index) in Number(y)" :key="index">
                                    <span class="seat" @click="changeStauts($event,seatStyle)"></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right-box">
                        <p class="seat-detail">座位详情</p>
                        <div class="seat-prop">
                            <span class="seat-detail-span">座位属性</span>
                            <div class="prop-box">
                                <span class="notBook" @click="changeStyle('notBook')"></span>
                                <span class="canBook" @click="changeStyle('canBook')"></span>
                                <span class="hasBook" @click="changeStyle('hasBook')"></span>
                                <span class="inBook" @click="changeStyle('inBook')"></span>
                            </div>
                        </div>
                        <div class="acc-people">
                            <span class="seat-detail-span">容纳人数</span>
                            <span>100</span>人
                        </div>
                        <div class="min-charge">
                            <span class="seat-detail-span">最低消费</span>
                            <span>￥100元</span>
                        </div>
                        <div class="lon-retain">
                            <span class="seat-detail-span">卡座保留最晚时间</span>
                            <span>20:30</span>
                        </div>
                        <div class="is-toilet">
                            <span class="seat-detail-span">独立卫生间</span>
                            <span>
                                <el-radio v-model="radio" label="1">有</el-radio>
                                <el-radio v-model="radio" label="0">无</el-radio>
                            </span>
                        </div>
                        <div class="mahjong">
                            <span class="seat-detail-span">机麻</span>
                            <span>1</span>桌
                        </div>
                        <div class="snacks">
                            <span class="seat-detail-span">零食</span>
                            <div class="snacks-detail">水果拼盘 x 2</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { regionData } from 'element-china-area-data';

export default {
    data() {
        return {
            dynamicTags: ['美女超多', '来了就不想回家', '现场嗨到爆炸'],
            inputVisible: false,
            inputValue: '',

            options: regionData,
            regionValue: [],

            dialogImageUrl: '',
            dialogVisible: false,

            x: 10,
            y: 10,

            radio: '1',

            seatStyle: 'hasBook'
            // chooseSeatArr: []
        };
    },
    methods: {
        //删除当前标签
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },

        //点击添加标签按钮
        showInput() {
            this.inputVisible = true;
            this.$nextTick((_) => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },

        //添加店铺标签
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                this.dynamicTags.push(inputValue);
                console.log(inputValue);
            }
            this.inputVisible = false;
            this.inputValue = '';
        },

        handleRemove(file, fileList) {
            console.log(file, fileList);
        },

        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        //座位点击事件
        changeStauts(e, style) {
            e.target.className = style;
        },

        //改变座位状态按钮
        changeStyle(style) {
            this.seatStyle = style;
        },

        handleChange(value) {
            console.log(value);
            // 楼主选择江苏省南京市江宁区 打印value结果 ["320000", "320100", "320114"]
        },

        init() {
            //步骤：定义map变量 调用 qq.maps.Map() 构造函数 获取地图显示容器
            //设置地图中心点
            var myLatlng = new qq.maps.LatLng(39.916527, 116.397128);
            //定义工厂模式函数
            var myOptions = {
                zoom: 8, //设置地图缩放级别
                center: myLatlng, //设置中心点样式
                mapTypeId: qq.maps.MapTypeId.ROADMAP //设置地图样式详情参见MapType
            };
            //获取dom元素添加地图信息
            var map = new qq.maps.Map(document.getElementById('container'), myOptions);
            console.log(map);
        }
    },

    created() {
        this.Tmap();
    },

    mounted() {
        this.init();
    }
};
</script>

<style scoped>
.con-wrap {
    height: 100%;
}

.container {
    /* height: 100%; */
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    padding: 30px;
}

.left-wrap {
    /* border: 1px solid black; */
    width: 50%;
    height: 100%;
    /* padding: 20px; */
}

.left-wrap h4 {
    font-weight: normal;
    display: flex;
    align-items: center;
    height: 26px;
    margin-bottom: 30px;
    box-sizing: border-box;
}

.left-wrap h4::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 26px;
    margin-right: 10px;
    background-color: #000;
}

.left-wrap .shop-info {
    height: 160px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    /* border: 1px solid black; */
}

.left-wrap .shop-info .left-info {
    margin-right: 60px;
}

.left-wrap .shop-info .left-info > p {
    margin-bottom: 10px;
}

.left-wrap .shop-info .left-info > img {
    border-radius: 8px;
}

.left-wrap .shop-info .right-info .shop-name {
    margin-bottom: 40px;
}

.el-tag + .el-tag {
    margin-left: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 32px;
    padding-top: 0;
    padding-bottom: 0;
    box-sizing: border-box;
    font-weight: bolder;
}
.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.el-tag--small {
    height: 32px;
    line-height: 32px;
}

.left-wrap .shop-label {
    margin-bottom: 30px;
    /* border: 1px solid black; */
}

.left-wrap .shop-label > p {
    margin-bottom: 10px;
}

.left-wrap .bussiness-hours {
    margin-bottom: 30px;
    /* border: 1px solid black; */
}

.left-wrap .bussiness-hours > p {
    margin-bottom: 10px;
}

.left-wrap .shop-address {
    margin-bottom: 30px;
    /* border: 1px solid black; */
}

.left-wrap .shop-address > p {
    margin-bottom: 10px;
}

.left-wrap .service-phone {
    /* border: 1px solid black; */
    margin-bottom: 30px;
}

.left-wrap .service-phone > p {
    margin-bottom: 10px;
}

.left-wrap .per-con {
    /* border: 1px solid black; */
    margin-bottom: 30px;
}

.red-font {
    color: #f00;
}

.shop-type > p {
    margin-bottom: 10px;
}

.shop-type .el-button--small,
.el-button--small.is-round {
    padding: 12px 20px;
}

.right-wrap {
    /* border: 1px solid black; */
    width: 50%;
    height: 100%;
}

.right-wrap h4 {
    font-weight: normal;
    display: flex;
    align-items: center;
    height: 26px;
    margin-bottom: 30px;
    box-sizing: border-box;
}

.right-wrap h4::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 26px;
    margin-right: 10px;
    background-color: #000;
}

.right-wrap .shop-info {
    /* border: 1px solid black; */
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    /* width: 310px; */
}

.right-wrap .shop-info {
    margin-bottom: 60px;
}

.right-wrap .shop-seat .left-box {
    float: left;
    margin-right: 50px;
    /* display: flex;
    justify-content: space-between; */
}

.right-wrap .shop-seat .left-box .seat-title {
    display: flex;
    justify-content: space-between;
    width: 360px;
    margin-bottom: 20px;
}

.right-wrap .shop-seat .left-box .seat-title p {
    display: flex;
    justify-content: center;
    align-items: center;
}

.right-wrap .shop-seat .left-box .seat-title p span {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: #ddd;
    margin-right: 6px;
    border: 1px solid #ddd;
}

.input-seat {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.not-book {
    background-color: #ddd !important;
    border: 1px solid transparent !important;
}

.can-book {
    background-color: #fff !important;
}

.in-book {
    background-color: #409eff !important;
    border: 1px solid transparent !important;
}

.has-book {
    background-color: #f56c6c !important;
    border: 1px solid transparent !important;
}

.right-wrap .shop-seat .left-box .seat-box {
    padding: 20px;
    padding-bottom: 10px;
    box-sizing: border-box;
    background-color: #ddd;
    display: flex;
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
    border: 1px solid #ddd !important;
}

.notBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    border: 1px solid transparent !important;
    background-color: #ddd !important;
    cursor: pointer;
}

.canBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    border: 1px solid #ddd !important;
    background-color: #fff !important;
    cursor: pointer;
}

.hasBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    border: 1px solid transparent !important;
    background-color: #409eff !important;
    cursor: pointer;
}

.inBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    border: 1px solid transparent !important;
    background-color: #f56c6c !important;
    cursor: pointer;
}

.shop-seat .right-box {
    float: left;
}

.shop-seat .right-box .seat-detail {
    margin-bottom: 30px;
}

.shop-seat .right-box .seat-prop {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
}

.seat-detail-span {
    float: left;
    margin-right: 20px;
}

.shop-seat .right-box .seat-prop .prop-box {
    float: left;
    padding: 10px;
    padding-bottom: 0;
    border: 1px solid #ddd;
}

.shop-seat .right-box .seat-prop .prop-box span {
    float: left;
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    background-color: #ddd;
    margin-right: 10px;
    border: 1px solid #ddd;
}

.shop-seat .right-box .acc-people {
    margin-bottom: 30px;
}

.shop-seat .right-box .min-charge {
    margin-bottom: 30px;
}

.shop-seat .right-box .lon-retain {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.shop-seat .right-box .is-toilet {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
}

.shop-seat .right-box .mahjong {
    margin-bottom: 30px;
}
</style>