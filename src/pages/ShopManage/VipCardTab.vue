<template>
    <div class="goods-info-box">
        <div class="left-box">
            <el-form ref="vipCardForm" :model="vipCardForm" label-width="80px">
                <div class="good-name-box">
                    <div>
                        <span>商品名称：</span>
                        <el-input v-model="vipCardForm.name" style="width:160px"></el-input>
                    </div>
                    <div>
                        <span>商品排序：</span>
                        <el-input-number v-model="vipCardForm.weight" :min="0" label="商品排序"></el-input-number>
                        <span>（*数值越小排序越靠前）</span>
                    </div>
                </div>
                <p>
                    <span>商品包含：</span>
                    <el-input type="textarea" v-model="vipCardForm.desc" style="width:300px;"></el-input>
                </p>
                <p>
                    <span>商品积分：</span>
                    <el-input v-model="vipCardForm.integral" style="width:120px;margin-right:20px"></el-input>

                    <span>商品单价：</span>
                    <el-input v-model="vipCardForm.nowPrice" style="width:120px"></el-input>
                </p>
                <p class="combo-spec">
                    <span>商品规格：</span>
                    <i v-for="(item,index) in vipCardForm.spec" :key="index">{{item}}</i>
                </p>
            </el-form>
            <p>
                <el-checkbox
                    @change="removeBanner"
                    v-model="vipCardForm.checkedBanner"
                    label="放至商店广告位"
                    border
                    style="margin-right:20px"
                ></el-checkbox>
            </p>
            <!-- 广告图 -->
            <el-upload
                v-if="vipCardForm.checkedBanner&&vipCardForm.checkedBanner !== 2"
                class="avatar-uploader"
                action="1"
                :show-file-list="false"
                :http-request="uploadBannerFiles"
                :on-error="uploadError"
            >
                <img
                    v-if="vipCardForm.bannerImageUrl"
                    :src="showImgPrefix + vipCardForm.bannerImageUrl"
                    class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <span>（*如需商店轮播推荐，请添加广告图片）</span>
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
                        v-if="vipCardForm.thumImageUrl"
                        :src="showImgPrefix + vipCardForm.thumImageUrl"
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
                        v-if="vipCardForm.detailImageUrl"
                        :src="showImgPrefix + vipCardForm.detailImageUrl"
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
    props: ['vipCardFormParent'], //父组件传过来的值

    data() {
        return {
            fileUploadUrl: '/admin/system/upload/create', //单文件上传
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            //会员卡标签页表单--------------------------------------------
            vipCardForm: {
                name: '',
                weight: 0,
                desc: '',
                integral: '', //积分
                nowPrice: '',
                spec: ['默认'],
                checkedBanner: false,
                bannerImageUrl: '', //广告图
                thumImageUrl: '', //缩略图
                detailImageUrl: '' //详情图
            }
        };
    },

    watch: {
        //监听表单信息变化
        vipCardForm: {
            handler() {
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
        console.log('会员卡组件');
    },

    methods: {
        //关闭广告位操作
        removeBanner() {
            if (!this.vipCardForm.checkedBanner) {
                this.vipCardForm.bannerImageUrl = '';
            }
        },

        //回显父组件传过来的值（编辑商品）
        assignParentToChild() {
            this.vipCardForm.name = this.vipCardFormParent.name;
            this.vipCardForm.weight = this.vipCardFormParent.weight;
            this.vipCardForm.desc = this.vipCardFormParent.desc;
            this.vipCardForm.integral = this.vipCardFormParent.integral;
            this.vipCardForm.nowPrice = this.vipCardFormParent.nowPrice;
            this.vipCardForm.checkedBanner = this.vipCardFormParent.checkedBanner == 1 ? true : false;
            this.vipCardForm.bannerImageUrl = this.vipCardFormParent.bannerImageUrl;
            this.vipCardForm.thumImageUrl = this.vipCardFormParent.thumImageUrl;
            this.vipCardForm.detailImageUrl = this.vipCardFormParent.detailImageUrl;

            console.log(this.vipCardForm.bannerImageUrl);
        },

        //发送当前子组件的表单信息给父组件
        sendChildForm() {
            this.$emit('vipCardFormChild', this.vipCardForm);
        },

        //上传广告图
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                this.vipCardForm.bannerImageUrl = res.data;
            });
        },

        //上传缩略图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                this.vipCardForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$file_post(this.fileUploadUrl, formData).then((res) => {
                this.vipCardForm.detailImageUrl = res.data;
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