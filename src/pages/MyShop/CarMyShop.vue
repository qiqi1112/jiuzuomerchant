<template>
    <div>
        <div class="container" v-loading="wrapLoading">
            <!-- 左边区域 -->
            <div class="left-wrap">
                <h4>
                    <span>车行信息</span>
                    <el-button type="primary" v-if="isReadonly" @click="editShopInfo">编辑</el-button>
                    <el-button type="success" @click="submitShopInfo" v-if="!isReadonly">保存</el-button>
                    <el-button type="info" @click="storageInfo" v-if="!isReadonly && !isUpdate">暂存数据</el-button>
                    <el-button @click="cancelSubmit" v-if="!isReadonly && isUpdate">取消</el-button>
                </h4>

                <!-- 店铺基本信息 -->
                <div class="shop-info clearfix">
                    <div class="left-info" v-loading="imgLoading.loading2">
                        <p>车行logo</p>
                        <img v-if="isReadonly && logoImageUrl" :src="showImgPrefix + logoImageUrl" class="avatar" />
                        <!-- <el-upload
                            v-else
                            class="avatar-uploader"
                            action="1"
                            :before-upload="beforeUpload"
                            :http-request="uploadAvatarFile"
                            :show-file-list="false"
                            :on-error="uploadError"
                        >
                            <img v-if="logoImageUrl" :src="showImgPrefix + logoImageUrl" class="avatar" />
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload> -->

                        <el-upload
                            v-else
                            class="avatar-uploader"
                            :auto-upload="false"
                            :on-change="changeUpload"
                            action="1"
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
                            <span>车行名称：</span>
                            <el-input v-model="shopName" placeholder="请输入店名" :readonly="isReadonly" clearable></el-input>
                        </p>
                        <p class="shop-loca">
                            <span>车行定位：</span>
                            <span class="shop-loca-span">租车行</span>
                        </p>
                    </div>
                </div>

                <!-- 联系电话 -->
                <div class="service-phone">
                    <p>联系电话</p>
                    <el-input
                        :onkeyup="(servicePhone = servicePhone.replace(/^(-1+)|[^\d]+/g, ''))"
                        v-model="servicePhone"
                        placeholder="联系电话"
                        style="width: 30%; margin-right: 10px"
                        :readonly="isReadonly"
                        clearable
                    ></el-input>
                </div>

                <!-- 店铺营业时间，营业执照 -->
                <div class="shop-div">
                    <div class="shop-div1">
                        <!-- 营业执照 -->
                        <div class="shop-type" v-loading="imgLoading.loading">
                            <p>我的营业执照</p>
                            <img v-if="isReadonly && bussinessPic" :src="showImgPrefix + bussinessPic" class="bussiness-pic" />
                            <el-upload
                                v-else
                                class="avatar-uploader"
                                action="1"
                                :before-upload="beforeUpload"
                                :http-request="uploadBusssinessFile"
                                :show-file-list="false"
                                :on-error="uploadError"
                            >
                                <img v-if="bussinessPic" :src="showImgPrefix + bussinessPic" class="bussiness-pic" />
                                <i class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                        </div>
                    </div>
                    <div class="shop-div2">
                        <!-- 店铺营业时间 -->
                        <div class="bussiness-hours">
                            <p>车行营业时间</p>
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
                    </div>
                </div>
            </div>

            <!-- 右边区域 -->
            <div class="right-wrap">
                <!-- 车行简介 -->
                <div class="shop-desc">
                    <div>
                        <span>车行简介</span>
                        <el-input
                            type="textarea"
                            :rows="3"
                            placeholder="请输入商品店面简介"
                            v-model="carBrief"
                            :readonly="isReadonly"
                            maxlength="100"
                            show-word-limit
                        ></el-input>
                    </div>
                </div>

                <!-- 店铺地址 -->
                <div class="shop-address">
                    <p>车行地址</p>
                    <div v-if="isReadonly" class="shop-add clearfix">
                        <div v-if="searchAddress">
                            <span>{{ province }}</span>
                            <span>{{ city }}</span>
                            <span>{{ searchAddress }}</span>
                            <span>{{ trustAddress }}</span>
                        </div>
                    </div>
                    <div v-else>
                        <mapCom @child-data="childData" @child-city="childCity" :mapList="mapList" :provAndCity="provAndCity"></mapCom>
                    </div>
                </div>
            </div>
        </div>

        <!-- vueCropper 剪裁图片实现-->
        <el-dialog
            title="图片剪裁"
            :visible.sync="dialogVisible"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            append-to-body
        >
            <div class="cropper-content">
                <div class="cropper" style="text-align: center">
                    <vueCropper
                        ref="cropper"
                        :img="option.img"
                        :outputType="option.outputType"
                        :info="true"
                        :autoCropWidth="option.autoCropWidth"
                        :autoCropHeight="option.autoCropHeight"
                        :canScale="option.canScale"
                        :autoCrop="option.autoCrop"
                        :fixedBox="option.fixedBox"
                        :fixedNumber="option.fixedNumber"
                        :canMoveBox="option.canMoveBox"
                        :centerBox="option.centerBox"
                        :infoTrue="option.infoTrue"
                    >
                    </vueCropper>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="finish">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import mapCom from '../../components/common/map';
