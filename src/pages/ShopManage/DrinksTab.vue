<template>
    <div class="goods-info-box">
        <div class="left-box drinks">
            <el-form ref="drinksForm" :model="drinksForm" label-width="80px">
                <p>
                    <span>酒水名称：</span>
                    <el-input v-model="drinksForm.name" style="width:170px;margin-right:20px"></el-input>
                    <el-select
                        v-model="drinksForm.classify"
                        placeholder="酒水分类"
                        style="width:110px;margin-right:20px"
                    >
                        <el-option
                            v-for="item in drinksForm.classifyOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <el-select
                        v-model="drinksForm.goodWeight"
                        placeholder="商品排序"
                        style="width:110px"
                    >
                        <el-option
                            v-for="item in drinksForm.goodOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </p>
                <p>
                    <span>酒水包含：</span>
                    <el-input type="textarea" v-model="drinksForm.desc" style="width:300px;"></el-input>
                </p>
                <p>
                    <span>酒水原单价：</span>
                    <el-input
                        v-model="drinksForm.originPrice"
                        style="width:120px;margin-right:20px"
                    ></el-input>

                    <span>酒水现单价：</span>
                    <el-input v-model="drinksForm.nowPrice" style="width:120px"></el-input>
                </p>
                <p class="drinks-spec">
                    <span>酒水规格：</span>
                    <el-form
                        :model="dynamicValidateForm"
                        ref="dynamicValidateForm"
                        label-width="100px"
                        class="demo-dynamic"
                    >
                        <el-form-item
                            v-for="(domain, index) in dynamicValidateForm.domains"
                            :key="index"
                        >
                            <el-input
                                v-model="domain.spec"
                                placeholder="规格（如：一打、一箱）"
                                style="width:170px;margin-right:10px"
                            ></el-input>
                            <el-input
                                v-model="domain.price"
                                placeholder="规格单价（如：999.99）"
                                style="width:173px;margin-right:10px"
                            ></el-input>
                            <el-button @click="addDomain">
                                <i class="el-icon-plus"></i>
                            </el-button>
                            <el-button
                                v-show="dynamicValidateForm.domains.length > 1"
                                @click.prevent="removeDomain(domain)"
                            >
                                <i class="el-icon-close"></i>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </p>
            </el-form>
            <div class="drinks-update-box">
                <!-- 商家推荐位 -->
                <div class="banner-box">
                    <el-checkbox
                        v-model="drinksForm.checkedBanner"
                        label="放至商家推荐位"
                        border
                        style="margin-right:20px"
                    ></el-checkbox>
                    <el-select
                        v-model="drinksForm.recoWeight"
                        placeholder="推荐位位权重"
                        style="width:140px"
                    >
                        <el-option
                            v-for="item in drinksForm.recoOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                    <div class="drinks-div">
                        <el-upload
                            class="avatar-uploader"
                            action="1"
                            :show-file-list="false"
                            :http-request="uploadRecoFiles"
                            :on-error="uploadError"
                        >
                            <img
                                v-if="drinksForm.recoImageUrl"
                                :src="drinksForm.recoImageUrl"
                                class="avatar"
                            />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span>（*如需商家推荐，请添加推荐位图片）</span>
                    </div>
                </div>

                <!-- 推荐banner图 -->
                <div class="reco-box">
                    <el-checkbox v-model="drinksForm.checkedReco" label="放至商店Banner位" border></el-checkbox>
                    <div class="drinks-div">
                        <el-upload class="avatar-uploader" action="1" :show-file-list="false">
                            <img
                                v-if="drinksForm.bannerImageUrl"
                                :src="drinksForm.bannerImageUrl"
                                class="avatar"
                            />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span>（*如需商店轮播推荐，请添加Banner图片）</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="right-box">
            <!-- 缩略图 -->
            <p>
                <span>酒水缩略图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadThumFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="drinksForm.thumImageUrl"
                        :src="drinksForm.thumImageUrl"
                        class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </p>
            <!-- 详情图 -->
            <p>
                <span>酒水详情图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadDetailFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="drinksForm.detailImageUrl"
                        :src="drinksForm.detailImageUrl"
                        class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            //酒水标签页表单-----------------------------------------
            drinksForm: {
                name: '',
                classify: '',
                classifyOptions: [
                    {
                        label: '啤酒',
                        value: '啤酒'
                    },
                    {
                        label: '香槟',
                        value: '香槟'
                    },
                    {
                        label: '饮料',
                        value: '饮料'
                    },
                    {
                        label: '矿泉水',
                        value: '矿泉水'
                    }
                ],
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                checkedReco: false,

                goodWeight: '',
                goodOptions: [
                    {
                        label: '0',
                        value: '0'
                    },
                    {
                        label: '1',
                        value: '1'
                    },
                    {
                        label: '2',
                        value: '2'
                    },
                    {
                        label: '3',
                        value: '3'
                    }
                ],

                recoWeight: '',
                recoOptions: [
                    {
                        label: '0',
                        value: '0'
                    },
                    {
                        label: '1',
                        value: '1'
                    },
                    {
                        label: '2',
                        value: '2'
                    },
                    {
                        label: '3',
                        value: '3'
                    }
                ],

                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: '', //上传banner图集时的url字符串
                recoImageUrl: '', //推荐位图
                thumImageUrl: '', //缩略图
                detailImageUrl: '' //详情图
            },

            //酒水新增规格
            dynamicValidateForm: {
                domains: [
                    {
                        spec: '', //规格
                        price: '' //规格价格
                    }
                ]
            }
        };
    },

    methods: {
        //酒水规格添加按钮
        addDomain() {
            this.dynamicValidateForm.domains.push({
                spec: '',
                price: ''
            });
        },

        //酒水规格删除按钮
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1);
            }
        },

        //发送当前子组件的表单信息给父组件
        sendChildForm() {
            this.$emit('drinksFormChild', this.drinksForm);
        },

        //上传banner图集
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$post(this.filesUploadUrl, formData).then((res) => {
                this.drinksForm.bannerUploadUrl += res.data[0] + ',';
                console.log('图集地址', this.drinksForm.bannerUploadUrl);
            });
        },

        //移除套餐banner图时
        comboBannerRemove(file, fileList) {
            //第一个参数为当前删除的图集信息，第二个参数为剩余的图集信息数组
            console.log(file, fileList);

            // let urlArr = this.bannerUploadUrl.split(',');
            // urlArr.forEach((item, i) => {
            //     if (this.showImgPrefix + item == file.url) {
            //         urlArr.splice(i, 1);
            //         this.bannerShowBox.splice(i, 1);
            //     }
            // });

            // this.bannerUploadUrl = urlArr.join(',');

            // console.log(this.bannerUploadUrl);
        },

        //上传推荐位图
        uploadRecoFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.drinksForm.recoImageUrl = res.data;
            });
        },

        //上传缩略图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.drinksForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.drinksForm.detailImageUrl = res.data;
            });
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('插入失败');
        }
    }
};
</script>

<style scoped>
</style>