<template>
    <div class="goods-info-box">
        <div class="left-box">
            <el-form ref="goodsForm" :model="goodsForm" label-width="80px">
                <div class="good-name-box">
                    <div>
                        <span>*商品名称：</span>
                        <el-input v-model="goodsForm.name" style="width: 160px"></el-input>
                    </div>
                    <div>
                        <span>商品排序：</span>
                        <el-input-number v-model="goodsForm.goodWeight" :min="0" label="商品排序"></el-input-number>
                        <span>（*数值越小排序越靠前）</span>
                    </div>
                </div>
                <p>
                    <span>商品简介：</span>
                    <el-input type="textarea" v-model="goodsForm.desc" maxlength="60" show-word-limit style="width: 300px"></el-input>
                </p>

                <!-- 商品规格 -->
                <template v-if="activeNum != 1 && activeNum != 11">
                    <div class="drinks-spec">
                        <div class="title">
                            <span>*商品规格：</span>
                        </div>
                        <div class="sku-list">
                            <div v-for="(item, index) in goodsForm.dynamicValidateForm.domains" :key="index">
                                <el-input
                                    maxlength="4"
                                    v-model="item.specName"
                                    placeholder="规格（如：一瓶）"
                                    style="width: 132px; margin-right: 10px"
                                ></el-input>
                                <el-input
                                    @blur="checkPrice(item.originalPrice, 1, index)"
                                    v-model="item.originalPrice"
                                    placeholder="原价（如：9.99）"
                                    style="width: 170px; margin-right: 10px"
                                >
                                    <template slot="append">￥</template>
                                </el-input>
                                <el-input
                                    @blur="checkPrice(item.statisticalPrice, 2, index)"
                                    v-model="item.statisticalPrice"
                                    placeholder="现价（如：9.99）"
                                    style="width: 170px; margin-right: 10px"
                                >
                                    <template slot="append">￥</template>
                                </el-input>
                                <el-button @click.prevent="removeDomain(item)">
                                    <i class="el-icon-close"></i>
                                </el-button>
                                <!-- <el-button
                                    v-if="item.sellOut !== undefined"
                                    size="mini"
                                    :type="item.sellOut === 0 ? 'warning' : 'danger'"
                                    @click="handleSellOut(index, item)"
                                    >{{ item.sellOut === 0 ? '未售罄' : '已售罄' }}
                                </el-button> -->
                            </div>
                            <div>
                                <el-input
                                    maxlength="4"
                                    v-model="goodsForm.skuObj.specName"
                                    placeholder="规格（如：一瓶）"
                                    style="width: 132px; margin-right: 10px"
                                ></el-input>
                                <el-input
                                    @blur="checkPrice(goodsForm.skuObj.originalPrice, 3)"
                                    v-model="goodsForm.skuObj.originalPrice"
                                    placeholder="原价（如：9.99）"
                                    style="width: 170px; margin-right: 10px"
                                >
                                    <template slot="append">￥</template>
                                </el-input>
                                <el-input
                                    @blur="checkPrice(goodsForm.skuObj.statisticalPrice, 4)"
                                    v-model="goodsForm.skuObj.statisticalPrice"
                                    placeholder="现价（如：9.99）"
                                    style="width: 170px; margin-right: 10px"
                                >
                                    <template slot="append">￥</template>
                                </el-input>
                                <el-button @click="addDomain">
                                    <i class="el-icon-plus"></i>
                                </el-button>
                            </div>
                            <span style="color: #f00">*输入完规格信息后，点击后面加号视为添加成功</span>
                        </div>

                        <!-- <el-form
                            :model="goodsForm.dynamicValidateForm"
                            ref="goodsForm.dynamicValidateForm"
                            label-width="100px"
                            class="demo-dynamic"
                        >
                            <el-form-item v-for="(item, index) in goodsForm.dynamicValidateForm.domains" :key="index">
                                <el-input
                                    v-model="item.specName"
                                    placeholder="规格（如：一瓶）"
                                    style="width: 132px; margin-right: 10px"
                                ></el-input>
                                <el-input
                                    v-model="item.originalPrice"
                                    placeholder="原价（如：9.99）"
                                    style="width: 170px; margin-right: 10px"
                                >
                                    <template slot="append">￥</template>
                                </el-input>
                                <el-input
                                    v-model="item.statisticalPrice"
                                    placeholder="现价（如：9.99）"
                                    style="width: 170px; margin-right: 10px"
                                >
                                    <template slot="append">￥</template>
                                </el-input>
                                <el-button @click="addDomain">
                                    <i class="el-icon-plus"></i>
                                </el-button>
                                <el-button v-show="goodsForm.dynamicValidateForm.domains.length > 1" @click.prevent="removeDomain(item)">
                                    <i class="el-icon-close"></i>
                                </el-button>
                            </el-form-item>
                        </el-form> -->
                    </div>
                </template>

                <!-- 酒水 -->
                <template v-if="activeNum != 1 && activeNum != 9 && activeNum != 10 && activeNum != 11">
                    <p>
                        <span>酒水产地：</span>
                        <el-input v-model="goodsForm.area" style="width: 170px"></el-input>
                    </p>
                    <p>
                        <span>酒水年份：</span>
                        <el-input v-model="goodsForm.year" style="width: 170px">
                            <template slot="append">年</template>
                        </el-input>
                    </p>
                </template>

                <!-- 套餐 -->
                <template v-if="activeNum == 1">
                    <!-- 套餐选择单品 -->
                    <p>
                        <span>*选择商品：</span>
                        <el-select
                            v-model="goodName"
                            filterable
                            remote
                            placeholder="请选择"
                            @change="selectGoodInfo"
                            @focus="selectGoodsList"
                        >
                            <el-option
                                v-for="(item, index) in options"
                                :key="index"
                                :label="item.name"
                                :value="
                                    item.id +
                                    '+' +
                                    item.listPicture +
                                    '+' +
                                    item.name +
                                    '+' +
                                    item.originalPrice +
                                    '+' +
                                    item.presentPrice +
                                    '+' +
                                    item.sellOut
                                "
                            ></el-option>
                        </el-select>
                    </p>

                    <!-- 套餐单品表格数据 -->
                    <p v-if="goodsForm.tableData.length > 0" style="width: 90%">
                        <el-table :data="goodsForm.tableData" border>
                            <el-table-column prop="goodsName" label="商品名称" width="150"></el-table-column>
                            <el-table-column label="商品图片" width="126">
                                <template slot-scope="scope">
                                    <img style="width: 100px; height: 60px" :src="showImgPrefix + scope.row.listPicture" />
                                </template>
                            </el-table-column>
                            <el-table-column prop="originalPrice" label="原价" width="100"></el-table-column>
                            <!-- <el-table-column prop="presentPrice" label="现价" width="100"></el-table-column> -->
                            <el-table-column label="数量" width="160">
                                <template slot-scope="scope">
                                    <el-input-number
                                        @change="goodsPriceSum"
                                        v-model="scope.row.number"
                                        :min="1"
                                        label="商品数量"
                                    ></el-input-number>
                                </template>
                            </el-table-column>
                            <!-- <el-table-column label="状态" width="100">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.sellOut == 0 ? '未售罄' : '已售罄' }}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column label="操作">
                                <template slot-scope="scope">
                                    <el-button size="mini" type="danger" @click="handleDelete(scope.row)">移除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </p>
                    <p>
                        <span>*套餐原单价：</span>
                        <el-input v-model="goodsForm.originPrice" style="width: 120px; margin-right: 20px"></el-input>
                        <span>*套餐现单价：</span>
                        <el-input v-model="goodsForm.comboNowPrice" style="width: 120px"></el-input>
                    </p>
                </template>

                <!-- 会员卡 -->
                <template v-if="activeNum == 11">
                    <p>
                        <span>*会员卡积分：</span>
                        <el-input v-model="goodsForm.originPrice" style="width: 120px; margin-right: 20px"></el-input>

                        <span>*会员卡原价：</span>
                        <el-input v-model="goodsForm.statisticalPrice" style="width: 120px; margin-right: 20px"></el-input>

                        <span>*会员卡现价：</span>
                        <el-input v-model="goodsForm.nowPrice" style="width: 120px"></el-input>
                    </p>
                </template>
            </el-form>

            <!-- 放置广告位 -->
            <!-- <template v-if="activeNum == 1 || activeNum == 9 || activeNum == 10 || activeNum == 11">
                <p>
                    <el-checkbox
                        @change="removeBanner"
                        v-model="goodsForm.checkedBanner"
                        label="放至店铺宣传图"
                        border
                        style="margin-right: 20px"
                    ></el-checkbox>
                </p>
                <el-upload
                    v-if="goodsForm.checkedBanner && goodsForm.checkedBanner !== 2"
                    class="avatar-uploader banner-img-box"
                    action="1"
                    :before-upload="beforeImgUpload"
                    :show-file-list="false"
                    :http-request="uploadBannerFiles"
                    :on-error="uploadError"
                >
                    <img v-if="goodsForm.bannerImageUrl" :src="showImgPrefix + goodsForm.bannerImageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <span v-if="goodsForm.checkedBanner == 1">（*选填，请上传尺寸为351*140，格式为jpg/jpeg/png的图片）</span>
            </template> -->

            <!-- 酒水上传广告图与推荐位图 -->
            <template v-if="activeNum != 9 && activeNum != 10 && activeNum != 11">
                <div class="drinks-update-box">
                    <!-- 广告图 -->
                    <!-- <div class="banner-box">
                        <el-checkbox
                            @change="removeBanner"
                            v-model="goodsForm.checkedBanner"
                            label="放至店铺宣传图"
                            border
                            style="margin-right: 20px"
                        ></el-checkbox>
                        <div class="drinks-div">
                            <el-upload
                                v-if="goodsForm.checkedBanner && goodsForm.checkedBanner !== 2"
                                class="avatar-uploader banner-img-box"
                                action="1"
                                :before-upload="beforeImgUpload"
                                :show-file-list="false"
                                :http-request="uploadBannerFiles"
                                :on-error="uploadError"
                            >
                                <img v-if="goodsForm.bannerImageUrl" :src="showImgPrefix + goodsForm.bannerImageUrl" class="avatar" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>

                            <span v-if="goodsForm.checkedBanner == 1">（*选填，请上传尺寸为351*140，格式为jpg/jpeg/png的图片）</span>
                        </div>
                    </div> -->

                    <!-- 商家推荐位 -->
                    <div class="reco-box">
                        <div class="reco-top-box">
                            <el-checkbox
                                @change="removeReco"
                                v-model="goodsForm.checkedReco"
                                label="放至商品推荐位"
                                border
                                style="margin-right: 20px"
                            ></el-checkbox>
                            <div v-if="goodsForm.checkedReco && goodsForm.checkedReco !== 2">
                                <el-input-number v-model="goodsForm.recoWeight" :min="0" label="推荐位排序"></el-input-number>
                                <span style="margin-left: 10px">推荐位排序</span>
                            </div>
                        </div>

                        <div class="drinks-div">
                            <el-upload
                                v-if="goodsForm.checkedReco && goodsForm.checkedReco !== 2"
                                class="avatar-uploader reco-img-box"
                                action="1"
                                :before-upload="beforeImgUpload"
                                :show-file-list="false"
                                :http-request="uploadRecoFiles"
                                :on-error="uploadError"
                            >
                                <img v-if="goodsForm.recoImageUrl" :src="showImgPrefix + goodsForm.recoImageUrl" class="avatar" />
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                            <span v-if="goodsForm.checkedReco == 1">（*选填，请上传尺寸为120*160，格式为jpg/jpeg/png的图片）</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
        <div class="right-box">
            <template v-if="activeNum != 11">
                <!-- 商品图 -->
                <div class="thum-img-box">
                    <p>
                        <span>*商品图：</span>
                        <el-upload
                            class="avatar-uploader"
                            action="1"
                            :before-upload="beforeImgUpload"
                            :show-file-list="false"
                            :http-request="uploadThumFiles"
                            :on-error="uploadError"
                        >
                            <img v-if="goodsForm.thumImageUrl" :src="showImgPrefix + goodsForm.thumImageUrl" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </p>
                    <span>（*请上传尺寸为80*80，格式为jpg/jpeg/png的图片）</span>
                </div>

                <!-- 详情图 -->
                <div class="details-img-box">
                    <p>
                        <span>*商品详情图：</span>
                        <el-upload
                            class="avatar-uploader detail-img-box"
                            action="1"
                            :before-upload="beforeImgUpload"
                            :show-file-list="false"
                            :http-request="uploadDetailFiles"
                            :on-error="uploadError"
                        >
                            <img v-if="goodsForm.detailImageUrl" :src="showImgPrefix + goodsForm.detailImageUrl" class="avatar" />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </p>
                    <span>（*请上传尺寸为200*200，格式为jpg/jpeg/png的图片）</span>
                </div>
            </template>

            <!-- 会员卡卡片列表 -->
            <template>
                <div class="vip-card-wrap" v-if="activeNum == 11">
                    <span>*会员卡商品图：</span>
                    <div class="image-box" v-if="thumImageBox">
                        <img
                            ref="thumImg"
                            @click="chooseThumImg(item.picture, $event)"
                            :src="showImgPrefix + item.picture"
                            v-for="(item, index) in thumImageBox"
                            :key="index"
                        />
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    props: ['goodsForm', 'activeNum'], //父组件传过来的值

    data() {
        return {
            showImgPrefix: this.$imgHead, //回显图片前缀
            thumImageBox: [], //会员卡卡片列表
            options: [], //输入框请求到的商品信息数组
            goodName: '', //选中的商品对应的信息
            antiStatus: true //防抖状态值
        };
    },

    watch: {
        activeNum(val) {
            //如果切换到会员卡页面就加载会员卡卡片列表
            val == 11 && this.getVipCard();
        }
    },

    methods: {
        //验证金额
        checkPrice(price, opt, index) {
            if (price !== '') {
                if (price < 0.1 || this.$regular.money(price) === false) {
                    switch (opt) {
                        case 1:
                            this.goodsForm.dynamicValidateForm.domains[index].originalPrice = 0.1;
                            break;
                        case 2:
                            this.goodsForm.dynamicValidateForm.domains[index].statisticalPrice = 0.1;
                            break;
                        case 3:
                            this.goodsForm.skuObj.originalPrice = 0.1;
                            break;
                        case 4:
                            this.goodsForm.skuObj.statisticalPrice = 0.1;
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

        //关闭广告位操作
        // removeBanner() {
        //     if (!this.goodsForm.checkedBanner) {
        //         this.goodsForm.bannerImageUrl = '';
        //     }
        // },

        //关闭商家推荐位操作
        removeReco() {
            if (!this.goodsForm.checkedReco) {
                this.goodsForm.recoImageUrl = '';
                this.goodsForm.recoWeight = 0;
            }
        },

        //处理当前选中的商品信息
        selectGoodInfo() {
            let goodInfoArr = this.goodName.split('+'); //将字符串拆分成数组

            //将商品相关信息存入对象
            let obj = {
                goodsId: goodInfoArr[0],
                listPicture: goodInfoArr[1],
                goodsName: goodInfoArr[2],
                originalPrice: goodInfoArr[3],
                presentPrice: goodInfoArr[4],
                number: 1,
                sellOut: goodInfoArr[5]
            };

            this.goodsForm.goodsIdList.push(goodInfoArr[0]); //存入当前选择的商品id

            this.goodsForm.tableData.push(obj); //存入当前选择的商品所有信息，用于表格回显

            this.goodsPriceSum(); //套餐价格求和

            this.goodName = ''; //清空选择的选项
            this.selectGoodsList(); //重新请求商品列表
        },

        //套餐价格求和
        goodsPriceSum() {
            //计算套餐原价（所有单品原价之和）
            this.goodsForm.originPrice = this.goodsForm.tableData
                .map((item) => item.originalPrice * item.number)
                .reduce((prev, item) => prev + item, 0)
                .toFixed(2);

            //计算套餐现价（所有单品现价之和）
            this.goodsForm.comboNowPrice = this.goodsForm.tableData
                .map((item) => item.presentPrice * item.number)
                .reduce((prev, item) => prev + item, 0)
                .toFixed(2);
        },

        //请求商品列表
        selectGoodsList() {
            if (this.antiStatus == true) {
                this.antiStatus = false;
                let data = {
                    goodsIdList: this.goodsForm.goodsIdList,
                    name: this.goodName
                };

                this.$post('/merchant/store/goods/setMealSelectGoodsList', data).then((res) => {
                    if (res.code === 0) {
                        this.options = res.data;
                        this.antiStatus = true;
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        },

        //单品售罄
        handleSellOut(index, item) {
            let status = '';
            item.sellOut === 0 ? (status = '售罄') : (status = '取消售罄');
            this.$confirm(`确认${status}操作吗？`, '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.goodsForm.dynamicValidateForm.domains[index].sellOut === 0
                        ? (this.goodsForm.dynamicValidateForm.domains[index].sellOut = 1)
                        : (this.goodsForm.dynamicValidateForm.domains[index].sellOut = 0);
                })
                .catch(() => {});
        },

        //移除商品列表里的商品
        handleDelete(row) {
            //在表格中移除当前商品
            this.goodsForm.tableData.forEach((item, i) => {
                if (row.goodsId == item.goodsId) {
                    this.goodsForm.tableData.splice(i, 1);

                    //在所已选择的商品id中移除当前商品的id
                    this.goodsForm.goodsIdList.forEach((item, i) => {
                        if (row.goodsId == item) {
                            this.goodsForm.goodsIdList.splice(i, 1);
                            this.goodsPriceSum();
                        }
                    });
                }
            });
        },

        //选择会员卡片
        chooseThumImg(item, e) {
            this.$refs.thumImg.forEach((item) => {
                item.classList.remove('border');
            });
            e.target.classList.add('border');
            this.goodsForm.thumImageUrl = item;
        },

        //获取会员卡片
        getVipCard() {
            this.$get('/merchant/store/goods/getVipPhoto').then((res) => {
                if (res.code === 0) {
                    this.thumImageBox = res.data;
                    this.showVipCard();
                }
            });
        },

        //回显会员卡片
        showVipCard() {
            this.$nextTick(() => {
                this.$refs.thumImg.forEach((item) => {
                    let imgSrc = item.getAttribute('src');
                    if (imgSrc == this.showImgPrefix + this.goodsForm.thumImageUrl) {
                        item.classList.add('border');
                    }
                });
            });
        },

        //商品规格添加按钮
        addDomain() {
            if (!this.goodsForm.skuObj.specName) {
                this.$message.error('请输入商品规格名称');
            } else if (!this.$regular.money(this.goodsForm.skuObj.originalPrice)) {
                this.$message.error('请输入正确的规格原价');
            } else if (!this.$regular.money(this.goodsForm.skuObj.statisticalPrice)) {
                this.$message.error('请输入正确的规格现价');
            } else if (+this.goodsForm.skuObj.statisticalPrice > +this.goodsForm.skuObj.originalPrice) {
                this.$message.error('规格现价不能大于原价');
            } else {
                this.goodsForm.dynamicValidateForm.domains.push(this.goodsForm.skuObj);
                this.goodsForm.skuObj = {
                    specName: '', //规格
                    originalPrice: '', //规格原价
                    presentPrice: '', //规格现价
                    statisticalPrice: '', //新增的现价
                    skuCode: '' //sku码
                };
            }
        },

        //商品规格删除按钮
        removeDomain(item) {
            const index = this.goodsForm.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.goodsForm.dynamicValidateForm.domains.splice(index, 1);
            }

            //删除一个规格就添加到这个删除规格数组里
            if (item.skuCode !== '') {
                this.goodsForm.skuCodeArr.push(item.skuCode);
            }
        },

        //上传广告图
        // uploadBannerFiles(file) {
        //     let formData = new FormData();
        //     formData.append('file', file.file);
        //     this.$file_post(this.$fileUploadUrl, formData).then((res) => {
        //         this.goodsForm.bannerImageUrl = res.data;
        //     });
        // },

        //上传推荐位图
        uploadRecoFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                this.goodsForm.recoImageUrl = res.data;
            });
        },

        //上传商品图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                this.goodsForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                this.goodsForm.detailImageUrl = res.data;
            });
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('插入失败');
        }
    }
};
</script>

