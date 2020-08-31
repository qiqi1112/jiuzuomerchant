<template>
    <div class="goods-info-box">
        <div class="left-box">
            <el-form ref="comboForm" :model="comboForm" label-width="80px">
                <p>
                    <span>套餐名称：</span>
                    <el-input v-model="comboForm.name" style="width:200px"></el-input>
                </p>
                <p>
                    <span>套餐包含：</span>
                    <el-input type="textarea" v-model="comboForm.desc" style="width:300px;"></el-input>
                </p>
                <p>
                    <span>套餐原单价：</span>
                    <el-input v-model="comboForm.originPrice" style="width:120px;margin-right:20px"></el-input>

                    <span>套餐现单价：</span>
                    <el-input v-model="comboForm.nowPrice" style="width:120px"></el-input>
                </p>
                <p class="combo-spec">
                    <span>套餐规格：</span>
                    <i v-for="(item,index) in comboForm.spec" :key="index">{{item}}</i>
                </p>
            </el-form>
            <p>
                <el-checkbox
                    v-model="comboForm.checkedBanner"
                    label="放至商店Banner位"
                    border
                    style="margin-right:20px"
                ></el-checkbox>
            </p>
            <!-- banner图 -->
            <el-upload
                action="1"
                list-type="picture-card"
                :http-request="uploadBannerFiles"
                :on-remove="comboBannerRemove"
                :file-list="bannerImgBox"
                :on-error="uploadError"
            >
                <i class="el-icon-plus"></i>
            </el-upload>
            <!-- <el-dialog :visible.sync="bannerDialog">
                <img :src="bannerImageUrl" alt />
            </el-dialog>-->
            <span>（*如需商店轮播推荐，请添加Banner图片）</span>
        </div>
        <div class="right-box">
            <!-- 缩略图 -->
            <p>
                <span>套餐缩略图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :http-request="uploadThumFiles"
                    :show-file-list="false"
                    :on-error="uploadError"
                >
                    <img v-if="thumImageUrl" :src="thumImageUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </p>
            <!-- 详情图 -->
            <p>
                <span>套餐详情图：</span>
                <el-upload
                    class="avatar-uploader"
                    action="1"
                    :http-request="uploadDetailFiles"
                    :show-file-list="false"
                    :on-error="uploadError"
                >
                    <img v-if="detailImageUrl" :src="detailImageUrl" class="avatar" />
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
            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            //表单属性
            comboForm: {
                name: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                spec: ['默认'],
                checkedBanner: false
            },

            // bannerDialog: false, //查看图集时的对话框
            // bannerImageUrl: '', //图集放大查看地址
            bannerImgBox: [], //回显在图集容器中的所有图片
            bannerUploadUrl: '', //上传banner图集时的url字符串

            thumImageUrl: '', //缩略图
            detailImageUrl: '' //详情图
        };
    },

    methods: {
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$post(this.filesUploadUrl, formData).then((res) => {
                this.bannerUploadUrl += res.data[0] + ',';
                console.log('图集地址', this.bannerUploadUrl);
            });
        },

        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.thumImageUrl = this.showImgPrefix + res.data;
            });
        },

        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.detailImageUrl = this.showImgPrefix + res.data;
            });
        },

        //点击查看套餐banner图时
        // comboBannerPreview(file) {
        //     this.bannerDialog = true; //展示图集的对话框开启
        //     this.bannerImageUrl = file.url; //将返回的图集地址展示到页面上
        // },

        //移除套餐banner图时
        comboBannerRemove(file, fileList) {
            //第一个参数为当前删除的图集信息，第二个参数为剩余的图集信息数组
            console.log(file, fileList);
        },

        //图片上传失败时
        uploadError() {
            this.$message.error('插入失败');
        },

        //添加套餐-------------------------------------------------------
        setComboInfo() {
            let data = {
                type: this.activeNum,
                name: this.comboForm.name,
                synopsis: this.comboForm.desc,
                originalPrice: this.comboForm.originPrice,
                presentPrice: this.comboForm.nowPrice,
                recommendAdStatus: 2,
                recommendStatus: 2,
                listPicture: 'shangzuo-dev/20200828/edk8f3v5b9j1d6s16y2p.jpg',
                infoPicture: 'shangzuo-dev/20200828/wa2wu8b47raagzp6cn5f.jpg'
            };
            this.$post('/dev/merchant/store/goods/save', data).then((res) => {
                console.log(res);
            });
        }
    }
};
</script>

<style scoped>
</style>