<template>
    <div id="numeral">

        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 广告栏
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div ref='echart' id="chartLineBox" style="width: 500px;height: 500px;"> </div>

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
        this.chart()
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
        //图表
        chart(){
            this.chartLine = echarts.init(this.$refs.echart);
            var option = {
               dataZoom: {
                          start: 0, //默认为0
                          end: 100 - 1500 / 31, //默认为100
                          type: 'inside',
                          show: true,
                          xAxisIndex: [0],
                          handleSize: 0, //滑动条的 左右2个滑动条的大小
                          height: 8, //组件高度
                          left: 20, //左边的距离
                          right: 20, //右边的距离
                          bottom: 30, //右边的距离
                          handleColor: '#CBBCDB', //h滑动图标的颜色
                          handleStyle: {
                              borderColor: "#CBBCDB",
                              borderWidth: "1",
                              shadowBlur: 2,
                              background: "#CBBCDB",
                              shadowColor: "#CBBCDB",
                          },
                          fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [{
                              //给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
                              //给第一个设置0，第四个设置1，就是垂直渐变
                              offset: 0,
                              color: '#CBBCDB'
                          }, {
                              offset: 1,
                              color: '#CBBCDB'
                          }]),
                          backgroundColor: 'rgba(37, 46, 100, 0.45)', //两边未选中的滑动条区域的颜色
                          showDataShadow: false, //是否显示数据阴影 默认auto
                          showDetail: false, //即拖拽时候是否显示详细数值信息 默认true
                          handleIcon: 'M-292,322.2c-3.2,0-6.4-0.6-9.3-1.9c-2.9-1.2-5.4-2.9-7.6-5.1s-3.9-4.8-5.1-7.6c-1.3-3-1.9-6.1-1.9-9.3c0-3.2,0.6-6.4,1.9-9.3c1.2-2.9,2.9-5.4,5.1-7.6s4.8-3.9,7.6-5.1c3-1.3,6.1-1.9,9.3-1.9c3.2,0,6.4,0.6,9.3,1.9c2.9,1.2,5.4,2.9,7.6,5.1s3.9,4.8,5.1,7.6c1.3,3,1.9,6.1,1.9,9.3c0,3.2-0.6,6.4-1.9,9.3c-1.2,2.9-2.9,5.4-5.1,7.6s-4.8,3.9-7.6,5.1C-285.6,321.5-288.8,322.2-292,322.2z',
                          filterMode: 'filter',
                      },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {
                        // saveAsImage: {}//隐藏下载图标
                    }
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '邮件营销',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '联盟广告',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '视频广告',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410]
                    },
                    {
                        name: '直接访问',
                        type: 'line',
                        stack: '总量',
                        data: [320, 332, 301, 334, 390, 330, 320]
                    },
                    {
                        name: '搜索引擎',
                        type: 'line',
                        stack: '总量',
                        data: [820, 932, 901, 934, 1290, 1330, 1320]
                    }
                ]
            };
    
            // 使用刚指定的配置项和数据显示图表。
            this.chartLine.setOption(option);

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