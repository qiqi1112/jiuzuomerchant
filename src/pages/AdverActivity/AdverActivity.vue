<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 活动列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <div class="handle-box">
                 <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="handleEdit()"
                >新增活动</el-button>
                <el-select v-model="query.address" placeholder="地址" class="handle-select mr10">
                    <el-option key="1" label="广东省" value="广东省"></el-option>
                    <el-option key="2" label="湖南省" value="湖南省"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column prop="id" label="ID" fixed width="80" align="center"></el-table-column>
                <el-table-column prop="act_name" min-width="200" label="活动主题"></el-table-column>
                <el-table-column label="活动简介" min-width="100">
                    <template slot-scope="scope">{{scope.row.act_release}}</template>
                </el-table-column>
                <el-table-column prop="act_introduce" label="活动开始时间" min-width="220"></el-table-column>
                <el-table-column label="标签" prop="act_lable" min-width="150" align="center">
                    <template slot-scope="scope">
                        <span  v-for="(item,index) in scope.row.act_lable" :key="index">{{item}} </span>
                    </template>
                </el-table-column>
                <el-table-column label="活动缩略图" align="center" min-width="300">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            v-for="(item,index) in scope.row.banner_list" :key="index"
                            :src="item"
                            :preview-src-list="scope.row.banner_list"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="act_content"  class-name="beyond" min-width="320" :show-overflow-tooltip='true' label="活动内容"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog :title="doing" :visible.sync="editVisible" width="32%">
            <el-form ref="form" :model='form'  label-width="70px">
                <div class="column">
                    <span class="line lw2"></span>
                    <span>活动详情</span>
                </div>
                <div class="top_info">
                    <div class="activity">
                        <div class="in_act">
                            <el-form-item label="活动名称">
                                <el-input v-model="dynamicValidateForm.dio_name"></el-input>
                            </el-form-item>
                            <el-form-item label="活动简介">
                                <el-input type="textarea" v-model="dynamicValidateForm.dio_introduce"></el-input>
                            </el-form-item>
                            <div class="lab_box">
                                <label class="label">活动标签</label>
                                <div class="iptList">
                                    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm"  class="demo-dynamic">
                                        <el-form-item
                                            v-for="(domain, index) in dynamicValidateForm.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                            :rules="{
                                            required: true, message: '标签不能为空', trigger: 'blur'
                                            }"
                                        >
                                            <el-input v-model="domain.value"></el-input>
                                            <i class="el-icon-error" @click.prevent="removeDomain(domain)"></i>
                                        </el-form-item>
                                        <el-form-item>
                                            <!-- <el-button type="primary" @click="submitForm('dynamicValidateForm')">提交</el-button> -->
                                            <img  src="../../assets/img/jia.png" @click="addDomain" class="addLab">
                                            <!-- <el-button @click="resetForm('dynamicValidateForm')">重置</el-button> -->
                                        </el-form-item>
                                    </el-form>
                                    <!-- <input type="text" v-for="(item,index) in addNum"   :key="index"> -->
                                    <!--  -->
                                </div>
                            </div>
                        </div>                   
                    </div>
                    <div class="banner">
                        <div class="imgs">
                            <p>活动Banner图:</p>
                            <el-upload
                                action="fakeaction"
                                multiple
                                list-type="picture-card"
                                :http-request="uploadSectionFile"
                                :on-change="handleChange"
                                :limit='5'
                                :auto-upload="false"
                                :on-remove="handleRemove">
                                <i class="el-icon-plus"></i>
                            </el-upload>
                            <el-dialog :visible.sync="dialogVisible">
                                <img width="100%" :src="dialogImageUrl" alt="" >
                            </el-dialog>
                        </div>
                    </div> 
                </div>
                <div class="editor">
                    <editor :formData="dynamicValidateForm"></editor>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">重置</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import editor from '../../components/common/editor'
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10,
            },
            tableData: [
                {
                    id:1,
                    act_name:'双十一秒杀',
                    act_release:'2020-11-11',
                    banner_list:['img/2.jpg','img/3.jpg','img/4.jpg'],
                    act_url:'www.baidu.com',
                    act_introduce:'企业成员编辑项目后',
                    act_lable:['秒杀','限时','拼单'],
                    act_content:'企业成员编辑项目后，会按时间顺序在这里显示企业成员编辑项目后，会按时间顺序在这里显示企业成员编辑项目后，会按时间顺序在这里显示',
                },
                {
                    id:2,
                    act_name:'春节优惠',
                    act_release:'2021-01-20',
                    banner_list:['img/timg.jpg','img/5.jpg','img/6.jpg'],
                    act_url:'www.baidu.com',
                    act_introduce:'企业成员编辑项目后',
                    act_lable:['秒杀'],
                    act_content:'企业成员编辑项目后，会按时间顺序在这里显示企业成员编辑项目后，会按时间顺序在这里显示企业成员编辑项目后，会按时间顺序在这里显示',
                },
                {
                    id:3,
                    act_name:'春节优惠aaabb',
                    act_release:'2021-01-20',
                    banner_list:['img/timg.jpg','img/2.jpg'],
                    act_url:'www.baidu.com',
                    act_introduce:'企业成员编辑项目后',
                    act_lable:['秒杀','限时'],
                    act_content:'企业成员编辑项目后，会按时间顺序在这里显示企业成员编辑项目后，会按时间顺序在这里显示企业成员编辑项目后，会按时间顺序在这里显示',
                },
            ],
            dio_name:'',
            dio_introduce:'',
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            form: {},
            idx: -1,
            id: -1,
            formData:[],
            dialogImageUrl:'',
            dialogVisible: false,   
            doing:'',
            value1: '',
            addNum:1,
            dynamicValidateForm: {
                domains: [{
                    value: ''
                }],
                dio_name:'',
                dio_introduce:'',
                fromdata:[]
            }
        }
    },  
    components:{
        editor        
    },
    created() {
        this.getData();
        this.pageTotal = this.tableData.length
    },
    methods: {
        // 新增活动标签相关
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                alert('submit!');
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item)
            if (index !== -1) {
            this.dynamicValidateForm.domains.splice(index, 1)
            }
        },
        addDomain() {
            this.dynamicValidateForm.domains.push({
                value: '',
            });
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$message.success('删除成功');
                    this.tableData.splice(index, 1);
                })
                .catch(() => {});
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index='', row='') {
            this.form = {}
            if(row){
                this.idx = index;
                this.form = row;
            }
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            this.$set(this.tableData, this.idx, this.form);
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        // 图片上传
        getimg(){
            let config = {
                "Content-Type":"multipart/form-data"
            };
            let fromdata = new FormData();
            var files = this.dynamicValidateForm.fromdata;
            for(let file of  files){
                fromdata.append("files",file.raw);
            }
            this.$post('/text/admin/system/upload/createBatch',fromdata,config).then((res) => {
                this.$message.success('上传成功');
            })
        },
        handleRemove(file, fileList) {
            this.dynamicValidateForm.fromdata.forEach((i,index)=>{
                if(file.name == i.name){
                    this.dynamicValidateForm.fromdata.splice(index,1)
                }
            })
        },
        handleChange(file, fileList) {
            this.formData.push(file)
            this.dynamicValidateForm.fromdata = this.formData
        },
        uploadSectionFile(file){
        },
    }
};
</script>

