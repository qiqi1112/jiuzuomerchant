<template>
    <div class="goods-info-box">
        <div class="left-box">
            <el-form ref="comboForm" :model="comboForm" label-width="80px">
                <div class="good-name-box">
                    <div>
                        <span>套餐名称：</span>
                        <el-input v-model="comboForm.name" style="width:160px"></el-input>
                    </div>
                    <div>
                        <!-- <span>商品排序：</span> -->
                        <el-select
                            v-model="comboForm.weight"
                            placeholder="商品排序"
                            style="width:110px"
                        >
                            <el-option
                                v-for="item in comboForm.options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            ></el-option>
                        </el-select>
                    </div>
                </div>
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
                :file-list="comboForm.bannerImgBox"
                :on-error="uploadError"
            >
                <i class="el-icon-plus"></i>
            </el-upload>
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
                    <img
                        v-if="comboForm.thumImageUrl"
                        :src="showImgPrefix + comboForm.thumImageUrl"
                        class="avatar"
                    />
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
                    <img
                        v-if="comboForm.detailImageUrl"
                        :src="showImgPrefix + comboForm.detailImageUrl"
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
    props: ['comboFormParent'], //父组件传过来的值

    data() {
        return {
            fileUploadUrl: '/file/admin/system/upload/create', //单文件上传
            filesUploadUrl: '/file/admin/system/upload/createBatch', //批量上传文件
            showImgPrefix: '/file/admin/system/upload/down?keyName=', //回显图片/视频的前缀

            //表单属性
            comboForm: {
                name: '',
                weight: '',
                desc: '',
                originPrice: '',
                nowPrice: '',
                spec: ['默认'],
                checkedBanner: false,
                options: [
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

                // bannerDialog: false, //查看图集时的对话框
                // bannerImageUrl: '', //图集放大查看地址
                bannerImgBox: [], //回显在图集容器中的所有图片
                bannerUploadUrl: '', //上传banner图集时的url字符串
                thumImageUrl: '', //缩略图
                detailImageUrl: '' //详情图
            }
        };
    },

    watch: {
        //监听表单信息变化
        comboForm: {
            handler() {
                this.sendChildForm();
            },
            deep: true
        }
    },

    methods: {
        //发送当前子组件的表单信息给父组件
        sendChildForm() {
            this.$emit('comboFormChild', this.comboForm);
        },

        //上传banner图集
        uploadBannerFiles(file) {
            let formData = new FormData();
            formData.append('files', file.file);
            this.$post(this.filesUploadUrl, formData).then((res) => {
                this.comboForm.bannerUploadUrl += res.data[0] + ',';
                console.log('图集地址', this.comboForm.bannerUploadUrl);
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

        //上传缩略图
        uploadThumFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.comboForm.thumImageUrl = res.data;
            });
        },

        //上传详情图
        uploadDetailFiles(file) {
            let formData = new FormData();
            formData.append('file', file.file);
            this.$post(this.fileUploadUrl, formData).then((res) => {
                this.comboForm.detailImageUrl = res.data;
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