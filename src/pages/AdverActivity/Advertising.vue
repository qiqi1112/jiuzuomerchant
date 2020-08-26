<template>
    <div id="advertising">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 广告栏
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            11
            <!-- <div class="advertising">
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
            </div> -->
        </div>
    </div>
</template>

<script>
const echarts =  require('echarts');
export default {
    data() {
        return {
            permissions:false,
            dialogImageUrl: '',
            formData:[],
            dialogVisible: false,

            chartLine:''
        };
    },
    created(){
      
    },
    mounted(){
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

<style scoped lang='less'>
#advertising{

}

</style>