<style scoped lang='less'>

.top_info{
    display: flex;
    .activity{
        flex: 1;
        .in_act{
            width: 85%;
        }
        .lab_box{
            display: flex;
            input{
                width: 100px;
                height: 32px;
                text-indent: 10px;
                margin-right: 10px;
                margin-bottom: 10px;
                border: 1px solid #DCDFE6;
                border-radius: 4px;
                color: #606266;
                background:none;  
                outline:none;  
            }
            input:focus{
                border: 1px solid #409EFF;
            }
            label{
                width: 70px;
            }
            .iptList{
                width: calc(100% - 70px);
            }
        }
        .addLab{
            height: 32px;
            width: 32px;
            vertical-align: middle;
        }
    }
    .banner{
        flex: 1;
        padding-left: 10px;
        .imgs{
            p{
                margin-bottom: 15px;
            }
        }
    }
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: inline-block;
    margin: auto;
    width: 80px;
    height: 80px;
    margin-right: 10px;
}
.table-td-thumb img{
    width: 100%;
    height: 100%;
}
// element
/deep/ .el-dialog{
    width: 55%;
    min-width:850px ;
}
/deep/ .el-dialog__body{
    padding-top: 0;
}
/deep/.lab_box{
    .el-form-item--small{
        display: inline-block;
        margin-right: 15px;
    }
    .el-input--small{
        width: 100px;
    }
    .el-icon-error{
        margin-left: 5px;
    }
}

</style>
