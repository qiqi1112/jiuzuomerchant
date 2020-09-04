<template>
    <div class="goods-info-box">
        <div class="left-box">
            <el-form ref="otherForm" :model="otherForm" label-width="80px">
                <div class="good-name-box">
                    <div>
                        <span>商品名称：</span>
                        <el-input v-model="otherForm.name" style="width:160px"></el-input>
                    </div>
                    <div>
                        <span>商品排序：</span>
                        <el-input-number v-model="otherForm.weight" :min="0" label="商品排序"></el-input-number>
                    </div>
                </div>
                <p>
                    <span>商品包含：</span>
                    <el-input type="textarea" v-model="otherForm.desc" style="width:300px;"></el-input>
                </p>
                <p>
                    <span>商品原单价：</span>
                    <el-input v-model="otherForm.originPrice" style="width:120px;margin-right:20px"></el-input>

                    <span>商品现单价：</span>
                    <el-input v-model="otherForm.nowPrice" style="width:120px"></el-input>
                </p>
                <p class="combo-spec">
                    <span>商品规格：</span>
                    <el-form
                        :model="otherForm.dynamicValidateForm"
                        ref="otherForm.dynamicValidateForm"
                        label-width="100px"
                        class="demo-dynamic"
                    >
                        <el-form-item
                            v-for="(item, index) in otherForm.dynamicValidateForm.domains"
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
                                v-show="otherForm.dynamicValidateForm.domains.length > 1"
                                @click.prevent="removeDomain(item)"
                            >
                                <i class="el-icon-close"></i>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </p>
            </el-form>
            <p>
                <el-checkbox
                    v-model="otherForm.checkedBanner"
                    label="放至商店Banner位"
                    border
                    style="margin-right:20px"
                ></el-checkbox>
            </p>
            <!-- banner图 -->
            <el-upload
                v-if="otherForm.checkedBanner&&otherForm.checkedBanner !== 2"
                class="avatar-uploader"
                action="1"
                list-type="picture-card"
                :http-request="uploadBannerFiles"
                :on-remove="bannerRemove"
                :file-list="otherForm.bannerImgBox"
                :on-error="uploadError"
            >
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>（*如需商店轮播推荐，请添加Banner图片）</span>
        </div>
        <div class="right-box">
            <!-- 缩略图 -->
            <p>
                <span>商品缩略图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadThumFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="otherForm.thumImageUrl"
                        :src="showImgPrefix + otherForm.thumImageUrl"
                        class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </p>
            <!-- 详情图 -->
            <p>
                <span>商品详情图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :show-file-list="false"
                    :http-request="uploadDetailFiles"
                    :on-error="uploadError"
                >
                    <img
                        v-if="otherForm.detailImageUrl"
                        :src="showImgPrefix + otherForm.detailImageUrl"
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
    props: ['otherFormParent'], //父组件传过来的值

    data() {
        return {
            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            //其他标签页表单--------------------------------------------
            otherForm: {
                name: '',
                weight: 0,
                desc: '',
                originPrice: '',
                nowPrice: '',
                checkedBanner: false,
                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: [], //上传banner图集时的url数组
                thumImageUrl: '', //缩略图
                detailImageUrl: '', //详情图

                //酒水新增规格
                dynamicValidateForm: {
                    domains: [
                        {
                            specName: '', //规格
                            originalPrice: '', //规格原价
                            presentPrice: '' //规格现价
                        }
                    ]
                }
            }
        };
    },

    watch: {
        //监听表单信息变化
        otherForm: {
            handler() {
                this.sendChildForm();
            },
            deep: true
        }
    },

    mounted() {
        this.assignParentToChild(); //回显商品信息
        console.log('其他组件');
    },

    methods: {
        //回显父组件传过来的值（编辑商品）
        assignParentToChild() {
            this.otherForm.name = this.otherFormParent.name;
            this.otherForm.weight = this.otherFormParent.weight;
            this.otherForm.desc = this.otherFormParent.desc;
            this.otherForm.originPrice = this.otherFormParent.originPrice;
            this.otherForm.nowPrice = this.otherFormParent.nowPrice;
            this.otherForm.checkedBanner = this.otherFormParent.checkedBanner;

            this.otherForm.bannerUploadUrl = this.otherFormParent.bannerUploadUrl;

            // let picture = this.otherFormParent.bannerUploadUrl;

            this.otherForm.thumImageUrl = this.otherFormParent.thumImageUrl;
            this.otherForm.detailImageUrl = this.otherFormParent.detailImageUrl;
            this.otherForm.dynamicValidateForm.domains = this.otherFormParent.dynamicValidateForm.domains;

            console.log('ccc', this.otherForm.bannerUploadUrl.length);

            //如果回显的图集长度大于1，才回显图片（空字符也算一个值）
            if (this.otherForm.bannerUploadUrl.length > 0) {
                this.showBannerImg(); //回显banner图片
            }
        },

        //回显banner图集
        showBannerImg() {
            let pictureArr = this.otherForm.bannerUploadUrl;
            this.otherForm.bannerImgBox = [];
            pictureArr.forEach((item) => {
                let obj = {};
                obj.url = this.showImgPrefix + item;
                this.otherForm.bannerImgBox.push(obj);
            });
        },

        // 删除banner图集
        bannerRemove(file) {
            console.log('bbbbb', this.otherForm.bannerUploadUrl);

            this.otherForm.bannerUploadUrl.forEach((item, i) => {
                if (file.url == this.showImgPrefix + item) {
                    this.otherForm.bannerUploadUrl.splice(i, 1);
                }
            });

            console.log('sxzzz', this.otherForm.bannerUploadUrl);
        },

        //发送当前子组件的表单信息给父组件
        sendChildForm() {
            this.$emit('otherFormChild', this.otherForm);
        },

        //规格添加按钮
        addDomain() {
            this.otherForm.dynamicValidateForm.domains.push({
                specName: '', //规格
                originalPrice: '', //规格原价
                presentPrice: '' //规格现价
            });
        },

        //规格删除按钮
        removeDomain(item) {
            var index = this.otherForm.dynamicValidateForm.domains.indexOf(item);
            if (index !== -1) {
                this.otherForm.dynamicValidateForm.domains.splice(index, 1);
            }
        },

        //上传banner图集
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$post(this.filesUploadUrl, formData).then((res) => {
                this.otherForm.bannerUploadUrl.push(res.data[0]);
                console.log('图集地址', this.otherForm.bannerUploadUrl);
            });
        },

        //上传缩略图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.otherForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.otherForm.detailImageUrl = res.data;
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