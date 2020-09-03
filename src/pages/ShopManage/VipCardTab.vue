<template>
    <div class="goods-info-box">
        <div class="left-box">
            <el-form ref="vipCardForm" :model="vipCardForm" label-width="80px">
                <!-- <p>
                    <span>商品名称：</span>
                    <el-input v-model="vipCardForm.name" style="width:200px"></el-input>
                </p>-->
                <div class="good-name-box">
                    <div>
                        <span>商品名称：</span>
                        <el-input v-model="vipCardForm.name" style="width:160px"></el-input>
                    </div>
                    <div>
                        <span>商品排序（可选）：</span>
                        <!-- <el-input type="number" min="0" v-model="drinksForm.goodWeight" style="width:200px" placeholder="请输入商品排序（如：0）"></el-input> -->
                        <el-input-number v-model="vipCardForm.weight" :min="0" label="商品排序"></el-input-number>
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
                    v-model="vipCardForm.checkedBanner"
                    label="放至商店Banner位"
                    border
                    style="margin-right:20px"
                ></el-checkbox>
            </p>
            <!-- banner图 -->
            <el-upload
                v-if="vipCardForm.checkedBanner"
                class="avatar-uploader"
                action="1"
                list-type="picture-card"
                :http-request="uploadBannerFiles"
                :on-remove="bannerRemove"
                :file-list="vipCardForm.bannerImgBox"
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
            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
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

                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: '', //上传banner图集时的url字符串
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

    mounted() {
        this.assignParentToChild(); //回显商品信息
    },

    methods: {
        //回显父组件传过来的值（编辑商品）
        assignParentToChild() {
            this.vipCardForm.name = this.vipCardFormParent.name;
            this.vipCardForm.weight = this.vipCardFormParent.weight;
            this.vipCardForm.desc = this.vipCardFormParent.desc;
            this.vipCardForm.integral = this.vipCardFormParent.integral;
            this.vipCardForm.nowPrice = this.vipCardFormParent.nowPrice;
            this.vipCardForm.checkedBanner = this.vipCardFormParent.checkedBanner;
            this.vipCardForm.bannerUploadUrl = this.vipCardFormParent.bannerUploadUrl + ',';
            let picture = this.vipCardFormParent.bannerUploadUrl;
            this.vipCardForm.thumImageUrl = this.vipCardFormParent.thumImageUrl;
            this.vipCardForm.detailImageUrl = this.vipCardFormParent.detailImageUrl;

            this.showBannerImg(picture);
        },

        //将字符串分割为数组（banner图片专用）
        imgStrChangeArr(str) {
            let res = str.split(',');
            let newRes = res.map((item) => {
                return (item = this.showImgPrefix + item);
            });
            return newRes;
        },

        //回显banner图集
        showBannerImg(picStr) {
            this.vipCardForm.bannerImgBox = [];
            let pictureArr = this.imgStrChangeArr(picStr); //回显在上传图集的容器中
            pictureArr.forEach((item) => {
                let obj = {};
                obj.url = item;
                this.vipCardForm.bannerImgBox.push(obj);
            });
        },

        // 删除banner图集
        bannerRemove(file) {
            //第一个参数为当前删除的图集信息，第二个参数为剩余的图集信息数组
            console.log(file);

            // console.log("zzz",this.vipCardForm.bannerUploadUrl);

            let urlArr = this.vipCardForm.bannerUploadUrl.split(',');
            urlArr.forEach((item, i) => {
                if (this.showImgPrefix + item == file.url) {
                    urlArr.splice(i, 1);
                }
            });

            this.vipCardForm.bannerUploadUrl = urlArr.join(',');

            console.log(this.vipCardForm.bannerUploadUrl);
        },

        //发送当前子组件的表单信息给父组件
        sendChildForm() {
            this.$emit('vipCardFormChild', this.vipCardForm);
        },

        //上传banner图集
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$post(this.filesUploadUrl, formData).then((res) => {
                this.vipCardForm.bannerUploadUrl += res.data[0] + ',';
                console.log('图集地址', this.vipCardForm.bannerUploadUrl);
            });
        },

        //上传缩略图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.vipCardForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
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