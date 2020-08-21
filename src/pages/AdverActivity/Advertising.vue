<template>
    <div id="numeral">

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 广告栏
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="advertising">
                <el-button type="primary">广告栏申请</el-button>
            </div>


            <div class="permi">
                <div v-if="permissions">
                    暂无广告栏权限
                </div>
                <div v-else>
                    <el-button type="primary" @click='getimg()'>上传bannner</el-button>
                    <el-upload
                        action="fakeaction"
                        multiple
                        list-type="picture-card"
                        :before-upload="beforeAvatarUpload"
                        :http-request="uploadSectionFile"
                        :on-change="handleChange"
                        :limit='5'  
                        :on-remove="handleRemove">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible">
                        <img width="100%" :src="dialogImageUrl" alt="" >
                    </el-dialog>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            permissions:false,
            dialogImageUrl: '',
            formData:[],
            dialogVisible: false,
        };
    },
    created(){
      
    },
    methods:{
        handleRemove(file, fileList) {
        },
        handleChange(file, fileList) {
            this.formData = fileList
        },
        uploadSectionFile(file){
        },
        beforeAvatarUpload(file) {
            // const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;
            // if (!isJPG) {
            // this.$message.error('上传图片只能是 JPG 格式!');
            // }
            if (!isLt2M) {
            this.$message.error('上传图片大小不能超过 2MB!');
            }
            return isLt2M;
            return isJPG && isLt2M;

        },
        getimg(){
            // 多图上传
            let config = {
                "Content-Type":"multipart/form-data"
            };
            let fromdata = new FormData();
            var files = this.formData;
            for(let file of  files){
                fromdata.append("files",file.raw);
            }
            this.$post('/text/admin/system/upload/createBatch',fromdata,config).then((res) => {
                this.$message.success('上传成功');
            })
        },
    }
};
</script>

<style scoped>
.content-title{
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .pre-img{   
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
    .crop-demo-btn{
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
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }


    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>