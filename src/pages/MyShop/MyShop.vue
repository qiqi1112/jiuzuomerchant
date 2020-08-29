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
                            action="1"
                            :http-request="uploadAvatarFile"
                            :show-file-list="false"
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
                                style="width:76%;"
                                :readonly="isReadonly"
                            ></el-input>
                        </p>
                    </div>
                </div>
                <div class="shop-loca">
                    <p>店铺定位（注：选择夜店/清吧就没有“独立卫生间、机麻、零嘴”）</p>
                    <div>
                        <span
                            v-for="(item,index) in shopLoca"
                            :key="index"
                            ref="shopLoca"
                            @click="changeShopLoca"
                        >{{item}}</span>
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
                            <p>店铺营业时间</p>
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
                        <p>店铺banner图</p>
                        <div v-if="isReadonly">
                            <img v-for="(item,index) in bannerShowBox" :key="index" :src="item" />
                        </div>
                        <el-upload
                            v-else
                            action="1"
                            list-type="picture-card"
                            :http-request="uploadBannerFiles"
                            :on-preview="bannerPreview"
                            :on-remove="bannerRemove"
                            :file-list="bannerImgBox"
                            :on-error="uploadError"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img :src="bannerImageUrl" alt />
                        </el-dialog>
                    </div>

                    <!-- 商家布局图 -->
                    <div class="overall-box">
                        <p>商家布局图</p>
                        <img v-if="isReadonly" :src="overallImageUrl" class="avatar" />
                        <el-upload
                            v-else
                            class="avatar-uploader"
                            action="1"
                            :http-request="uploadOverallFile"
                            :show-file-list="false"
                            :on-error="uploadError"
                        >
                            <img v-if="overallImageUrl" :src="overallImageUrl" class="avatar" />
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>

                    <!-- 排号banner图 -->
                    <div class="rowNum-box">
                        <p>排号banner图</p>
                        <img v-if="isReadonly" :src="rowNumImageUrl" class="avatar" />
                        <el-upload
                            v-else
                            class="avatar-uploader"
                            action="1"
                            :http-request="uploadRowNumFile"
                            :show-file-list="false"
                            :on-error="uploadError"
                        >
                            <img v-if="rowNumImageUrl" :src="rowNumImageUrl" class="avatar" />
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </div>
                <h4>店铺卡座</h4>
                <div v-if="shopLocaIndex == 1" class="shop-seat">
                    <div class="left-box">
                        <p class="input-seat">
                            <label style="margin-right:30px">
                                座位行数：
                                <el-input
                                    :readonly="isReadonly"
                                    v-model="x"
                                    min="1"
                                    placeholder="请输入行数"
                                    type="number"
                                    style="width:120px"
                                ></el-input>
                            </label>
                            <label>
                                座位列数：
                                <el-input
                                    :readonly="isReadonly"
                                    v-model="y"
                                    min="1"
                                    placeholder="请输入列数"
                                    type="number"
                                    style="width:120px"
                                ></el-input>
                            </label>
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
                        <!-- 回显的座位图 -->
                        <div
                            class="seat-box"
                            ref="seatBox"
                            :style="{width:32 * y + 30 + 'px'}"
                            style="overflow:hidden"
                        >
                            <div v-for="(itemY,indexY) in Number(y)" :key="indexY">
                                <div v-for="(itemX,indexX) in Number(x)" :key="indexX">
                                    <span
                                        ref="seatSpan"
                                        :data-indexX="(indexX + 1)"
                                        :data-indexY="(indexY + 1)"
                                        class="seat"
                                        @click="changeStauts($event,seatStyle)"
                                        @contextmenu.prevent="changeStauts($event,'canBook')"
                                    ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right-box">
                        <p class="seat-detail">座位详情</p>
                        <div class="seat-prop">
                            <span class="seat-detail-span">座位属性：</span>
                            <div class="prop-box">
                                <span
                                    :class="item.style"
                                    v-for="(item,index) in seatAttOpt"
                                    :key="index"
                                    :title="item.title"
                                    @click="changeStyle(item.style)"
                                ></span>
                            </div>
                        </div>
                        <div class="seat-num">
                            <span class="seat-detail-span">座位号：</span>
                            <el-input
                                v-model="presentSeatInfo.seatCode"
                                placeholder="座位号"
                                style="width:50%"
                                :readonly="isReadonly"
                            ></el-input>
                        </div>
                        <div class="seat-num">
                            <span class="seat-detail-span">座位类型：</span>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="presentSeatInfo.softHardStatus"
                                label="1"
                            >软座</el-radio>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="presentSeatInfo.softHardStatus"
                                label="2"
                            >硬座</el-radio>
                        </div>
                        <div class="acc-people">
                            <span class="seat-detail-span">容纳人数：</span>
                            <el-input
                                v-model="presentSeatInfo.numberOfPeople"
                                placeholder="容纳人数"
                                style="width:50%;margin-right:6px"
                                :readonly="isReadonly"
                            ></el-input>人
                        </div>
                        <div class="min-charge">
                            <span class="seat-detail-span">最低消费：</span>
                            <el-input
                                v-model="presentSeatInfo.minConsumption"
                                placeholder="最低消费"
                                style="width:34%;margin-right:6px"
                                :readonly="isReadonly"
                            ></el-input>元/人
                        </div>
                        <div class="lon-retain">
                            <span class="seat-detail-span">保留最晚时间：</span>
                            <el-time-select
                                style="width:50%"
                                v-model="presentSeatInfo.seatLatestReservationTime"
                                :readonly="isReadonly"
                                :picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:45'
                                }"
                            ></el-time-select>
                        </div>
                        <!-- <div class="is-toilet">
                            <span class="seat-detail-span">独立卫生间</span>
                            <span>
                                <el-radio v-model="radio" label="1">有</el-radio>
                                <el-radio v-model="radio" label="0">无</el-radio>
                            </span>
                        </div>
                        <div class="mahjong">
                            <span class="seat-detail-span">机麻</span>
                            <span>{{}}</span>桌
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
                        </div>-->
                    </div>
                </div>
                <div v-if="shopLocaIndex == 2" class="shop-seat">
                    <div class="left-box">
                        <p class="input-seat">
                            <label style="margin-right:30px">
                                座位行数：
                                <el-input
                                    :readonly="isReadonly"
                                    v-model="x"
                                    min="1"
                                    placeholder="请输入行数"
                                    type="number"
                                    style="width:120px"
                                ></el-input>
                            </label>
                            <label>
                                座位列数：
                                <el-input
                                    :readonly="isReadonly"
                                    v-model="y"
                                    min="1"
                                    placeholder="请输入列数"
                                    type="number"
                                    style="width:120px"
                                ></el-input>
                            </label>
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
                        <!-- 回显的座位图 -->
                        <div
                            class="seat-box"
                            ref="seatBox"
                            :style="{width:32 * y + 30 + 'px'}"
                            style="overflow:hidden"
                        >
                            <div v-for="(itemY,indexY) in Number(y)" :key="indexY">
                                <div v-for="(itemX,indexX) in Number(x)" :key="indexX">
                                    <span
                                        ref="seatSpan"
                                        :data-indexX="(indexX + 1)"
                                        :data-indexY="(indexY + 1)"
                                        class="seat"
                                        @click="changeStauts($event,seatStyle)"
                                        @contextmenu.prevent="changeStauts($event,'canBook')"
                                    ></span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="right-box">
                        <p class="seat-detail">座位详情</p>
                        <div class="seat-prop">
                            <span class="seat-detail-span">包间属性：</span>
                            <div class="prop-box">
                                <span
                                    :class="item.style"
                                    v-for="(item,index) in seatAttOpt"
                                    :key="index"
                                    :title="item.title"
                                    @click="changeStyle(item.style)"
                                ></span>
                            </div>
                        </div>
                        <div class="seat-num">
                            <span class="seat-detail-span">包间号/名称：</span>
                            <el-input
                                v-model="presentSeatInfo.seatCode"
                                placeholder="座位号"
                                style="width:50%"
                                :readonly="isReadonly"
                            ></el-input>
                        </div>
                        <div class="acc-people">
                            <span class="seat-detail-span">容纳人数：</span>
                            <el-input
                                v-model="presentSeatInfo.numberOfPeople"
                                placeholder="容纳人数"
                                style="width:50%"
                                :readonly="isReadonly"
                            ></el-input>
                        </div>
                        <div class="min-charge">
                            <span class="seat-detail-span">最低消费：</span>
                            <el-input
                                v-model="presentSeatInfo.minConsumption"
                                placeholder="最低消费"
                                style="width:34%;margin-right:6px"
                                :readonly="isReadonly"
                            ></el-input>元/人
                        </div>
                        <div class="lon-retain">
                            <span class="seat-detail-span">保留最晚时间：</span>
                            <el-time-select
                                style="width:50%"
                                placeholder="请选择时间"
                                v-model="presentSeatInfo.seatLatestReservationTime"
                                :readonly="isReadonly"
                                :picker-options="{
                                    start: '00:00',
                                    step: '00:15',
                                    end: '23:45'
                                }"
                            ></el-time-select>
                        </div>
                        <div class="seat-num">
                            <span class="seat-detail-span">独立卫生间：</span>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="presentSeatInfo.haveToilet"
                                label="1"
                            >有</el-radio>
                            <el-radio
                                :disabled="isReadonly"
                                v-model="presentSeatInfo.haveToilet"
                                label="2"
                            >无</el-radio>
                        </div>
                        <div class="min-charge">
                            <span class="seat-detail-span">机麻：</span>
                            <el-input
                                v-model="presentSeatInfo.mahjong"
                                placeholder="机麻数量"
                                style="width:34%;margin-right:6px"
                                :readonly="isReadonly"
                            ></el-input>桌
                        </div>
                        <div class="snacks">
                            <span class="seat-detail-span">零嘴：</span>
                            <div class="snacks-detail">
                                <div>
                                    <span>水果拼盘</span>
                                    <span class="mult">
                                        <i class="el-icon-close"></i>
                                    </span>
                                    <span>2</span>
                                </div>

                                <el-input style="width:100px" v-model="goodName" placeholder="名称"></el-input>
                                <span class="mult">
                                    <i class="el-icon-close"></i>
                                </span>
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
            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            isReadonly: true, //编辑信息开关（默认只读）
            logoImageUrl: '', //店铺logo
            shopName: '', //店铺名称
            shopBrief: '', //店铺简介
            shopLoca: ['夜店/清吧', 'ktv'], //店铺定位数组
            shopLocaIndex: 2, //默认的店铺定位下标
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

            dialogVisible: false, //点击放大查看图集时的对话框开关
            bannerImageUrl: '', //图集放大查看地址
            bannerUploadUrl: '', //上传banner图集的url字符串
            bannerShowBox: [], //要回显的banner图集（可以显示在自定义的地方）
            bannerImgBox: [], //要回显的banner图集（只能显示在上传图集的容器中）
            overallImageUrl: '', //商家布局图
            rowNumImageUrl: '', //排号banner图

            x: 0, //座位行数
            y: 0, //座位列数

            //座位属性数组
            seatAttOpt: [
                {
                    title: '不可预订',
                    name: '不可预订',
                    style: 'notBook'
                },
                {
                    title: '可预订',
                    name: '可预订',
                    style: 'canBook'
                },
                {
                    title: '可预订',
                    name: '可预订',
                    style: 'hasBook'
                },
                {
                    title: '可预订',
                    name: '可预订',
                    style: 'inBook'
                }
            ],
            seatStyle: 'hasBook', //默认的选座样式

            //夜店/清吧对应的座位信息
            nightEnterSeatDetail: [
                // {
                //     id: 1, //id
                //     seatAttribute: 2, //座位属性（1-不可预定 2-可预定 3-预定中 4-已预订）
                //     seatCode: '1', //座位号
                //     softHardStatus: '1', //软硬座类型（1-软座 2-硬座）
                //     numberOfPeople: '1', //容纳人数
                //     minConsumption: '100', //最低消费
                //     seatLatestReservationTime: '20:30', //座位保留最晚时间
                //     seatColumn: 1, //列
                //     seatRow: 1, //行
                // },
                // {
                //     id: 2, //id
                //     seatAttribute: 4, //座位属性（1-不可预定 2-可预定 3-预定中 4-已预订）
                //     seatCode: '2', //座位号
                //     softHardStatus: '2', //软硬座类型（1-软座 2-硬座）
                //     numberOfPeople: '2', //容纳人数
                //     minConsumption: '200', //最低消费
                //     seatLatestReservationTime: '21:30', //座位保留最晚时间
                //     seatColumn: 2, //列
                //     seatRow: 1, //行
                // }
            ],
            //当前座位对应的信息
            presentSeatInfo: {},

            //ktv对应的座位信息
            ktvSeatDetail: [
                {
                    id: 0, //id
                    seatAttribute: 2, //包间属性（1-不可预定 2-可预定 3-预定中 4-已预订）
                    seatCode: '', //包间号/名称
                    numberOfPeople: '', //容纳人数
                    minConsumption: '', //最低消费
                    seatLatestReservationTime: '', //座位保留最晚时间
                    haveToilet: '1', //是否有独立卫生间（1-有 2-无）
                    mahjong: '', //机麻
                    snacks: '', //零嘴
                    seatColumn: 0, //列
                    seatRow: 0, //行
                    seatType: 1 //座位类型（1-普通座位 2-卡座 3-过道）
                }
            ],

            goodName: '',
            goodNum: ''
        };
    },
    methods: {
        //上传头像-------------------------------------------------------------------
        uploadAvatarFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.logoImageUrl = this.showImgPrefix + res.data;
            });
        },

        //上传banner图-------------------------------------------------------------
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$post(this.filesUploadUrl, formData).then((res) => {
                this.bannerUploadUrl += res.data[0] + ',';
                console.log('图集地址', this.bannerUploadUrl);
            });
        },

        // 点击查看banner图集
        bannerPreview(file) {
            this.dialogVisible = true; //展示图集的对话框开启
            this.bannerImageUrl = file.url; //将返回的图集地址展示到页面上
        },

        // 删除banner图集
        bannerRemove(file, fileList) {
            //第一个参数为当前删除的图集信息，第二个参数为剩余的图集信息数组
            console.log(file, fileList);
        },

        //上传商家布局图-------------------------------------------------------------------
        uploadOverallFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.overallImageUrl = this.showImgPrefix + res.data;
            });
        },

        //上传排号banner图-------------------------------------------------------------------
        uploadRowNumFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.rowNumImageUrl = this.showImgPrefix + res.data;
            });
        },

        //编辑商铺信息
        editShopInfo() {
            this.isReadonly = false;
        },

        //切换店铺定位
        changeShopLoca(e) {
            if (this.isReadonly == false) {
                this.$refs.shopLoca.forEach((item) => {
                    item.classList.remove('shop-loca-span');
                });
                e.target.classList.add('shop-loca-span');
                if (e.target.innerHTML == '夜店/清吧') {
                    this.shopLocaIndex = 1;
                } else if (e.target.innerHTML == 'ktv') {
                    this.shopLocaIndex = 2;
                }
            }
        },

        //提交修改并保存
        submitShopInfo() {
            this.isReadonly = true;
            if (this.isReadonly == true) {
                this.$message.success('保存成功');
                console.log(this.bannerShowBox);
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

        //查看当前座位信息
        lookSeatInfo(e) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            //匹配当前座位信息
            this.nightEnterSeatDetail.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    this.presentSeatInfo = item;
                }
            });
        },

        //修改当前座位信息
        setSeatInfo(e, style) {
            e.target.className = style;
        },

        //座位点击事件
        changeStauts(e, style) {
            if (!this.isReadonly) {
                this.setSeatInfo(e, style);
            }
            this.lookSeatInfo(e);
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
            switch (type) {
                case '夜店':
                    shopType = 1;
                    break;
                case '清吧':
                    shopType = 2;
                    break;
                case 'ktv':
                    shopType = 3;
                    break;
            }
            return shopType;
        },

        //转换店铺类型（数字转文字）
        shopTypeChangeWord(type) {
            let shopType = '';
            switch (type) {
                case 1:
                    shopType = '夜店';
                    break;
                case 2:
                    shopType = '清吧';
                    break;
                case 3:
                    shopType = 'ktv';
                    break;
            }
            return shopType;
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('插入失败');
        },

        //将字符串分割为数组（图片视频专用）
        imgStrChangeArr(str) {
            let res = str.split(',');
            let newRes = res.map((item) => {
                return (item = this.showImgPrefix + item);
            });
            return newRes;
        },

        //banner图集回显
        showBannerImg(picStr) {
            this.bannerShowBox = this.imgStrChangeArr(picStr.slice(0, picStr.length - 1)); //回显在自定义的位置
            let pictureArr = this.imgStrChangeArr(picStr.slice(0, picStr.length - 1)); //回显在上传图集的容器中
            pictureArr.forEach((item) => {
                let obj = {};
                obj.url = item;
                this.bannerImgBox.push(obj);
            });
        },

        //回显店铺卡座数量（行和列数量）
        getShopSeat(seat) {
            seat = seat.split('x');
            this.x = seat[0];
            this.y = seat[1];
        },

        //回显店铺数据
        getStoreInfo() {
            this.$get('/dev/merchant/store/getStoreInfo').then((res) => {
                console.log(res.data);
                let result = res.data;
                this.logoImageUrl = 'img/' + result.logo;
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

                //banner图集模拟数据
                let picture =
                    'shangzuo-dev/20200829/vc1ljtgidmg5xlnn5gq4.jpg,shangzuo-dev/20200829/d0uqvctvwgzpbwklvrvp.jpg,shangzuo-dev/20200829/vc1ljtgidmg5xlnn5gq4.jpg,';
                this.showBannerImg(picture); //回显banner图集

                //门店卡座（模拟数据）--------------------------
                let cassette = '20x20';
                this.getShopSeat(cassette); //回显店铺卡座数量

                //所有座位（模拟数据）--------------------------
                let layoutList = [
                    {
                        haveToilet: 0,
                        id: 1298186290748964900,
                        mahjong: '',
                        minConsumption: '0.00',
                        numberOfPeople: 2,
                        seatAttribute: 3,
                        seatCode: '1',
                        seatColumn: 1,
                        seatLatestReservationTime: '20:30',
                        seatRow: 1,
                        seatType: 1,
                        snacks: '',
                        softHardStatus: 1,
                        storeId: 1298186290719604700
                    },
                    {
                        haveToilet: 0,
                        id: 1298186290748964900,
                        mahjong: '',
                        minConsumption: '0.00',
                        numberOfPeople: 2,
                        seatAttribute: 4,
                        seatCode: '2',
                        seatColumn: 2,
                        seatLatestReservationTime: '21:30',
                        seatRow: 1,
                        seatType: 1,
                        snacks: '',
                        softHardStatus: 2,
                        storeId: 1298186290719604700
                    }
                ];

                //转换返回数组中的软硬座类型（将数值型转为字符型）
                layoutList.forEach((item) => {
                    if (item.softHardStatus) {
                        item.softHardStatus = item.softHardStatus.toString();
                    }
                });

                this.nightEnterSeatDetail = layoutList; //赋值返回的座位信息

                this.showSeatAtt(); //座位属性回显

                //商家布局图和排号banner图模拟
                // this.overallImageUrl = result.layoutPicture;
                // this.rowNumImageUrl = result.rowNumberBanner;
                this.overallImageUrl = 'img/img.jpg';
                this.rowNumImageUrl = 'img/img.jpg';
            });
        },

        //座位属性回显
        showSeatAtt() {
            this.$nextTick(() => {
                //遍历所有座位
                this.$refs.seatSpan.forEach((item) => {
                    let x = item.dataset.indexx; //行
                    let y = item.dataset.indexy; //列

                    //根据返回的座位数组进行匹配，并替换当前座位的属性
                    this.nightEnterSeatDetail.forEach((item2) => {
                        if (item2.seatRow == x && item2.seatColumn == y) {
                            switch (item2.seatAttribute) {
                                case 1:
                                    item.classList.add('notBook');
                                    break;
                                case 2:
                                    item.classList.add('canBook');
                                    break;
                                case 3:
                                    item.classList.add('hasBook');
                                    break;
                                case 4:
                                    item.classList.add('inBook');
                                    break;
                            }
                        }
                    });
                });
            });
        },

        //店铺定位样式初始化
        initShopLocaStyle() {
            if (this.shopLocaIndex == 1) {
                this.$refs.shopLoca[0].classList.add('shop-loca-span');
            } else if (this.shopLocaIndex == 2) {
                this.$refs.shopLoca[1].classList.add('shop-loca-span');
            }
        },

        //修改店铺数据
        setStoreInfo() {}
    },

    created() {},

    mounted() {
        this.getStoreInfo(); //回显所有店铺数据
        this.initShopLocaStyle(); //店铺定位样式初始化
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
    margin-bottom: 30px;
}

