<template>
    <div class="con-wrap">
        <div class="container">
            <!-- 左边区域 -->
            <div class="left-wrap">
                <h4>
                    <span>店铺信息</span>
                    <el-button type="primary" @click="editShopInfo">编辑</el-button>
                    <el-button type="success" @click="submitShopInfo" v-if="!isReadonly">保存</el-button>
                    <el-button type="info" @click="cancelSubmit" v-if="!isReadonly">取消</el-button>
                </h4>

                <!-- 店铺基本信息 -->
                <div class="shop-info clearfix">
                    <div class="left-info">
                        <p>店铺招牌logo</p>
                        <img
                            v-if="isReadonly&&logoImageUrl"
                            :src="showImgPrefix + logoImageUrl"
                            class="avatar"
                        />
                        <el-upload
                            v-else
                            class="avatar-uploader"
                            action="1"
                            :http-request="uploadAvatarFile"
                            :show-file-list="false"
                            :on-error="uploadError"
                        >
                            <img
                                v-if="logoImageUrl"
                                :src="showImgPrefix + logoImageUrl"
                                class="avatar"
                            />
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

                <!-- 店铺定位 -->
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

                <!-- 店铺标签 -->
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

                <!-- 店铺营业时间，客服电话，人均消费，类型 -->
                <div class="shop-div">
                    <div class="shop-div1">
                        <!-- 店铺营业时间 -->
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
                        <!-- 店铺人均消费 -->
                        <div class="per-con">
                            <p>店铺人均消费</p>
                            <el-input
                                v-model="perCon"
                                placeholder="人均消费"
                                style="width:44%;margin-right:6px"
                                :readonly="isReadonly"
                            ></el-input>元/人
                        </div>
                    </div>
                    <div class="shop-div2">
                        <!-- 客服电话 -->
                        <div class="service-phone">
                            <p>客服电话</p>
                            <el-input
                                v-model="servicePhone"
                                placeholder="客服电话"
                                style="width:70%"
                                :readonly="isReadonly"
                            ></el-input>
                        </div>
                        <!-- 店铺类型 -->
                        <div class="shop-type">
                            <p>
                                店铺类型
                                <span>（用于客户筛选出本店）</span>
                            </p>
                            <div class="type-box">
                                <div v-if="isReadonly">
                                    <span
                                        v-for="(item,index) in shopTypeOptStrArr"
                                        :key="index"
                                        class="shop-type-span"
                                    >{{item}}</span>
                                </div>
                                <div v-else>
                                    <span
                                        v-for="(item,index) in shopTypeOpt"
                                        :key="index"
                                        @click="checkType($event,item)"
                                    >{{item}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 店铺地址 -->
                <div class="shop-address">
                    <p>店铺地址</p>
                    <p v-if="isReadonly" class="shop-add clearfix">
                        <span>{{province}}</span>
                        <span>{{city}}</span>
                        <span>{{district}}</span>
                        <span>{{trustAddress}}</span>
                    </p>
                    <div v-else>
                        <mapCom @child-data="childData" :mapList="mapList"></mapCom>
                    </div>
                </div>

                <!-- 商品文本域部分 -->
                <div class="shop-desc">
                    <!-- 商品店面简介 -->
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
                    <!-- 订桌注意事项 -->
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
                    <!-- 排号商家提醒 -->
                    <!-- <div class="shop-remind">
                        <span>排号商家提醒：</span>
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入排号商家提醒"
                            v-model="shopRemind"
                            style="width:76%"
                            :readonly="isReadonly"
                        ></el-input>
                    </div>-->
                </div>
            </div>

            <!-- 右边区域 -->
            <div class="right-wrap">
                <h4>店铺展示图</h4>
                <!-- 店铺所有展示图 -->
                <div class="shop-info">
                    <!-- banner展示图 -->
                    <div class="banner-box">
                        <p>店铺banner图</p>
                        <div v-if="isReadonly">
                            <img
                                v-for="(item,index) in bannerShowBox"
                                :key="index"
                                :src="showImgPrefix + item"
                            />
                        </div>
                        <el-upload
                            v-else
                            action="1"
                            list-type="picture-card"
                            :before-upload="beforeBannerUpload"
                            :http-request="uploadBannerFiles"
                            :on-remove="bannerRemove"
                            :file-list="bannerImgBox"
                            :on-error="uploadError"
                        >
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>

                    <div class="rowNum-box">
                        <!-- 排号横幅图 -->
                        <div class="top">
                            <p>排号横幅图</p>
                            <img
                                v-if="isReadonly&&logoImageUrl"
                                :src="showImgPrefix + rowNumImageUrl"
                                class="avatar"
                            />
                            <el-upload
                                v-else
                                class="avatar-uploader"
                                action="1"
                                :http-request="uploadRowNumFile"
                                :show-file-list="false"
                                :on-error="uploadError"
                            >
                                <img
                                    v-if="rowNumImageUrl"
                                    :src="showImgPrefix + rowNumImageUrl"
                                    class="avatar"
                                />
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                        <!-- 店铺长图 -->
                        <div class="botm">
                            <p>店铺长图（用于展示位置变化）</p>
                            <img
                                v-if="isReadonly&&logoImageUrl"
                                :src="showImgPrefix + appShopImageUrl"
                                class="avatar"
                            />
                            <el-upload
                                v-else
                                class="avatar-uploader"
                                action="1"
                                :http-request="uploadAppShopFile"
                                :show-file-list="false"
                                :on-error="uploadError"
                            >
                                <img
                                    v-if="appShopImageUrl"
                                    :src="showImgPrefix + appShopImageUrl"
                                    class="avatar"
                                />
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </div>

                    <!-- 商家布局图 -->
                    <div class="overall-box">
                        <p>商家布局图</p>
                        <img
                            v-if="isReadonly&&logoImageUrl"
                            :src="showImgPrefix + overallImageUrl"
                            class="avatar"
                        />
                        <el-upload
                            v-else
                            class="avatar-uploader"
                            action="1"
                            :http-request="uploadOverallFile"
                            :show-file-list="false"
                            :on-error="uploadError"
                        >
                            <img
                                v-if="overallImageUrl"
                                :src="showImgPrefix + overallImageUrl"
                                class="avatar"
                            />
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </div>
                <h4>店铺卡座</h4>
                <div class="shop-seat">
                    <!-- 左边座位展示 -->
                    <div class="left-box">
                        <!-- 座位行数和列数 -->
                        <p class="input-seat">
                            <label style="margin-right:30px">
                                座位行数：
                                <el-input-number
                                    :disabled="isReadonly"
                                    v-model="x"
                                    :min="6"
                                    style="width:120px"
                                    label="行数"
                                ></el-input-number>
                            </label>
                            <label style="margin-right:30px">
                                座位列数：
                                <el-input-number
                                    :disabled="isReadonly"
                                    v-model="y"
                                    :min="6"
                                    style="width:120px"
                                    label="列数"
                                ></el-input-number>
                            </label>
                        </p>
                        <!-- 座位属性标题 -->
                        <div class="seat-title">
                            <p @click="changeStyle('notBook')">
                                <span class="not-book"></span>
                                不可预订
                            </p>
                            <p @click="changeStyle('canBook')">
                                <span class="can-book"></span>
                                可预订
                            </p>
                            <p @click="changeStyle('hasBook')">
                                <span class="in-book"></span>
                                预定中
                            </p>
                            <p @click="changeStyle('inBook')">
                                <span class="has-book"></span>
                                已预订
                            </p>
                            <p @click="changeStyle('stageBook')">
                                <span class="stage-book"></span>
                                舞台
                            </p>
                        </div>
                        <!-- 回显的座位图 -->
                        <div
                            v-if="x&&y"
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
                    <!-- 当选择夜店/清吧时展示的座位属性 -->
                    <div
                        v-if="isClickSeat && shopLocaIndex == 1 || isClickSeat && shopLocaIndex == 2"
                        class="right-box"
                    >
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
                        <div class="min-charge">
                            <span class="seat-detail-span min-con">最低消费：</span>
                            <div class="day-mincom">
                                <p>
                                    <span>星期一</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[0].price"
                                        placeholder="最低消费"
                                        style="width:47%;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期二</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[1].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期三</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[2].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期四</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[3].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期五</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[4].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期六</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[5].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期七</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[6].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                            </div>
                        </div>
                    </div>
                    <!-- 当选择ktv时展示的座位属性 -->
                    <div v-if="isClickSeat && shopLocaIndex == 3" class="right-box">
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
                            <span class="seat-detail-span snacks">零嘴：</span>
                            <div class="snacks-detail">
                                <ul>
                                    <li v-for="(item,index) in presentSeatInfo.snacks" :key="index">
                                        <!-- <span class="snacks-name" :title="item.name">{{item.name}}</span>
                                        <span class="mult">
                                            <i class="el-icon-close"></i>
                                        </span>
                                        <span>{{item.num}}</span>-->
                                        <el-input
                                            style="width:90px"
                                            v-model="item.name"
                                            placeholder="名称"
                                            :readonly="isReadonly"
                                        ></el-input>
                                        <span class="mult">
                                            <i class="el-icon-close"></i>
                                        </span>
                                        <el-input
                                            style="width:60px;margin-right:10px"
                                            v-model="item.num"
                                            placeholder="数量"
                                            :readonly="isReadonly"
                                        ></el-input>
                                        <el-button
                                            v-if="!isReadonly"
                                            @click="deleteSnacks(item)"
                                            type="danger"
                                        >删除</el-button>
                                    </li>
                                </ul>
                                <span
                                    v-if="presentSeatInfo.snacks.length == 0 && isReadonly"
                                    style="margin-left:74px"
                                >无</span>
                                <div class="snacks-form" v-if="!isReadonly">
                                    <el-input
                                        style="width:90px"
                                        v-model="snackName"
                                        placeholder="名称"
                                        :readonly="isReadonly"
                                    ></el-input>
                                    <span class="mult">
                                        <i class="el-icon-close"></i>
                                    </span>
                                    <el-input
                                        style="width:60px;margin-right:10px"
                                        v-model="snackNum"
                                        placeholder="数量"
                                        :readonly="isReadonly"
                                    ></el-input>
                                    <el-button
                                        :disabled="isReadonly"
                                        type="primary"
                                        @click="addSnacks"
                                    >确定</el-button>
                                </div>
                            </div>
                        </div>
                        <div class="min-charge">
                            <span class="seat-detail-span min-con">最低消费：</span>
                            <div class="day-mincom">
                                <p>
                                    <span>星期一</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[0].price"
                                        placeholder="最低消费"
                                        style="width:47%;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期二</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[1].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期三</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[2].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期四</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[3].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期五</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[4].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期六</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[5].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                                <p>
                                    <span>星期七</span>
                                    <el-input
                                        v-model="presentSeatInfo.weekPriceList[6].price"
                                        placeholder="最低消费"
                                        style="width:47%;;margin-right:6px"
                                        :readonly="isReadonly"
                                    ></el-input>元/人
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mapCom from '../../components/common/map';

export default {
    components: {
        mapCom
    },

    data() {
        return {
            //传给地图子组件的值
            mapList: {
                width: '100%',
                height: '300px',
                status: true,
                searchAddress: '',
                trustAddress: ''
            },

            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            isReadonly: true, //编辑信息开关
            isUpdate: true, //判断当前操作为修改还是新增店铺

            shopId: '', //门店ID
            logoImageUrl: '', //店铺logo
            shopName: '', //店铺名称
            shopBrief: '', //店铺简介

            shopLoca: ['夜店', '清吧', 'ktv'], //店铺定位数组
            shopLocaIndex: 1, //店铺定位下标
            dynamicTags: [], //店铺标签数组
            inputVisible: false, //添加店铺标签的输入框开关
            inputValue: '', //店铺标签输入框的输入值
            startBussTime: '', //开始营业时间
            endBussTime: '', //结束营业时间

            province: '', //省
            city: '', //市
            district: '', //区县
            districtCode: '', //区县编码
            searchAddress: '', //地址搜索框里的值
            trustAddress: '', //输入的详细地址
            longitude: '', //经度
            latitude: '', //纬度

            servicePhone: '', //客服电话
            shopType: '', //选择的店铺类型
            shopTypeOpt: ['1', '2', '3', '4'], //所有店铺类型
            shopTypeOptStrArr: [], //用于回显店铺类型
            shopTypeOptStr: '', //所选的店铺类型（提交时用到的字符串）
            perCon: '', //人均消费

            goodsBrief: '', //商品店面简介
            shopMatter: '', //订桌注意事项
            shopRemind: '', //排号商家提醒

            bannerShowBox: [], //要上传的banner图集和回显的banner图集（回显在自定义的位置）
            bannerImgBox: [], //要回显的banner图集（只能显示在上传图集的容器中）

            overallImageUrl: '', //商家布局图
            rowNumImageUrl: '', //排号横幅图
            appShopImageUrl: '', //店铺长图

            x: 20, //座位行数
            y: 20, //座位列数

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
                    title: '预定中',
                    name: '预定中',
                    style: 'hasBook'
                },
                {
                    title: '已预订',
                    name: '已预订',
                    style: 'inBook'
                },
                {
                    title: '舞台',
                    name: '舞台',
                    style: 'stageBook'
                }
            ],
            seatStyle: 'hasBook', //默认的选座样式

            allSeatDetailInfo: [], //所有座位详细信息
            presentSeatInfo: {}, //当前座位对应的详细信息
            isClickSeat: false, //展示当前座位的详细信息开关

            snackName: '', //当前座位的零嘴名称
            snackNum: '' //当前座位的零嘴数量
        };
    },
    methods: {
        //接收地图子组件传过来的参数
        childData(data) {
            if (data) {
                this.longitude = data.location.lng;
                this.latitude = data.location.lat;
                this.province = data.ad_info.province;
                this.city = data.ad_info.city;
                this.district = data.ad_info.district;
                this.districtCode = data.ad_info.adcode;
                this.searchAddress = data.title;
                this.trustAddress = data.trustAddress;
            }
        },

        //上传头像
        uploadAvatarFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.logoImageUrl = res.data;
            });
        },

        //上传banner图之前的验证
        beforeBannerUpload(file) {
            console.log('上传之前', file);

            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2; //限制文件大小

            if (!isJPG && !isPNG) {
                this.$message.error('上传图片只能是 JPG 或 PNG 格式');
            }

            if (!isLt2M) {
                this.$message.error('上传文件大小不能超过 2MB!');
            }

            // console.log(isJPG, isPNG, isLt2M);
            return isJPG || (isPNG && isLt2M);
        },

        //上传banner图
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$post(this.filesUploadUrl, formData).then((res) => {
                this.bannerShowBox.push(res.data[0]);
                console.log('图集', this.bannerShowBox);
            });
        },

        //将字符串分割为数组（banner图片视频专用）
        imgStrChangeArr(str) {
            let res = str.split(',');
            let newRes = res.map((item) => {
                return (item = this.showImgPrefix + item);
            });
            return newRes;
        },

        //回显banner图集
        showBannerImg(picStr) {
            this.bannerImgBox = [];
            let pictureArr = this.imgStrChangeArr(picStr); //回显在上传图集的容器中
            pictureArr.forEach((item) => {
                let obj = {};
                obj.url = item;
                this.bannerImgBox.push(obj);
            });
        },

        // 删除banner图集
        bannerRemove(file, fileList) {
            this.bannerShowBox.forEach((item, i) => {
                if (this.showImgPrefix + item == file.url) {
                    this.bannerShowBox.splice(i, 1);
                }
            });
            console.log('剩余的图集数组', this.bannerShowBox);
        },

        //上传商家布局图
        uploadOverallFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.overallImageUrl = res.data;
            });
        },

        //上传排号横幅图
        uploadRowNumFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.rowNumImageUrl = res.data;
            });
        },

        //上传店铺长图
        uploadAppShopFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.appShopImageUrl = res.data;
            });
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('插入失败');
        },

        //切换店铺定位
        changeShopLoca(e) {
            if (!this.isReadonly) {
                this.$refs.shopLoca.forEach((item) => {
                    item.classList.remove('shop-loca-span');
                });
                e.target.classList.add('shop-loca-span');

                //切换店铺定位下标
                if (e.target.innerHTML == '夜店') {
                    this.shopLocaIndex = 1;
                } else if (e.target.innerHTML == '清吧') {
                    this.shopLocaIndex = 2;
                } else if (e.target.innerHTML == 'ktv') {
                    this.shopLocaIndex = 3;
                }
            }
        },

        //选择店铺类型
        checkType(e, item) {
            if (!e.target.className) {
                e.target.classList.add('shop-type-span');
                this.shopTypeOptStr += item + ',';
            } else {
                e.target.classList.remove('shop-type-span');
                this.shopTypeOptStr = this.shopTypeOptStr.replace(item + ',', '');
            }
        },

        //编辑商铺信息
        editShopInfo() {
            this.isReadonly = false;

            //给地图子组件传值（回显地址信息）
            this.mapList.searchAddress = this.searchAddress;
            this.mapList.trustAddress = this.trustAddress;
        },

        //新增店铺
        submitCreatShop() {
            //数组转json形式（零嘴）
            let seatArr = JSON.parse(JSON.stringify(this.allSeatDetailInfo));
            seatArr.forEach((item) => {
                item.snacks = JSON.stringify(item.snacks);
            });

            //将数值型转为字符型（软硬座和有无卫生间）
            // this.allSeatDetailInfo.forEach((item) => {
            //     if (item.softHardStatus || item.haveToilet) {
            //         item.softHardStatus = Number(item.softHardStatus);
            //         item.haveToilet = Number(item.haveToilet);
            //     }
            // });

            //要传的值
            let data = {
                appListBigPicture: this.appShopImageUrl,
                businessReminder: '商家排号提醒',
                cassette: `${this.x}x${this.y}`,
                city: this.city,
                customerServicePhone: this.servicePhone,
                district: this.district,
                districtCode: this.districtCode,
                endTime: this.endBussTime,
                goodsStoreSynopsis: this.goodsBrief,
                labels: this.dynamicTags.join(','),
                layoutPicture: this.overallImageUrl,
                logo: this.logoImageUrl,
                lonlat: `${this.longitude},${this.latitude}`,
                name: this.shopName,
                perCapitaConsumption: this.perCon,
                picture: this.bannerShowBox.join(','),
                province: this.province,
                rowNumberBanner: this.rowNumImageUrl,
                searchAddress: this.searchAddress,
                startTime: this.startBussTime,
                storeLocation: this.shopLocaIndex,
                synopsis: this.shopBrief,
                tableReservationNotes: this.shopMatter,
                trustAddress: this.trustAddress,
                type: this.shopTypeOptStr,
                layoutList: seatArr
            };

            console.log('新增时传的值', data);

            this.$post('/api/merchant/store/save', data)
                .then((res) => {
                    if (res.code == 0) {
                        this.getStoreInfo();
                        this.$message.success('添加成功');
                        this.isReadonly = true;
                        this.isUpdate = true;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.isReadonly = true;
                    console.log(err);
                });
        },

        //修改店铺
        submitUpdateShop() {
            //数组转json形式（零嘴）
            // let seatArr = JSON.parse(JSON.stringify(this.allSeatDetailInfo));
            // seatArr.forEach((item) => {
            //     item.snacks = JSON.stringify(item.snacks);
            // });

            this.allSeatDetailInfo.forEach((item) => {
                item.snacks = JSON.stringify(item.snacks);
            });

            //将数值型转为字符型（软硬座和有无卫生间）
            // this.allSeatDetailInfo.forEach((item) => {
            //     if (item.softHardStatus || item.haveToilet) {
            //         item.softHardStatus = Number(item.softHardStatus);
            //         item.haveToilet = Number(item.haveToilet);
            //     }
            // });

            //要传的值
            let data = {
                id: this.shopId,
                appListBigPicture: this.appShopImageUrl,
                businessReminder: '商家排号提醒',
                cassette: `${this.x}x${this.y}`,
                city: this.city,
                customerServicePhone: this.servicePhone,
                district: this.district,
                districtCode: this.districtCode,
                endTime: this.endBussTime,
                goodsStoreSynopsis: this.goodsBrief,
                labels: this.dynamicTags.join(','),
                layoutPicture: this.overallImageUrl,
                logo: this.logoImageUrl,
                lonlat: `${this.longitude},${this.latitude}`,
                name: this.shopName,
                perCapitaConsumption: this.perCon,
                picture: this.bannerShowBox.join(','),
                province: this.province,
                rowNumberBanner: this.rowNumImageUrl,
                searchAddress: this.searchAddress,
                startTime: this.startBussTime,
                storeLocation: this.shopLocaIndex,
                synopsis: this.shopBrief,
                tableReservationNotes: this.shopMatter,
                trustAddress: this.trustAddress,
                type: this.shopTypeOptStr,
                layoutList: this.allSeatDetailInfo
            };

            console.log('修改时传的值', data);

            this.$put('/api/merchant/store/update', data)
                .then((res) => {
                    if (res.code == 0) {
                        this.getStoreInfo();
                        this.$message.success('修改成功');
                        this.isReadonly = true;
                    } else {
                        this.$message.error(res.msg);
                    }
                })
                .catch((err) => {
                    this.isReadonly = true;
                    console.log(err);
                });
        },

        //保存按钮
        submitShopInfo() {
            if (!this.isReadonly) {
                if (!this.isUpdate) {
                    this.submitCreatShop(); //新增店铺
                } else {
                    this.submitUpdateShop(); //修改店铺
                }
                this.isClickSeat = false; //展示当前点击的座位的详细信息
            }
        },

        //取消保存按钮
        cancelSubmit() {
            this.isReadonly = true;
            this.isClickSeat = false; //展示当前点击的座位的详细信息
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

        //查看当前座位信息（修改和添加的情况下）
        lookSeatInfo(e, seatType, stageCode) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            //匹配当前座位信息
            this.allSeatDetailInfo.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    this.presentSeatInfo = item;

                    //修改当前座位的属性值
                    this.presentSeatInfo.seatAttribute = seatType == 'stageBook' ? this.presentSeatInfo.seatAttribute : seatType;

                    //修改当前座位为舞台
                    this.presentSeatInfo.seatType = stageCode;

                    // console.log('当前点击的座位信息', this.presentSeatInfo);
                }
            });
        },

        //查看当前座位信息（普通情况下）
        lookSeatInfo2(e) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            //匹配当前座位信息
            this.allSeatDetailInfo.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    this.presentSeatInfo = item;
                    // console.log('当前点击的座位信息', this.presentSeatInfo);
                }
            });
        },

        //座位点击事件
        changeStauts(e, style) {
            //只有在编辑商铺时，点击座位才会显示对话框
            if (!this.isReadonly) {
                this.dialogFormVisible = true;
            }
            this.isClickSeat = true; //展示当前点击的座位的详细信息

            let seatType = style;
            let stageCode = 3;

            //修改当前座位的属性（座位颜色）
            if (!this.isReadonly) {
                switch (seatType) {
                    case 'notBook':
                        seatType = 1;
                        break;
                    case 'canBook':
                        seatType = 2;
                        break;
                    case 'hasBook':
                        seatType = 3;
                        break;
                    case 'inBook':
                        seatType = 4;
                        break;
                    case 'stageBook':
                        stageCode = 4;
                        break;
                }
                this.setSeatInfo(e, style);
                this.lookSeatInfo(e, seatType, stageCode); //查看当前座位信息
            } else {
                this.lookSeatInfo2(e, seatType, stageCode); //查看当前座位信息
            }
        },

        //修改当前座位属性
        setSeatInfo(e, style) {
            e.target.className = style;
        },

        //改变座位状态按钮（改变点击的座位颜色）
        changeStyle(style) {
            this.seatStyle = style;
        },

        //将返回的字符串转为数组
        strChangeArr(str) {
            return str.split(',');
        },

        //回显店铺卡座数量（行和列数量）
        getShopSeat(seat) {
            seat = seat.split('x');
            this.x = seat[0];
            this.y = seat[1];
        },

        //获取经纬度
        getlonlat(lonlat) {
            lonlat = lonlat.split(',');
            this.longitude = lonlat[0];
            this.latitude = lonlat[1];
        },

        //添加零嘴
        addSnacks() {
            let snacksObj = {};
            snacksObj.name = this.snackName;
            snacksObj.num = this.snackNum;

            // let snacksArr = [];
            // snacksArr.push(snacksObj);

            // snacksArr.forEach((item) => {
            //     this.presentSeatInfo.snacks.push(item);
            // });

            this.presentSeatInfo.snacks.push(snacksObj);

            this.snackName = '';
            this.snackNum = '';

            console.log('添加零嘴', this.presentSeatInfo.snacks);
        },

        //删除零嘴
        deleteSnacks(item) {
            this.presentSeatInfo.snacks.forEach((ele, i) => {
                if (ele.name == item.name && ele.num == item.num) {
                    this.presentSeatInfo.snacks.splice(i, 1);
                }
            });

            console.log('删除零嘴', this.presentSeatInfo.snacks);
        },

        //座位属性回显
        showSeatAtt() {
            this.$nextTick(() => {
                //遍历所有座位
                this.$refs.seatSpan.forEach((item) => {
                    let x = item.dataset.indexx; //行
                    let y = item.dataset.indexy; //列

                    //根据返回的座位数组进行匹配，并替换当前座位的属性
                    this.allSeatDetailInfo.forEach((item2) => {
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

                            if (item2.seatType == 4) {
                                item.classList.add('stageBook');
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
            } else if (this.shopLocaIndex == 3) {
                this.$refs.shopLoca[2].classList.add('shop-loca-span');
            }
        },

        //创建座位
        createSeatFn() {
            this.allSeatDetailInfo = [];
            //根据行数和列数动态的创建座位
            for (let i = 1; i <= this.y; i++) {
                for (let j = 1; j <= this.x; j++) {
                    this.allSeatDetailInfo.push({
                        haveToilet: '1',
                        mahjong: '',
                        minConsumption: 0,
                        numberOfPeople: 1,
                        seatAttribute: 2,
                        seatCode: j + '-' + i,
                        seatColumn: i,
                        seatLatestReservationTime: '',
                        seatRow: j,
                        seatType: 3,
                        snacks: [],
                        softHardStatus: '1',
                        weekPriceList: [
                            {
                                id: '',
                                price: 0,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 1
                            },
                            {
                                id: '',
                                price: 0,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 2
                            },
                            {
                                id: '',
                                price: 0,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 3
                            },
                            {
                                id: '',
                                price: 0,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 4
                            },
                            {
                                id: '',
                                price: 0,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 5
                            },
                            {
                                id: '',
                                price: 0,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 6
                            },
                            {
                                id: '',
                                price: 0,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 7
                            }
                        ]
                    });
                }
            }

            //重新创建座位就要将之前的样式全部清除
            this.$refs.seatSpan.forEach((item) => {
                item.className = 'seat';
            });
        },

        //回显店铺数据
        getStoreInfo() {
            this.$get('/api/merchant/store/getStoreInfo').then((res) => {
                if (res.code == 0) {
                    let result = res.data;

                    //返回的所有属性
                    this.shopId = result.id;
                    this.appShopImageUrl = result.appListBigPicture;
                    this.shopRemind = result.businessReminder;
                    let cassette = result.cassette;
                    this.city = result.city;
                    this.servicePhone = result.customerServicePhone;
                    this.district = result.district;
                    this.districtCode = result.districtCode;
                    this.endBussTime = result.endTime;
                    this.goodsBrief = result.goodsStoreSynopsis;
                    this.dynamicTags = this.strChangeArr(result.labels);
                    this.overallImageUrl = result.layoutPicture;
                    this.logoImageUrl = result.logo;
                    let lonlat = result.lonlat;
                    this.shopName = result.name;
                    this.perCon = result.perCapitaConsumption;
                    let picture = result.picture;
                    this.bannerShowBox = result.picture.split(',');
                    this.province = result.province;
                    this.rowNumImageUrl = result.rowNumberBanner;
                    this.searchAddress = result.searchAddress;
                    this.startBussTime = result.startTime;
                    this.shopLocaIndex = result.storeLocation;
                    this.shopBrief = result.synopsis;
                    this.shopMatter = result.tableReservationNotes;
                    this.trustAddress = result.trustAddress;
                    let shopTypeStr = result.type;
                    this.shopTypeOptStr = result.type;
                    let layoutList = result.layoutList;

                    //回显banner图集
                    this.showBannerImg(picture);

                    //回显店铺卡座数量
                    this.getShopSeat(cassette);

                    //获取经纬度
                    this.getlonlat(lonlat);

                    //门店类型（模拟数据）
                    this.shopTypeOptStrArr = this.strChangeArr(shopTypeStr.slice(0, shopTypeStr.length - 1)); //转换为数组并赋值，回显到页面上

                    //json字符串转为数组对象形式（零嘴）
                    layoutList.forEach((item) => {
                        item.snacks = JSON.parse(item.snacks);
                    });

                    //将数值型转为字符型（软硬座和有无卫生间）
                    layoutList.forEach((item) => {
                        if (item.softHardStatus || item.haveToilet) {
                            item.softHardStatus = item.softHardStatus.toString();
                            item.haveToilet = item.haveToilet.toString();
                        }
                    });

                    this.allSeatDetailInfo = layoutList; //赋值返回的座位信息

                    this.showSeatAtt(); //座位属性回显

                    this.initShopLocaStyle(); //店铺定位样式初始化

                    console.log('当前店铺数据', res.data);
                } else if (res.code == 600) {
                    this.$confirm(res.msg, '提示', {
                        confirmButtonText: '添加门店',
                        cancelButtonText: '取消',
                        type: 'warning'
                    })
                        .then(() => {
                            this.isReadonly = false;
                            this.isUpdate = false;
                            this.createSeatFn();
                        })
                        .catch(() => {
                            this.$router.push('/index');
                        });
                }
            });
        }
    },

    watch: {
        //行数变化就重新渲染座位
        x(newVal, oldVal) {
            if (!this.isReadonly) {
                if (oldVal != newVal) {
                    this.createSeatFn();
                }
            }
        },
        //列数变化就重新渲染座位
        y(newVal, oldVal) {
            if (!this.isReadonly) {
                if (oldVal != newVal) {
                    this.createSeatFn();
                }
            }
        }
    },

    mounted() {
        this.getStoreInfo(); //回显所有店铺数据
    }
};
</script>

<style scoped>
.add-classify-title {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.add-classify-title::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    margin-right: 10px;
    background-color: #999;
}

>>> .el-dialog__header {
    padding: 0;
}

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
    padding: 20px;
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

.shop-info .rowNum-box div > p {
    margin-bottom: 10px;
}

.shop-info .rowNum-box div.top {
    margin-bottom: 30px;
}

.shop-info .rowNum-box div > img {
    width: 200px;
    height: 120px;
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

>>> .left-wrap .shop-address .dtl_add {
    margin: 10px 0;
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

.left-wrap .per-con > p {
    margin-bottom: 10px;
}

.shop-seat .right-box .min-charge {
    margin-top: 30px;
    align-items: flex-start;
}

.shop-seat .right-box .min-charge .day-mincom {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 16px 20px;
    width: 80%;
}

.shop-seat .right-box .min-charge .day-mincom > p {
    margin-bottom: 16px;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.shop-seat .right-box .min-charge .day-mincom > p:last-child {
    margin-bottom: 0;
}

.shop-seat .right-box .min-charge .day-mincom > p > span {
    margin-right: 10px;
}

.shop-type > p {
    margin-bottom: 10px;
}

.shop-type .type-box::after {
    display: block;
    content: '';
    clear: both;
}

.shop-type .type-box div > span {
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

.shop-type-span {
    background-color: #ecf5ff;
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
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
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
    line-height: 1.9;
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
    height: 120px;
    line-height: 120px;
}

>>> .rowNum-box .el-upload--text > img {
    width: 200px;
    height: 120px;
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
    /* width: 360px; */
    margin-bottom: 20px;
}

.right-wrap .shop-seat .left-box .seat-title > p {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
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

.stage-book {
    background-color: #008000 !important;
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
    border: 1px solid #ddd;
}

.notBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
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
    margin-right: 10px;
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
    margin-right: 10px;
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
    margin-right: 10px;
    border: 1px solid transparent !important;
    background-color: #f56c6c !important;
    cursor: pointer;
}

.stageBook {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    margin-bottom: 10px;
    margin-right: 10px;
    border: 1px solid transparent !important;
    background-color: #008000 !important;
    cursor: pointer;
}

.shop-seat .right-box {
    margin-top: 94px;
}

.shop-seat .right-box > div {
    display: flex;
    align-items: center;
}

.shop-seat .right-box > div.snacks {
    align-items: flex-start;
}

.shop-seat .right-box > div > span {
    margin-right: 0;
    width: 120px;
}

.shop-seat .right-box > div > span.snacks {
    width: 48px !important;
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

.seat-detail-span.min-con {
    float: left;
    margin-right: 0px;
    /* width: 132px !important; */
}

.snacks .snacks-detail li {
    /* float: left; */
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}

.snacks .snacks-detail li .snacks-name {
    max-width: 132px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.snacks .snacks-form {
    display: flex;
    align-items: center;
}

>>> .snacks .snacks-form .el-input__inner {
    padding: 0 8px;
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
    margin: 0 3px;
}
</style>