import { VueCropper } from 'vue-cropper';

export default {
    components: {
        mapCom,
        VueCropper
    },

    data() {
        return {
            // 裁剪组件的基础配置option
            option: {
                img: '', // 裁剪图片的地址
                outputType: 'jpeg', // 裁剪生成图片的格式
                canScale: true, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: -1, // 默认生成截图框宽度
                autoCropHeight: -1, // 默认生成截图框高度
                fixedBox: true, // 固定截图框大小 不允许改变
                fixedNumber: [1, 1], // 截图框的宽高比例
                canMoveBox: false, // 截图框能否拖动
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            },
            dialogVisible: false,

            wrapLoading: false, //全集加载开关

            //图片加载开关
            imgLoading: {
                loading: false,
                loading2: false
            },

            //传给地图子组件的值
            mapList: {
                width: '100%',
                height: '500px',
                status: true,
                city: '',
                searchAddress: '', //搜索地址
                trustAddress: '', //详细地址
                merchantType: 2 //商家类型（租车行）
            },

            //传给地图子组件的省市值
            provAndCity: {
                province: '', //省
                city: '' //市
            },

            showImgPrefix: this.$imgHead, //回显图片/视频的前缀

            isReadonly: true, //编辑信息开关
            isUpdate: true, //判断当前操作为修改还是新增店铺

            shopId: '', //门店ID
            logoImageUrl: '', //店铺logo
            shopName: '', //店铺名称
            servicePhone: '', //客服电话输入框
            startBussTime: '', //开始营业时间
            endBussTime: '', //结束营业时间
            bussinessPic: '', //营业执照图片

            province: '', //省
            city: '', //市
            showMapCity: '', //在地图里回显的市
            vehicleAreaId: -1, //租车区域ID
            searchAddress: '', //地址搜索框里的值
            trustAddress: '', //输入的详细地址
            longitude: '', //经度
            latitude: '', //纬度

            carBrief: '', //商品店面简介

            allRegRight: false //全部验证通过的开关
        };
    },
    methods: {
        // 上传按钮 限制图片大小
        changeUpload(file) {
            this.option.autoCropWidth = 154;
            this.option.autoCropHeight = 154;

            console.log(file);

            const isJPG = file.raw.type === 'image/jpeg';
            const isPNG = file.raw.type === 'image/png';

            //限制上传文件格式
            if (!isJPG && !isPNG) {
                this.$message.error('上传图片只能是 JPG / PNG 格式');
                return false;
            }

            // 上传成功后将图片地址赋值给裁剪框显示图片
            this.$nextTick(() => {
                this.option.img = URL.createObjectURL(file.raw);
                this.dialogVisible = true;
            });
        },

        // 点击裁剪，这一步是可以拿到处理后的地址
        finish() {
            this.$refs.cropper.getCropBlob((data) => {
                console.log('ccccc', data);

                this.dialogVisible = false;

                // 把图片上传到服务器
                let formData = new FormData();
                formData.append('file', data);
                this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                    if (res.code === 0) {
                        this.logoImageUrl = res.data;
                        this.$message.success('上传成功');
                    }
                });
            });
        },

        //验证所有输入的值
        checkFormInfo() {
            if (!this.shopName) {
                this.$message.error('请输入车行名称');
                return;
            } else if (!this.logoImageUrl) {
                this.$message.error('请上传车行logo');
                return;
            } else if (!this.servicePhone) {
                this.$message.error('请输入联系电话');
                return;
            } else if (this.$regular.phone(this.servicePhone) === false) {
                this.$message.error('电话号码格式不正确，请重新输入');
                return;
            } else if (!this.bussinessPic) {
                this.$message.error('请上传营业执照');
                return;
            } else if (!this.startBussTime) {
                this.$message.error('请选择开始营业时间');
                return;
            } else if (!this.endBussTime) {
                this.$message.error('请选择结束营业时间');
                return;
            } else if (!this.carBrief) {
                this.$message.error('请输入车行简介');
                return;
            } else if (!this.province || !this.city) {
                this.$message.error('请选择省市');
            } else if (!this.searchAddress) {
                this.$message.error('请输入地址');
                return;
            } else if (!this.trustAddress) {
                this.$message.error('请输入详细地址');
                return;
            } else {
                this.allRegRight = true;
            }
        },

        //接收地图子组件传过来的参数
        childData(data) {
            if (data) {
                this.longitude = data.location.lng;
                this.latitude = data.location.lat;
                this.searchAddress = data.title;
                this.trustAddress = data.trustAddress;
            }
        },

        //获取地图子组件传过来的省市
        childCity(data) {
            if (data) {
                this.province = data[0];
                //从返回的市和区域id中截取出两个字段
                var pattern = new RegExp('[0-9]+');
                var num = data[1].match(pattern);
                this.showMapCity = data[1].substr(0, num.index);
                this.vehicleAreaId = data[1].substr(num.index);
                this.city = this.showMapCity;
            }
        },

        //上传图片之前的验证
        beforeUpload(file) {
            // const isJPG = file.raw.type === 'image/jpeg';
            // const isPNG = file.raw.type === 'image/png';

            // //限制上传文件格式
            // if (!isJPG && !isPNG) {
            //     this.$message.error('上传图片只能是 JPG / PNG 格式');
            //     return false;
            // }

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
            console.log(file.file);
            this.imgLoading.loading2 = true;
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                if (res.code === 0) {
                    this.logoImageUrl = res.data;
                    this.imgLoading.loading2 = false;
                    this.$message.success('上传成功');
                }
            });
        },

        //上传营业执照
        uploadBusssinessFile(file) {
            this.imgLoading.loading = true;
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                if (res.code === 0) {
                    this.bussinessPic = res.data;
                    this.imgLoading.loading = false;
                    this.$message.success('上传成功');
                }
            });
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('上传失败');
        },

        //给地图子组件传值（编辑店铺时）
        sendInfoToMap() {
            this.mapList.searchAddress = this.searchAddress;
            this.mapList.trustAddress = this.trustAddress;
            this.mapList.city = this.city;
            this.provAndCity.province = this.province;
            this.provAndCity.city = this.showMapCity;
        },

        //编辑商铺信息
        editShopInfo() {
            this.isReadonly = false;
            this.sendInfoToMap(); //给地图子组件传值（回显地址信息）
        },

        //请求成功后，处理的操作
        requestSuccessInit(txt) {
            this.getStoreInfo();
            this.$message.success(txt);
            this.isReadonly = true;
            this.allRegRight = false;
            this.wrapLoading = false;
        },

        //新增/修改店铺
        submitShopRequest() {
            this.wrapLoading = true;

            //要传的值
            let data = {
                vehicleAreaId: this.vehicleAreaId,
                businessLicense: this.bussinessPic,
                customerServicePhone: this.servicePhone,
                endTime: this.endBussTime,
                logo: this.logoImageUrl,
                lonlat: `${this.longitude},${this.latitude}`,
                name: this.shopName,
                searchAddress: this.searchAddress,
                startTime: this.startBussTime,
                synopsis: this.carBrief,
                trustAddress: this.trustAddress,
                province: this.province,
                city: this.city
            };

            if (this.isUpdate) {
                data.id = this.shopId;
                console.log('修改时传的值', data);

                this.$post('/merchant/store/vehicleStore/update', data).then((res) => {
                    if (res.code === 0) {
                        this.requestSuccessInit('修改成功');
                    } else if (res.code === 741) {
                        this.wrapLoading = false;
                        this.isReadonly = true;
                        this.getStoreInfo();
                        this.$message.error(res.msg);
                    } else {
                        this.wrapLoading = false;
                        this.$message.error(res.msg);
                    }
                });
            } else {
                console.log('新增时传的值', data);

                this.$post('/merchant/store/vehicleStore/save', data).then((res) => {
                    if (res.code === 0) {
                        this.requestSuccessInit('新增成功');
                        localStorage.removeItem('carStorageInfo');
                        this.isUpdate = true;
                    } else if (res.code === 741) {
                        this.wrapLoading = false;
                        this.$message.error(res.msg);
                    } else {
                        this.wrapLoading = false;
                        this.$message.error(res.msg);
                    }
                });
            }
        },

        //保存按钮
        submitShopInfo() {
            this.checkFormInfo(); //验证所有输入的值
            if (this.allRegRight) {
                this.submitShopRequest(); //新增/修改店铺
            }
        },

        //取消保存按钮
        cancelSubmit() {
            this.isReadonly = true;
            this.getStoreInfo(); //重新获取商店数据
        },

        //获取经纬度
        getlonlat(lonlat) {
            lonlat = lonlat.split(',');
            this.longitude = lonlat[0];
            this.latitude = lonlat[1];
        },

        //回显店铺数据
        getStoreInfo() {
            this.wrapLoading = true;
            this.$get('/merchant/store/vehicleStore/storeInfoByAccount').then((res) => {
                if (res.code === 0) {
                    let result = res.data;
                    this.shopId = result.id;
                    this.bussinessPic = result.businessLicense;
                    this.servicePhone = result.customerServicePhone;
                    this.startBussTime = result.startTime;
                    this.endBussTime = result.endTime;
                    this.logoImageUrl = result.logo;
                    let lonlat = result.lonlat;
                    this.shopName = result.name;
                    this.searchAddress = result.searchAddress;
                    this.carBrief = result.synopsis;
                    this.trustAddress = result.trustAddress;
                    this.province = result.province;
                    this.city = result.city;
                    this.showMapCity = result.city + result.vehicleAreaId;
                    this.vehicleAreaId = result.vehicleAreaId;

                    //获取经纬度
                    this.getlonlat(lonlat);

                    this.wrapLoading = false;

                    console.log('当前店铺数据', res.data);
                } else if (res.code === 600) {
                    this.$alert(res.msg, '创建车行', {
                        confirmButtonText: '添加信息',
                        callback: (action) => {
                            this.isReadonly = false;
                            this.isUpdate = false;
                            //如果有缓存就用缓存里的数据，否则就重新创建座位
                            if (localStorage.getItem('carStorageInfo')) {
                                this.getStorageInfo(); //获取缓存数据
                            }
                            this.wrapLoading = false;
                        }
                    });
                }
            });
        },

        //暂存数据
        storageInfo() {
            let obj = {
                logoImageUrl: this.logoImageUrl,
                shopName: this.shopName,
                servicePhone: this.servicePhone,
                startBussTime: this.startBussTime,
                endBussTime: this.endBussTime,
                bussinessPic: this.bussinessPic,
                province: this.province,
                showMapCity: this.showMapCity + this.vehicleAreaId,
                searchAddress: this.searchAddress,
                trustAddress: this.trustAddress,
                longitude: this.longitude,
                latitude: this.latitude,
                carBrief: this.carBrief
            };
            localStorage.setItem('carStorageInfo', JSON.stringify(obj));
            this.$message.success('暂存数据成功');
        },

        //获取缓存
        getStorageInfo() {
            let storageInfo = JSON.parse(localStorage.getItem('carStorageInfo'));
            if (storageInfo) {
                this.logoImageUrl = storageInfo.logoImageUrl;
                this.shopName = storageInfo.shopName;
                this.servicePhone = storageInfo.servicePhone;
                this.startBussTime = storageInfo.startBussTime;
                this.endBussTime = storageInfo.endBussTime;
                this.bussinessPic = storageInfo.bussinessPic;
                this.province = storageInfo.province;
                this.showMapCity = storageInfo.showMapCity;
                this.searchAddress = storageInfo.searchAddress;
                this.trustAddress = storageInfo.trustAddress;
                this.longitude = storageInfo.longitude;
                this.latitude = storageInfo.latitude;
                this.carBrief = storageInfo.carBrief;

                //给地图子组件传值（回显地址信息）
                this.sendInfoToMap();
            }
        }
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
        width: 40%;
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
        width: 50%;
        height: 100%;
    }
}

