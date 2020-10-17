<template>
    <div>
        <div class="container">
            <!-- 左边区域 -->
            <div class="left-wrap">
                <h4>
                    <span>店铺信息</span>
                    <el-button type="primary" @click="editShopInfo">编辑</el-button>
                    <el-button type="success" @click="storeRecommend" v-if="!isReadonly">申请商家推荐</el-button>
                    <el-button type="success" @click="submitShopInfo" v-if="!isReadonly">保存</el-button>
                    <el-button type="info" @click="storageInfo" v-if="!isReadonly && !isUpdate">暂存数据</el-button>
                    <el-button @click="cancelSubmit" v-if="!isReadonly && isUpdate">取消</el-button>
                </h4>

                <!-- 店铺基本信息 -->
                <div class="shop-info clearfix">
                    <div class="left-info" v-loading="imgLoading.loading2">
                        <p>店铺招牌logo</p>
                        <img v-if="isReadonly && logoImageUrl" :src="showImgPrefix + logoImageUrl" class="avatar" />
                        <el-upload
                            v-else
                            class="avatar-uploader"
                            action="1"
                            :before-upload="beforeAvatarUpload"
                            :http-request="uploadAvatarFile"
                            :show-file-list="false"
                            :on-error="uploadError"
                        >
                            <img v-if="logoImageUrl" :src="showImgPrefix + logoImageUrl" class="avatar" />
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span>（*正方形，1MB以内）</span>
                    </div>
                    <div class="right-info">
                        <p class="shop-name">
                            <span>店名：</span>
                            <el-input
                                v-model="shopName"
                                placeholder="请输入店名"
                                style="width: 70%"
                                :readonly="isReadonly"
                                clearable
                            ></el-input>
                        </p>
                        <p class="shop-brief">
                            <span>店铺简介：</span>
                            <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入店铺简介"
                                v-model="shopBrief"
                                style="width: 76%"
                                :readonly="isReadonly"
                                maxlength="120"
                                show-word-limit
                            ></el-input>
                        </p>
                    </div>
                </div>

                <!-- 店铺定位 -->
                <div class="shop-loca">
                    <p>店铺定位（注：选择夜店/清吧就没有“独立卫生间、机麻、零嘴”）</p>
                    <div v-if="!isUpdate">
                        <span v-for="(item, index) in shopLoca" :key="index" ref="shopLoca" @click="changeShopLoca">{{ item }}</span>
                    </div>
                    <div v-else>
                        <span class="shop-loca-span">{{ shopLocaIndex | shopLocaShow }}</span>
                    </div>
                </div>

                <!-- 店铺标签 -->
                <!-- <div class="shop-label">
                    <p>店铺标签</p>
                    <div class="change-labels">
                        <el-tag
                            :key="tag"
                            :closable="!isReadonly"
                            v-for="tag in dynamicTags"
                            :disable-transitions="false"
                            @close="handleClose(tag)"
                            >{{ tag }}</el-tag
                        >
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                        ></el-input>
                        <el-button v-else-if="!isReadonly" class="button-new-tag" @click="showInput">
                            <i class="el-icon-plus"></i>
                        </el-button>
                    </div>
                </div> -->

                <!-- 客服电话 -->
                <div class="service-phone">
                    <p>客服电话</p>
                    <!-- 回显 -->
                    <div class="show-box" v-for="(item, index) in servicePhoneArr" :key="index">
                        <el-input
                            v-model="servicePhoneArr[index]"
                            placeholder="客服电话"
                            style="width: 26%; margin-right: 10px"
                            :readonly="isReadonly"
                            clearable
                        ></el-input>
                        <el-button v-if="!isReadonly" type="danger" @click="deleteServicePhone(item)">删除</el-button>
                    </div>

                    <!-- 新增 -->
                    <div v-if="!isReadonly">
                        <el-input v-model="servicePhone" placeholder="客服电话" style="width: 26%; margin-right: 10px" clearable></el-input>
                        <el-button type="primary" @click="addServicePhone">添加</el-button>
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
                                type="number"
                                v-model="perCon"
                                placeholder="人均消费"
                                style="width: 70%; margin-right: 6px"
                                :readonly="isReadonly"
                                min="0"
                            >
                                <template slot="append">￥/人</template>
                            </el-input>
                        </div>
                    </div>
                    <div class="shop-div2">
                        <!-- 店铺类型 -->
                        <div class="shop-type">
                            <p>
                                店铺类型
                                <span>（用于客户筛选出本店）</span>
                            </p>
                            <div class="type-box">
                                <div v-if="isReadonly">
                                    <span v-for="(item, index) in shopTypeOptStrArr" :key="index" class="shop-type-span">{{ item }}</span>
                                </div>
                                <div v-else>
                                    <span
                                        ref="shopTypeSpan"
                                        v-for="(item, index) in shopTypeOpt"
                                        :key="index"
                                        @click="checkType($event, item.id)"
                                        >{{ item.recommendBrand }}</span
                                    >
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
                            <span>{{ province }}</span>
                            <span>{{ city }}</span>
                            <span>{{ district }}</span>
                            <span>{{ trustAddress }}</span>
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
                            style="width: 76%"
                            :readonly="isReadonly"
                            maxlength="60"
                            show-word-limit
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
                    <div class="banner-box" v-loading="imgLoading.loading">
                        <p>店铺banner图</p>
                        <div v-if="isReadonly">
                            <div v-for="(item, index) in bannerShowBox" :key="index">
                                <!-- 如果匹配到mp4的视频就不回显到图片标签里 -->
                                <img :src="showImgPrefix + item" v-if="item.search(/.mp4/i) == -1" />
                            </div>
                            <!-- 回显视频 -->
                            <video controls v-for="item in bannerVideo" :key="item">
                                <source :src="showImgPrefix + item" />
                                您的浏览器版本太低，请升级。
                            </video>
                        </div>
                        <el-upload
                            class="banner-show-box"
                            v-else
                            multiple
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
                        <div class="top" v-loading="imgLoading.loading3">
                            <p>排号横幅图</p>
                            <img v-if="isReadonly && logoImageUrl" :src="showImgPrefix + rowNumImageUrl" class="avatar" />
                            <el-upload
                                v-else
                                class="avatar-uploader"
                                action="1"
                                :before-upload="beforeImgUpload"
                                :http-request="uploadRowNumFile"
                                :show-file-list="false"
                                :on-error="uploadError"
                            >
                                <img v-if="rowNumImageUrl" :src="showImgPrefix + rowNumImageUrl" class="avatar" />
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                        <!-- 店铺长图 -->
                        <div class="botm" v-loading="imgLoading.loading4">
                            <p>店铺长图（用于展示位置变化）</p>
                            <img v-if="isReadonly && logoImageUrl" :src="showImgPrefix + appShopImageUrl" class="avatar" />
                            <el-upload
                                v-else
                                class="avatar-uploader"
                                action="1"
                                :before-upload="beforeImgUpload"
                                :http-request="uploadAppShopFile"
                                :show-file-list="false"
                                :on-error="uploadError"
                            >
                                <img v-if="appShopImageUrl" :src="showImgPrefix + appShopImageUrl" class="avatar" />
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </div>

                    <!-- 商家布局图 -->
                    <div class="overall-box" v-loading="imgLoading.loading5" v-if="shopLocaIndex != 3">
                        <p>商家布局图</p>
                        <img v-if="isReadonly && logoImageUrl" :src="showImgPrefix + overallImageUrl" class="avatar" />
                        <el-upload
                            v-else
                            class="avatar-uploader"
                            action="1"
                            :before-upload="beforeImgUpload"
                            :http-request="uploadOverallFile"
                            :show-file-list="false"
                            :on-error="uploadError"
                        >
                            <img v-if="!!overallImageUrl" :src="showImgPrefix + overallImageUrl" class="avatar" />
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </div>
                </div>
                <!-- 店铺卡座 -->
                <div v-if="shopLocaIndex == 1 || shopLocaIndex == 2">
                    <h4>店铺卡座</h4>
                    <div class="shop-seat">
                        <!-- 左边座位展示 -->
                        <div class="left-box">
                            <!-- 座位行数和列数 -->
                            <p class="input-seat">
                                <label style="margin-right: 30px">
                                    座位行数：
                                    <el-input-number
                                        :disabled="isReadonly"
                                        v-model="x"
                                        :min="6"
                                        style="width: 120px"
                                        label="行数"
                                        @change="changeSeatNum"
                                    ></el-input-number>
                                </label>
                                <label style="margin-right: 30px">
                                    座位列数：
                                    <el-input-number
                                        :disabled="isReadonly"
                                        v-model="y"
                                        :min="6"
                                        style="width: 120px"
                                        label="列数"
                                        @change="changeSeatNum"
                                    ></el-input-number>
                                </label>
                            </p>
                            <!-- 座位属性标题 -->
                            <div class="seat-title">
                                <p v-for="(item, index) in seatAttOpt" :key="index" @click="changeStyle(item.style)">
                                    <span :class="item.class"></span>
                                    {{ item.name }}
                                </p>
                            </div>
                            <!-- 回显的座位图 -->
                            <div
                                v-if="x && y"
                                class="seat-box"
                                ref="seatBox"
                                :style="{ width: 32 * y + 30 + 'px' }"
                                style="overflow: hidden"
                            >
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
                        <div class="right-box" v-if="isClickSeat">
                            <p class="seat-detail">座位详情</p>
                            <!-- 座位属性 -->
                            <div class="seat-prop">
                                <span>座位属性：</span>
                                <div class="prop-box">
                                    <span
                                        :class="item.style"
                                        v-for="(item, index) in seatAttOpt"
                                        :key="index"
                                        :title="item.name"
                                        @click="changeStyle(item.style)"
                                    ></span>
                                </div>
                            </div>
                            <!-- 座位号 -->
                            <div>
                                <span>座位号：</span>
                                <el-input
                                    v-model="presentSeatInfo.seatCode"
                                    placeholder="座位号"
                                    style="width: 50%"
                                    :readonly="isReadonly"
                                ></el-input>
                            </div>
                            <!-- 座位类型 -->
                            <div>
                                <span>座位类型：</span>
                                <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="1">软座</el-radio>
                                <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="2">硬座</el-radio>
                            </div>
                            <!-- 容纳人数 -->
                            <div>
                                <span>容纳人数：</span>
                                <el-input-number
                                    v-model="presentSeatInfo.numberOfPeople"
                                    controls-position="right"
                                    placeholder="容纳人数"
                                    style="width: 50%; margin-right: 6px"
                                    :disabled="isReadonly"
                                    :min="1"
                                ></el-input-number>
                                <!-- <el-input
                                    v-model="presentSeatInfo.numberOfPeople"
                                    placeholder="容纳人数"
                                    style="width: 50%; margin-right: 6px"
                                    :readonly="isReadonly"
                                    type="number"
                                >
                                </el-input> -->
                            </div>
                            <!-- 最晚保留时间 -->
                            <div class="lon-retain">
                                <span>保留最晚时间：</span>
                                <el-time-select
                                    style="width: 50%"
                                    placeholder="最晚保留时间"
                                    v-model="presentSeatInfo.seatLatestReservationTime"
                                    :readonly="isReadonly"
                                    :picker-options="
                                        startBussTime.slice(0, 2) > endBussTime.slice(0, 2)
                                            ? {
                                                  start: startBussTime,
                                                  step: '00:10',
                                                  end: '23:50'
                                              }
                                            : {
                                                  start: startBussTime,
                                                  step: '00:10',
                                                  end: endBussTime
                                              }
                                    "
                                ></el-time-select>
                            </div>
                            <!-- 最低消费 -->
                            <div class="min-charge">
                                <span class="min-con">最低消费：</span>
                                <div class="day-mincom">
                                    <p v-for="(item, index) in presentSeatInfo.weekPriceList" :key="index">
                                        <span>{{ item.weekIndex | dayOfWeek }}</span>
                                        <el-input
                                            v-model="item.price"
                                            placeholder="最低消费"
                                            style="width: 47%; margin-right: 6px"
                                            :readonly="isReadonly"
                                        >
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ktv包间 -->
                <div v-if="shopLocaIndex == 3">
                    <h4>KTV包间</h4>
                    <!-- 当选择ktv时展示的座位属性 -->
                    <div class="ktv-wrap">
                        <div class="ktv-left-box" v-if="isLookKtvInfo">
                            <!-- 包间类型 -->
                            <div>
                                <span>包间类型：</span>
                                <el-select
                                    filterable
                                    clearable
                                    :disabled="isReadonly"
                                    v-model="presentKtvInfo.roomTypeId"
                                    placeholder="请选择"
                                    style="width: 50%"
                                >
                                    <el-option v-for="item in ktvTypeOpt" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </div>
                            <!-- 包间所属 -->
                            <div>
                                <span>包间所属：</span>
                                <el-radio :disabled="isReadonly" v-model="presentKtvInfo.roomAttribute" label="1">预定桌</el-radio>
                                <el-radio :disabled="isReadonly" v-model="presentKtvInfo.roomAttribute" label="2">AA拼单桌</el-radio>
                            </div>
                            <!-- 包间数量 -->
                            <div>
                                <span>包间数量：</span>
                                <el-input-number
                                    v-model="presentKtvInfo.roomNumber"
                                    controls-position="right"
                                    :min="1"
                                    placeholder="包间数量"
                                    style="width: 50%"
                                    :disabled="isReadonly"
                                ></el-input-number>
                                <!-- <el-input
                                    v-model="presentKtvInfo.roomNumber"
                                    placeholder="包间数量"
                                    style="width: 50%"
                                    :readonly="isReadonly"
                                ></el-input> -->
                            </div>
                            <!-- 容纳人数 -->
                            <div>
                                <span>容纳人数：</span>
                                <el-input-number
                                    controls-position="right"
                                    :min="1"
                                    v-model="presentKtvInfo.capacity"
                                    placeholder="容纳人数"
                                    style="width: 50%"
                                    :disabled="isReadonly"
                                ></el-input-number>
                                <!-- <el-input
                                    v-model="presentKtvInfo.capacity"
                                    placeholder="容纳人数"
                                    style="width: 50%"
                                    :readonly="isReadonly"
                                ></el-input> -->
                            </div>
                            <!-- 独立卫生间 -->
                            <div>
                                <span>独立卫生间：</span>
                                <el-radio :disabled="isReadonly" v-model="presentKtvInfo.haveToilet" label="1">有</el-radio>
                                <el-radio :disabled="isReadonly" v-model="presentKtvInfo.haveToilet" label="2">无</el-radio>
                            </div>
                            <!-- 机麻 -->
                            <div>
                                <span>机麻：</span>
                                <el-input-number
                                    controls-position="right"
                                    :min="0"
                                    v-model="presentKtvInfo.mahjong"
                                    placeholder="机麻数量"
                                    style="width: 50%"
                                    :disabled="isReadonly"
                                ></el-input-number>
                                <!-- <el-input
                                    v-model="presentKtvInfo.mahjong"
                                    placeholder="机麻数量"
                                    style="width: 50%"
                                    :readonly="isReadonly"
                                ></el-input> -->
                            </div>
                            <!-- 时间段分布 -->
                            <div class="time-quan">
                                <!-- 回显 -->
                                <div class="date-dist clearfix" v-for="(item, index) in presentKtvInfo.roomTimeIntervalList" :key="index">
                                    <!-- 时间段 -->
                                    <div class="data">
                                        <span>时间段分布：</span>
                                        <div>
                                            <el-time-select
                                                style="width: 100px"
                                                v-model="item.startTime"
                                                :readonly="isReadonly"
                                                :picker-options="{
                                                    start: '00:00',
                                                    step: '00:10',
                                                    end: '23:50'
                                                }"
                                                placeholder="开始"
                                            ></el-time-select>
                                            <span style="margin: 0 10px">~</span>
                                            <el-time-select
                                                style="width: 100px"
                                                v-model="item.endTime"
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
                                    <!-- 最低消费 -->
                                    <div class="minCon">
                                        <span>最低消费：</span>
                                        <el-input
                                            v-model="item.minConsumption"
                                            placeholder="最低消费"
                                            style="width: 50%"
                                            :readonly="isReadonly"
                                            type="number"
                                            min="0"
                                        >
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </div>
                                    <!-- 最晚保留时间 -->
                                    <div class="longRetain">
                                        <span>最晚保留时间：</span>
                                        <el-select
                                            :disabled="isReadonly"
                                            style="width: 50%"
                                            v-model="item.latestTime"
                                            placeholder="最晚保留时间（分钟）"
                                        >
                                            <el-option
                                                v-for="(item, index) in timeQuanArr"
                                                :key="index"
                                                :label="item"
                                                :value="item"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <!-- 删除 -->
                                    <el-button v-if="!isReadonly" @click="delTimeQuan(item)" type="danger" style="float: right"
                                        >删除</el-button
                                    >
                                </div>
                                <!-- 新增 -->
                                <div class="date-dist clearfix" v-if="!isReadonly && presentKtvInfo.roomTimeIntervalList.length < 6">
                                    <!-- 时间段 -->
                                    <div class="data">
                                        <span>时间段分布：</span>
                                        <div>
                                            <el-time-select
                                                style="width: 100px"
                                                v-model="timeQuanObj.startTime"
                                                :readonly="isReadonly"
                                                :picker-options="{
                                                    start: '00:00',
                                                    step: '00:10',
                                                    end: '23:50'
                                                }"
                                                placeholder="开始"
                                            ></el-time-select>
                                            <span style="margin: 0 10px">~</span>
                                            <el-time-select
                                                style="width: 100px"
                                                v-model="timeQuanObj.endTime"
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
                                    <!-- 最低消费 -->
                                    <div class="minCon">
                                        <span>最低消费：</span>
                                        <el-input
                                            type="number"
                                            v-model="timeQuanObj.minConsumption"
                                            placeholder="最低消费"
                                            style="width: 50%"
                                            :readonly="isReadonly"
                                            min="0"
                                        >
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </div>
                                    <!-- 最晚保留时间 -->
                                    <div class="longRetain">
                                        <span>最晚保留时间：</span>
                                        <el-select
                                            style="width: 50%"
                                            v-model="timeQuanObj.latestTime"
                                            placeholder="最晚保留时间（分钟）"
                                            :readonly="isReadonly"
                                        >
                                            <el-option
                                                v-for="(item, index) in timeQuanArr"
                                                :key="index"
                                                :label="item"
                                                :value="item"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <!-- 确定 -->
                                    <el-button v-if="!isReadonly" @click="addTimeQuan" type="primary" style="float: right">添加</el-button>
                                </div>
                            </div>
                            <!-- 零嘴 -->
                            <div class="snacks">
                                <p>
                                    零嘴：
                                    <span v-if="isReadonly && presentKtvInfo.snacks.length == 0">无</span>
                                </p>
                                <div class="snacks-detail">
                                    <!-- 回显 -->
                                    <ul>
                                        <li v-for="(item, index) in presentKtvInfo.snacks" :key="index">
                                            <el-input
                                                style="width: 170px"
                                                v-model="item.name"
                                                placeholder="名称"
                                                :readonly="isReadonly"
                                                clearable
                                            ></el-input>
                                            <span class="mult">
                                                <i class="el-icon-close"></i>
                                            </span>
                                            <el-input
                                                style="width: 70px; margin-right: 10px"
                                                v-model="item.num"
                                                placeholder="数量"
                                                :readonly="isReadonly"
                                                min="1"
                                                type="number"
                                            ></el-input>
                                            <el-button v-if="!isReadonly" @click="deleteSnacks(item)" type="danger">删除</el-button>
                                        </li>
                                    </ul>
                                    <!-- 新增 -->
                                    <div class="snacks-form" v-if="!isReadonly">
                                        <el-input
                                            style="width: 170px"
                                            v-model="snacksObj.name"
                                            placeholder="名称"
                                            :readonly="isReadonly"
                                            clearable
                                        ></el-input>
                                        <span class="mult">
                                            <i class="el-icon-close"></i>
                                        </span>
                                        <el-input
                                            style="width: 70px; margin-right: 10px"
                                            v-model="snacksObj.num"
                                            placeholder="数量"
                                            :readonly="isReadonly"
                                            min="1"
                                            type="number"
                                        ></el-input>
                                        <el-button :disabled="isReadonly" type="primary" @click="addSnacks">添加</el-button>
                                    </div>
                                </div>
                            </div>
                            <!-- ktv包间示意图 -->
                            <div class="ktv-banner" v-loading="imgLoading.loading6">
                                <p>包间示意图：</p>
                                <div v-if="isReadonly && presentKtvInfo.sketchMap.length > 0">
                                    <div v-for="(item, index) in presentKtvInfo.sketchMap" :key="index">
                                        <img :src="showImgPrefix + item" />
                                    </div>
                                </div>
                                <span v-else-if="isReadonly && presentKtvInfo.sketchMap.length === 0">无</span>
                                <el-upload
                                    v-else
                                    action="1"
                                    list-type="picture-card"
                                    :before-upload="beforeImgUpload"
                                    :http-request="uploadktvBannerFiles"
                                    :on-error="uploadError"
                                    :file-list="ktvBannerImgBox"
                                    :on-remove="ktvBannerRemove"
                                    :limit="4"
                                >
                                    <i class="el-icon-plus"></i>
                                </el-upload>
                            </div>
                            <!-- 确定与取消 -->
                            <div v-if="!isReadonly">
                                <el-button @click="ktvCancelSub">取消</el-button>
                                <el-button @click="ktvSureSub" type="primary">{{ isUpdateKtvInfo == false ? '新增' : '修改' }}</el-button>
                            </div>
                        </div>
                        <!-- ktv包间属性列表 -->
                        <div class="ktv-right-box">
                            <ul>
                                <li v-for="(item, index) in ktvRoomList" :key="index">
                                    <div class="left-box">
                                        <div>
                                            <p>
                                                <span>包间类型：</span>
                                                <span>{{ item.roomTypeId | roomType(ktvTypeOpt) }}</span>
                                            </p>
                                            <p>
                                                <span>包间属性：</span>
                                                <span>{{ item.roomAttribute | roomAttr }}</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p>
                                                <span>包间数量：</span>
                                                <span>{{ item.roomNumber }}</span>
                                            </p>
                                            <p>
                                                <span>最低消费：</span>
                                                <span>{{ item.minConsumption }}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div class="right-box">
                                        <el-button @click="lookKtvInfo(item)" type="primary">{{
                                            isReadonly == true ? '查看' : '编辑'
                                        }}</el-button>
                                        <el-button @click="delKtvInfo(item)" type="danger" v-if="!isReadonly">删除</el-button>
                                    </div>
                                </li>
                            </ul>
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
            imgLoading: {
                loading: false,
                loading2: false,
                loading3: false,
                loading4: false,
                loading5: false,
                loading6: false
            },

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

            servicePhoneArr: [], //客户电话回显数组
            servicePhone: '', //客服电话
            shopType: '', //选择的店铺类型
            shopTypeOpt: [], //所有店铺类型
            shopTypeOptStrArr: [], //回显店铺类型
            submitShopType: [], //提交所选的店铺类型id
            shopTypeArr: '', //返回的所选的店铺类型暂存数组
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

            ktvRoomList: [], //ktv包间集合
            ktvTypeOpt: [], //ktv包间类型
            isLookKtvInfo: false, //查看或编辑当前ktv包间属性信息的标杆
            isUpdateKtvInfo: false, //当前确认按钮是否为修改包间属性信息
            //当前ktv包间配置的零嘴
            snacksObj: {
                name: '',
                num: ''
            },
            //当前ktv包间配置的时间段
            timeQuanObj: {
                startTime: '', //开始时间
                endTime: '', //结束时间
                latestTime: '', //最晚保留时间
                minConsumption: 0 //最低消费
            },
            timeQuanArr: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120'],
            //当前ktv包间对应的详细信息
            presentKtvInfo: {
                roomTypeId: '', //包间类型
                roomAttribute: '1', //包间所属
                roomNumber: 1, //包间数量
                capacity: 1, //容纳人数
                haveToilet: '2', //独立卫生间
                mahjong: 0, //机麻
                minConsumption: '', //最低消费（时间段集合里的最低消费）
                snacks: [], //零嘴
                sketchMap: [], //包间示意图
                roomTimeIntervalList: [] //时间段集合
            }
        };
    },
    methods: {
        //验证所有输入的值
        checkFormInfo() {
            if (!this.shopName) {
                this.$message.error('请输入店铺名称');
            } else if (!this.shopBrief) {
                this.$message.error('请输入店铺简介');
            } else if (!this.logoImageUrl) {
                this.$message.error('请上传店铺logo');
            } else if (!this.shopLocaIndex) {
                this.$message.error('请选择店铺定位');
            } else if (this.servicePhoneArr.length == 0) {
                this.$message.error('请输入客服电话');
            } else if (!this.startBussTime) {
                this.$message.error('请选择开始营业时间');
            } else if (!this.endBussTime) {
                this.$message.error('请选择结束营业时间');
            } else if (this.submitShopType.length == 0) {
                this.$message.error('请选择店铺类型');
            } else if (!this.perCon) {
                this.$message.error('请输入店铺人均消费');
            } else if (!this.searchAddress) {
                this.$message.error('请输入地址');
            } else if (!this.trustAddress) {
                this.$message.error('请输入详细地址');
            } else if (!this.goodsBrief) {
                this.$message.error('请输入商品店名简介');
            } else if (this.bannerShowBox.length == 0) {
                this.$message.error('请上传店铺banner图');
            } else if (!this.rowNumImageUrl) {
                this.$message.error('请上传排号横幅图');
            } else if (!this.appShopImageUrl) {
                this.$message.error('请上传店铺长图');
            } else if (!this.overallImageUrl) {
                this.$message.error('请上传商家布局图');
            }
        },

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

        //申请商家推荐
        storeRecommend() {
            this.$get('/merchant/store/recommend/storeRecommend').then((res) => {
                console.log(res);
            });
        },

        //获取申请商家推荐状态
        storeRecommendType() {
            this.$get('/merchant/store/recommend/storeRecommendType').then((res) => {
                console.log(res);
            });
        },

        //上传头像之前的验证
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 <= 1; //限制文件大小

            //限制上传文件格式
            if (!isJPG && !isPNG) {
                this.$message.error('上传logo只能是 JPG / PNG 格式');
                return false;
            }

            //限制上传文件大小
            if (!isLt2M) {
                this.$message.error('logo大小不能超过 1MB');
                return false;
            }
        },

        //上传banner图之前的验证
        beforeBannerUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';
            const isMP4 = file.type === 'video/mp4';

            //限制上传文件格式
            if (!isJPG && !isPNG && !isMP4) {
                this.$message.error('上传文件只能是 JPG / PNG / MP4 格式');
                return false;
            }

            if (file.type === 'video/mp4') {
                //限制上传视频个数
                let isVideo = false;
                this.bannerShowBox.forEach((item) => {
                    if (item.replace(/.+\./, '') == 'mp4' || item.replace(/.+\./, '') == 'MP4') {
                        isVideo = true;
                        return;
                    }
                });
                if (isVideo) {
                    this.$message.error('最多只能上传1个短视频');
                    return false;
                }

                //限制上传视频时长
                return new Promise((resolve, reject) => {
                    this.getVideoTime(file).then((res) => {
                        if (res > 15) {
                            this.$message.error('视频时长请控制在15秒以内');
                            reject();
                        } else {
                            resolve();
                        }
                    });
                });
            }
        },

        //获取视频时长
        getVideoTime(file) {
            let url = URL.createObjectURL(file);
            let audioElement = new Audio(url);
            let duration;
            return new Promise((resolve, reject) => {
                audioElement.addEventListener('loadedmetadata', (e) => {
                    duration = audioElement.duration; //视频时长/s
                    resolve(duration);
                });
            });
        },

        // 上传单图之前的验证
        beforeImgUpload(file) {
            const isJPG = file.type === 'image/jpeg';
            const isPNG = file.type === 'image/png';

            //限制上传文件格式
            if (!isJPG && !isPNG) {
                this.$message.error('上传图片只能是 JPG / PNG 格式');
                return false;
            }
        },

        //上传logo
        uploadAvatarFile(file) {
            this.imgLoading.loading2 = true;
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.logoImageUrl = res.data;
                    this.imgLoading.loading2 = false;
                    this.$message.success('上传成功');
                }
            });
        },

        //上传banner图
        uploadBannerFiles(file) {
            this.imgLoading.loading = true;
            let formData = new FormData();
            formData.append('files', file.file);
            this.$file_post(this.filesUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    //将url添加到上传容器中
                    this.bannerShowBox.push(res.data[0]);

                    //将url添加到视图容器里
                    let obj = {
                        url: this.showImgPrefix + res.data[0]
                    };
                    this.bannerImgBox.push(obj);

                    this.showBannerVideo(); //回显视频

                    this.imgLoading.loading = false;
                    this.$message.success('上传成功');
                }
            });
        },

        //回显banner图集（回显在上传图集的容器中）
        showBannerImg() {
            this.bannerImgBox = [];

            //给每张图片加上前缀
            let pictureArr = this.bannerShowBox.map((item) => {
                return (item = this.showImgPrefix + item);
            });

            //存入对象，回显到页面上
            pictureArr.forEach((item) => {
                let obj = {
                    url: item
                };
                this.bannerImgBox.push(obj);
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
                    this.bannerShowBox.splice(i, 1); //删除上传容器中的
                    this.bannerImgBox.splice(i, 1); //删除视图上的
                }
            });
        },

        // 上传ktv包间示意图
        uploadktvBannerFiles(file) {
            this.imgLoading.loading6 = true;
            let formData = new FormData();
            formData.append('files', file.file);
            this.$file_post(this.filesUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    //将url添加到上传容器中
                    if (!this.presentKtvInfo.sketchMap) {
                        this.presentKtvInfo.sketchMap = [];
                    }
                    this.presentKtvInfo.sketchMap.push(res.data[0]);

                    //将url添加到视图容器中
                    let obj = {
                        url: this.showImgPrefix + res.data[0]
                    };
                    this.ktvBannerImgBox.push(obj);

                    this.imgLoading.loading6 = false;
                    this.$message.success('上传成功');
                }
            });
        },

        // 回显ktv包间示意图（回显在上传图集的容器中）
        showKtvBannerImg() {
            this.ktvBannerImgBox = [];

            //给每张图片加上前缀
            let ktvBannerArr = this.presentKtvInfo.sketchMap.map((item) => {
                return (item = this.showImgPrefix + item);
            });

            //存入对象，回显到页面上
            ktvBannerArr.forEach((item2) => {
                let obj = {
                    url: item2
                };
                this.ktvBannerImgBox.push(obj);
            });
        },

        // 删除ktv包间示意图
        ktvBannerRemove(file, fileList) {
            this.presentKtvInfo.sketchMap.forEach((item, i) => {
                if (this.showImgPrefix + item == file.url) {
                    this.presentKtvInfo.sketchMap.splice(i, 1);
                    this.ktvBannerImgBox.splice(i, 1);
                }
            });
        },

        //上传商家布局图
        uploadOverallFile(file) {
            this.imgLoading.loading5 = true;
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.overallImageUrl = res.data;
                    this.imgLoading.loading5 = false;
                    this.$message.success('上传成功');
                }
            });
        },

        //上传排号横幅图
        uploadRowNumFile(file) {
            this.imgLoading.loading3 = true;
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.rowNumImageUrl = res.data;
                    this.imgLoading.loading3 = false;
                    this.$message.success('上传成功');
                }
            });
        },

        //上传店铺长图
        uploadAppShopFile(file) {
            this.imgLoading.loading4 = true;
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.appShopImageUrl = res.data;
                    this.imgLoading.loading4 = false;
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

                this.$alert('店铺定位一经保存，则不可更改，请慎重选择！', '提示');
            }
        },

        //选择店铺类型
        checkType(e, item) {
            // 多选情况下
            if (this.shopLocaIndex == 1 || this.shopLocaIndex == 2) {
                if (!e.target.className) {
                    if (this.submitShopType.length < 3) {
                        e.target.classList.add('shop-type-span');
                        this.submitShopType.push(item);
                    } else {
                        this.$message.error('最多选取3个店铺类型');
                    }
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
            if (this.shopLocaIndex == 3) {
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

        //给地图子组件传值（编辑店铺时）
        sendInfoToMap() {
            this.mapList.searchAddress = this.searchAddress;
            this.mapList.trustAddress = this.trustAddress;
        },

        //点击编辑后的操作
        editShopInit() {
            this.isReadonly = false;
            this.isLookKtvInfo = true;
            this.isUpdateKtvInfo = false;
            this.isClickSeat = false;
        },

        //编辑商铺信息
        editShopInfo() {
            this.storeRecommendType();
            this.editShopInit(); //初始化操作
            this.sendInfoToMap(); //给地图子组件传值（回显地址信息）
            this.getShopType(); //获取店铺类型
            this.showCheckType(); //回显已经选择的店铺类型
            this.showBannerVideo(); //回显banner图集里的视频
            this.clearKtvInfo(); //清空ktv包间属性数据
            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
        },

        //新增/修改店铺
        submitShopRequest() {
            let ktvRoomList = [];
            if (this.shopLocaIndex == 3) {
                ktvRoomList = this.cloneSnacks(); //数组转json形式（零嘴）
                //数组转字符串（ktv示意图）
                ktvRoomList.forEach((item) => {
                    item.sketchMap = item.sketchMap.join(',');
                });
            }

            //要传的值
            let data = {
                appListBigPicture: this.appShopImageUrl,
                cassette: `${this.x}x${this.y}`,
                city: this.city,
                // customerServicePhone: this.servicePhone,
                customerServicePhoneList: this.servicePhoneArr,
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
                businessReminder: '商家排号提醒',
                tableReservationNotes: '订桌注意事项',
                trustAddress: this.trustAddress,
                type: this.submitShopType.join(','),
                layoutList: this.allSeatDetailInfo,
                ktvRoomList: ktvRoomList
            };

            if (this.isUpdate) {
                data.id = this.shopId;
                console.log('修改时传的值', data);

                this.$put('/merchant/store/update', data).then((res) => {
                    if (res.code == 0) {
                        this.getStoreInfo();
                        this.$message.success('修改成功');
                        this.submitShopType = []; //清空店铺类型上传数组
                        this.isReadonly = true;
                    }
                    // else {
                    //     this.$message.error(res.msg);
                    // }
                });
            } else {
                console.log('新增时传的值', data);

                this.$post('/merchant/store/save', data).then((res) => {
                    if (res.code == 0) {
                        this.getStoreInfo();
                        localStorage.removeItem('storageInfo');
                        this.$message.success('添加成功');
                        this.submitShopType = []; //清空店铺类型上传数组
                        this.isReadonly = true;
                        this.isUpdate = true;
                    }
                    // else {
                    //     this.$message.error(res.msg);
                    // }
                });
            }
        },

        //保存按钮
        submitShopInfo() {
            this.checkFormInfo(); //验证所有输入的值
            this.submitShopRequest(); //新增/修改店铺
            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
            this.isClickSeat = false;
            this.isLookKtvInfo = false;
        },

        //取消保存按钮
        cancelSubmit() {
            this.isReadonly = true;
            this.isClickSeat = false;
            this.isLookKtvInfo = false;
            this.getStoreInfo(); //重新获取商店数据
            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
        },

        //删除当前店铺标签
        handleClose(tag) {
            this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
        },

        //点击添加店铺标签按钮
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

        //查看或编辑当前座位信息
        lookEditSeatInfo(e, seatType, stageCode) {
            let seatRow = Number(e.target.dataset.indexx); //行
            let seatColumn = Number(e.target.dataset.indexy); //列

            //匹配当前座位信息
            this.allSeatDetailInfo.forEach((item) => {
                if (item.seatRow == seatRow && item.seatColumn == seatColumn) {
                    //查看当前座位信息
                    this.presentSeatInfo = item;

                    //修改当前座位信息
                    if (!this.isReadonly) {
                        //修改当前座位的属性
                        this.presentSeatInfo.seatAttribute = seatType;
                        //修改当前座位为舞台/过道
                        this.presentSeatInfo.seatType = stageCode;
                    }
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

        //添加时间段
        addTimeQuan() {
            let timeQuan = Object.assign({}, this.timeQuanObj);
            this.presentKtvInfo.roomTimeIntervalList.push(timeQuan);
            this.timeQuanObj = {
                startTime: '', //开始时间
                endTime: '', //结束时间
                latestTime: '', //最晚保留时间
                minConsumption: '' //最低消费
            };
        },

        //删除时间段
        delTimeQuan(item) {
            this.presentKtvInfo.roomTimeIntervalList.forEach((ele, i) => {
                if (
                    ele.startTime == item.startTime &&
                    ele.endTime == item.endTime &&
                    ele.latestTime == item.latestTime &&
                    ele.minConsumption == item.minConsumption
                ) {
                    this.presentKtvInfo.roomTimeIntervalList.splice(i, 1);
                }
            });
        },

        //添加客服电话
        addServicePhone() {
            this.servicePhoneArr.push(this.servicePhone);
            this.servicePhone = '';
        },

        //删除客服电话
        deleteServicePhone(item) {
            this.servicePhoneArr.forEach((ele, i) => {
                if (ele == item) {
                    this.servicePhoneArr.splice(i, 1);
                }
            });
        },

        //添加零嘴
        addSnacks() {
            let snacksObj = Object.assign({}, this.snacksObj);
            this.presentKtvInfo.snacks.push(snacksObj);
            this.snacksObj = {
                name: '',
                num: ''
            };
        },

        //删除零嘴
        deleteSnacks(item) {
            this.presentKtvInfo.snacks.forEach((ele, i) => {
                if (ele.name == item.name && ele.num == item.num) {
                    this.presentKtvInfo.snacks.splice(i, 1);
                }
            });
        },

        //克隆零嘴数组方法
        cloneSnacks() {
            let newSeatArr = this.ktvRoomList.map((item) => {
                let cloneItem = Object.assign({}, item);
                cloneItem.snacks = JSON.stringify(item.snacks);
                return cloneItem;
            });
            return newSeatArr;
        },

        //查看当前ktv包间信息
        lookKtvInfo(item) {
            this.isLookKtvInfo = true;
            this.isUpdateKtvInfo = true;
            this.presentKtvInfo = item;
            this.showKtvBannerImg();
        },

        //删除当前ktv包间信息
        delKtvInfo(item) {
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.ktvRoomList.forEach((ele, i) => {
                        if (item.id) {
                            if (ele.id == item.id) {
                                this.ktvRoomList.splice(i, 1);
                            }
                        } else {
                            if (
                                ele.capacity == item.capacity &&
                                ele.haveToilet == item.haveToilet &&
                                ele.mahjong == item.mahjong &&
                                ele.roomAttribute == item.roomAttribute &&
                                ele.roomNumber == item.roomNumber &&
                                ele.roomTimeIntervalList.length == item.roomTimeIntervalList.length &&
                                ele.roomTypeId == item.roomTypeId &&
                                ele.sketchMap.length == item.sketchMap.length &&
                                ele.snacks.length == item.snacks.length
                            ) {
                                this.ktvRoomList.splice(i, 1);
                            }
                        }
                    });
                    this.clearKtvInfo();
                    this.isUpdateKtvInfo = false;
                })
                .catch(() => {});
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

        //店铺定位样式初始化
        initShopLocaStyle() {
            if (this.shopLocaIndex) {
                this.$nextTick(() => {
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
                });
            }
        },

        //创建座位（夜店/清吧）
        createSeatFn() {
            this.allSeatDetailInfo = [];
            //根据行数和列数动态的创建座位
            for (let i = 1; i <= this.y; i++) {
                for (let j = 1; j <= this.x; j++) {
                    this.allSeatDetailInfo.push({
                        minConsumption: 0,
                        numberOfPeople: 1,
                        seatAttribute: 2,
                        seatCode: j + '-' + i,
                        seatColumn: i,
                        seatRow: j,
                        seatLatestReservationTime: this.endBussTime == '' ? '00:00' : this.endBussTime,
                        seatType: 1,
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
            if (this.$refs.seatSpan) {
                this.$refs.seatSpan.forEach((item) => {
                    item.className = 'seat';
                });
            }
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

        //对座位信息进行相关转换
        changeLayoutList(arr) {
            arr.forEach((item) => {
                //将数值型转为字符型（软硬座）
                if (item.softHardStatus) {
                    item.softHardStatus = item.softHardStatus.toString();
                }
            });
        },

        //对ktv信息进行相关转换
        changeKtvList(arr) {
            arr.forEach((item) => {
                //零嘴json字符串转为数组对象
                if (item.snacks) {
                    item.snacks = JSON.parse(item.snacks);
                } else {
                    item.snacks = [];
                }

                //ktv包间示意图转为数组
                if (item.sketchMap) {
                    item.sketchMap = item.sketchMap.split(',');
                } else {
                    item.sketchMap = [];
                }

                //将数值型转为字符型
                if (item.roomAttribute || item.haveToilet) {
                    item.roomAttribute = item.roomAttribute.toString();
                    item.haveToilet = item.haveToilet.toString();
                }
            });
        },

        //清空ktv包间属性编辑区域的数据
        clearKtvInfo() {
            this.presentKtvInfo = {
                roomTypeId: '', //包间类型
                roomAttribute: '1', //包间所属
                roomNumber: 1, //包间数量
                capacity: 1, //容纳人数
                haveToilet: '2', //独立卫生间
                mahjong: 0, //机麻
                minConsumption: '', //最低消费（时间段集合里的最低消费）
                snacks: [], //零嘴
                sketchMap: [], //包间示意图
                roomTimeIntervalList: [] //时间段集合
            };
            this.snacksObj = {
                name: '',
                num: ''
            };
            this.timeQuanObj = {
                startTime: '', //开始时间
                endTime: '', //结束时间
                latestTime: '', //最晚保留时间
                minConsumption: 0 //最低消费
            };
            this.ktvBannerImgBox = [];
        },

        //取消保存ktv包间信息
        ktvCancelSub() {
            this.clearKtvInfo();
            if (this.isUpdateKtvInfo) {
                this.isUpdateKtvInfo = false;
            }
        },

        //提交保存ktv包间信息
        ktvSureSub() {
            if (this.isUpdateKtvInfo) {
                this.$message.success('修改成功');
                this.isUpdateKtvInfo = false;
            } else {
                if (!this.ktvRoomList) {
                    this.ktvRoomList = [];
                }
                this.ktvRoomList.push(this.presentKtvInfo);
                this.$message.success('新增成功');
            }
            this.clearKtvInfo();
        },

        //回显店铺数据
        getStoreInfo() {
            this.$get('/merchant/store/getStoreInfo').then((res) => {
                if (res.code == 0) {
                    let result = res.data;
                    this.shopId = result.id;
                    this.appShopImageUrl = result.appListBigPicture;
                    let cassette = result.cassette;
                    this.city = result.city;
                    // this.servicePhone = result.customerServicePhone;
                    this.servicePhoneArr = result.customerServicePhoneList;
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
                    this.trustAddress = result.trustAddress;
                    this.shopTypeArr = result.type.split(',');
                    this.allSeatDetailInfo = result.layoutList;
                    this.ktvRoomList = result.ktvRoomList;

                    //获取店铺类型
                    this.getShopType(result.storeLocation);

                    //回显banner图集
                    this.showBannerImg();

                    //回显视频banner
                    this.showBannerVid();

                    //回显店铺卡座数量
                    this.getShopSeat(cassette);

                    //获取经纬度
                    this.getlonlat(lonlat);

                    //对座位信息进行相关转换
                    this.changeLayoutList(this.allSeatDetailInfo);

                    //对ktv信息进行相关转换
                    this.changeKtvList(this.ktvRoomList);

                    //座位属性回显
                    this.showSeatAtt();

                    console.log('当前店铺数据', res.data);
                } else if (res.code == 600) {
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
                    //回显店铺类型
                    this.showShopType(this.shopTypeArr);
                }
            });
        },

        //获取ktv包间类型
        getKtvType() {
            this.$get('/merchant/store/ktvDeploy/deployList').then((res) => {
                if (res.code == 0) {
                    this.ktvTypeOpt = res.data;
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
                // servicePhone: this.servicePhone,
                servicePhoneArr: this.servicePhoneArr,
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
                overallImageUrl: this.overallImageUrl,
                rowNumImageUrl: this.rowNumImageUrl,
                appShopImageUrl: this.appShopImageUrl,
                x: this.x,
                y: this.y,
                allSeatDetailInfo: this.allSeatDetailInfo,
                ktvRoomList: this.ktvRoomList
            };

            localStorage.setItem('storageInfo', JSON.stringify(obj));

            this.$message.success('暂存数据成功');
        },

        //获取缓存
        getStorageInfo() {
            let storageInfo = JSON.parse(localStorage.getItem('storageInfo'));

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
                // this.servicePhone = storageInfo.servicePhone;
                this.servicePhoneArr = storageInfo.servicePhoneArr;
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
                this.overallImageUrl = storageInfo.overallImageUrl;
                this.rowNumImageUrl = storageInfo.rowNumImageUrl;
                this.appShopImageUrl = storageInfo.appShopImageUrl;
                this.x = storageInfo.x;
                this.y = storageInfo.y;
                this.allSeatDetailInfo = storageInfo.allSeatDetailInfo;
                this.ktvRoomList = storageInfo.ktvRoomList;

                //给地图子组件传值（回显地址信息）
                this.sendInfoToMap();

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

        //座位行数/列数改变
        changeSeatNum() {
            if (!this.isReadonly) {
                this.isClickSeat = false;
                this.createSeatFn(); //创建座位
            }
        },

        //监听上传图片个数，显示与隐藏上传图标
        imgUploadWatch(dom, eleArr, len) {
            this.$nextTick(() => {
                let addPic = document.querySelector(`${dom} .el-upload.el-upload--picture-card`);
                if (addPic !== null) {
                    if (eleArr.length > len) {
                        addPic.style.display = 'none';
                    } else {
                        addPic.style.display = 'inline-block';
                    }
                }
            });
        }
    },

    watch: {
        //根据包间示意图的个数，来显示与隐藏上传图标
        'presentKtvInfo.sketchMap': {
            handler() {
                if (!this.isReadonly && this.shopLocaIndex == 3) {
                    this.imgUploadWatch('.ktv-banner', this.presentKtvInfo.sketchMap, 3);
                }
            },
            deep: true
        },

        //根据上传的banner图个数，来显示与隐藏上传图标
        bannerShowBox: {
            handler() {
                if (!this.isReadonly) {
                    this.imgUploadWatch('.banner-show-box', this.bannerShowBox, 5);
                }
            },
            deep: true
        }
    },

    created() {
        this.getShopType(); //获取店铺类型
        this.getKtvType(); //获取ktv包间类型

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
        margin-right: 10px;
        background-color: #000;
    }

    .shop-info {
        margin-bottom: 30px;

        .left-info {
            width: 30%;
            float: left;

            > span {
                font-size: 12px;
            }

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

    .service-phone {
        margin-bottom: 30px;

        .show-box {
            margin-bottom: 10px;
        }

        > p {
            margin-bottom: 10px;
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
    width: 65%;

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
        margin-bottom: 40px;

        img {
            border-radius: 6px !important;
        }

        video {
            border-radius: 6px !important;
        }

        .banner-box {
            width: 38%;
            /deep/ .el-upload-list--picture-card .el-upload-list__item {
                transition: none;
            }

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

        .rowNum-box {
            margin-right: 100px;
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
        }
    }

    .ktv-wrap {
        display: flex;

        .ktv-left-box {
            width: 60%;

            .time-quan {
                max-height: 420px;
                width: 70%;
                overflow-y: auto;
                margin-bottom: 0;
            }

            .date-dist {
                border: 1px solid #c0c4cc;
                border-radius: 4px;
                padding: 20px 20px 10px;
                margin-bottom: 20px;

                > div {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;

                    > span {
                        min-width: 120px;
                    }
                }

                .data > div {
                    display: flex;
                    align-items: center;
                }
            }

            > div {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                margin-bottom: 20px;

                > span {
                    min-width: 120px;
                }
            }

            .snacks {
                display: block;

                > p {
                    margin-bottom: 10px;
                }

                .snacks-detail {
                    .mult {
                        margin: 0 3px;
                    }

                    li {
                        display: flex;
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
                display: flex;
                align-items: flex-start;
                > p {
                    margin-bottom: 10px;
                }
                > div {
                    width: 100%;
                    display: flex;
                    flex-wrap: wrap;
                }
                img {
                    width: 130px;
                    height: 80px;
                    margin: 0 8px 6px 0;
                    border-radius: 6px;
                }
                /deep/ .el-upload-list--picture-card .el-upload-list__item {
                    transition: none;
                    width: 130px;
                    height: 80px;
                    margin: 0 8px 6px 0;
                }

                /deep/ .el-upload--picture-card {
                    width: 130px;
                    height: 80px;
                    line-height: 80px;
                }
            }
        }

        .ktv-right-box {
            width: 38%;

            .left-box {
                display: flex;
                justify-content: space-between;
            }

            ul li {
                border: 1px solid #c0c4cc;
                border-radius: 4px;
                padding: 16px;
                margin-bottom: 20px;

                p {
                    margin-bottom: 10px;
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

/deep/ .el-input-group__append,
.el-input-group__prepend {
    padding: 0 10px;
}

/deep/ .el-input--suffix .el-input__inner {
    padding-right: 0;
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