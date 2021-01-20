<template>
    <div class="cropper">
        <!-- element 上传图片按钮 -->
        <el-upload class="upload-demo" action="" drag :auto-upload="false" :show-file-list="false" :on-change="changeUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">点击上传</div>
            <div class="el-upload__tip">支持绝大多数图片格式，单张图片最大支持5MB</div>
        </el-upload>
        <img v-if="fileImg" :src="showImgPrefix + fileImg" class="avatar" />

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
                        :canScale="option.canScale"
                        :autoCrop="option.autoCrop"
                        :autoCropWidth="option.autoCropWidth"
                        :autoCropHeight="option.autoCropHeight"
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
// 使用vue-cropper 图片上传组件
import { VueCropper } from 'vue-cropper';

export default {
    name: 'Cropper',

    components: {
        VueCropper
    },

    data() {
        return {
            showImgPrefix: this.$imgHead, //回显图片/视频的前缀

            fileImg: '',
            dialogVisible: false,
            // 裁剪组件的基础配置option
            option: {
                img: '', // 裁剪图片的地址
                outputType: 'jpeg', // 裁剪生成图片的格式
                canScale: false, // 图片是否允许滚轮缩放
                autoCrop: true, // 是否默认生成截图框
                autoCropWidth: 320, // 默认生成截图框宽度
                autoCropHeight: 320, // 默认生成截图框高度
                fixedBox: true, // 固定截图框大小 不允许改变
                fixedNumber: [1, 1], // 截图框的宽高比例
                canMoveBox: false, // 截图框能否拖动
                centerBox: true, // 截图框是否被限制在图片里面
                infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
            }
        };
    },

    methods: {
        // 上传按钮 限制图片大小
        changeUpload(file) {
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
                this.dialogVisible = false;

                // 把图片上传到服务器
                let formData = new FormData();
                formData.append('file', data);
                this.$file_post(this.$fileUploadUrl, formData).then((res) => {
                    if (res.code === 0) {
                        this.fileImg = res.data;
                        this.$message.success('上传成功');
                    }
                });
            });
        }
    }
};
</script>

<style scoped lang="less">
/* 截图 */
.cropper {
    width: auto;
    height: 320px;
}
</style>