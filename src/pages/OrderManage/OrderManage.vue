<template>
    <div id="order_msg">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 订单管理
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
                >新增订单</el-button>
                <el-select v-model="query.address" placeholder="订单类型" class="handle-select mr10">
                    <el-option key="1" label="预定" value="预定"></el-option>
                    <el-option key="2" label="AA拼单" value="AA拼单"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="用户名" class="handle-input mr10"></el-input>
                <el-input v-model="query.tel" placeholder="手机号" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table 
                :data="tableData" border class="table" 
                ref="multipleTable" 
                header-cell-class-name="table-header" 
                @selection-change="handleSelectionChange" 
                @row-dblclick="lineDb"
            >
                <el-table-column prop="id" label="ID" fixed width="80" align="center"></el-table-column>
                <el-table-column prop="order_id" min-width="200" label="订单号"></el-table-column>
                <el-table-column prop="user_name" min-width="200" label="用户昵称"></el-table-column>
                <el-table-column prop="order_type" min-width="200" label="订单类型"></el-table-column>
                <el-table-column prop="tel" min-width="200" label="手机号"></el-table-column>
                <el-table-column prop="creat_time" min-width="200" label="发起时间"></el-table-column>
                <el-table-column prop="order_state" min-width="200" label="支付状态"></el-table-column>
                <el-table-column prop="remark" min-width="200" label="备注"></el-table-column>
                <el-table-column prop="pay_type" min-width="200" label="支付类型"></el-table-column>
                <el-table-column prop="pay_time" min-width="200" label="实付时间"></el-table-column>
                <el-table-column prop="total" min-width="200" label="实付金额"></el-table-column>
                <el-table-column prop="order_detail" min-width="200" label="订单内容"></el-table-column>
                <el-table-column prop="is_coupons" min-width="200" label="是否使用优惠券"></el-table-column>
                <el-table-column prop="coupons_total" min-width="200" label="优惠券金额"></el-table-column>
                <!-- <el-table-column label="活动发布" min-width="100">
                    <template slot-scope="scope">{{scope.row.act_release}}</template>
                </el-table-column>
                <el-table-column prop="act_introduce" label="活动简介" min-width="220"></el-table-column>
                <el-table-column label="活动标签" prop="act_lable" min-width="150" align="center">
                    <template slot-scope="scope">
                        <span  v-for="(item,index) in scope.row.act_lable" :key="index">{{item}} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="act_content"  class-name="beyond" min-width="320" :show-overflow-tooltip='true' label="活动内容"></el-table-column> -->
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
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
            <el-form ref="form" :model='form'  label-width="100px" :rules='rules'>
                    <el-form-item prop="user_name" label="用户昵称"><el-input v-model="form.user_name"></el-input></el-form-item>
                    <el-form-item prop="order_id" label="订单号"><el-input v-model="form.order_id"></el-input></el-form-item>   
                    <el-form-item prop="order_type" label="订单类型"><el-input v-model="form.order_type"></el-input></el-form-item>   
                    <el-form-item prop="tel" label="手机号"><el-input v-model="form.tel"></el-input></el-form-item>   
                    <el-form-item prop="creat_time" label="发起时间"><el-input v-model="form.creat_time"></el-input></el-form-item>   
                    <el-form-item prop="order_state" label="支付状态"><el-input v-model="form.order_state"></el-input></el-form-item>   
                    <el-form-item prop="pay_type" label="支付类型"><el-input v-model="form.pay_type"></el-input></el-form-item>   
                    <el-form-item prop="pay_time" label="实付时间"><el-input v-model="form.pay_time"></el-input></el-form-item>   
                    <el-form-item prop="total" label="实付金额"><el-input v-model="form.total"></el-input></el-form-item>   
                    <el-form-item prop="remark" label="备注"><el-input v-model="form.remark"></el-input></el-form-item>   
                    <el-form-item prop="order_detail" label="订单内容"><el-input v-model="form.order_detail"></el-input></el-form-item>   
                    <el-form-item prop="is_coupons" label="使用优惠券"><el-input v-model="form.is_coupons"></el-input></el-form-item>   
                    <el-form-item prop="coupons_total" label="优惠券金额"><el-input v-model="form.coupons_total"></el-input></el-form-item>   

                <!-- <el-form-item label="活动名称">
                    <el-input v-model="form.act_name"></el-input>
                </el-form-item>
                <el-form-item label="活动发布">
                     <div class="block">
                        <el-date-picker
                        v-model="form.act_release"
                        type="datetime"
                        placeholder="选择日期时间">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="活动简介"><el-input v-model="form.act_introduce"></el-input></el-form-item>
                <el-form-item label="活动内容">
                    <el-input v-model="form.act_content"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="活动标签">
                    <el-input v-model="form.act_lable"></el-input>
                </el-form-item> -->
                <!-- <el-form-item label="banner">
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
                </el-form-item> -->
                <!-- <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveEdit">确 定</el-button>
                </span> -->
                <el-form-item>
                    <el-button @click="editVisible = false">取消</el-button>
                    <el-button type="primary" @click="saveEdit">确定</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10,
                tel:'',
            },
            tableData: [
                {
                    id:1,
                    order_id:'20184512120',
                    user_name:'张三',
                    order_type:'预定',
                    tel:19999999999,
                    creat_time:'2020-08-12 22:00',
                    order_state:'1',
                    pay_type:'微信支付',
                    pay_time:'2020-08-12 22:10',
                    total:'1000',
                    is_coupons:1,
                    coupons_total:'50',
                    remark:'快点快点快点快点快点快点',
                    order_detail:'202卡座'
                },
                {
                    id:2,
                    order_id:'20184512120',
                    user_name:'李四',
                    order_type:'预定',
                    tel:19999999999,
                    creat_time:'2020-08-12 22:00',
                    order_state:'1',
                    pay_type:'微信支付',
                    pay_time:'2020-08-12 22:10',
                    total:'1000',
                    is_coupons:1,
                    coupons_total:'50',
                    remark:'快点快点快点快点快点快点',
                    order_detail:'202卡座'
                },
                {
                    id:3,
                    order_id:'20184512120',
                    user_name:'李四斯',
                    order_type:'预定',
                    tel:19999999999,
                    creat_time:'2020-08-12 22:00',
                    order_state:'1',
                    pay_type:'微信支付',
                    pay_time:'2020-08-12 22:10',
                    total:'1000',
                    is_coupons:1,
                    coupons_total:'50',
                    remark:'快点快点快点快点快点快点',
                    order_detail:'202卡座'
                },
            ],
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
            rules: {
                user_name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' },
                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                ],
                order_id: [
                    { required: true, message: '请输入订单号', trigger: 'change' }
                ],
                order_type: [
                    { type: 'date', required: true, message: '请选择订单类型', trigger: 'change' }
                ],
                tel: [
                    { type: 'date', required: true, message: '请输入手机号', trigger: 'change' }
                ],
                creat_time: [
                    { type: 'array', required: true, message: '请选择创建订单时间', trigger: 'change' }
                ],
                order_state: [
                    { required: true, message: '请选择订单状态', trigger: 'change' }
                ],
                pay_type: [
                    { required: true, message: '请选择支付状态', trigger: 'blur' }
                ],
                pay_time: [
                    { required: true, message: '请选择实付时间', trigger: 'blur' }
                ],
                total: [
                    { required: true, message: '请输入金额', trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: '请填写备注', trigger: 'blur' }
                ],
                order_detail: [
                    { required: true, message: '请输入订单内容', trigger: 'blur' }
                ],
                is_coupons: [
                    { required: true, message: '请选择优惠券类型', trigger: 'blur' }
                ],
                coupons_total: [
                    { required: true, message: '请输入优惠券金额', trigger: 'blur' }
                ],

            }
        };
    },
    created() {
        this.getData();
        this.pageTotal = this.tableData.length
    },
    methods: {
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
        // 双击某一行
        lineDb(row, column, event){
            this.form = {}
            if(row){
                // this.idx = index;
                this.form = row;
            }
            this.editVisible = true;
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
            var files = this.formData;
            for(let file of  files){
                fromdata.append("files",file.raw);
            }
            this.$post('/text/admin/system/upload/createBatch',fromdata,config).then((res) => {
                this.$message.success('上传成功');
            })
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handleChange(file, fileList) {
            this.formData.push(file)
        },
        uploadSectionFile(file){
        },
    }
};
</script>

<style scoped>
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
    width: 40px;
    height: 40px;
    margin-right: 10px;

}
.table-td-thumb img{
    width: 100%;
    height: 100%;
}
/* /deep/ .beyond{
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
} */
</style>