@media screen and (max-width: 1300px) {
    .left-wrap {
        .shop-info {
            .left-info {
                width: 22%;
            }

            .right-info {
                width: 78%;
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
        }

        .right-info {
            display: flex;
            flex-direction: column;
            justify-content: center;

            .shop-name {
                width: 70%;
                margin-bottom: 40px;

                > span {
                    min-width: 80px;
                }

                display: flex;
                align-items: center;
            }

            .shop-loca {
                .shop-loca-span {
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
                    background-color: #ecf5ff;
                }
            }
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
            width: 40%;
            margin-right: 20px;

            .shop-type {
                /deep/ .avatar-uploader .el-upload {
                    border: 1px dashed #d9d9d9;
                    border-radius: 6px;
                    position: relative;
                    overflow: hidden;
                    width: 180px;
                    height: 240px;
                    line-height: 240px;
                    cursor: pointer;
                }

                /deep/ .avatar-uploader .el-upload:hover {
                    border-color: #409eff;
                }

                /deep/.avatar-uploader-icon {
                    font-size: 28px;
                    color: #8c939d;
                    width: 180px;
                    height: 240px;
                    line-height: 240px;
                    text-align: center;
                }

                /deep/.bussiness-pic {
                    width: 180px;
                    height: 240px;
                    border-radius: 6px;
                    display: block;
                }

                > p {
                    margin-bottom: 10px;
                }
            }
        }

        .shop-div2 {
            width: 50%;

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
        }
    }
}

.right-wrap {
    .shop-desc {
        margin-bottom: 50px;

        > div {
            display: flex;
            align-items: center;
            margin-bottom: 30px;

            > span {
                min-width: 90px;
            }
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
}

/deep/ .el-textarea__inner {
    resize: none !important;
    line-height: 1.9;
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

.cropper {
    width: auto;
    height: 320px;
}
</style>
