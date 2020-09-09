<template>
    <div class="goods-info-box">
        <div class="left-box">
            <el-form ref="snackForm" :model="snackForm" label-width="80px">
                <!-- <p>
                    <span>小吃名称：</span>
                    <el-input v-model="snackForm.name" style="width:200px"></el-input>
                </p>-->

                <div class="good-name-box">
                    <div>
                        <span>小吃名称：</span>
                        <el-input v-model="snackForm.name" style="width:160px"></el-input>
                    </div>
                    <div>
                        <span>商品排序：</span>
                        <el-input-number v-model="snackForm.weight" :min="0" label="商品排序"></el-input-number>
                        <span>（*数值越小排序越靠前）</span>
                    </div>
                </div>
                <p>
                    <span>小吃包含：</span>
                    <el-input type="textarea" v-model="snackForm.desc" style="width:300px;"></el-input>
                </p>
                <p class="combo-spec">
                    <span>小吃规格：</span>
                    <el-form
                        :model="snackForm.dynamicValidateForm"
                        ref="snackForm.dynamicValidateForm"
                        label-width="100px"
                        class="demo-dynamic"
                    >
                        <el-form-item
                            v-for="(domain, index) in snackForm.dynamicValidateForm.domains"
                            :key="index"
                        >
                            <el-input
                                v-model="domain.specName"
                                placeholder="规格（如：一箱）"
                                style="width:132px;margin-right:10px"
                            ></el-input>
                            <el-input
                                v-model="domain.originalPrice"
                                placeholder="原价（如：9.99）"
                                style="width:130px;margin-right:10px"
                            ></el-input>
                            <el-input
                                v-model="domain.presentPrice"
                                placeholder="现价（如：9.99）"
                                style="width:130px;margin-right:10px"
                            ></el-input>
                            <el-button @click="addDomain">
                                <i class="el-icon-plus"></i>
                            </el-button>
                            <el-button
                                v-show="snackForm.dynamicValidateForm.domains.length > 1"
                                @click.prevent="removeDomain(domain)"
                            >
                                <i class="el-icon-close"></i>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </p>
            </el-form>
            <p>
                <el-checkbox
                    @change="removeBanner"
                    v-model="snackForm.checkedBanner"
                    label="放至商店广告位"
                    border
                    style="margin-right:20px"
                ></el-checkbox>
            </p>
            <!-- 广告图 -->
            <el-upload
                v-if="snackForm.checkedBanner&&snackForm.checkedBanner !== 2"
                class="avatar-uploader"
                action="1"
                :show-file-list="false"
                :http-request="uploadBannerFiles"
                :on-error="uploadError"
            >
                <img
                    v-if="snackForm.bannerImageUrl"
                    :src="showImgPrefix + snackForm.bannerImageUrl"
                    class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>（*如需商店轮播推荐，请添加广告图片）</span>
        </div>
        <div class="right-box">
            <!-- 缩略图 -->
            <p>
                <span>小吃缩略图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadThumFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="snackForm.thumImageUrl"
                        :src="showImgPrefix + snackForm.thumImageUrl"
                        class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </p>
            <!-- 详情图 -->
            <p>
                <span>小吃详情图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadDetailFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="snackForm.detailImageUrl"
                        :src="showImgPrefix + snackForm.detailImageUrl"
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
    props: ['snackFormParent'], //父组件传过来的值

    data() {
        return {
            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            //小吃标签页表单------------------------------------------
            snackForm: {
                name: '',
                weight: 0,
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,

                bannerImageUrl: '', //广告图
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
        //监听表单信息变化
        snackForm: {
            handler() {
                this.sendChildForm();
            },
            deep: true
        }
    },

    mounted() {
        this.assignParentToChild(); //回显商品信息
        console.log('小吃组件');
    },

    methods: {
        //关闭广告位操作
        removeBanner() {
            if (!this.snackForm.checkedBanner) {
                this.snackForm.bannerImageUrl = '';
            }
        },

        //回显父组件传过来的值（编辑商品）
        assignParentToChild() {
            this.snackForm.name = this.snackFormParent.name;
            this.snackForm.weight = this.snackFormParent.weight;
            this.snackForm.desc = this.snackFormParent.desc;
            this.snackForm.originPrice = this.snackFormParent.originPrice;
            this.snackForm.nowPrice = this.snackFormParent.nowPrice;
            this.snackForm.checkedBanner = this.snackFormParent.checkedBanner == 1 ? true : false;
            this.snackForm.bannerImageUrl = this.snackFormParent.bannerImageUrl;
            this.snackForm.thumImageUrl = this.snackFormParent.thumImageUrl;
            this.snackForm.detailImageUrl = this.snackFormParent.detailImageUrl;
            this.snackForm.dynamicValidateForm.domains = this.snackFormParent.dynamicValidateForm.domains;
            this.snackForm.skuCodeArr = this.snackFormParent.skuCodeArr;

            console.log('xxx', this.snackForm.checkedBanner);
        },

        //发送当前子组件的表单信息给父组件
        sendChildForm() {
            this.$emit('snackFormChild', this.snackForm);
        },

        //规格添加按钮
        addDomain() {
            this.snackForm.dynamicValidateForm.domains.push({
                specName: '', //规格
                originalPrice: '', //规格原价
                presentPrice: '', //规格现价
                skuCode: '' //sku码
            });
        },

        //规格删除按钮
        removeDomain(item) {
            var index = this.snackForm.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.snackForm.dynamicValidateForm.domains.splice(index, 1);
            }

            //删除一个规格就添加到这个删除规格数组里
            if (item.skuCode !== '') {
                this.snackForm.skuCodeArr.push(item.skuCode);
                console.log('规格', this.snackForm.skuCodeArr);
            }
        },

        //上传广告图
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.snackForm.bannerImageUrl = res.data;
            });
        },

        //上传缩略图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.snackForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.snackForm.detailImageUrl = res.data;
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