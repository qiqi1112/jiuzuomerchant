<template>
    <div class="con-wrap">
        <div class="container">
            <!-- 左边区域 -->
            <div class="left-wrap">
                <h4>
                    <span>店铺信息</span>
                    <el-button type="primary" @click="editShopInfo">编辑</el-button>
                    <el-button type="success" @click="submitShopInfo" v-if="!isReadonly">保存</el-button>
                    <el-button type="info" @click="storageInfo" v-if="!isReadonly&&!isUpdate">暂存数据</el-button>
                    <el-button type="info" @click="cancelSubmit" v-if="!isReadonly&&isUpdate">取消</el-button>
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
                                    step: '00:10',
                                    end: '23:50'
                                }"
                                    placeholder="开始"
                                ></el-time-select>
                                <span>~</span>
                                <el-time-select
                                    v-model="endBussTime"
                                    :readonly="isReadonly"
                                    :picker-options="{
                                    start: '00:00',
                                  step: '00:10',
                                  end: '23:50'
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
                                        ref="shopTypeSpan"
                                        v-for="(item,index) in shopTypeOpt"
                                        :key="index"
                                        @click="checkType($event,item.id)"
                                    >{{item.recommendBrand}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 店铺地址 -->
                <div class="shop-address">
                    <p>店铺地址</p>
                    <div v-if="isReadonly" class="shop-add clearfix">
                        <div v-if="searchAddress">
                            <span>{{province}}</span>
                            <span>{{city}}</span>
                            <span>{{district}}</span>
                            <span>{{trustAddress}}</span>
                        </div>
                    </div>
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
                            <div v-for="(item,index) in bannerShowBox" :key="index">
                                <!-- 如果匹配到mp4的视频就不回显到图片标签里 -->
                                <img :src="showImgPrefix + item" v-if="item.search(/.mp4/i) == -1" />
                            </div>
                            <!-- 回显视频 -->
                            <video controls v-for="item in bannerVideo" :key="item">
                                <source :src="showImgPrefix + item" />您的浏览器版本太低，请升级。
                            </video>
                        </div>
                        <el-upload
                            class="banner-show-box"
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
                                v-if="!!overallImageUrl"
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
                                    @change="changeSeatNum"
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
                                    @change="changeSeatNum"
                                ></el-input-number>
                            </label>
                        </p>
                        <!-- 座位属性标题 -->
                        <div class="seat-title">
                            <p
                                v-for="(item,index) in seatAttOpt"
                                :key="index"
                                @click="changeStyle(item.style)"
                            >
                                <span :class="item.class"></span>
                                {{item.name}}
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
                            <span>座位属性：</span>
                            <div class="prop-box">
                                <span
                                    :class="item.style"
                                    v-for="(item,index) in seatAttOpt"
                                    :key="index"
                                    :title="item.name"
                                    @click="changeStyle(item.style)"
                                ></span>
                            </div>
                        </div>
                        <div class="seat-num">
                            <span>座位号：</span>
                            <el-input
                                v-model="presentSeatInfo.seatCode"
                                placeholder="座位号"
                                style="width:50%"
                                :readonly="isReadonly"
                            ></el-input>
                        </div>
                        <div class="seat-num">
                            <span>座位类型：</span>
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
                            <span>容纳人数：</span>
                            <el-input
                                v-model="presentSeatInfo.numberOfPeople"
                                placeholder="容纳人数"
                                style="width:50%;margin-right:6px"
                                :readonly="isReadonly"
                            ></el-input>人
                        </div>
                        <div class="lon-retain">
                            <span>保留最晚时间：</span>
                            <el-time-select
                                style="width:50%"
                                v-model="presentSeatInfo.seatLatestReservationTime"
                                :readonly="isReadonly"
                                :picker-options="startBussTime.slice(0,2) > endBussTime.slice(0,2) ? {
                                    start: startBussTime,
                                    step: '00:10',
                                    end: '23:50'
                                } : {
                                    start: startBussTime,
                                    step: '00:10',
                                    end: endBussTime
                                }"
                            ></el-time-select>
                        </div>
                        <div class="min-charge">
                            <span class="min-con">最低消费：</span>
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
                            <span>包间属性：</span>
                            <div class="prop-box">
                                <span
                                    :class="item.style"
                                    v-for="(item,index) in seatAttOpt"
                                    :key="index"
                                    :title="item.name"
                                    @click="changeStyle(item.style)"
                                ></span>
                            </div>
                        </div>
                        <div class="seat-num">
                            <span>包间号/名称：</span>
                            <el-input
                                v-model="presentSeatInfo.seatCode"
                                placeholder="座位号"
                                style="width:50%"
                                :readonly="isReadonly"
                            ></el-input>
                        </div>
                        <div class="acc-people">
                            <span>容纳人数：</span>
                            <el-input
                                v-model="presentSeatInfo.numberOfPeople"
                                placeholder="容纳人数"
                                style="width:50%"
                                :readonly="isReadonly"
                            ></el-input>
                        </div>
                        <div class="lon-retain">
                            <span>保留最晚时间：</span>
                            <el-time-select
                                style="width:50%"
                                v-model="presentSeatInfo.seatLatestReservationTime"
                                :readonly="isReadonly"
                                :picker-options="startBussTime.slice(0,2) > endBussTime.slice(0,2) ? {
                                    start: startBussTime,
                                    step: '00:10',
                                    end: '23:50'
                                } : {
                                    start: startBussTime,
                                    step: '00:10',
                                    end: endBussTime
                                }"
                            ></el-time-select>
                        </div>
                        <div class="seat-num">
                            <span>独立卫生间：</span>
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
                        <div class="mahjong">
                            <span>机麻：</span>
                            <el-input
                                v-model="presentSeatInfo.mahjong"
                                placeholder="机麻数量"
                                style="width:34%;margin-right:6px"
                                :readonly="isReadonly"
                            ></el-input>桌
                        </div>
                        <div class="snacks">
                            <span class="snacks">零嘴：</span>
                            <div class="snacks-detail">
                                <ul>
                                    <li v-for="(item,index) in presentSeatInfo.snacks" :key="index">
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
                        <div class="ktv-banner">
                            <span>包间示意图：</span>
                            <div v-if="isReadonly&&presentSeatInfo.sketchMap.length > 0">
                                <div v-for="(item,index) in presentSeatInfo.sketchMap" :key="index">
                                    <img :src="showImgPrefix + item" />
                                </div>
                            </div>
                            <span v-else-if="isReadonly&&presentSeatInfo.sketchMap.length === 0">无</span>
                            <el-upload
                                v-else
                                action="1"
                                list-type="picture-card"
                                :before-upload="beforektvBannerUpload"
                                :http-request="uploadktvBannerFiles"
                                :on-error="uploadError"
                                :file-list="ktvBannerImgBox"
                                :on-remove="ktvBannerRemove"
                                :limit="2"
                            >
                                <i class="el-icon-plus"></i>
                            </el-upload>
                        </div>
                        <div class="min-charge">
                            <span class="min-con">最低消费：</span>
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

            fileUploadUrl: '/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            isReadonly: true, //编辑信息开关
            isUpdate: true, //判断当前操作为修改还是新增店铺

            shopId: '', //门店ID
            logoImageUrl: '', //店铺logo
            shopName: '', //店铺名称
            shopBrief: '', //店铺简介

            shopLoca: ['夜店', '清吧', 'ktv'], //店铺定位数组
            shopLocaIndex: '', //店铺定位下标
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
            shopTypeOpt: [], //所有店铺类型
            shopTypeOptStrArr: [], //回显店铺类型
            submitShopType: [], //提交所选的店铺类型id
            perCon: '', //人均消费

            goodsBrief: '', //商品店面简介
            shopMatter: '', //订桌注意事项

            bannerShowBox: [], //要上传的banner图集和回显的banner图集（回显在自定义的位置）
            bannerImgBox: [], //要回显的banner图集（只能显示在上传图集的容器中）
            bannerVideo: [], //回显banner视频
            ktvBannerImgBox: [], //回显ktv包间示意图（上传图集容器中）

            overallImageUrl: '', //商家布局图
            rowNumImageUrl: '', //排号横幅图
            appShopImageUrl: '', //店铺长图

            x: 20, //座位行数
            y: 20, //座位列数

            //座位属性数组
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
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.logoImageUrl = res.data;
                    this.$message.success('上传成功');
                }
            });
        },

        //上传banner图之前的验证
        beforeBannerUpload(file) {
            console.log('上传之前', file);

            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isMP4 = file.type === 'video/mp4';
            // const isLt2M = file.size / 1024 / 1024 < 2; //限制文件大小

            //限制上传文件格式
            if (!isJPG && !isPNG && !isMP4) {
                this.$message.error('上传文件只能是 JPG / PNG / MP4 格式');
            }

            //显示上传文件大小
            // if (!isLt2M) {
            //     this.$message.error('上传文件大小不能超过 2MB!');
            // }

            return isJPG || isPNG || isMP4;
        },

        //上传ktv包间示意图之前的验证
        beforektvBannerUpload(file) {
            console.log('上传之前', file);

            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            // const isLt2M = file.size / 1024 / 1024 < 2; //限制文件大小

            //限制上传文件格式
            if (!isJPG && !isPNG) {
                this.$message.error('上传文件只能是 JPG / PNG 格式');
            }

            //显示上传文件大小
            // if (!isLt2M) {
            //     this.$message.error('上传文件大小不能超过 2MB!');
            // }

            return isJPG || isPNG;
        },

        //上传banner图
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$file_post(this.filesUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.bannerShowBox.push(res.data[0]);
                    this.$message.success('上传成功');
                }
            });
        },

        //上传ktv包间示意图
        uploadktvBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$file_post(this.filesUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    if (!this.presentSeatInfo.sketchMap) {
                        this.presentSeatInfo.sketchMap = [];
                    }

                    this.presentSeatInfo.sketchMap.push(res.data[0]);
                    this.$message.success('上传成功');
                }
            });
        },

        //回显banner图集（回显在上传图集的容器中）
        showBannerImg(picStr) {
            this.bannerImgBox = [];

            //给每张图片加上前缀
            let pictureArr = this.bannerShowBox.map((item) => {
                return (item = this.showImgPrefix + item);
            });

            //存入对象，回显到页面上
            pictureArr.forEach((item) => {
                let obj = {};
                obj.url = item;
                this.bannerImgBox.push(obj);
            });
        },

        //回显ktv包间示意图（回显在上传图集的容器中）
        showKtvBannerImg() {
            this.ktvBannerImgBox = [];

            //给每张图片加上前缀
            let ktvBannerArr = this.presentSeatInfo.sketchMap.map((item) => {
                return (item = this.showImgPrefix + item);
            });

            //存入对象，回显到页面上
            ktvBannerArr.forEach((item2) => {
                let obj = {};
                obj.url = item2;
                this.ktvBannerImgBox.push(obj);
            });
        },

        //回显banner视频（回显在自定义的位置）
        showBannerVid() {
            this.bannerVideo = [];
            this.bannerShowBox.forEach((item, i) => {
                if (item.search(/.mp4/i) !== -1) {
                    this.bannerVideo.push(item);
                }
            });
        },

        // 删除banner图集
        bannerRemove(file, fileList) {
            this.bannerShowBox.forEach((item, i) => {
                if (this.showImgPrefix + item == file.url) {
                    this.bannerShowBox.splice(i, 1);
                }
            });
        },

        // 删除ktv包间示意图
        ktvBannerRemove(file, fileList) {
            this.presentSeatInfo.sketchMap.forEach((item, i) => {
                if (this.showImgPrefix + item == file.url) {
                    this.presentSeatInfo.sketchMap.splice(i, 1);
                }
            });
        },

        //上传商家布局图
        uploadOverallFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.overallImageUrl = res.data;
                    this.$message.success('上传成功');
                }
            });
        },

        //上传排号横幅图
        uploadRowNumFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.rowNumImageUrl = res.data;
                    this.$message.success('上传成功');
                }
            });
        },

        //上传店铺长图
        uploadAppShopFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.appShopImageUrl = res.data;
                    this.$message.success('上传成功');
                }
            });
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('上传失败');
        },

        //点击编辑时，回显banner图集里的视频
        showBannerVideo() {
            this.$nextTick(() => {
                let showImgList = document.querySelectorAll('.banner-show-box ul li img'); //获取所有回显的img节点
                showImgList.forEach((item) => {
                    //匹配所有链接是mp4格式的
                    if (item.src.search(/.mp4/i) !== -1) {
                        //重新创建一个video节点，并添加上相关属性
                        let newEle = document.createElement('video');
                        newEle.controls = 'controls';
                        newEle.style = `width:100%;height:100%`;
                        newEle.innerHTML = `<source :src="${this.showImgPrefix}${item.src}" />您的浏览器版本太低，请升级。`;

                        item.parentNode.replaceChild(newEle, item); //在该节点的父节点上替换掉之前的img节点，换成video
                    }
                });
            });
        },

        //切换店铺定位
        changeShopLoca(e) {
            if (!this.isReadonly) {
                this.$refs.shopLoca.forEach((item) => {
                    item.classList.remove('shop-loca-span');
                });
                e.target.classList.add('shop-loca-span');

                //切换店铺定位下标
                switch (e.target.innerHTML) {
                    case '夜店':
                        this.shopLocaIndex = 1;
                        break;
                    case '清吧':
                        this.shopLocaIndex = 2;
                        break;
                    case 'ktv':
                        this.shopLocaIndex = 3;
                }

                this.getShopType(this.shopLocaIndex); //获取所有店铺类型的值

                this.submitShopType = []; //清空提交id数组

                if (this.$refs.shopTypeSpan) {
                    this.$refs.shopTypeSpan.forEach((item) => {
                        item.classList.remove('shop-type-span'); //清空所选店铺的样式
                    });
                }
            }
        },

        //选择店铺类型
        checkType(e, item) {
            // 多选情况下
            if (this.shopLocaIndex == 1 || this.shopLocaIndex == 2) {
                if (!e.target.className) {
                    e.target.classList.add('shop-type-span');
                    this.submitShopType.push(item);
                } else {
                    e.target.classList.remove('shop-type-span');
                    this.submitShopType.forEach((ele, i) => {
                        if (ele == item) {
                            this.submitShopType.splice(i, 1);
                        }
                    });
                }
            }
            // 单选情况下
            else if (this.shopLocaIndex == 3) {
                this.submitShopType = [];
                this.$refs.shopTypeSpan.forEach((i) => {
                    i.classList.remove('shop-type-span');
                });
                e.target.classList.add('shop-type-span');
                this.submitShopType.push(item);
            }

            console.log(this.submitShopType);
        },

        //回显店铺类型样式（编辑时）
        showCheckType() {
            this.shopTypeOptStrArr.forEach((item) => {
                this.shopTypeOpt.forEach((obj) => {
                    if (item == obj.recommendBrand) {
                        this.submitShopType.push(obj.id); //将原有的类型id存入上传数组中
                        this.$nextTick(() => {
                            this.$refs.shopTypeSpan.forEach((item2) => {
                                if (item2.innerHTML == obj.recommendBrand) {
                                    item2.classList.add('shop-type-span'); //回显原有类型对应的样式
                                }
                            });
                        });
                    }
                });
            });
        },

        //编辑商铺信息
        editShopInfo() {
            this.isReadonly = false;

            this.isClickSeat = false; //关闭展示当前点击的座位的详细信息
            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
            this.showBannerVideo(); //回显banner图集里的视频
            this.getShopType(); //获取店铺类型
            this.showCheckType(); //回显已经选择的店铺类型

            //给地图子组件传值（回显地址信息）
            this.mapList.searchAddress = this.searchAddress;
            this.mapList.trustAddress = this.trustAddress;
        },

        //新增店铺
        submitCreatShop() {
            //数组转json形式（零嘴）
            let allSeatDetailInfo = this.cloneSnacks();

            //数组转字符串（ktv示意图）
            allSeatDetailInfo.forEach((item) => {
                item.sketchMap = item.sketchMap.join(',');
            });

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
                type: this.submitShopType.join(','),
                layoutList: allSeatDetailInfo
            };

            console.log('新增时传的值', data);

            this.$post('/merchant/store/save', data)
                .then((res) => {
                    if (res.code == 0) {
                        this.getStoreInfo();
                        localStorage.removeItem('storageInfo');
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
            let allSeatDetailInfo = this.cloneSnacks();

            //数组转字符串（ktv示意图）
            allSeatDetailInfo.forEach((item) => {
                item.sketchMap = item.sketchMap.join(',');
            });

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
                type: this.submitShopType.join(','),
                layoutList: allSeatDetailInfo
            };

            console.log('修改时传的值', data);

            this.$put('/merchant/store/update', data)
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
                this.isClickSeat = false; //关闭展示当前点击的座位的详细信息
                this.submitShopType = []; //清空店铺类型上传数组
                this.clearSeatBorder(); //清空座位外边框（定位当前座位）
            }
        },

        //取消保存按钮
        cancelSubmit() {
            this.isReadonly = true;
            this.isClickSeat = false; //关闭展示当前点击的座位的详细信息
            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
            this.getStoreInfo(); //重新获取商店数据
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

        //查看并编辑当前座位信息
        lookEditSeatInfo(e, seatType, stageCode) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            //匹配当前座位信息
            this.allSeatDetailInfo.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    this.presentSeatInfo = item;

                    //修改当前座位的属性值
                    this.presentSeatInfo.seatAttribute = seatType;

                    //修改当前座位为舞台
                    this.presentSeatInfo.seatType = stageCode;

                    //回显当前座位对应的包间示意图
                    this.showKtvBannerImg();

                    console.log('cccc', this.presentSeatInfo);
                }
            });
        },

        //查看当前座位信息
        lookSeatInfo(e) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            //匹配当前座位信息
            this.allSeatDetailInfo.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    this.presentSeatInfo = item;

                    //回显当前座位对应的包间示意图
                    this.showKtvBannerImg();
                }
            });
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
                this.lookEditSeatInfo(e, seatType, stageCode); //查看并编辑当前座位信息
            } else {
                this.lookSeatInfo(e, seatType, stageCode); //查看当前座位信息
            }

            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
            e.target.classList.add('border'); //定位当前座位
        },

        //清空座位外边框（定位当前座位）
        clearSeatBorder() {
            this.$refs.seatSpan.forEach((item) => {
                item.classList.remove('border');
            });
        },

        //修改当前座位属性
        setSeatInfo(e, style) {
            e.target.className = style;

            //修改四周的位置
            // let row = Number(e.target.dataset.indexx); //行
            // let col = Number(e.target.dataset.indexy); //列

            // let allSeatSpan = document.querySelectorAll('.seat-box div div span');
            // allSeatSpan.forEach((item) => {
            //     let indexX = item.dataset.indexx;
            //     let indexY = item.dataset.indexy;

            //     if (row + 1 == indexX && col == indexY) {
            //         item.className = style;
            //     }

            //     if (row == indexX && col + 1 == indexY) {
            //         item.className = style;
            //     }

            //     if (row + 1 == indexX && col + 1 == indexY) {
            //         item.className = style;
            //     }
            // });
        },

        //改变座位状态按钮（改变点击的座位颜色）
        changeStyle(style) {
            this.seatStyle = style;
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
            this.presentSeatInfo.snacks.push(snacksObj);
            this.snackName = '';
            this.snackNum = '';
        },

        //删除零嘴
        deleteSnacks(item) {
            this.presentSeatInfo.snacks.forEach((ele, i) => {
                if (ele.name == item.name && ele.num == item.num) {
                    this.presentSeatInfo.snacks.splice(i, 1);
                }
            });
        },

        //克隆零嘴数组方法
        cloneSnacks() {
            let newSeatArr = this.allSeatDetailInfo.map((item) => {
                let cloneItem = Object.assign({}, item);
                cloneItem.snacks = JSON.stringify(item.snacks);
                return cloneItem;
            });
            return newSeatArr;
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
            });
        },

        //店铺定位样式初始化
        initShopLocaStyle() {
            if (this.shopLocaIndex) {
                this.$refs.shopLoca.forEach((item) => {
                    item.classList.remove('shop-loca-span'); //清空所选店铺的样式
                });

                switch (this.shopLocaIndex) {
                    case 1:
                        this.$refs.shopLoca[0].classList.add('shop-loca-span');
                        break;
                    case 2:
                        this.$refs.shopLoca[1].classList.add('shop-loca-span');
                        break;
                    case 3:
                        this.$refs.shopLoca[2].classList.add('shop-loca-span');
                        break;
                }
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
                        seatType: 1,
                        snacks: [],
                        sketchMap: [],
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

        //回显当前店铺的类型
        showShopType(arr) {
            this.shopTypeOptStrArr = [];
            this.shopTypeOpt.forEach((item) => {
                if (arr.includes(item.id)) {
                    this.shopTypeOptStrArr.push(item.recommendBrand);
                }
            });
        },

        //对每个座位进行相关转换
        changeLayoutList(arr) {
            arr.forEach((item) => {
                item.snacks = JSON.parse(item.snacks); //零嘴json字符串转为数组对象

                if (!!item.sketchMap) {
                    item.sketchMap = item.sketchMap.split(','); //ktv包间示意图转为数组
                } else {
                    item.sketchMap = [];
                }

                //将数值型转为字符型（软硬座和有无卫生间）
                if (item.softHardStatus || item.haveToilet) {
                    item.softHardStatus = item.softHardStatus.toString();
                    item.haveToilet = item.haveToilet.toString();
                }
            });
        },

        //回显店铺数据
        getStoreInfo() {
            this.$get('/merchant/store/getStoreInfo').then((res) => {
                if (res.code == 0) {
                    let result = res.data;

                    //返回的所有属性
                    this.shopId = result.id;
                    this.appShopImageUrl = result.appListBigPicture;
                    let cassette = result.cassette;
                    this.city = result.city;
                    this.servicePhone = result.customerServicePhone;
                    this.district = result.district;
                    this.districtCode = result.districtCode;
                    this.endBussTime = result.endTime;
                    this.goodsBrief = result.goodsStoreSynopsis;
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
                    this.shopMatter = result.tableReservationNotes;
                    this.trustAddress = result.trustAddress;
                    let shopTypeArr = result.type.split(',');
                    let layoutList = result.layoutList;

                    //获取店铺类型
                    this.getShopType(result.storeLocation);

                    //回显店铺类型
                    this.showShopType(shopTypeArr);

                    //回显banner图集
                    this.showBannerImg();

                    //回显视频banner
                    this.showBannerVid();

                    //回显店铺卡座数量
                    this.getShopSeat(cassette);

                    //获取经纬度
                    this.getlonlat(lonlat);

                    //对每个座位进行相关转换
                    this.changeLayoutList(layoutList);

                    //赋值返回的座位信息
                    this.allSeatDetailInfo = layoutList;

                    //座位属性回显
                    this.showSeatAtt();

                    //店铺定位初始化
                    this.initShopLocaStyle();

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

                            //如果有缓存就用缓存里的数据，否则就重新创建座位
                            if (localStorage.getItem('storageInfo')) {
                                this.getStorageInfo(); //获取输入的缓存数据
                            } else {
                                this.createSeatFn(); //创建座位
                            }
                        })
                        .catch(() => {
                            this.$router.push('/index');
                        });
                }
            });
        },

        //获取店铺类型
        getShopType(index) {
            let data = {
                filterModule: index
            };
            this.$post('/merchant/store/screening/apiList', data).then((res) => {
                if (res.data) {
                    this.shopTypeOpt = res.data.storeScreeningDTOS;
                }
            });
        },

        //暂存数据
        storageInfo() {
            let obj = {
                logoImageUrl: this.logoImageUrl,
                shopName: this.shopName,
                shopBrief: this.shopBrief,
                shopLocaIndex: this.shopLocaIndex,
                dynamicTags: this.dynamicTags,
                startBussTime: this.startBussTime,
                endBussTime: this.endBussTime,
                province: this.province,
                city: this.city,
                district: this.district,
                districtCode: this.districtCode,
                searchAddress: this.searchAddress,
                trustAddress: this.trustAddress,
                longitude: this.longitude,
                latitude: this.latitude,
                servicePhone: this.servicePhone,
                shopType: this.shopType,
                shopTypeOpt: this.shopTypeOpt,
                shopTypeOptStrArr: this.shopTypeOptStrArr,
                submitShopType: this.submitShopType,
                perCon: this.perCon,
                goodsBrief: this.goodsBrief,
                shopMatter: this.shopMatter,
                bannerImgBox: this.bannerImgBox,
                bannerShowBox: this.bannerShowBox,
                bannerVideo: this.bannerVideo,
                ktvBannerImgBox: this.ktvBannerImgBox,
                overallImageUrl: this.overallImageUrl,
                rowNumImageUrl: this.rowNumImageUrl,
                appShopImageUrl: this.appShopImageUrl,
                x: this.x,
                y: this.y,
                allSeatDetailInfo: this.allSeatDetailInfo
            };

            localStorage.setItem('storageInfo', JSON.stringify(obj));

            this.$message.success('暂存数据成功');
        },

        //获取缓存
        getStorageInfo() {
            let storageInfo = JSON.parse(localStorage.getItem('storageInfo'));
            console.log(storageInfo);

            if (storageInfo) {
                this.logoImageUrl = storageInfo.logoImageUrl;
                this.shopName = storageInfo.shopName;
                this.shopBrief = storageInfo.shopBrief;
                this.shopLocaIndex = storageInfo.shopLocaIndex;
                this.dynamicTags = storageInfo.dynamicTags;
                this.startBussTime = storageInfo.startBussTime;
                this.endBussTime = storageInfo.endBussTime;
                this.province = storageInfo.province;
                this.city = storageInfo.city;
                this.district = storageInfo.district;
                this.districtCode = storageInfo.districtCode;
                this.searchAddress = storageInfo.searchAddress;
                this.trustAddress = storageInfo.trustAddress;
                this.longitude = storageInfo.longitude;
                this.latitude = storageInfo.latitude;
                this.servicePhone = storageInfo.servicePhone;
                this.shopType = storageInfo.shopType;
                this.shopTypeOpt = storageInfo.shopTypeOpt;
                this.shopTypeOptStrArr = storageInfo.shopTypeOptStrArr;
                this.submitShopType = storageInfo.submitShopType;
                this.perCon = storageInfo.perCon;
                this.goodsBrief = storageInfo.goodsBrief;
                this.shopMatter = storageInfo.shopMatter;
                this.bannerImgBox = storageInfo.bannerImgBox;
                this.bannerShowBox = storageInfo.bannerShowBox;
                this.bannerVideo = storageInfo.bannerVideo;
                this.ktvBannerImgBox = storageInfo.ktvBannerImgBox;
                this.overallImageUrl = storageInfo.overallImageUrl;
                this.rowNumImageUrl = storageInfo.rowNumImageUrl;
                this.appShopImageUrl = storageInfo.appShopImageUrl;
                this.x = storageInfo.x;
                this.y = storageInfo.y;
                this.allSeatDetailInfo = storageInfo.allSeatDetailInfo;

                //给地图子组件传值（回显地址信息）
                this.mapList.searchAddress = this.searchAddress;
                this.mapList.trustAddress = this.trustAddress;

                // //回显banner图片
                this.showBannerImg();

                //回显banner视频
                this.showBannerVideo();

                //店铺定位初始化
                this.initShopLocaStyle();

                //获取已经选择的店铺类型
                this.showShopType(this.submitShopType);

                //回显已经选择的店铺类型
                this.showCheckType();

                // //座位属性回显
                this.showSeatAtt();
            }
        },

        //清空所有内容
        clearShopInfo() {
            this.logoImageUrl = '';
            this.shopName = '';
            this.shopBrief = '';
            this.shopLocaIndex = '';
            this.dynamicTags = [];
            this.startBussTime = '';
            this.endBussTime = '';
            this.province = '';
            this.city = '';
            this.district = '';
            this.districtCode = '';
            this.searchAddress = '';
            this.trustAddress = '';
            this.longitude = '';
            this.latitude = '';
            this.servicePhone = '';
            this.shopType = '';
            this.shopTypeOpt = [];
            this.shopTypeOptStrArr = [];
            this.submitShopType = [];
            this.perCon = '';
            this.goodsBrief = '';
            this.shopMatter = '';
            this.bannerImgBox = [];
            this.bannerShowBox = [];
            this.bannerVideo = [];
            this.ktvBannerImgBox = [];
            this.overallImageUrl = '';
            this.rowNumImageUrl = '';
            this.appShopImageUrl = '';
            this.x = 20;
            this.y = 20;
            this.allSeatDetailInfo = [];
        },

        //座位行数/列数改变
        changeSeatNum() {
            if (!this.isReadonly) {
                this.createSeatFn(); //创建座位
            }
        }
    },

    watch: {
        //根据包间示意图的个数，来显示与隐藏上传图标
        'presentSeatInfo.sketchMap': {
            handler() {
                if (!this.isReadonly) {
                    this.$nextTick(() => {
                        let addPic = document.querySelector('.ktv-banner .el-upload.el-upload--picture-card');
                        if (addPic !== null) {
                            if (this.presentSeatInfo.sketchMap.length > 1) {
                                addPic.style.display = 'none';
                            } else {
                                addPic.style.display = 'block';
                            }
                        }
                    });
                }
            },
            deep: true
        }
    },

    created() {
        this.clearShopInfo(); //清空所有内容
        this.getShopType(); //获取店铺类型

        if (process.env.NODE_ENV === 'development') {
            this.showImgPrefix = '/file/admin/system/upload/down?keyName=';
        } else {
            this.showImgPrefix = 'http://47.108.204.66:8078/admin/system/upload/down?keyName=';
        }
    },

    mounted() {
        this.getStoreInfo(); //回显所有店铺数据
    }
};
</script>

