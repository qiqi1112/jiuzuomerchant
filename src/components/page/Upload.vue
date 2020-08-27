<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>图片上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 图片 -->
        <el-upload
            class="avatar-uploader"
            action="http://api_dev.wanxikeji.cn/api/savePic"
            :data="imgdata2"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload2"
            :show-file-list="false"
        >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>

        <!-- 图集 -->
        <el-upload
            list-type="picture-card"
            action="http://api_dev.wanxikeji.cn/api/savePic"
            :data="imgdata"
            :before-upload="beforeAvatarUpload"
            :on-preview="handlePictureCardPreview"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :file-list="dialogImageUrlBox"
        >
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>

        <el-button type="primary" @click="submit">提交</el-button>

        <!-- <div class="container">
            <div class="content-title">支持拖拽</div>
            <div class="plugins-tips">
                Element UI自带上传组件。
                访问地址：
                <a
                    href="http://element.eleme.io/#/zh-CN/component/upload"
                    target="_blank"
                >Element UI Upload</a>
            </div>
            <el-upload
                class="upload-demo"
                drag
                action="http://jsonplaceholder.typicode.com/api/posts/"
                multiple
            >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                    将文件拖到此处，或
                    <em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
            <div class="content-title">支持裁剪</div>
            <div class="plugins-tips">
                vue-cropperjs：一个封装了 cropperjs 的 Vue 组件。
                访问地址：
                <a
                    href="https://github.com/Agontuk/vue-cropperjs"
                    target="_blank"
                >vue-cropperjs</a>
            </div>
            <div class="crop-demo">
                <img :src="cropImg" class="pre-img" />
                <div class="crop-demo-btn">
                    选择图片
                    <input
                        class="crop-input"
                        type="file"
                        name="image"
                        accept="image/*"
                        @change="setImage"
                    />
                </div>
            </div>

            <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
                <vue-cropper
                    ref="cropper"
                    :src="imgSrc"
                    :ready="cropImage"
                    :zoom="cropImage"
                    :cropmove="cropImage"
                    style="width:100%;height:300px;"
                ></vue-cropper>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
            </el-dialog>
        </div>-->
    </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
export default {
    name: 'upload',
    data: function () {
        return {
            // defaultSrc: require('../../assets/img/img.jpg'),
            // fileList: [],
            // imgSrc: '',
            // cropImg: '',

            dialogVisible: false, //图集对话框默认隐藏
            dialogImageUrl: '', //当前图集的地址
            //上传时附带的额外参数（图集地址）
            imgdata: {
                img: ''
            },
            imageUrl: '', //添加与修改对话框里的图片上传
            //上传时附带的额外参数（图片地址）
            imgdata2: {
                img: ''
            },
            dialogImageUrlBox: [] //要上传的文件列表
        };
    },
    components: {
        VueCropper
    },
    methods: {
        //上传图集完成之前的操作（获取图集flie信息）
        beforeAvatarUpload(file) {
            this.imgdata.img = file; //上传图集完成之前就把这个图集的相关flie信息赋给一个对象里的属性，然后上面上传时就通过:data将这个imgdata对象携带过去
        },

        //点击查看图集时
        handlePictureCardPreview(file) {
            this.dialogVisible = true; //展示图集的对话框开启
            this.dialogImageUrl = file.url; //将返回的图集地址展示到页面上
        },

        //删除图集后
        handleRemove(file, fileList) {
            //第一个参数为当前删除的图集信息，第二个参数为剩余的图集信息数组
            console.log(file, fileList);
        },

        //图集上传完成以后
        handleAvatarSuccess(res, file) {
            this.dialogImageUrl += 'http://api_dev.wanxikeji.cn/' + res.data + ',';
            console.log(this.dialogImageUrl, '图集上传完成之后返回的地址');
            // console.log("xxx",res);
            // console.log(file, '图集上传完返回的file');
        },

        //-----------------------------------------------------------

        //上传文件完成之前的操作
        beforeAvatarUpload2(file) {
            this.imgdata2.img = file; //上传图片完成之前就把这个图片的相关信息赋给一个对象里的属性，然后上面上传时就通过:data将这个imgdata对象携带过去，这样下面就能获取到这个图片的地址信息等
        },

        //上传图片完成的操作
        handleAvatarSuccess2(res, file) {
            this.imageUrl = 'http://api_dev.wanxikeji.cn/' + res.data; //这就是图片的完整地址，这样后续就可以进行相关操作了
            console.log(this.imageUrl);
        },

        //提交
        submit() {},

        setImage(e) {
            const file = e.target.files[0];
            if (!file.type.includes('image/')) {
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                this.dialogVisible = true;
                this.imgSrc = event.target.result;
                this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
            };
            reader.readAsDataURL(file);
        },
        cropImage() {
            this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
        },
        cancelCrop() {
            this.dialogVisible = false;
            this.cropImg = this.defaultSrc;
        },
        imageuploaded(res) {
            console.log(res);
        },
        handleError() {
            this.$notify.error({
                title: '上传失败',
                message: '图片上传接口上传失败，可更改为自己的服务器接口'
            });
        }
    },
    created() {
        this.cropImg = this.defaultSrc;
    }
};
</script>

<style scoped>
.content-title {
    font-weight: 400;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.pre-img {
    width: 100px;
    height: 100px;
    background: #f8f8f8;
    border: 1px solid #eee;
    border-radius: 5px;
}
.crop-demo {
    display: flex;
    align-items: flex-end;
}
.crop-demo-btn {
    position: relative;
    width: 100px;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    margin-left: 30px;
    background-color: #409eff;
    color: #fff;
    font-size: 14px;
    border-radius: 4px;
    box-sizing: border-box;
}
.crop-input {
    position: absolute;
    width: 100px;
    height: 40px;
    left: 0;
    top: 0;
    opacity: 0;
    cursor: pointer;
}
</style>