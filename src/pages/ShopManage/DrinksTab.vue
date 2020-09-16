<template>
    <div class="goods-info-box">
        <div class="left-box drinks">
            <el-form ref="drinksForm" :model="drinksForm" label-width="80px">
                <p>
                    <span>酒水名称：</span>
                    <el-input v-model="drinksForm.name" style="width:170px;margin-right:20px"></el-input>
                    <!-- 酒水分类 -->
                    <el-select
                        v-model="drinksForm.classify"
                        placeholder="酒水分类"
                        style="width:150px;margin-right:20px"
                    >
                        <el-option
                            v-for="item in drinksForm.classifyOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </p>
                <p>
                    <span>商品排序：</span>
                    <el-input-number v-model="drinksForm.goodWeight" :min="0" label="商品排序"></el-input-number>
                    <span>（*数值越小排序越靠前）</span>
                </p>
                <p>
                    <span>酒水包含：</span>
                    <el-input type="textarea" v-model="drinksForm.desc" style="width:300px;"></el-input>
                </p>
                <p class="drinks-spec">
                    <span>酒水规格：</span>
                    <el-form
                        :model="drinksForm.dynamicValidateForm"
                        ref="drinksForm.dynamicValidateForm"
                        label-width="100px"
                        class="demo-dynamic"
                    >
                        <el-form-item
                            v-for="(item, index) in drinksForm.dynamicValidateForm.domains"
                            :key="index"
                        >
                            <el-input
                                v-model="item.specName"
                                placeholder="规格（如：一箱）"
                                style="width:132px;margin-right:10px"
                            ></el-input>
                            <el-input
                                v-model="item.originalPrice"
                                placeholder="原价（如：9.99）"
                                style="width:130px;margin-right:10px"
                            ></el-input>
                            <el-input
                                v-model="item.presentPrice"
                                placeholder="现价（如：9.99）"
                                style="width:130px;margin-right:10px"
                            ></el-input>
                            <el-button @click="addDomain">
                                <i class="el-icon-plus"></i>
                            </el-button>
                            <el-button
                                v-show="drinksForm.dynamicValidateForm.domains.length > 1"
                                @click.prevent="removeDomain(item)"
                            >
                                <i class="el-icon-close"></i>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </p>
                <p>
                    <span>酒水产地：</span>
                    <el-input v-model="drinksForm.area" style="width:170px"></el-input>
                </p>
                <p>
                    <span>酒水年份：</span>
                    <el-input v-model="drinksForm.year" style="width:170px"></el-input>
                </p>
            </el-form>
            <div class="drinks-update-box">
                <!-- 广告图 -->
                <div class="banner-box">
                    <el-checkbox
                        @change="removeBanner"
                        v-model="drinksForm.checkedBanner"
                        label="放至商店广告位"
                        border
                        style="margin-right:20px"
                    ></el-checkbox>
                    <div class="drinks-div">
                        <el-upload
                            v-if="drinksForm.checkedBanner&&drinksForm.checkedBanner !== 2"
                            class="avatar-uploader"
                            action="1"
                            :show-file-list="false"
                            :http-request="uploadBannerFiles"
                            :on-error="uploadError"
                        >
                            <img
                                v-if="drinksForm.bannerImageUrl"
                                :src="showImgPrefix + drinksForm.bannerImageUrl"
                                class="avatar"
                            />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>

                        <span>（*如需商店轮播推荐，请添加广告图片）</span>
                    </div>
                </div>

                <!-- 商家推荐位 -->
                <div class="reco-box">
                    <el-checkbox
                        @change="removeReco"
                        v-model="drinksForm.checkedReco"
                        label="放至商家推荐位"
                        border
                        style="width:88%;margin-bottom: 20px;"
                    ></el-checkbox>
                    <div v-if="drinksForm.checkedReco&&drinksForm.checkedReco !==2">
                        <span>推荐位排序：</span>
                        <el-input-number v-model="drinksForm.recoWeight" :min="0" label="推荐位排序"></el-input-number>
                    </div>
                    <div class="drinks-div">
                        <el-upload
                            v-if="drinksForm.checkedReco&&drinksForm.checkedReco !==2"
                            class="avatar-uploader"
                            action="1"
                            :show-file-list="false"
                            :http-request="uploadRecoFiles"
                            :on-error="uploadError"
                        >
                            <img
                                v-if="drinksForm.recoImageUrl"
                                :src="showImgPrefix + drinksForm.recoImageUrl"
                                class="avatar"
                            />
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <span>（*如需商家推荐，请添加推荐位图片）</span>
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
                        :src="showImgPrefix + drinksForm.thumImageUrl"
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
                        :src="showImgPrefix + drinksForm.detailImageUrl"
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
    props: ['drinksFormParent'], //父组件传过来的值

    data() {
        return {
            fileUploadUrl: '/admin/system/upload/create', //单文件上传
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            //酒水标签页表单-----------------------------------------
            drinksForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                checkedReco: false,

                area: '', //产地
                year: '', //年份

                //酒水分类
                classify: '',
                classifyOptions: [
                    {
                        label: '红酒',
                        value: 1
                    },
                    {
                        label: '白酒',
                        value: 2
                    },
                    {
                        label: '啤酒',
                        value: 3
                    },
                    {
                        label: '香槟',
                        value: 4
                    },
                    {
                        label: '洋酒',
                        value: 5
                    },
                    {
                        label: '调制酒',
                        value: 6
                    },
                    {
                        label: '饮料',
                        value: 7
                    }
                ],

                //商品排序
                goodWeight: 0,

                //商家推荐位排序
                recoWeight: 0,

                bannerImageUrl: '', //广告图
                recoImageUrl: '', //推荐位图
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图

                //酒水新增规格
                dynamicValidateForm: {
                    domains: [
                        {
                            specName: '', //规格
                            originalPrice: '', //规格原价
                            presentPrice: '', //规格现价
                            skuCode: '' //sku码
                        }
                    ]
                },
                skuCodeArr: [] //sku码数组
            }
        };
    },

    watch: {
        drinksForm: {
            handler(val) {
                this.sendChildForm();
            },
            deep: true
        }
    },

    created() {
        if (process.env.NODE_ENV === 'development') {
            this.showImgPrefix = '/file/admin/system/upload/down?keyName=';
        } else {
            this.showImgPrefix = 'http://47.108.204.66:8078/admin/system/upload/down?keyName=';
        }
    },

    mounted() {
        this.assignParentToChild(); //回显商品信息
        console.log('酒水组件');
    },

    methods: {
        //关闭广告位操作
        removeBanner() {
            if (!this.drinksForm.checkedBanner) {
                this.drinksForm.bannerImageUrl = '';
            }
        },

        //关闭商家推荐位操作
        removeReco() {
            if (!this.drinksForm.checkedReco) {
                this.drinksForm.recoImageUrl = '';
                this.drinksForm.recoWeight = 0;
            }
        },

        //发送当前子组件的表单信息给父组件
        sendChildForm() {
            this.$emit('drinksFormChild', this.drinksForm);
        },

        //回显父组件传过来的值（编辑商品）
        assignParentToChild() {
            this.drinksForm.area = this.drinksFormParent.area;
            this.drinksForm.year = this.drinksFormParent.year;
            this.drinksForm.name = this.drinksFormParent.name;
            this.drinksForm.goodWeight = this.drinksFormParent.goodWeight;
            this.drinksForm.desc = this.drinksFormParent.desc;
            this.drinksForm.originPrice = this.drinksFormParent.originPrice;
            this.drinksForm.nowPrice = this.drinksFormParent.nowPrice;
            this.drinksForm.checkedBanner = this.drinksFormParent.checkedBanner == 1 ? true : false;
            this.drinksForm.checkedReco = this.drinksFormParent.checkedReco == 1 ? true : false;
            this.drinksForm.classify = this.drinksFormParent.classify;
            this.drinksForm.recoWeight = this.drinksFormParent.recoWeight;
            this.drinksForm.bannerImageUrl = this.drinksFormParent.bannerImageUrl;
            this.drinksForm.recoImageUrl = this.drinksFormParent.recoImageUrl;
            this.drinksForm.thumImageUrl = this.drinksFormParent.thumImageUrl;
            this.drinksForm.detailImageUrl = this.drinksFormParent.detailImageUrl;
            this.drinksForm.dynamicValidateForm.domains = this.drinksFormParent.dynamicValidateForm.domains;
            this.drinksForm.skuCodeArr = this.drinksFormParent.skuCodeArr;
        },

        //酒水规格添加按钮
        addDomain() {
            this.drinksForm.dynamicValidateForm.domains.push({
                specName: '', //规格
                originalPrice: '', //规格原价
                presentPrice: '', //规格现价
                skuCode: '' //sku码
            });
        },

        //酒水规格删除按钮
        removeDomain(item) {
            var index = this.drinksForm.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.drinksForm.dynamicValidateForm.domains.splice(index, 1);
            }

            //删除一个规格就添加到这个删除规格数组里
            if (item.skuCode !== '') {
                this.drinksForm.skuCodeArr.push(item.skuCode);
                console.log('规格', this.drinksForm.skuCodeArr);
            }
        },

        //上传广告图
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                this.drinksForm.bannerImageUrl = res.data;
            });
        },

        //上传推荐位图
        uploadRecoFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                this.drinksForm.recoImageUrl = res.data;
            });
        },

        //上传缩略图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                this.drinksForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
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