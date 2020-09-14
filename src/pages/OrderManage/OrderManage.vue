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
                <el-button
                    type="primary"
                    class="handle-del mr10"
                    @click="handleEdit()"
                >查看座位</el-button>
                <el-button
                    type="primary"
                    icon="el-icon-download"
                    class="handle-del mr10"
                    @click="handleEdit()"
                >Excel导出</el-button>
            </div>
            <el-table 
                :data="tableData" border class="table" 
                ref="multipleTable" 
                header-cell-class-name="table-header" 
                @selection-change="handleSelectionChange" 
                @row-dblclick="lineDb"
            >
            <!-- phoneNum -->
                <el-table-column prop="id" label="ID" fixed width="80" align="center"></el-table-column>
                <el-table-column prop="order_id" min-width="120" label="订单发起人"></el-table-column>
                <el-table-column prop="order_id" min-width="120" label="预定用户"></el-table-column>
                <el-table-column prop="tel" min-width="120" label="预定手机">
                    <template slot-scope="scope">
                        <span>{{scope.row.tel | phoneNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="order_type" min-width="100" label="订单类型"></el-table-column>  
                <el-table-column prop="user_name" min-width="180" label="订单号"></el-table-column>
                <el-table-column prop="creat_time" min-width="150" label="支付状态"></el-table-column>
                <el-table-column prop="order_state" min-width="100" label="支付类型"></el-table-column>
                <el-table-column prop="order_state" min-width="200" label="总订单号"></el-table-column>
                <el-table-column prop="remark" min-width="200" label="实付金额"></el-table-column>
                <el-table-column prop="pay_type" min-width="200" label="优惠卷"></el-table-column>
                <el-table-column prop="pay_time" min-width="200" label="备注信息"></el-table-column>
                <el-table-column prop="total" min-width="150" label="订单发起时间"></el-table-column>
                <el-table-column prop="order_detail" min-width="150" label="订单支付时间"></el-table-column>
                <el-table-column prop="is_coupons" min-width="200" label="订单信息"></el-table-column>
                <el-table-column label="操作" width="180" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                        size="mini"
                        :disabled='scope.row.stateUsing==3'
                        :type="scope.row.stateUsing==1?'success':(scope.row.stateUsing==2?'danger':'info')"
                        @click="stateEdit(scope.$index, scope.row)">
                        {{scope.row.stateUsing==1?'已到店':(scope.row.stateUsing==2?'使用中':'已离开')}}
                        </el-button>
                        <el-button
                        size="mini"
                        type="primary"
                        @click="handleEdit(scope.$index, scope.row)">查看</el-button>

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
            <el-form ref="form" :model='form'  label-width="100px" ><!--:rules='rules'-->
                    <div class="column">
                        <span class="line lw2"></span>
                        <span>订单信息</span>
                    </div>

                    <div class="order_detail">
                        <div class="ol">
                            <div class="or_li">
                                <span class="or_lab">预定用户：</span>
                                <span class="or_info">张十周年</span>
                            </div>
                            <div class="or_li">
                                <span class="or_lab">预定手机：</span>
                                <span class="or_info">19999999999</span>
                            </div>
                            <div class="or_li">
                                <span class="or_lab">预定备注信息：</span>
                                <span class="or_info">帮我提前打理好卫生吧，我这里来的是比较重要的领导，会早点来</span>
                            </div>
                            <div class="or_li">
                                <span class="or_lab">订单号：</span>
                                <span class="or_info">Mugabsj587416594KSJD54</span>
                            </div>
                            <div>
                                <span>订单类型：&nbsp;</span>
                                <span class="ors">预定桌</span>
                                <span>支付状态：&nbsp;</span>
                                <span class="ors sta">已支付</span>
                                <span>支付方式：&nbsp;</span>
                                <span>微信</span>
                            </div>

                            <div>
                                <div class="dl">
                                    <span>支付金额：</span><span class="total">￥1298.00</span>
                                    <span class="old_t">商品原价：</span><span class="total">￥1298.00</span>
                                </div>
                                <div class="dl tr">
                                    <span>优惠券优惠：</span><span class="total">￥1298.00</span>
                                </div>
                            </div>

                            <div class="or_li">
                                <span class="or_lab">下单时间：</span>
                                <span class="or_t">2020-09-23 09:56:28 星期三</span>
                            </div>
                            <div class="or_li">
                                <span class="or_lab">支付时间：</span>
                                <span class="or_t">2020-09-23 09:56:28 星期三</span>
                            </div>
                        </div>
                        <div class="or">
                            <div class="orl">
                                清单详情：
                            </div>
                            <div class="orr">
                                <div class="seat">
                                    <p class="tit">座位信息</p>
                                    <div class="oli">
                                        <span class="olil">座位号</span>
                                        <span class="olir">K5座</span>
                                    </div>
                                    <div class="oli">
                                        <span class="olil">容纳人数</span>
                                        <span class="olir">8人</span>
                                    </div>
                                    <div class="oli">
                                        <span class="olil">保留时间</span>
                                        <span class="olir">最晚至 20：30</span>
                                    </div>
                                    <div class="oli">
                                        <span class="olil">抵消金额</span>
                                        <span class="olir">￥ 1000.00</span>
                                    </div>
                                </div>
                                <div class="coupons">
                                    <p class="tit">优惠卷</p>
                                    <div class="oli">满1000减50</div>
                                </div>
                                <div class="drinks">
                                    <p class="tit">酒水清单</p>
                                     <div class="oli">
                                        <span class="olil">商品名称</span>
                                        <span class="olir">￥246.00 <span>￥246.00</span></span>
                                    </div>
                                    <div class="onu"><span class="olil">*1</span></div>
                                     <div class="oli">
                                        <span class="olil">抵消金额</span>
                                        <span class="olir">￥246.00 <span>￥246.00</span></span>
                                    </div>
                                    <div class="onu"><span class="olil">*2</span></div>
                                </div>
                                <div class="save">
                                    <el-button type="primary">返回</el-button>
                                </div>
                            </div>
                        </div>
                    </div>
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
                    tel:'18825255252',
                    creat_time:'2020-08-12 22:00',
                    order_state:'1',
                    pay_type:'微信支付',
                    pay_time:'2020-08-12 22:10',
                    total:'1000',
                    is_coupons:1,
                    coupons_total:'50',
                    stateUsing:1,
                    remark:'快点快点快点快点快点快点',
                    order_detail:'202卡座'
                },
                {
                    id:2,
                    order_id:'20184512120',
                    user_name:'李四',
                    order_type:'预定',
                    tel:'18825255252',
                    creat_time:'2020-08-12 22:00',
                    order_state:'1',
                    pay_type:'微信支付',
                    pay_time:'2020-08-12 22:10',
                    total:'1000',
                    is_coupons:1,
                    coupons_total:'50',
                    stateUsing:1,
                    remark:'快点快点快点快点快点快点',
                    order_detail:'202卡座'
                },
                {
                    id:3,
                    order_id:'20184512120',
                    user_name:'李四斯',
                    order_type:'预定',
                    tel:'18825255252',
                    creat_time:'2020-08-12 22:00',
                    order_state:'1',
                    stateUsing:1,
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
            console.log(row)
        },
        // 修改当前状态 已到店/使用中/已离开
        stateEdit(idx,row) {
            this.$confirm('确定要修改当前订单状态吗？', '温馨提示', {
                type: 'warning'
            }).then(() => {
                this.$message.success('订单状态修改成功');
                row.stateUsing ++
                if(row.stateUsing > 3){
                    row.stateUsing = 1
                }
            }).catch(() => {});
         
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

<style scoped lang='less'>
@border-color:#7a7a7a;
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
/* 弹窗 */
.order_detail{
    display: flex;
    .ol{
        flex: 1;
        .or_li{
            display: flex;
            margin-bottom: 20px;
        }
        .or_lab{
            flex: .3;
            width: 100px;
        }
        .or_info{
            flex: .7;
            width: 100px;
            border: 1px solid @border-color;
            border-radius: 5px;
            padding:7px  10px;
            box-sizing: border-box;
        }
        .ors{
            margin-right: 41px;
        }
        .sta{
            color: #488c05;
        }
        .total{
            display: inline-block;
            border: 1px solid @border-color;
            padding: 5px 7px;
            border-radius: 5px;
            margin-left:20px;
        }
        .or_t{
            flex: .7;
        }
        .dl{
            margin: 20px 0;
            .old_t{
                margin-left: 75px;
            }
        }
        .tr{
            text-align: right;
        }
    }
    .or{
        flex: 1;
        // text-indent: 50px;
        display: flex;
        .orl{
            flex: .2;
            padding-left:50px ;
        }
        .orr{
            flex: .65;
            .seat,.coupons{
               border-bottom:1px solid @border-color ; 
               margin-bottom: 10px;
            }
            .drinks{
                height: 220px;
                overflow-y:scroll;
            }
            .drinks::-webkit-scrollbar {display:none}
            .tit{
                color: rgb(236, 126, 0);
                margin-bottom: 10px;
            }
            .oli{
                line-height: 32px;
                span{
                    display: inline-block;
                }
                .olil{
                    width: 42%;
                }
                .olir{
                    width: 58%;
                    span{
                        text-decoration: line-through;
                        color: rgb(138, 138, 138);
                    }
                }
            }
            .save{
                text-align: right;
            }
            .onu{
                line-height: 20px;
            }
        }
    }
}

// element
/deep/.el-dialog{
    width: 46%!important;
    min-width: 876px;
}
/deep/.el-dialog__header{
    padding: 0;
}
/deep/ .el-dialog__body{
    padding-top: 10px;
}
/deep/.handle-input{
    width: 150px;
}
</style>
