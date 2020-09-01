<template>
    <div class="shop-info">
        <!-- banner展示图 -->
        <div class="banner-box">
            <p>店铺banner图</p>
            <div v-if="isReadonly">
                <img v-for="(item,index) in bannerShowBox" :key="index" :src="item" />
            </div>
            <el-upload
                v-else
                action="1"
                list-type="picture-card"
                :http-request="uploadBannerFiles"
                :on-preview="bannerPreview"
                :on-remove="bannerRemove"
                :file-list="bannerImgBox"
                :on-error="uploadError"
            >
                <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
                <img :src="bannerImageUrl" alt />
            </el-dialog>
        </div>

        <!-- 排号横幅图 -->
        <div class="rowNum-box">
            <div class="top">
                <p>排号横幅图</p>
                <img v-if="isReadonly" :src="rowNumImageUrl" class="avatar" />
                <el-upload
                    v-else
                    class="avatar-uploader"
                    action="1"
                    :http-request="uploadRowNumFile"
                    :show-file-list="false"
                    :on-error="uploadError"
                >
                    <img v-if="rowNumImageUrl" :src="rowNumImageUrl" class="avatar" />
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
            <div class="botm">
                <p>店铺长图（用于展示位置变化）</p>
                <img v-if="isReadonly" :src="appShopImageUrl" class="avatar" />
                <el-upload
                    v-else
                    class="avatar-uploader"
                    action="1"
                    :http-request="uploadAppShopFile"
                    :show-file-list="false"
                    :on-error="uploadError"
                >
                    <img v-if="appShopImageUrl" :src="appShopImageUrl" class="avatar" />
                    <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </div>
        </div>

        <!-- 商家布局图 -->
        <div class="overall-box">
            <p>商家布局图</p>
            <img v-if="isReadonly" :src="overallImageUrl" class="avatar" />
            <el-upload
                v-else
                class="avatar-uploader"
                action="1"
                :http-request="uploadOverallFile"
                :show-file-list="false"
                :on-error="uploadError"
            >
                <img v-if="overallImageUrl" :src="overallImageUrl" class="avatar" />
                <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </div>
    </div>
</template>

<script>
export default {
    props: ['shopShowImgProp'],

    data() {
        return {
            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            isReadonly: true,

            dialogVisible: false, //点击放大查看图集时的对话框开关
            bannerImageUrl: '', //图集放大查看地址
            bannerUploadUrl: '', //上传banner图集时的url字符串
            bannerShowBox: [], //要回显的banner图集（可以显示在自定义的地方）
            bannerImgBox: [], //要回显的banner图集（只能显示在上传图集的容器中）
            overallImageUrl: '', //商家布局图
            rowNumImageUrl: '', //排号横幅图
            appShopImageUrl: '' //店铺长图
        };
    },

    methods: {
        //上传banner图-------------------------------------------------------------
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$post(this.filesUploadUrl, formData).then((res) => {
                this.bannerUploadUrl += this.showImgPrefix + res.data[0] + ',';
                console.log(this.bannerUploadUrl);
            });
        },

        // 点击查看banner图集
        bannerPreview(file) {
            this.dialogVisible = true; //展示图集的对话框开启
            this.bannerImageUrl = file.url; //将返回的图集地址展示到页面上
        },

        // 删除banner图集
        bannerRemove(file, fileList) {
            //第一个参数为当前删除的图集信息，第二个参数为剩余的图集信息数组
            console.log(file, fileList);
        },

        //上传商家布局图-------------------------------------------------------------------
        uploadOverallFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.overallImageUrl = this.showImgPrefix + res.data;
            });
        },

        //上传排号横幅图-------------------------------------------------------------------
        uploadRowNumFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.rowNumImageUrl = this.showImgPrefix + res.data;
            });
        },

        //上传店铺长图-------------------------------------------------------------------
        uploadAppShopFile(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.appShopImageUrl = this.showImgPrefix + res.data;
            });
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('插入失败');
        },

        //banner图集回显
        showBannerImg(picStr) {
            this.bannerShowBox = this.imgStrChangeArr(picStr.slice(0, picStr.length - 1)); //回显在自定义的位置
            let pictureArr = this.imgStrChangeArr(picStr.slice(0, picStr.length - 1)); //回显在上传图集的容器中
            pictureArr.forEach((item) => {
                let obj = {};
                obj.url = item;
                this.bannerImgBox.push(obj);
            });
        }
    },

    watch: {
        //监听传过来的状态
        shopShowImgProp: {
            handler(val) {
                this.isReadonly = val.isReadonly; //改变只读属性
            },
            deep: true
        }
    },

    mounted() {}
};
</script>