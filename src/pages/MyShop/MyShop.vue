<template>
    <div class="con-wrap">
        <div class="container">
            <div class="left-wrap">
                <h4>
                    <span>店铺信息</span>
                    <el-button type="primary" @click="editShopInfo">编辑</el-button>
                    <el-button type="primary" @click="submitShopInfo">保存</el-button>
                </h4>
                <div class="shop-info clearfix">
                    <div class="left-info">
                        <p>店铺招牌logo</p>
                        <img v-if="isReadonly" :src="logoImageUrl" class="avatar" />
                        <el-upload
                            v-else
                            class="avatar-uploader"
                            :action="serverUrl"
                            :show-file-list="false"
                            :data="avatarImg"
                            :on-success="uploadAvatarSuccess"
                            :before-upload="beforeAvatarUpload"
                            :on-error="uploadError"
                        >
                            <img v-if="logoImageUrl" :src="logoImageUrl" class="avatar" />
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                    <div class="right-info">
                        <p class="shop-name">
                            <span>店名：</span>
                            <el-input
                                v-model="shopName"
                                placeholder="请输入店名"
                                style="width:70%"
                                :readonly="isReadonly"
                            ></el-input>
                        </p>
                        <p class="shop-brief">
                            <span>店铺简介：</span>
                            <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入店铺简介"
                                v-model="shopBrief"
                                style="width:76%"
                                :readonly="isReadonly"
                            ></el-input>
                            <!-- <span>{{shopBrief}}</span> -->
                        </p>
                    </div>
                </div>
                <div class="shop-label">
                    <p>店铺标签</p>
                    <div class="change-labels">
                        <el-tag
                            :key="tag"
                            :closable="!isReadonly"
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
                        <!-- @blur="handleInputConfirm" -->

                        <el-button
                            v-else-if="!isReadonly"
                            class="button-new-tag"
                            @click="showInput"
                        >
                            <i class="el-icon-plus"></i>
                        </el-button>
                    </div>
                </div>
                <div class="shop-div">
                    <div class="shop-div1">
                        <div class="bussiness-hours">
                            <p>营业时间</p>
                            <div class="time-select">
                                <el-time-select
                                    v-model="startBussTime"
                                    :readonly="isReadonly"
                                    :picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:45'
                                }"
                                    placeholder="开始"
                                ></el-time-select>
                                <span>~</span>
                                <el-time-select
                                    v-model="endBussTime"
                                    :readonly="isReadonly"
                                    :picker-options="{
                                    start: '00:00',
                                  step: '00:15',
                                  end: '23:45'
                                }"
                                    placeholder="结束"
                                ></el-time-select>
                            </div>
                        </div>
                        <div class="service-phone">
                            <p>客服电话</p>
                            <el-input
                                v-model="servicePhone"
                                placeholder="客服电话"
                                style="width:70%"
                                :readonly="isReadonly"
                            ></el-input>
                        </div>
                    </div>
                    <div class="shop-div2">
                        <div class="shop-address">
                            <p>店铺地址</p>
                            <p class="shop-add clearfix">
                                <span>{{country}}</span>
                                <span>{{street}}</span>

                                <el-input
                                    v-model="detailAdd"
                                    placeholder="请输入店铺详细地址"
                                    :readonly="isReadonly"
                                ></el-input>

                                <!-- <span class="detail-address">{{detailAdd}}</span> -->
                            </p>
                            <!-- <div>
                                <el-cascader
                                    :options="addressOptions"
                                    v-model="regionValue"
                                    @change="handleAddChange"
                                ></el-cascader>
                            </div>-->
                        </div>
                        <div class="shop-type">
                            <p>
                                店铺类型
                                <span>（用于客户筛选出本店）</span>
                            </p>
                            <div class="type-box">
                                <span v-if="isReadonly">{{shopType}}</span>

                                <el-select v-else v-model="shopType" placeholder="请选择">
                                    <el-option
                                        v-for="item in shopTypeOpt"
                                        :key="item.value"
                                        :label="item.value"
                                        :value="item.value"
                                    ></el-option>
                                </el-select>
                                <!-- <span
                                    v-else
                                    v-for="(item,index) of shopTypeOpt"
                                    :key="index"
                                >{{item}}</span>-->
                            </div>
                        </div>
                    </div>
                </div>
                <p class="per-con">
                    店铺人均消费：
                    <el-input
                        v-model="perCon"
                        placeholder="人均消费"
                        style="width:20%;margin-right:6px"
                        :readonly="isReadonly"
                    ></el-input>元/人
                    <!-- <span>{{perCon}}</span>元/人 -->
                </p>
                <div class="shop-desc">
                    <div class="goods-brief">
                        <span>商品店面简介：</span>
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入商品店面简介"
                            v-model="goodsBrief"
                            style="width:76%"
                            :readonly="isReadonly"
                        ></el-input>
                    </div>
                    <div class="shop-matter">
                        <span>订桌注意事项：</span>
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入订桌注意事项"
                            v-model="shopMatter"
                            style="width:76%"
                            :readonly="isReadonly"
                        ></el-input>
                    </div>
                    <div class="shop-remind">
                        <span>排号商家提醒：</span>
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入排号商家提醒"
                            v-model="shopRemind"
                            style="width:76%"
                            :readonly="isReadonly"
                        ></el-input>
                    </div>
                </div>
            </div>
            <div class="right-wrap">
                <h4>店铺展示图</h4>
                <div class="shop-info">
                    <!-- banner展示图 -->

                    <div class="banner-box">
                        <img :src="dialogImageUrl" alt />
                        <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img :src="dialogImageUrl" alt />
                        </el-dialog>
                    </div>

                    <!-- 商家布局图 -->
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>

                    <!-- 排号banner图 -->
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                    >
                        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
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
                            v-if="x&&y"
                            class="seat-box"
                            ref="seatBox"
                            :style="{width:32 * x + 30 + 'px'}"
                            style="overflow:hidden"
                        >
                            <div v-for="(itemX,index) in Number(x)" :key="index">
                                <div v-for="(itemY,index) in Number(y)" :key="index">
                                    <span class="seat" @click="changeStauts($event,seatStyle)" @contextmenu.prevent="changeStauts($event,'canBook')"></span>
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
                            <div class="snacks-detail">
                                <div>
                                    <span>水果拼盘</span>
                                    <span>x2</span>
                                </div>
                                <div>
                                    <span>水果拼盘</span>
                                    <span>x2</span>
                                </div>
                                <div>
                                    <span>水果拼盘</span>
                                    <span>x2</span>
                                </div>
                                <el-input style="width:100px" v-model="goodName" placeholder="名称"></el-input>
                                <span class="mult">x</span>
                                <el-input style="width:100px" v-model="goodNum" placeholder="数量"></el-input>
                                <el-button type="primary">确定</el-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { regionData } from 'element-china-area-data'; //引入外部地址选择器