<style lang="less" scoped>
/deep/.el-tabs__header {
    margin-bottom: 30px;
}

.goods-info-box {
    display: flex;

    /deep/.avatar-uploader {
        .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .el-upload:hover {
            border-color: #409eff;
        }
    }

    /deep/.avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 140px;
        height: 140px;
        line-height: 140px;
        text-align: center;
    }

    /deep/.el-upload--text {
        width: 140px;
        height: 140px;
    }

    /deep/.avatar {
        width: 140px;
        height: 140px;
        display: block;
    }

    .left-box {
        width: 68%;

        .banner-img-box {
            /deep/.el-upload--text {
                // width: 350px;
            }

            /deep/.avatar-uploader-icon {
                // width: 350px;
                // line-height: 350px;
            }

            /deep/.avatar {
                // width: 350px;
            }
        }

        .drinks-update-box {
            display: flex;

            .banner-box {
                width: 50%;
            }

            .drinks-div {
                margin-top: 20px;

                .reco-img-box {
                    /deep/.el-upload--text {
                        // width: 120px;
                        // height: 160px;
                    }

                    /deep/.avatar-uploader-icon {
                        // width: 120px;
                        // height: 160px;
                        // line-height: 160px;
                    }

                    /deep/.avatar {
                        // width: 120px;
                        // height: 160px;
                    }
                }
            }
        }

        .reco-box {
            .reco-top-box {
                display: flex;
            }
        }
    }

    .right-box {
        width: 32%;

        .detail-img-box {
            /deep/.avatar-uploader-icon {
                // width: 300px;
                // line-height: 300px;
            }

            /deep/ .el-upload--text {
                // width: 300px;
            }

            /deep/.avatar {
                // width: 300px;
            }
        }

        .thum-img-box,
        .details-img-box {
            margin-bottom: 30px;

            > p {
                margin-bottom: 0;

                > span {
                    min-width: 90px;
                }
            }
        }

        .vip-card-wrap {
            > span {
                min-width: 110px;
            }

            display: flex;
            margin-bottom: 30px;

            .image-box {
                font-size: 0;
                img {
                    width: 140px;
                    height: 70px;
                    margin-right: 10px;
                    margin-bottom: 10px;
                    border-radius: 4px;
                    box-sizing: border-box;
                    cursor: pointer;
                }
            }

            .border {
                box-sizing: border-box;
                border: 2px solid #f56c6c;
            }
        }
    }

    p {
        margin-bottom: 30px;
        display: flex;
        align-items: center;

        > i {
            display: inline-block;
            font-style: normal;
            text-align: center;
            line-height: 30px;
            width: 60px;
            height: 30px;
            border-radius: 5px;
            margin-right: 10px;
            background-color: #999;
            color: #fff;
        }
    }

    div.drinks-spec {
        display: flex;
        margin-bottom: 30px;

        // align-items: flex-start;

        .title > span {
            margin-right: 10px;
            margin-top: 6px;
        }

        .sku-list > div {
            margin-bottom: 10px;
        }

        // .el-form-item {
        //     margin-bottom: 10px;
        // }
    }

    .good-name-box {
        margin-bottom: 30px;
        display: flex;
        align-items: center;

        > div:first-child {
            margin-right: 20px;
        }
    }

    /deep/.el-textarea__inner {
        resize: none;
        height: 84px;
    }
}
</style>