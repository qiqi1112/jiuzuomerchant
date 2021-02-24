<template>
    <div>
        <div class="container" v-loading="wrapLoading">
            <!-- 左边区域 -->
            <div class="left-wrap">
                <h4>
                    <span>店铺信息</span>
                    <el-button
                        :disabled="recoType != 1"
                        :type="recoType == 1 ? 'primary' : recoType == 2 ? 'info' : 'success'"
                        @click="storeRecommend"
                        v-if="isReadonly && recoType"
                        >{{ recoType | recoType }}
                    </el-button>
                    <el-button :disabled="putawayStatus === 3" type="primary" @click="putawayStore" v-if="isReadonly && putawayStatus">{{
                        putawayStatus | putawayStatus
                    }}</el-button>
                    <el-button type="primary" v-if="isReadonly && putawayStatus == 2" @click="editShopInfo">编辑</el-button>
                    <el-button type="success" @click="submitShopInfo" v-if="!isReadonly">保存</el-button>
                    <el-button type="info" @click="storageInfo" v-if="!isReadonly && !isUpdate">暂存数据</el-button>
                    <el-button @click="cancelSubmit" v-if="!isReadonly && isUpdate">取消</el-button>
                </h4>

                <!-- 店铺基本信息 -->
                <div class="shop-info clearfix">
                    <div class="left-info" v-loading="imgLoading.loading2">
                        <p>店铺logo</p>
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
                        <span>（154X154）</span>
                    </div>
                    <div class="right-info">
                        <p class="shop-name">
                            <span>店名：</span>
                            <el-input v-model="shopName" placeholder="请输入店名" :readonly="isReadonly" clearable></el-input>
                        </p>
                        <p class="shop-brief">
                            <span>店铺简介：</span>
                            <el-input
                                type="textarea"
                                :rows="3"
                                placeholder="请输入店铺简介"
                                v-model="shopBrief"
                                :readonly="isReadonly"
                                maxlength="120"
                                show-word-limit
                            ></el-input>
                        </p>
                    </div>
                </div>

                <!-- 店铺定位 -->
                <div class="shop-loca">
                    <p>店铺定位</p>
                    <!-- <p>店铺定位（注：选择夜店/清吧就没有“独立卫生间、机麻、赠品”）</p> -->
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
                            :onkeyup="(servicePhoneArr[index] = servicePhoneArr[index].replace(/^(-1+)|[^\d]+/g, ''))"
                            v-model="servicePhoneArr[index]"
                            placeholder="客服电话"
                            style="width: 30%; margin-right: 10px"
                            :readonly="isReadonly"
                            clearable
                        ></el-input>
                        <el-button v-if="!isReadonly" type="danger" @click="deleteServicePhone(item)">删除</el-button>
                    </div>

                    <!-- 新增 -->
                    <template v-if="!isReadonly && servicePhoneArr.length < 3">
                        <div style="margin-bottom: 10px">
                            <el-input
                                :onkeyup="(servicePhone = servicePhone.replace(/^(-1+)|[^\d]+/g, ''))"
                                v-model="servicePhone"
                                placeholder="客服电话"
                                style="width: 30%; margin-right: 10px"
                                clearable
                            ></el-input>
                            <el-button type="primary" @click="addServicePhone">添加</el-button>
                        </div>
                        <span style="font-size: 12px; color: #f00">*输入完电话后，点击添加按钮视为添加成功</span>
                    </template>
                </div>

                <!-- 店铺营业时间，人均消费，类型 -->
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
                            <span>{{ searchAddress }}</span>
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
                    <div>
                        <span>商城简介：</span>
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入商品店面简介"
                            v-model="goodsBrief"
                            :readonly="isReadonly"
                            maxlength="60"
                            show-word-limit
                        ></el-input>
                    </div>

                    <!-- 订单最晚保留时间 -->
                    <div v-if="shopLocaIndex != 3">
                        <span>晚于最晚到店时间订单的保留分钟数：</span>
                        <el-select clearable v-model="latestRetainTime" placeholder="最晚保留时间（分钟）" :disabled="isReadonly">
                            <el-option v-for="(item, index) in timeQuanArr" :key="index" :label="item" :value="item"></el-option>
                        </el-select>
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
                        <p>店铺顶部展示图</p>
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
                        <span style="word-break: break-all; display: block; width: 76%; font-size: 12px"
                            >（*请上传尺寸大小为351*181，格式为jpg/jpeg/png/mp4的图片或视频，最多一个视频）</span
                        >
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
                            <span style="word-break: break-all; display: block; width: 76%; margin-top: 10px; font-size: 12px"
                                >(*请上传尺寸大小为351*181，格式为jpg/jpeg/png的图片）</span
                            >
                        </div>
                        <!-- 店铺logo-列表大图 -->
                        <!-- <div class="botm" v-loading="imgLoading.loading4">
                            <p>店铺logo-列表大图</p>
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
                            <span style="word-break: break-all; display: block; width: 76%; margin-top: 10px; font-size: 12px">
                                (*请上传尺寸大小为351*154，格式为jpg/jpeg/png的图片，用于展示位置变化）</span
                            >
                        </div> -->
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
                        <span></span>
                    </div>
                </div>

                <!-- 店铺卡座 -->
                <div v-if="shopLocaIndex == 1 || shopLocaIndex == 2">
                    <!-- 新增/编辑楼层对话框 -->
                    <el-dialog title="新增/编辑楼层" :visible.sync="seatFloorDialog" class="floor-dialog" @close="handleCancelEditFloor">
                        <div class="input-box">
                            <div v-for="(item, index) in list" :key="index">
                                <span>楼层名称：</span>
                                <el-input
                                    v-model="item.floor"
                                    placeholder="如：1楼"
                                    style="width: 30%; margin-right: 10px"
                                    clearable
                                    @change="changeFloor(item)"
                                ></el-input>
                                <el-button type="danger" @click="deleteFloorList(item)">删除</el-button>
                            </div>
                            <div v-if="list.length < 5">
                                <span>楼层名称：</span>
                                <el-input
                                    v-model="floorName"
                                    placeholder="如：1楼"
                                    style="width: 30%; margin-right: 10px"
                                    clearable
                                ></el-input>
                                <el-button type="primary" @click="creatFloorList">添加</el-button>
                            </div>
                        </div>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="handleCancelEditFloor">取 消</el-button>
                            <el-button type="primary" @click="handleSeatFloor">确 定</el-button>
                        </div>
                    </el-dialog>

                    <h4>店铺卡座</h4>
                    <div class="shop-seat">
                        <!-- 左边座位展示 -->
                        <div class="left-box">
                            <el-button v-if="isReadonly || !isUpdate" type="primary" @click="addFloor" class="add-floor"
                                >编辑楼层</el-button
                            >

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

                            <template v-if="list.length !== 0 && !seatFloorDialog">
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
                            </template>
                        </div>
                        
                        <!-- 座位属性 -->
                        <div class="right-box" v-if="list.length !== 0 && !seatFloorDialog && isClickSeat">
                            <p class="seat-detail">座位详情</p>
                            <!-- 座位属性 -->
                            <div class="seat-prop" v-if="!isReadonly">
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
                            <div style="display: flex">
                                <span>座位号：</span>
                                <el-input
                                    v-model="presentSeatInfo.seatCode"
                                    placeholder="座位号"
                                    style="width: 50%"
                                    :readonly="isReadonly"
                                    @blur="checkNull(presentSeatInfo.seatCode, '座位号')"
                                ></el-input>
                            </div>
                            <!-- 座位类型 -->
                            <div style="display: flex">
                                <span>座位类型：</span>
                                <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="1">卡座</el-radio>
                                <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="2">散台</el-radio>
                                <el-radio :disabled="isReadonly" v-model="presentSeatInfo.softHardStatus" label="3">独立高脚凳</el-radio>
                            </div>
                            <!-- 容纳人数 -->
                            <div style="display: flex">
                                <span>容纳人数：</span>
                                <el-input-number
                                    :step="1"
                                    step-strictly
                                    v-model="presentSeatInfo.numberOfPeople"
                                    controls-position="right"
                                    placeholder="容纳人数"
                                    style="width: 50%; margin-right: 6px"
                                    :disabled="isReadonly"
                                    :min="1"
                                    @blur="checkNull(presentSeatInfo.numberOfPeople, '容纳人数')"
                                ></el-input-number>
                            </div>
                            <!-- 最晚保留时间 -->
                            <div class="lon-retain">
                                <span>保留最晚时间：</span>
                                <el-time-select
                                    @change="checkLateTime(presentSeatInfo.seatLatestReservationTime)"
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
                                <span class="min-con" style="margin-bottom: 10px">最低消费：</span>
                                <div class="day-mincom">
                                    <div v-for="(item, index) in presentSeatInfo.weekPriceList" :key="index">
                                        <div style="width: 40%">
                                            <span>{{ item.weekIndex | dayOfWeek }}</span
                                            ><br />
                                            <el-input
                                                type="number"
                                                @blur="checkPrice(item.price, 1, index)"
                                                v-model="item.price"
                                                style="width: 100%; margin-right: 6px"
                                                :readonly="isReadonly"
                                            >
                                                <template slot="append">￥</template>
                                            </el-input>
                                        </div>
                                        <!-- <div style="width: 50%">
                                            <span>最晚保留时间</span><br />
                                            <el-time-select
                                                @change="checkWeekLateTime(item.seatLatestReservationTime, index)"
                                                style="width: 80%"
                                                placeholder="最晚保留时间"
                                                v-model="item.seatLatestReservationTime"
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
                                        </div> -->
                                    </div>
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
                            <!-- 所属楼层 -->
                            <div>
                                <span>所属楼层：</span>
                                <el-input
                                    :readonly="isReadonly"
                                    v-model="presentKtvInfo.floor"
                                    placeholder="所属楼层"
                                    style="width: 50%"
                                ></el-input>
                            </div>

                            <!-- 包间类型 -->
                            <div>
                                <span>包间类型：</span>
                                <el-select
                                    filterable
                                    :disabled="isReadonly"
                                    v-model="presentKtvInfo.roomTypeId"
                                    placeholder="请选择"
                                    style="width: 50%"
                                >
                                    <el-option v-for="item in ktvTypeOpt" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </div>
                            <!-- 包间所属 -->
                            <!-- <div>
                                <span>包间所属：</span>
                                <el-radio :disabled="isReadonly" v-model="presentKtvInfo.roomAttribute" label="1">预定桌</el-radio>
                                <el-radio :disabled="isReadonly" v-model="presentKtvInfo.roomAttribute" label="2">AA拼单桌</el-radio>
                            </div> -->
                            <!-- 包间数量 -->
                            <div>
                                <span>包间数量：</span>
                                <el-input-number
                                    @blur="checkNull(presentKtvInfo.roomNumber, '包间数量')"
                                    :step="1"
                                    step-strictly
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
                                    @blur="checkNull(presentKtvInfo.capacity, '容纳人数')"
                                    :step="1"
                                    step-strictly
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
                            <!-- 配套设施 -->
                            <div>
                                <span>配套设施：</span>
                                <template>
                                    <el-checkbox :disabled="isReadonly" v-model="presentKtvInfo.haveDiningTable">餐桌</el-checkbox>
                                    <el-checkbox :disabled="isReadonly" v-model="presentKtvInfo.haveMahjong">机麻</el-checkbox>
                                    <el-checkbox :disabled="isReadonly" v-model="presentKtvInfo.haveSwimming">泳池</el-checkbox>
                                    <el-checkbox :disabled="isReadonly" v-model="presentKtvInfo.haveTableTennis">桌球</el-checkbox>
                                </template>
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
                                                @change="checkNull(item.startTime, '开始时间')"
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
                                                @change="checkNull(item.endTime, '结束时间')"
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
                                            type="number"
                                            @blur="checkPrice(item.minConsumption, 2, index)"
                                            v-model="item.minConsumption"
                                            placeholder="最低消费"
                                            style="width: 50%"
                                            :readonly="isReadonly"
                                            min="0"
                                        >
                                            <template slot="append">￥</template>
                                        </el-input>
                                    </div>
                                    <!-- 最晚保留时间 -->
                                    <!-- <div class="longRetain">
                                        <span>最晚保留时间：</span>
                                        <el-select
                                            clearable
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
                                        （分钟）
                                    </div> -->
                                    <!-- 删除 -->
                                    <el-button v-if="!isReadonly" @click="delTimeQuan(item)" type="danger" style="float: right"
                                        >删除</el-button
                                    >
                                </div>
                                <!-- 新增 -->
                                <div class="date-dist clearfix" v-if="!isReadonly">
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
                                            @blur="checkPrice(timeQuanObj.minConsumption, 3)"
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
                                    <!-- <div class="longRetain">
                                        <span>最晚保留时间：</span>
                                        <el-select
                                            clearable
                                            style="width: 50%"
                                            v-model="timeQuanObj.latestTime"
                                            placeholder="最晚保留时间（分钟）"
                                            :disabled="isReadonly"
                                        >
                                            <el-option
                                                v-for="(item, index) in timeQuanArr"
                                                :key="index"
                                                :label="item"
                                                :value="item"
                                            ></el-option>
                                        </el-select>
                                        （分钟）
                                    </div> -->
                                    <span style="font-size: 12px; color: #f00">*输入完内容后，点击添加按钮视为添加成功</span>
                                    <!-- 确定 -->
                                    <el-button v-if="!isReadonly" @click="addTimeQuan" type="primary" style="float: right">添加</el-button>
                                </div>
                            </div>
                            <!-- 赠品 -->
                            <div class="snacks">
                                <p>
                                    赠品：
                                    <span v-if="isReadonly && presentKtvInfo.snacks.length == 0">无</span>
                                </p>
                                <div class="snacks-detail">
                                    <!-- 回显 -->
                                    <ul>
                                        <li v-for="(item, index) in presentKtvInfo.snacks" :key="index">
                                            <el-input
                                                @blur="checkSnacks(item.name)"
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
                                                @blur="checkSnacks(item.num)"
                                                :onkeyup="(item.num = item.num.replace(/^(0+)|[^\d]+/g, ''))"
                                                style="width: 70px; margin-right: 10px"
                                                v-model="item.num"
                                                placeholder="数量"
                                                :readonly="isReadonly"
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
                                            :onkeyup="(snacksObj.num = snacksObj.num.replace(/^(0+)|[^\d]+/g, ''))"
                                            style="width: 70px; margin-right: 10px"
                                            v-model="snacksObj.num"
                                            placeholder="数量"
                                            :readonly="isReadonly"
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
                                <el-button @click="ktvCancelSub" v-if="!isUpdateKtvInfo">清空</el-button>
                                <el-button @click="ktvSureSub" type="primary">{{ isUpdateKtvInfo == false ? '新增' : '确定' }}</el-button>
                            </div>
                        </div>
                        <!-- ktv包间属性列表 -->
                        <div class="ktv-right-box">
                            <template v-if="isReadonly && ktvList.length !== 0">
                                <div class="change-ktvFloor">
                                    <el-button
                                        v-for="(item, index) in list"
                                        :key="index"
                                        :type="nowKtvFloor == item.floor ? 'primary' : ''"
                                        @click="changeShowKtvFloor(item, index)"
                                        class="add-floor"
                                        >{{ item.floor }}</el-button
                                    >
                                </div>
                                <ul>
                                    <li v-for="(item, index) in ktvList[nowKtvFloorIndex].ktvRoomList" :key="index">
                                        <div class="left-box">
                                            <div>
                                                <p>
                                                    <span>包间类型：</span>
                                                    <span>{{ item.roomTypeId | roomType(ktvTypeOpt) }}</span>
                                                </p>
                                                <p>
                                                    <span>容纳人数：</span>
                                                    <span>{{ item.capacity }}人</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    <span>包间数量：</span>
                                                    <span>{{ item.roomNumber }}个</span>
                                                </p>
                                                <p>
                                                    <span>最低消费：</span>
                                                    <span>{{ item.minConsumption }}元</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="right-box">
                                            <el-button @click="lookKtvInfo(item)" type="primary">查看</el-button>
                                        </div>
                                    </li>
                                </ul>
                            </template>
                            <template v-else>
                                <ul>
                                    <li v-for="(item, index) in ktvRoomList" :key="index">
                                        <div class="left-box">
                                            <div>
                                                <p>
                                                    <span>包间类型：</span>
                                                    <span>{{ item.roomTypeId | roomType(ktvTypeOpt) }}</span>
                                                </p>
                                                <p>
                                                    <span>容纳人数：</span>
                                                    <span>{{ item.capacity }}人</span>
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    <span>包间数量：</span>
                                                    <span>{{ item.roomNumber }}个</span>
                                                </p>
                                                <p>
                                                    <span>最低消费：</span>
                                                    <span>{{ item.minConsumption }}元</span>
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
                            </template>
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
                city: '',
                searchAddress: '',
                trustAddress: '',
                longitude: -1, //经度
                latitude: -1, //纬度
                merchantType: 1 //商家类型
            },

            showImgPrefix: this.$imgHead, //回显图片/视频的前缀

            isReadonly: true, //编辑信息开关
            isUpdate: true, //判断当前操作为修改还是新增店铺

            putawayStatus: '', //店铺的申请上下架状态

            recoType: '', //申请推荐位状态
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
            longitude: -1, //经度
            latitude: -1, //纬度

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
            latestRetainTime: '', //晚于最晚保留时间的订单保留分钟数

            bannerShowBox: [], //要上传的banner图集和回显的banner图集（回显在自定义的位置）
            bannerImgBox: [], //要回显的banner图集（只能显示在上传图集的容器中）
            bannerVideo: [], //回显banner视频
            ktvBannerImgBox: [], //回显ktv包间示意图（上传图集容器中）

            overallImageUrl: '', //商家布局图
            rowNumImageUrl: '', //排号横幅图
            // appShopImageUrl: '', //店铺长图

            x: 6, //座位行数
            y: 6, //座位列数
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
            presentSeatInfo: {}, //当前正在操作的座位对应的详细信息
            isClickSeat: false, //展示当前座位的详细信息开关

            ktvRoomList: [], //ktv包间集合
            deleteKtvRoomList: [], //要删除的ktv包间id数组
            ktvTypeOpt: [], //ktv包间类型
            isLookKtvInfo: false, //查看或编辑当前ktv包间属性信息的标杆
            isUpdateKtvInfo: false, //当前确认按钮是否为修改包间属性信息
            //当前ktv包间配置的赠品
            snacksObj: {
                name: '',
                num: ''
            },
            //当前ktv包间配置的时间段
            timeQuanObj: {
                startTime: '', //开始时间
                endTime: '', //结束时间
                latestTime: '20', //最晚保留时间
                minConsumption: 0.1 //最低消费
            },
            timeQuanArr: ['10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120'],

            //当前ktv包间对应的详细信息
            presentKtvInfo: {
                floor: '', //所属楼层
                roomTypeId: '', //包间类型
                // roomAttribute: '1', //包间所属
                roomNumber: 1, //包间数量
                capacity: 1, //容纳人数
                haveToilet: '2', //独立卫生间
                haveDiningTable: false, //餐桌
                haveMahjong: false, //麻将
                haveSwimming: false, //泳池
                haveTableTennis: false, //桌球
                minConsumption: '', //最低消费（时间段集合里的最低消费）
                snacks: [], //赠品
                sketchMap: [], //包间示意图
                roomTimeIntervalList: [] //时间段集合
            },

            wrapLoading: false, //加载开关
            allRegRight: false, //全部验证通过的开关

            seatFloorDialog: false, //添加或修改楼层弹窗的开关
            cassette: [], //所有楼层的座位数量
            list: [], //所有楼层中所有的座位
            floorName: '', //添加楼层名称的输入框
            nowFloor: '', //当前正在操作的楼层名
            nowFloorIndex: -1, //当前正在操作的楼层的下标
            nowFloorPower: '', //当前正在操作的楼层的权重
            ktvList: [], //回显KTV楼层列表专用
            nowKtvFloor: '', //当前正在操作的KTV楼层名
            nowKtvFloorIndex: -1 //当前正在操作的KTV楼层的下标
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

        //打开添加/修改楼层对话框
        addFloor() {
            this.checkFormInfo(); //验证所有输入的值
            if (!this.allRegRight) {
                return;
            }

            //获取最新的楼层（老店铺才去获取）
            if (this.isUpdate) {
                this.getStoreInfo();
            }
            this.seatFloorDialog = true;
        },

        //确定添加/修改楼层
        handleSeatFloor() {
            //添加店铺
            this.submitShopRequest();

            this.seatFloorDialog = false; //关闭编辑楼层对话框
        },

        //取消编辑楼层
        handleCancelEditFloor() {
            this.seatFloorDialog = false;
            if (this.list.length !== 0) {
                this.changeShowFloor(this.list[0], 0);
            }
            // this.changeShowFloor(this.list[0], 0);
        },

        //更改楼层名称，内部的座位的相关信息也要跟着改变
        changeFloor(item) {
            item.layoutList.forEach((ele) => {
                ele.floor = item.floor;
            });
        },

        //验证所有输入的值
        checkFormInfo() {
            if (!this.shopName) {
                this.$message.error('请输入店铺名称');
                return;
            } else if (!this.shopBrief) {
                this.$message.error('请输入店铺简介');
                return;
            } else if (!this.logoImageUrl) {
                this.$message.error('请上传店铺logo');
                return;
            } else if (!this.shopLocaIndex) {
                this.$message.error('请选择店铺定位');
                return;
            } else if (this.servicePhoneArr.length == 0) {
                this.$message.error('请输入客服电话');
                return;
            } else if (!this.startBussTime) {
                this.$message.error('请选择开始营业时间');
                return;
            } else if (!this.endBussTime) {
                this.$message.error('请选择结束营业时间');
                return;
            } else if (this.submitShopType.length === 0) {
                this.$message.error('请选择店铺类型');
                return;
            } else if (!this.perCon) {
                this.$message.error('请输入店铺人均消费');
                return;
            } else if (this.$regular.money(this.perCon) === false) {
                this.$message.error('请输入正确格式的店铺人均消费');
                return;
            } else if (!this.searchAddress) {
                this.$message.error('请输入地址');
                return;
            } else if (!this.trustAddress) {
                this.$message.error('请输入详细地址');
                return;
            } else if (!this.goodsBrief) {
                this.$message.error('请输入商品店名简介');
                return;
            } else if (!this.latestRetainTime && this.shopLocaIndex != 3) {
                this.$message.error('请选择晚于最晚到店时间订单的保留分钟数');
                return;
            } else if (this.bannerShowBox.length == 0) {
                this.$message.error('请上传店铺轮播图');
                return;
            } else if (!this.rowNumImageUrl) {
                this.$message.error('请上传排号横幅图');
                return;
            }
            // else if (!this.appShopImageUrl) {
            //     this.$message.error('请上传店铺长图');
            //     return;
            // }
            else if (!this.overallImageUrl && this.shopLocaIndex != 3) {
                this.$message.error('请上传商家布局图');
                return;
            } else {
                let arr = this.servicePhoneArr;
                for (let i = 0; i < arr.length; i++) {
                    if (this.$regular.phone(arr[i]) === false) {
                        this.$message.error('电话号码格式不正确，请重新输入');
                        this.allRegRight = false;
                        break;
                    } else {
                        this.allRegRight = true;
                    }
                }
            }
        },

        //验证金额
        checkPrice(price, opt, index) {
            if ((!this.isReadonly && price !== '') || opt == 2) {
                if (price < 0.1 || this.$regular.money(price) === false) {
                    switch (opt) {
                        case 1:
                            this.presentSeatInfo.weekPriceList[index].price = 0.1;
                            break;
                        case 2:
                            this.presentKtvInfo.roomTimeIntervalList[index].minConsumption = 0.1;
                            break;
                        case 3:
                            this.timeQuanObj.minConsumption = 0.1;
                            break;
                    }
                    if (price < 0.1) {
                        this.$message.error('消费金额不能低于0.1元');
                    } else if (this.$regular.money(price) === false) {
                        this.$message.error('请输入正确格式的金额');
                    }
                }
            }
        },

        //零嘴输入框失去焦点验证
        checkSnacks(item) {
            if (!item) {
                this.$message.error('零嘴不能为空');
            }
        },

        //每个座位单独的最晚保留时间失去焦点验证
        checkLateTime(item) {
            if (!item) {
                this.$message.error('保留最晚时间不能为空，默认将置为开始营业时间');
                setTimeout(() => {
                    this.presentSeatInfo.seatLatestReservationTime = this.startBussTime;
                }, 300);
            }
        },

        //每天的最晚保留时间失去焦点验证
        checkWeekLateTime(item, ind) {
            if (!item) {
                this.$message.error('保留最晚时间不能为空，默认将置为开始营业时间');
                setTimeout(() => {
                    this.presentSeatInfo.weekPriceList[ind].seatLatestReservationTime = this.startBussTime;
                }, 300);
            }
        },

        //非空验证
        checkNull(item, txt) {
            if (item === '' || item === undefined || item === null) {
                this.$message.error(`${txt}不能为空`);
            }
        },

        //获取上架下架状态
        getPutawayStatus() {
            this.$get('/merchant/store/settled/applyOnlineType').then((res) => {
                if (res.code === 0) {
                    this.putawayStatus = res.data.type;
                }
            });
        },

        //申请上架店铺/下架店铺
        putawayStore() {
            if (this.putawayStatus !== 3) {
                let txt = '';
                if (this.putawayStatus == 1) {
                    txt = '是否向平台申请下线店铺，为保证呈现给用户的数据准确性，下线成功后需重新提交上线店铺审核，通过后则能在App展示';
                }

                if (this.putawayStatus == 2) {
                    txt = '是否向平台申请上线店铺，为保证呈现给用户的数据准确性，上线成功后需再次申请下线店铺才能进行资料变更';
                }

                this.$confirm(txt, '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$get('/merchant/store/settled/applyOnline').then((res) => {
                            if (res.code === 0) {
                                this.$message.success('申请成功');
                                this.getPutawayStatus();
                            }
                        });
                    })
                    .catch(() => {});
            }
        },

        //申请商家推荐
        storeRecommend() {
            if (this.recoType == 1) {
                this.$confirm('确定要申请商家推荐吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        this.$get('/merchant/store/recommend/storeRecommend').then((res) => {
                            if (res.code === 0) {
                                this.$message.success('申请成功，请等待审核');
                                this.storeRecommendType();
                            }
                        });
                    })
                    .catch(() => {});
            }
        },

        //获取申请商家推荐状态
        storeRecommendType() {
            this.$get('/merchant/store/recommend/storeRecommendType').then((res) => {
                if (res.code === 0) {
                    this.recoType = res.data.type;
                }
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
            const isLt2M = file.size / 1024 / 1024 <= 1; //限制文件大小

            //限制上传文件格式
            if (!isJPG && !isPNG && !isMP4) {
                this.$message.error('上传文件只能是 JPG / PNG / MP4 格式');
                return false;
            }

            //限制上传文件大小
            if (isJPG || isPNG) {
                if (!isLt2M) {
                    this.$message.error('图片大小不能超过 1MB');
                    return false;
                }
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
            const isLt2M = file.size / 1024 / 1024 <= 1; //限制文件大小

            //限制上传文件格式
            if (!isJPG && !isPNG) {
                this.$message.error('上传图片只能是 JPG / PNG 格式');
                return false;
            }

            //限制上传文件大小
            if (isJPG || isPNG) {
                if (!isLt2M) {
                    this.$message.error('图片大小不能超过 1MB');
                    return false;
                }
            }
        },

        //上传logo
        uploadAvatarFile(file) {
            this.imgLoading.loading2 = true;
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
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
            formData.append('file', file.file);
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    //将url添加到上传容器中
                    this.bannerShowBox.push(res.data);

                    //将url添加到视图容器里
                    let obj = {
                        url: this.showImgPrefix + res.data
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
            formData.append('file', file.file);
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    //将url添加到上传容器中
                    if (!this.presentKtvInfo.sketchMap) {
                        this.presentKtvInfo.sketchMap = [];
                    }
                    this.presentKtvInfo.sketchMap.push(res.data);

                    //将url添加到视图容器中
                    let obj = {
                        url: this.showImgPrefix + res.data
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
            if (typeof this.presentKtvInfo.sketchMap === 'string') {
                this.presentKtvInfo.sketchMap = this.presentKtvInfo.sketchMap.split(',');
            }

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
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
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
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                if (res.code == 0) {
                    this.rowNumImageUrl = res.data;
                    this.imgLoading.loading3 = false;
                    this.$message.success('上传成功');
                }
            });
        },

        //上传店铺长图
        // uploadAppShopFile(file) {
        //     this.imgLoading.loading4 = true;
        //     let formData = new FormData();
        //     formData.append('file', file.file);
        //     this.$file_post(this.$fileUploadUrl, formData).then((res) => {
        //         if (res.code == 0) {
        //             this.appShopImageUrl = res.data;
        //             this.imgLoading.loading4 = false;
        //             this.$message.success('上传成功');
        //         }
        //     });
        // },

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
            console.log('店铺类型', this.submitShopType);
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
        },

        //回显店铺类型样式（编辑时）
        showCheckType() {
            this.submitShopType = [];
            if (this.shopTypeOptStrArr.length !== [] && this.shopTypeOpt !== [] && this.$refs.shopTypeSpan !== []) {
                this.shopTypeOptStrArr.forEach((item) => {
                    this.shopTypeOpt.forEach((obj) => {
                        if (item == obj.recommendBrand) {
                            this.submitShopType.push(obj.id); //将原有的类型id存入上传数组中
                            if (!this.seatFloorDialog) {
                                this.$nextTick(() => {
                                    this.$refs.shopTypeSpan.forEach((item2) => {
                                        if (item2.innerHTML == obj.recommendBrand) {
                                            item2.classList.add('shop-type-span'); //回显原有类型对应的样式
                                        }
                                    });
                                });
                            }
                        }
                    });
                });
            }
        },

        //给地图子组件传值（编辑店铺时）
        sendInfoToMap() {
            this.mapList.searchAddress = this.searchAddress;
            this.mapList.trustAddress = this.trustAddress;
            this.mapList.city = this.city;
            this.mapList.longitude = Number(this.longitude);
            this.mapList.latitude = Number(this.latitude);
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
            this.editShopInit(); //初始化操作
            this.sendInfoToMap(); //给地图子组件传值（回显地址信息）
            // this.getShopType(); //获取店铺类型
            this.showCheckType(); //回显已经选择的店铺类型
            this.showBannerVideo(); //回显banner图集里的视频
            this.clearKtvInfo(); //清空ktv包间属性数据
            this.clearSeatBorder(); //清空座位外边框（定位当前座位）
            this.imgUploadWatch('.banner-show-box', this.bannerShowBox, 5); //根据上传的banner图个数，来显示与隐藏上传图标
        },

        //请求成功后，处理的操作
        requestSuccessInit(txt) {
            this.getStoreInfo();
            this.$message.success(txt);
            this.submitShopType = [];
            this.deleteKtvRoomList = []; //初始化要删除的ktv包间id
            this.isReadonly = true;
            this.allRegRight = false;
            this.wrapLoading = false;
        },

        //不让传过去的banner集合的第一个值为.mp4格式
        bannerVideoSort() {
            if (this.bannerShowBox.length !== 0) {
                const index = this.bannerShowBox[0].indexOf('mp4');
                if (index !== -1) {
                    [this.bannerShowBox[0], this.bannerShowBox[1]] = [this.bannerShowBox[1], this.bannerShowBox[0]];
                }
            }
        },

        //新增/修改店铺
        submitShopRequest() {
            this.wrapLoading = true;

            //不让传过去的banner集合的第一个值为.mp4格式
            this.bannerVideoSort();

            //传消息时，座位号前面要跟上当前的楼层号
            if (this.list.length !== 0 && this.shopLocaIndex != 3) {
                this.list.forEach((item) => {
                    item.layoutList.forEach((item2) => {
                        item2.seatCode = item.floor + '-' + item2.seatCode;
                    });
                });
            }

            //要传的值
            let data = {
                source: 1,
                // appListBigPicture: this.appShopImageUrl,
                city: this.city,
                cassette: '6x6',
                customerServicePhoneList: this.servicePhoneArr,
                district: this.district,
                districtCode: this.districtCode,
                endTime: this.endBussTime,
                goodsStoreSynopsis: this.goodsBrief,
                latestRetainTime: this.shopLocaIndex == 3 ? '20' : this.latestRetainTime,
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
                layoutList: [],
                ktvRoomList: this.ktvStrTran(),
                deleteKtvRoomList: this.deleteKtvRoomList,
                list: this.shopLocaIndex == 3 ? [] : this.list
            };

            if (this.isUpdate) {
                data.id = this.shopId;
                console.log('修改时传的值', data);

                this.$put('/merchant/store/update', data).then((res) => {
                    if (res.code === 0) {
                        this.requestSuccessInit('修改成功');
                    } else if (res.code === 500) {
                        this.submitNoInput(res.msg);
                    } else if (res.code === 741) {
                        this.wrapLoading = false;
                        this.isReadonly = true;
                        this.getStoreInfo();
                        this.$message.error(res.msg);
                    } else {
                        this.floorName = '';
                        this.wrapLoading = false;
                        this.$message.error(res.msg);
                    }
                });
            } else {
                console.log('新增时传的值', data);

                this.$post('/merchant/store/save', data).then((res) => {
                    if (res.code === 0) {
                        this.requestSuccessInit('新增成功');
                        localStorage.removeItem('storageInfo');
                        this.isUpdate = true;
                    } else if (res.code === 500) {
                        this.submitNoInput(res.msg);
                    } else if (res.code === 741) {
                        this.wrapLoading = false;
                        // this.isReadonly = true;
                        // this.getStoreInfo();
                        this.$message.error(res.msg);
                    } else {
                        this.floorName = '';
                        this.wrapLoading = false;
                        this.$message.error(res.msg);
                    }
                });
            }
        },

        //如果保存时，未添加楼层座位，KTV包间信息，就提示
        submitNoInput(txt) {
            this.wrapLoading = false;
            if (this.shopLocaIndex != 3) {
                this.getStoreInfo(); //重新获取商店数据
                this.isReadonly = true;
            } else {
                this.isLookKtvInfo = true;
            }
            this.$message.error(txt);
        },

        //保存按钮
        submitShopInfo() {
            this.checkFormInfo(); //验证所有输入的值
            if (this.allRegRight) {
                this.submitShopRequest(); //新增/修改店铺
                this.clearSeatBorder(); //清空座位外边框（定位当前座位）
                this.isClickSeat = false;
                this.isLookKtvInfo = false;
            }
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

            this.list.forEach((item) => {
                if (item.floor === this.nowFloor) {
                    item.layoutList.forEach((item2) => {
                        if (item2.floor == item.floor && item2.seatRow == seatRow && item2.seatColumn == seatColumn) {
                            //查看当前座位信息
                            this.presentSeatInfo = item2;

                            //修改当前座位信息
                            if (!this.isReadonly) {
                                //修改当前座位的属性
                                this.presentSeatInfo.seatAttribute = seatType;
                                //修改当前座位为舞台/过道
                                this.presentSeatInfo.seatType = stageCode;
                            }
                        }
                    });
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
        },

        //改变座位状态按钮（改变点击的座位颜色）
        changeStyle(style) {
            this.seatStyle = style;
        },

        //切换ktv楼层时，楼层对应的数据跟着切换
        changeShowKtvFloor(item, index) {
            this.nowKtvFloor = item.floor;
            this.nowKtvFloorIndex = index;
        },

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

        //回显店铺卡座数量（行和列数量）
        getShopSeat(index) {
            if (this.list.length !== 0) {
                let seat = this.list[index].cassettes.split('x');
                this.x = +seat[0];
                this.y = +seat[1];
            }
        },

        //获取经纬度
        getlonlat(lonlat) {
            lonlat = lonlat.split(',');
            this.longitude = lonlat[0];
            this.latitude = lonlat[1];
        },

        //添加时间段
        addTimeQuan() {
            if (this.timeQuanObj.startTime === '' || this.timeQuanObj.startTime === null) {
                this.$message.error('开始时间不能为空');
            } else if (this.timeQuanObj.endTime === '' || this.timeQuanObj.endTime === null) {
                this.$message.error('结束时间不能为空');
            }
            // else if (this.timeQuanObj.latestTime === '') {
            //     this.$message.error('最晚保留时间不能为空');
            // }
            else if (this.timeQuanObj.minConsumption == 0) {
                this.$message.error('最低消费不能为0');
            } else if (this.$regular.money(this.timeQuanObj.minConsumption) === false) {
                this.$message.error('请输入正确格式的金额');
            } else {
                let timeQuan = Object.assign({}, this.timeQuanObj);
                this.presentKtvInfo.roomTimeIntervalList.push(timeQuan);
                this.timeQuanObj = {
                    startTime: '', //开始时间
                    endTime: '', //结束时间
                    latestTime: '20', //最晚保留时间
                    minConsumption: 0.1 //最低消费
                };
            }
        },

        //删除时间段
        delTimeQuan(item) {
            const index = this.presentKtvInfo.roomTimeIntervalList.indexOf(item);
            if (index !== -1) {
                this.presentKtvInfo.roomTimeIntervalList.splice(index, 1);
            }
        },

        //添加客服电话
        addServicePhone() {
            if (this.$regular.phone(this.servicePhone) === false) {
                this.$message.error('电话格式不正确，请重新输入');
            } else {
                this.servicePhoneArr.push(this.servicePhone);
            }
            this.servicePhone = '';
        },

        //删除客服电话
        deleteServicePhone(item) {
            const index = this.servicePhoneArr.indexOf(item);
            if (index !== -1) {
                this.servicePhoneArr.splice(index, 1);
            }
        },

        //添加赠品
        addSnacks() {
            if (!this.snacksObj.name) {
                this.$message.error('请输入赠品名称');
            } else if (!this.snacksObj.num) {
                this.$message.error('请输入赠品数量');
            } else {
                let snacksObj = Object.assign({}, this.snacksObj);
                this.presentKtvInfo.snacks.push(snacksObj);
                this.snacksObj = {
                    name: '',
                    num: ''
                };
            }
        },

        //删除赠品
        deleteSnacks(item) {
            const index = this.presentKtvInfo.snacks.indexOf(item);
            if (index !== -1) {
                this.presentKtvInfo.snacks.splice(index, 1);
            }
        },

        //ktv里的相关字符串转换方法
        ktvStrTran() {
            const newSeatArr = this.ktvRoomList.map((i) => {
                //深拷贝，避免干扰以前的数据
                let item = this.$regular.deepClone(i);

                if (item.sketchMap instanceof Array) {
                    item.sketchMap = item.sketchMap.join(','); //将包间示意图数组转成字符串传给后台
                }
                item.haveDiningTable = item.haveDiningTable === false ? 2 : 1;
                item.haveMahjong = item.haveMahjong === false ? 2 : 1;
                item.haveSwimming = item.haveSwimming === false ? 2 : 1;
                item.haveTableTennis = item.haveTableTennis === false ? 2 : 1;

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
                    const index = this.ktvRoomList.indexOf(item);
                    if (index !== -1) {
                        if (item.id) {
                            this.ktvRoomList.splice(index, 1);
                            this.deleteKtvRoomList.push(item.id);
                        } else {
                            this.ktvRoomList.splice(index, 1);
                        }
                    }

                    this.clearKtvInfo();
                    this.isUpdateKtvInfo = false;
                })
                .catch(() => {});
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

        //删除楼层
        deleteFloorList(item) {
            // if (this.list.length === 0) {
            //     this.$message.error('楼层最低保留一层');
            //     return;
            // }

            const index = this.list.indexOf(item);
            if (index !== -1) {
                this.list.splice(index, 1);
            }

            //删除一楼就将剩余楼层权重减一
            this.list.forEach((item, i) => {
                item.floorPower = i;
                item.layoutList.forEach((item2) => {
                    item2.floorPower = i;
                });
            });
        },

        //创建楼层
        creatFloorList() {
            if (this.floorName.trim() === '') {
                this.$message.error('请输入正确的楼层名称');
                return;
            }

            let layoutList = [];
            //根据行数和列数动态的创建座位
            for (let i = 1; i <= 6; i++) {
                for (let j = 1; j <= 6; j++) {
                    layoutList.push({
                        minConsumption: 0,
                        numberOfPeople: 1,
                        seatAttribute: 2,
                        seatCode: j + '-' + i,
                        floor: this.floorName,
                        floorPower: this.list.length,
                        seatColumn: i,
                        seatRow: j,
                        seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime,
                        seatType: 1,
                        softHardStatus: '1',
                        weekPriceList: [
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 1,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 2,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 3,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 4,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 5,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 6,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 7,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            }
                        ]
                    });
                }
            }

            //创建楼层
            this.list.push({
                cassettes: '6x6',
                floor: this.floorName,
                floorPower: this.list.length,
                layoutList
            });

            //清空新增输入框
            this.floorName = '';
        },

        //创建座位（夜店/清吧）
        createSeatFn() {
            let layoutList = [];
            //根据行数和列数动态的创建座位
            for (let i = 1; i <= this.y; i++) {
                for (let j = 1; j <= this.x; j++) {
                    layoutList.push({
                        minConsumption: 0,
                        numberOfPeople: 1,
                        seatAttribute: 2,
                        seatCode: j + '-' + i,
                        floor: this.nowFloor,
                        floorPower: this.nowFloorPower,
                        seatColumn: i,
                        seatRow: j,
                        seatLatestReservationTime: this.endBussTime == '' ? '00:00' : this.endBussTime,
                        seatType: 1,
                        softHardStatus: '1',
                        weekPriceList: [
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 1,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 2,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 3,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 4,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 5,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 6,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            },
                            {
                                id: '',
                                price: 0.1,
                                seatCode: '',
                                storeId: '',
                                weekIndex: 7,
                                seatLatestReservationTime: this.startBussTime == '' ? '00:00' : this.startBussTime
                            }
                        ]
                    });
                }
            }

            //重新赋值当前楼层的所有座位
            this.list.forEach((item) => {
                if (item.floor == this.nowFloor) {
                    item.cassettes = this.x + 'x' + this.y;
                    item.floorPower = this.nowFloorPower;
                    item.layoutList = layoutList;
                }
            });

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
        changeLayoutList() {
            this.list.forEach((item) => {
                item.layoutList.forEach((item2) => {
                    //将数值型转为字符型（软硬座）
                    if (item2.softHardStatus) {
                        item2.softHardStatus = item2.softHardStatus.toString();
                    }
                });
            });
        },

        //对ktv信息进行相关转换
        changeKtvList(arr) {
            if (arr.length !== 0) {
                console.log('vvvv', arr);
                arr.forEach((item) => {
                    //赠品json字符串转为数组对象
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
                    if (item.haveToilet) {
                        item.haveToilet = item.haveToilet.toString();
                    }

                    //将配套设施转为布尔类型
                    if (item.haveDiningTable || item.haveMahjong || item.haveSwimming || item.haveTableTennis) {
                        item.haveDiningTable = item.haveDiningTable === 1 ? true : false;
                        item.haveMahjong = item.haveMahjong === 1 ? true : false;
                        item.haveSwimming = item.haveSwimming === 1 ? true : false;
                        item.haveTableTennis = item.haveTableTennis === 1 ? true : false;
                    }
                });
            }
        },

        //清空ktv包间属性编辑区域的数据
        clearKtvInfo() {
            this.presentKtvInfo = {
                floor: '', //所属楼层
                roomTypeId: '', //包间类型
                // roomAttribute: '1', //包间所属
                roomNumber: 1, //包间数量
                capacity: 1, //容纳人数
                haveToilet: '2', //独立卫生间
                haveDiningTable: false, //餐桌
                haveMahjong: false, //麻将
                haveSwimming: false, //泳池
                haveTableTennis: false, //桌球
                minConsumption: '', //最低消费（时间段集合里的最低消费）
                snacks: [], //赠品
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
                latestTime: '20', //最晚保留时间
                minConsumption: 0.1 //最低消费
            };
            this.ktvBannerImgBox = [];
        },

        //清空新增输入框的ktv包间信息
        ktvCancelSub() {
            this.clearKtvInfo();
            // if (this.isUpdateKtvInfo) {
            //     this.isUpdateKtvInfo = false;
            //     this.getStoreInfo();
            //     setTimeout(() => {
            //         this.showBannerVideo();
            //     }, 500);
            // }
        },

        //提交保存ktv包间信息
        ktvSureSub() {
            if (!this.presentKtvInfo.floor) {
                this.$message.error('请输入所属楼层');
            } else if (!this.presentKtvInfo.roomTypeId) {
                this.$message.error('请选择包间类型');
            } else if (this.presentKtvInfo.roomTimeIntervalList.length == 0) {
                this.$message.error('请添加时间段分布');
            } else if (this.presentKtvInfo.sketchMap.length == 0) {
                this.$message.error('至少上传一张包间示意图');
            } else {
                //最低消费不能输入0
                let arr = this.presentKtvInfo.roomTimeIntervalList;
                let flag = false;
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].minConsumption == 0 || arr[i].minConsumption == 0.0 || arr[i].minConsumption == 0.0) {
                        flag = true;
                        break;
                    }
                }

                if (flag) {
                    this.$message.error('最低消费不能为0');
                    return;
                }

                if (this.isUpdateKtvInfo) {
                    this.$message.success('修改成功');
                    this.isUpdateKtvInfo = false;
                } else {
                    if (!this.ktvRoomList) {
                        this.ktvRoomList = [];
                    }

                    //获取时间段里的所有最低消费
                    let minConArr = this.presentKtvInfo.roomTimeIntervalList.map((item) => {
                        return item.minConsumption;
                    });

                    this.presentKtvInfo.minConsumption = Math.min(...minConArr); //返回ktv包间最小值

                    //将当前用户添加的KTV信息存到上传数组中
                    this.ktvRoomList.push(this.presentKtvInfo);
                    this.ktvRoomList.map((item) => {
                        this.$set(item, 'roomAttribute', 0);
                    });

                    console.log(this.ktvRoomList);
                    // for (let i = 0; i < this.ktvList.length; i++) {
                    //     if (this.ktvList[i].floor === this.presentKtvInfo.floor) {
                    //         this.ktvList[i].ktvRoomList.push(this.presentKtvInfo);
                    //         break;
                    //     } else {
                    //         let ktvRoomList = [];
                    //         ktvRoomList.push(this.presentKtvInfo);
                    //         this.ktvList.push({
                    //             cassettes: '',
                    //             floor: this.presentKtvInfo.floor,
                    //             floorPower: this.ktvList.length,
                    //             ktvRoomList
                    //         });
                    //         break;
                    //     }
                    // }

                    this.$message.success('新增成功');
                }
                this.clearKtvInfo();
            }

            console.log(this.ktvRoomList);
        },

        //回显每个座位号时，不要带上楼层号
        substrSeatNum() {
            this.list.forEach((item) => {
                item.layoutList.forEach((item2) => {
                    const index = item2.seatCode.indexOf('-');
                    if (index !== -1) {
                        item2.seatCode = item2.seatCode.substr(index + 1);
                    }
                });
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

                    //获取店铺类型
                    this.getShopType(result.storeLocation);

                    //获取经纬度
                    this.getlonlat(lonlat);

                    //回显banner图集
                    this.showBannerImg();

                    //回显视频banner
                    this.showBannerVid();

                    //回显第一楼店铺卡座数量
                    this.getShopSeat(0);

                    //默认展示的楼层为第一楼
                    if (this.list.length !== 0) {
                        this.nowFloor = result.list[0].floor;
                    }

                    //默认展示第一楼的ktv列表
                    if (this.shopLocaIndex == 3 && this.list.length !== 0) {
                        this.changeShowKtvFloor(this.ktvList[0], 0);
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
                if (res.code === 0) {
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
                servicePhoneArr: this.servicePhoneArr,
                // shopType: this.shopType,
                shopTypeOpt: this.shopTypeOpt,
                // shopTypeOptStrArr: this.shopTypeOptStrArr,
                // submitShopType: this.submitShopType,
                perCon: this.perCon,
                goodsBrief: this.goodsBrief,
                latestRetainTime: this.latestRetainTime,
                shopMatter: this.shopMatter,
                bannerImgBox: this.bannerImgBox,
                bannerShowBox: this.bannerShowBox,
                bannerVideo: this.bannerVideo,
                overallImageUrl: this.overallImageUrl,
                rowNumImageUrl: this.rowNumImageUrl,
                // appShopImageUrl: this.appShopImageUrl,
                x: this.x,
                y: this.y,
                list: this.list,
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
                this.servicePhoneArr = storageInfo.servicePhoneArr;
                // this.shopType = storageInfo.shopType;
                this.shopTypeOpt = storageInfo.shopTypeOpt;
                // this.shopTypeOptStrArr = storageInfo.shopTypeOptStrArr;
                // this.submitShopType = storageInfo.submitShopType;
                this.perCon = storageInfo.perCon;
                this.goodsBrief = storageInfo.goodsBrief;
                this.latestRetainTime = storageInfo.latestRetainTime;
                this.shopMatter = storageInfo.shopMatter;
                this.bannerImgBox = storageInfo.bannerImgBox;
                this.bannerShowBox = storageInfo.bannerShowBox;
                this.bannerVideo = storageInfo.bannerVideo;
                this.overallImageUrl = storageInfo.overallImageUrl;
                this.rowNumImageUrl = storageInfo.rowNumImageUrl;
                // this.appShopImageUrl = storageInfo.appShopImageUrl;
                this.x = storageInfo.x;
                this.y = storageInfo.y;
                this.list = storageInfo.list;
                this.ktvRoomList = storageInfo.ktvRoomList;

                //给地图子组件传值（回显地址信息）
                this.sendInfoToMap();

                // //回显banner图片
                this.showBannerImg();

                //回显banner视频
                this.showBannerVideo();

                //店铺定位初始化
                this.initShopLocaStyle();

                // //座位属性回显
                this.showSeatAtt(0);

                //默认展示第一家店的信息
                if (this.list.length !== 0) {
                    this.changeShowFloor(this.list[0], 0);
                }

                // //获取已经选择的店铺类型
                // this.showShopType(this.submitShopType);

                // //回显已经选择的店铺类型
                // this.showCheckType();
            }
        },

        //座位行数/列数改变
        changeSeatNum() {
            if (!this.isReadonly) {
                this.isClickSeat = false;
                this.createSeatFn(); //创建座位
            } else {
                this.$message.error('请输入整数的列数和行数');
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
    },

    mounted() {
        this.getStoreInfo(); //回显所有店铺数据
    }
};
</script>

<style lang="less" scoped>
@media screen and (min-width: 1300px) {
    .container {
        box-sizing: border-box;
        display: flex;
        padding: 20px;
    }

    .left-wrap {
        width: 35%;
        height: 100%;
        margin-right: 50px;

        .shop-info {
            .left-info {
                width: 30%;
            }

            .right-info {
                width: 70%;
            }
        }
    }

    .right-wrap {
        height: 100%;
        width: 65%;
    }
}

@media screen and (max-width: 1300px) {
    .left-wrap {
        .shop-info {
            .left-info {
                width: 20%;
            }

            .right-info {
                width: 80%;
            }
        }
    }
}

.clearfix::after {
    display: block;
    content: '';
    clear: both;
}

.left-wrap {
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
        height: 30px;
        margin-right: 10px;
        background-color: #000;
    }

    .shop-info {
        display: flex;
        margin-bottom: 30px;

        .left-info {
            > span {
                font-size: 12px;
            }

            > p {
                margin-bottom: 10px;
            }
        }

        .right-info {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .shop-name {
                margin-bottom: 40px;

                > span {
                    min-width: 80px;
                }

                display: flex;
                align-items: center;
            }

            .shop-brief {
                > span {
                    min-width: 80px;
                }

                display: flex;
                align-items: center;
            }
        }
    }

    .shop-desc {
        margin-bottom: 50px;

        > div {
            display: flex;
            align-items: center;
            margin-bottom: 30px;

            > span {
                min-width: 120px;
            }
        }
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

                /deep/.el-input--suffix .el-input__inner {
                    padding-right: 0;
                }

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
            width: 50%;
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

        .overall-box {
            width: 20%;

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
            width: 30%;

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
                margin-bottom: 50px;
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

    .ktv-wrap {
        display: flex;

        .ktv-left-box {
            width: 60%;

            .time-quan {
                max-height: 420px;
                width: 70%;
                overflow-y: auto;
                margin: 20px 0;
            }

            .date-dist {
                border: 1px solid #c0c4cc;
                border-radius: 4px;
                padding: 20px 20px 10px;
                margin-bottom: 20px;

                &:last-child {
                    margin-bottom: 0;
                }

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

            .change-ktvFloor {
                margin-bottom: 20px;
            }

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

/deep/.right-wrap .day-mincom {
    .el-input-group__append,
    .el-input-group__prepend {
        padding: 0 5px;
    }

    .el-input__inner {
        padding: 0 0 0 5px;
    }
    .el-input__prefix {
        left: 100%;
    }
}

/deep/ .el-input--suffix .el-input__inner {
    padding-right: 0;
}

/deep/ .floor-dialog {
    .el-dialog {
        width: 30%;

        .el-dialog__body {
            padding: 10px 20px;
        }

        .input-box {
            > div {
                margin-bottom: 15px;
            }
        }
    }
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