export default {
    data() {
        return {
            serverUrl: '/file/admin/system/upload/create',
            // serverUrl : 'http://api_dev.wanxikeji.cn/api/savePic',
            isReadonly: true, //编辑信息开关（默认只读）
            logoImageUrl: '', //店铺logo
            //上传头像时附带的额外参数（头像地址）
            avatarImg: {
                img: ''
            },
            shopName: '', //店铺名称
            shopBrief: '', //店铺简介
            dynamicTags: [], //店铺标签数组
            inputVisible: false, //添加店铺标签的输入框开关
            inputValue: '', //店铺标签输入框的输入值
            startBussTime: '', //开始营业时间
            endBussTime: '', //结束营业时间
            addressOptions: regionData, //使用外部地址数组
            regionValue: [], //地址选择器选择后的地址编号
            country: '锦江区', //区县
            street: '蜀都大道', //街道
            detailAdd: '锦江区水碾河路48号', //详细地址
            servicePhone: '028-0000 0000', //客服电话
            shopType: '', //选择的店铺类型
            //所有店铺类型
            shopTypeOpt: [
                {
                    label: '1',
                    value: '夜店'
                },
                {
                    label: '2',
                    value: '清吧'
                },
                {
                    label: '3',
                    value: 'ktv'
                }
            ],
            perCon: 0, //人均消费
            goodsBrief: '', //商品店面简介
            shopMatter: '', //订桌注意事项
            shopRemind: '', //排号商家提醒

            dialogImageUrl: '',
            dialogVisible: false,

            // 选座模块-----------------------------------------
            x: 20, //座位列数
            y: 20, //座位行数
            seatStyle: 'hasBook', //默认的选座样式

            radio: '1',

            goodName: '',
            goodNum: '',

            imageUrl: ''
        };
    },
    methods: {
        //上传头像完成之前
        beforeAvatarUpload(file) {
            this.avatarImg.img = file; //上传图片完成之前就把这个图片的相关信息赋给一个对象里的属性，然后上面上传时就通过:data将这个imgdata对象携带过去，这样下面就能获取到这个图片的地址信息等
        },

        //上传头像成功
        uploadAvatarSuccess(res, file) {
            this.logoImageUrl = 'http://47.108.204.66:8078/' + res.data; //这就是图片的完整地址，这样后续就可以进行相关操作了
            console.log(this.logoImageUrl);
        },

        //编辑商铺信息
        editShopInfo() {
            this.isReadonly = false;
        },

        //提交修改并保存
        submitShopInfo() {
            this.isReadonly = true;
            if (this.isReadonly == true) {
                this.$message.success('保存成功');

                console.log('zzz', this.shopTypeChangeNum(this.shopType));
            }
        },

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

        //地址选择器切换地址
        handleAddChange(value) {
            console.log(value);
            console.log('xxx', this.regionValue);
        },

        //将返回的字符串转为数组
        strChangeArr(str) {
            return str.split(',');
        },

        //转换店铺类型（文字转数字）
        shopTypeChangeNum(type) {
            let shopType = '';
            if (type == '夜店') {
                shopType = 1;
            } else if (type == '清吧') {
                shopType = 2;
            } else if (type == 'ktv') {
                shopType = 3;
            }
            return shopType;
        },

        //转换店铺类型（数字转文字）
        shopTypeChangeWord(type) {
            let shopType = '';
            if (type == 1) {
                shopType = '夜店';
            } else if (type == 2) {
                shopType = '清吧';
            } else if (type == 3) {
                shopType = 'ktv';
            }
            return shopType;
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('插入失败');
        },

        getStoreInfo() {
            this.$get('/dev/merchant/store/getStoreInfo').then((res) => {
                console.log(res.data);
                let result = res.data;
                this.logoImageUrl = 'img/' + result.logo;
                // console.log(this.logoImageUrl);
                this.shopName = result.name;
                this.shopBrief = result.synopsis;
                this.dynamicTags = this.strChangeArr(result.labels);
                this.servicePhone = result.customerServicePhone;
                this.shopType = this.shopTypeChangeWord(result.type);
                this.perCon = result.perCapitaConsumption;
                this.goodsBrief = result.goodsStoreSynopsis;
                this.shopMatter = result.tableReservationNotes;
                this.shopRemind = result.businessReminder;
                this.startBussTime = result.startTime;
                this.endBussTime = result.endTime;
            });
        }
    },

    created() {},

    mounted() {
        this.getStoreInfo();
    }
};
</script>