<style lang="less" scoped>
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

    h4 {
        font-weight: normal;
        display: flex;
        align-items: center;
        height: 26px;
        margin-bottom: 30px;
        box-sizing: border-box;

        > span {
            margin-right: 30px;
        }
    }

    h4::before {
        display: inline-block;
        content: '';
        width: 4px;
        height: 26px;
        margin-right: 10px;
        background-color: #000;
    }

    .shop-info {
        height: 160px;
        margin-bottom: 30px;

        .left-info {
            width: 30%;
            float: left;

            > p {
                margin-bottom: 10px;
            }
        }

        .right-info {
            width: 70%;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .shop-name {
                float: left;
                margin-bottom: 40px;

                > span {
                    margin-right: 30px;
                }
            }

            .shop-brief {
                display: flex;
                align-items: center;
            }
        }
    }

    .shop-desc > div {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
    }

    .shop-loca {
        margin-bottom: 30px;

        > p {
            margin-bottom: 10px;
        }

        > div span {
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
    }

    .shop-div {
        display: flex;
        margin-bottom: 30px;

        .shop-div1 {
            width: 42%;
            margin-right: 30px;

            .bussiness-hours {
                margin-bottom: 30px;

                > p {
                    margin-bottom: 10px;
                }

                .time-select {
                    display: flex;
                    align-items: center;

                    > span {
                        margin: 0 10px;
                    }
                }
            }

            .per-con > p {
                margin-bottom: 10px;
            }
        }

        .shop-div2 {
            .service-phone {
                margin-bottom: 30px;

                > p {
                    margin-bottom: 10px;
                }
            }

            .shop-type {
                > p {
                    margin-bottom: 10px;
                }

                .type-box::after {
                    display: block;
                    content: '';
                    clear: both;
                }

                .type-box div > span {
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
            }
        }
    }

    .shop-label {
        margin-bottom: 30px;

        > p {
            margin-bottom: 10px;
        }

        .labels > span {
            display: block;
            border: 1px solid #409eff;
            color: #409eff;
            border-radius: 6px;
            padding: 6px 20px;
            float: left;
            margin: 0 10px 10px 0;
            background-color: #ecf5ff;
        }

        /deep/ .input-new-tag {
            width: 90px;
            margin-left: 10px;
            vertical-align: bottom;
            vertical-align: middle !important;
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
    }

    .shop-address {
        margin-bottom: 30px;

        /deep/ .dtl_add {
            margin: 10px 0;
        }

        > p {
            margin-bottom: 10px;
        }

        .shop-add span {
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
    }

    /deep/ .el-textarea__inner {
        resize: none !important;
        line-height: 1.9;
    }
}

.right-wrap {
    height: 100%;
    width: 100%;

    h4 {
        font-weight: normal;
        display: flex;
        align-items: center;
        height: 26px;
        margin-bottom: 30px;
        box-sizing: border-box;
    }

    h4::before {
        display: inline-block;
        content: '';
        width: 4px;
        height: 26px;
        margin-right: 10px;
        background-color: #000;
    }

    .shop-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;

        img {
            border-radius: 6px !important;
        }

        video {
            border-radius: 6px !important;
        }

        .banner-box {
            width: 38%;

            > div {
                img {
                    width: 170px;
                    height: 100px;
                    margin: 0 10px 10px 0;
                }

                video {
                    width: 170px;
                    height: 100px;
                    margin: 0 10px 10px 0;
                }

                div {
                    display: inline-block;
                }
            }

            > p {
                margin-bottom: 10px;
            }
        }

        .overall-box {
            > p {
                margin-bottom: 10px;
            }

            > img {
                width: 160px;
                height: 200px;
            }

            /deep/.el-upload--text {
                width: 160px;
                height: 200px;
                line-height: 200px;

                > img {
                    width: 160px;
                    height: 200px;
                }
            }
        }

        .rowNum-box {
            div {
                > p {
                    margin-bottom: 10px;
                }

                > img {
                    width: 200px;
                    height: 120px;
                }
            }

            div.top {
                margin-bottom: 30px;
            }

            /deep/ .el-upload--text {
                width: 200px;
                height: 120px;
                line-height: 120px;
            }

            /deep/.el-upload--text > img {
                width: 200px;
                height: 120px;
            }
        }
    }

    .shop-seat {
        display: flex;

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
                padding-bottom: 10px;
                box-sizing: border-box;
                background-color: #ddd;
                display: flex;
            }

            .input-seat {
                display: flex;
                margin-bottom: 20px;
            }
        }

        .right-box {
            .min-charge {
                align-items: flex-start;

                .day-mincom {
                    border: 1px solid #dcdfe6;
                    border-radius: 4px;
                    padding: 16px 20px;
                    width: 80%;

                    > p {
                        margin-bottom: 16px;
                        font-size: 14px;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        > span {
                            margin-right: 10px;
                        }
                    }

                    > p:last-child {
                        margin-bottom: 0;
                    }
                }
            }

            > div {
                display: flex;
                align-items: center;
                margin-bottom: 30px;

                > span {
                    margin-right: 0;
                    width: 120px;
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

            .is-toilet {
                display: flex;
                align-items: center;
            }

            .snacks {
                .snacks-detail {
                    .mult {
                        margin: 0 3px;
                    }

                    li {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 10px;

                        .snacks-name {
                            max-width: 132px;
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                        }
                    }

                    div span:first-child {
                        margin-right: 30px;
                    }
                }

                .snacks-form {
                    display: flex;
                    align-items: center;

                    /deep/.el-input__inner {
                        padding: 0 8px;
                    }
                }
            }

            .ktv-banner {
                align-items: flex-start;
                > span {
                    width: 142px;
                }
                > div {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                }
                img {
                    width: 150px;
                    height: 80px;
                    margin: 0 8px 6px 0;
                    border-radius: 6px;
                }
                /deep/ .el-upload-list--picture-card .el-upload-list__item {
                    transition: none;
                    width: 150px;
                    height: 80px;
                    margin: 0 8px 6px 0;
                }

                /deep/ .el-upload--picture-card {
                    width: 150px;
                    height: 80px;
                    line-height: 80px;
                }
            }
        }
    }

    /deep/ .el-upload-list--picture-card .el-upload-list__item {
        width: 170px;
        height: 100px;
    }

    /deep/ .el-upload--picture-card {
        width: 170px;
        height: 100px;
        line-height: 100px;
    }
}

/deep/ .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

/deep/ .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

/deep/.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
}

/deep/.avatar {
    width: 120px;
    height: 120px;
    border-radius: 6px;
    display: block;
}

/deep/.el-upload.el-upload--text {
    width: 120px;
    height: 120px;
}

.el-tag + .el-tag {
    margin-left: 10px;
}

.el-tag--small {
    height: 32px;
    line-height: 32px;
    margin-bottom: 10px;
}

.shop-loca-span {
    background-color: #ecf5ff;
}

.shop-type-span {
    background-color: #ecf5ff;
}

.not-book {
    background-color: #e6a23c !important;
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

.aisle-book {
    background-color: #ddd !important;
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
    background-color: #ddd !important;
    cursor: pointer;
}
</style>