.right-wrap .shop-info img {
    border-radius: 6px !important;
}

.shop-brief {
    display: flex;
    align-items: center;
}

.left-wrap .shop-info .left-info {
    width: 30%;
    float: left;
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

.shop-info .banner-box > p {
    margin-bottom: 10px;
}

.shop-info .overall-box > p {
    margin-bottom: 10px;
}

.shop-info .overall-box > img {
    width: 160px;
    height: 200px;
}

.shop-info .rowNum-box > p {
    margin-bottom: 10px;
}

.shop-info .rowNum-box > img {
    width: 200px;
    height: 160px;
}

.left-wrap .shop-info .right-info {
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

.left-wrap .shop-loca {
    margin-bottom: 30px;
}

.left-wrap .shop-loca > p {
    margin-bottom: 10px;
}

.left-wrap .shop-loca > div span {
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
    cursor: pointer;
}

.shop-loca-span {
    background-color: #ecf5ff;
}

.left-wrap .shop-div {
    display: flex;
    margin-bottom: 30px;
}

.left-wrap .shop-div .shop-div1 {
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

.right-wrap {
    height: 100%;
    width: 100%;
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
    justify-content: space-between;
    margin-bottom: 40px;
}

.right-wrap .shop-info .banner-box {
    width: 38%;
}

>>> .el-textarea__inner {
    resize: none !important;
}

>>> .el-upload-list--picture-card .el-upload-list__item {
    width: 170px;
    height: 100px;
}

>>> .el-upload--picture-card {
    width: 170px;
    height: 100px;
    line-height: 100px;
}

>>> .overall-box .el-upload--text {
    width: 160px;
    height: 200px;
    line-height: 200px;
}

>>> .overall-box .el-upload--text > img {
    width: 160px;
    height: 200px;
}

>>> .rowNum-box .el-upload--text {
    width: 200px;
    height: 160px;
    line-height: 160px;
}

>>> .rowNum-box .el-upload--text > img {
    width: 200px;
    height: 160px;
}

.right-wrap .shop-info .banner-box > div img {
    width: 170px;
    height: 100px;
    margin: 0 10px 10px 0;
}

.right-wrap .shop-seat {
    display: flex;
}

.right-wrap .shop-seat .left-box {
    margin-right: 30px;
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
    margin-top: 94px;
}

.shop-seat .right-box > div {
    display: flex;
    align-items: center;
}

.shop-seat .right-box > div > span {
    margin-right: 0;
    width: 120px;
}

.shop-seat .right-box .seat-detail {
    margin-bottom: 30px;
}

.shop-seat .right-box .seat-prop {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
}

.seat-num {
    margin-bottom: 30px;
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

.shop-seat .right-box .seat-prop .prop-box span:last-child {
    margin-right: 0;
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