<style scoped>
.clearfix::after {
    display: block;
    content: '';
    clear: both;
}

.con-wrap {
    height: 100%;
}

.container {
    box-sizing: border-box;
    display: flex;
    padding: 30px;
}

.left-wrap {
    width: 35%;
    height: 100%;
    margin-right: 50px;
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

.left-wrap h4 > span {
    margin-right: 30px;
}

.left-wrap .shop-info {
    height: 160px;
    /* display: flex; */
    /* justify-content: space-between; */
    margin-bottom: 30px;
}

.shop-brief {
    /* float: left; */
    display: flex;
    align-items: center;
}

.shop-brief > span {
    /* margin-right:  30px; */
}

.left-wrap .shop-info .left-info {
    width: 30%;
    float: left;
    /* margin-right: 40px; */
}

.left-wrap .shop-info .left-info > p {
    margin-bottom: 10px;
}

>>> .left-info .el-upload.el-upload--text {
    width: 120px;
    height: 120px;
}

>>> .left-wrap .shop-info .left-info .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

>>> .left-wrap .shop-info .left-info .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

>>> .left-wrap .shop-info .left-info .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

>>> .left-wrap .shop-info .left-info .avatar {
    width: 120px;
    height: 120px;
    border-radius: 6px;
    display: block;
}

.left-wrap .shop-info .right-info {
    /* float: left; */
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.left-wrap .shop-info .right-info .shop-name {
    float: left;
    margin-bottom: 40px;
}

.left-wrap .shop-info .right-info .shop-name > span {
    margin-right: 30px;
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
    margin-bottom: 10px;
}

>>> .input-new-tag {
    vertical-align: middle !important;
}

.left-wrap .shop-desc > div {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.left-wrap .shop-div {
    display: flex;
    margin-bottom: 30px;
}

.left-wrap .shop-div .shop-div1 {
    /* margin-right: 140px; */
    width: 42%;
    margin-right: 30px;
}

.left-wrap .shop-label {
    margin-bottom: 30px;
}

.left-wrap .shop-label > p {
    margin-bottom: 10px;
}

.left-wrap .bussiness-hours {
    margin-bottom: 30px;
}

.left-wrap .bussiness-hours > p {
    margin-bottom: 10px;
}

.left-wrap .bussiness-hours .time-select {
    display: flex;
    align-items: center;
}

.left-wrap .bussiness-hours .time-select > span {
    margin: 0 10px;
}

.left-wrap .shop-address {
    margin-bottom: 30px;
}

.left-wrap .shop-address > p {
    margin-bottom: 10px;
}

.left-wrap .shop-address .shop-add span {
    /* display: block; */
    /* border: 1px solid #409eff;
    color: #409eff;
    border-radius: 6px;
    padding: 6px 20px;
    float: left;
    margin: 0 10px 10px 0;
    background-color: #ecf5ff; */
    background-color: #ecf5ff;
    display: inline-block;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    color: #409eff;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    margin: 0 10px 10px 0;
    box-sizing: border-box;
    white-space: nowrap;
}

.left-wrap .service-phone {
    margin-bottom: 30px;
}

.left-wrap .service-phone > p {
    margin-bottom: 10px;
}

.left-wrap .per-con {
    margin-bottom: 30px;
}

.shop-type {
    margin-bottom: 30px;
}

.shop-type > p {
    margin-bottom: 10px;
}

.shop-type .type-box::after {
    display: block;
    content: '';
    clear: both;
}

.shop-type .type-box > span {
    /* display: block;
    border: 1px solid #409eff;
    color: #409eff;
    border-radius: 6px;
    padding: 6px 20px;
    float: left;
    margin: 0 10px 10px 0;
    background-color: #ecf5ff; */
    background-color: #ecf5ff;
    display: inline-block;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    color: #409eff;
    border: 1px solid #d9ecff;
    border-radius: 4px;
    margin: 0 10px 10px 0;
    box-sizing: border-box;
    white-space: nowrap;
}

.shop-label .labels > span {
    display: block;
    border: 1px solid #409eff;
    color: #409eff;
    border-radius: 6px;
    padding: 6px 20px;
    float: left;
    margin: 0 10px 10px 0;
    background-color: #ecf5ff;
}

/* .shop-type .el-button--small,
.el-button--small.is-round {
    padding: 12px 20px;
} */

.right-wrap {
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.right-wrap .shop-info {
    margin-bottom: 60px;
}

.right-wrap .shop-info .banner-box {
}

.right-wrap .shop-info .banner-box img {
    width: 160px;
    height: 40px;
}

.right-wrap .shop-seat {
    display: flex;
}

.right-wrap .shop-seat .left-box {
    /* float: left; */
    margin-right: 50px;
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
    /* float: left; */
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

.snacks .snacks-detail {
    float: left;
}

.snacks .snacks-detail div span:first-child {
    margin-right: 30px;
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

.mult {
    margin: 0 10px;
}
</style>