<template>
    <div id="coupons">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-text"></i> 优惠券
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="addTicket()">添加</el-button>
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="dtlCoupon('',this.primary_dtl_cou)">删除</el-button>
                <el-input v-model="query.text" placeholder="关键字" class="handle-input mr10"></el-input>
                 <el-select v-model="query.coupons" placeholder="优惠券类型" class="handle-select mr10">
                    <el-option key="0" label="全部" value=""></el-option>
                    <el-option key="1" label="满减券" value="2"></el-option>
                    <el-option key="2" label="抵扣券" value="1"></el-option>
                    <el-option key="3" label="消费礼券" value="3"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table 
            :data="tableData"
            border 
            class="table" 
            ref="multipleTable" 
            header-cell-class-name="table-header" 
            @selection-change="handleSelectionChange"
            @row-dblclick="lineDb"
            >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" fixed width="180" align="center"></el-table-column>
                <el-table-column prop="category" align="center" min-width="100" label="优惠券类型">
                    <template slot-scope="scope">
                        <span>{{scope.row.category==1?'抵扣券':(scope.row.category==2?'满减券':'消费礼券')}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="details" min-width="80" label="优惠详情"></el-table-column>  
                <el-table-column prop="sum" align="center" min-width="150" label="发布张数"></el-table-column>
                <el-table-column align="center" prop="remainder" min-width="80" label="剩余张数"></el-table-column>  
                <el-table-column align="center" prop="beginTime" min-width="100" label="开始时间"></el-table-column>
                <el-table-column align="center" prop="overTime" min-width="100" label="结束时间"></el-table-column>
                <el-table-column label="操作" width="300" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" >查看</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)" >编辑</el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="dtlCoupon(scope.$index, scope.row)">删除</el-button>
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
            <el-form ref="form" :model='form'  label-width="120px" label-position="left">
                <div class="column">
                    <span class="line lw2"></span>
                    <span>优惠券信息</span>
                </div>

                <div class="top_info">
                    <div class="activity">
                        <div class="in_act">
                            <el-form-item label="优惠券类型">
                                <el-select v-model="form.region" placeholder="请选择类型">
                                <el-option label="满减券" value="2"></el-option>
                                <el-option label="抵扣券" value="1"></el-option>
                                <el-option label="消费礼券" value="3"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="优惠券详情" v-if='form.region'>
                                <div class="add_con">
                                    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm"  class="demo-dynamic">
                                        <el-form-item
                                            v-for="(domain, index) in dynamicValidateForm.domains"
                                            :key="domain.key"
                                            :prop="'domains.' + index + '.value'"
                                        >
                                            <div v-if="form.region == 2">
                                                <span class="tt">满</span>
                                                <el-input v-model="domain.full" class="num">
                                                    <template slot="append">￥</template>
                                                </el-input>
                                                <span class="tt">减</span>
                                                <el-input v-model="domain.minus" class="num">
                                                    <template slot="append">￥</template>
                                                </el-input>
                                                <span class="tt">送</span>
                                                <el-input v-model="domain.give" class="num">
                                                    <template slot="append">张</template>
                                                </el-input>
                                                <i class="el-icon-error" @click.prevent="removeDomain(domain)"></i>
                                            </div>

                                            <div v-if="form.region == 1">
                                                <span class="tt">直接抵扣</span>
                                                <el-input v-model="domain.minus" class="num">
                                                    <template slot="append">￥</template>
                                                </el-input>
                                                <span class="tt">送</span>
                                                <el-input v-model="domain.give" class="num">
                                                    <template slot="append">张</template>
                                                </el-input>
                                                <i class="el-icon-error" @click.prevent="removeDomain(domain)"></i>
                                            </div>

                                            <div v-if="form.region == 3">
                                                <span class="tt">满</span>
                                                <el-input v-model="domain.full" class="num">
                                                    <template slot="append">￥</template>
                                                </el-input>
                                                <span class="tt">赠</span>
                                                <el-input v-model="domain.minus" class="num">
                                                    <template slot="append">￥</template>
                                                </el-input>
                                                <span class="tt">送</span>
                                                <el-input v-model="domain.give" class="num">
                                                    <template slot="append">张</template>
                                                </el-input>
                                                <i class="el-icon-error" @click.prevent="removeDomain(domain)"></i>
                                            </div>

                                            <div class="block">
                                                <el-date-picker
                                                v-model="domain.start_end"
                                                type="daterange"
                                                range-separator="至"
                                                start-placeholder="开始日期"
                                                end-placeholder="结束日期">
                                                </el-date-picker>
                                            </div>
                                        </el-form-item>
                                    </el-form>
                                </div>
                                <img class="addCou" src="../../assets/img/jia.png" @click="addCou" alt="">
                            </el-form-item>
                        </div>                   
                    </div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible=false">返回</el-button>
                <el-button type="primary" @click="save">确定</el-button>
            </span>
        </el-dialog>
     
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                text: '',
                pageIndex: 1,
                pageSize: 10,
                coupons:'',
            },
            doing:'',
            form: {},
            pageTotal:null,
            editVisible:false,
            tableData: [],
            dynamicValidateForm: {
                domains: [{
                    full: '',
                    minus:'',
                    give:'',
                    start_end:'',
                }],//标签
            },
            primary_dtl_cou:'',//多选中的数组
        };
    },
    created() {
        this.getData();
    },
    watch:{
        'form.region': {
            handler: function (val) {
                this.dynamicValidateForm = {
                    domains: [{
                        full: '',
                        minus:'',
                        give:'',
                        start_end:'',
                    }]
                }
            },
            deep: true
        },
    },
    methods: {
        getData() {
            let data = {
                pageNo:this.query.pageIndex,
                pageSize:this.query.pageSize,
                category:this.query.coupons,
                details:this.query.text
            }
            this.$post('/api/merchant/store/coupon/couponLimit',data).then(res=>{
                if(res.code == 0){
                    this.tableData = res.data.list
                    this.pageTotal = res.data.total
                }else{
                    this.$message({message: res.mesg,type: 'warning'});
                }
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.getData();
        },
         // 编辑操作
        handleEdit(index='', row='') {
            this.form = {}
            console.log(row)
            if(row){
                this.idx = index;
                this.form = row;
            }
            this.editVisible = true;
        },
        // 双击某一行
        lineDb(row, column, event){
            this.form = {}
            if(row){
                this.form = row;
            }
            this.editVisible = true;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },

        addTicket(){

        },
        // 批量增加优惠券
        addCou() {
            this.dynamicValidateForm.domains.push({
                
            });
        },
        // 删除 新增时的优惠券
        removeDomain(item) {
            var index = this.dynamicValidateForm.domains.indexOf(item)
            if (index !== -1) {
            this.dynamicValidateForm.domains.splice(index, 1)
            }
        },
        // 多选
        handleSelectionChange(val){
            this.primary_dtl_cou = val
        },
        //删除已有优惠券
        dtlCoupon(index,val){
            let str = val.map(v=>{return v.id});
            let data = str.join(",");
            this.$Delete(`/api/merchant/store/coupon/deleteById/${data}`).then(res=>{
                if(res.code == 0){
                    this.$message({message: '删除成功',type: 'success'});
                }else{
                    this.$message({message: res.msg,type: 'warning'});
                }
            })
        },
        // 新增保存
        save(){
            let from = this.dynamicValidateForm.domains
            let arr = []
            from.forEach(i=>{
                let str = ''
                if(this.form.region == 1){
                    str = `直接抵扣${i.minus}`
                }else if(this.form.region == 2){
                    str = `满${i.full}元减${i.minus}元`
                }else{
                    str = `满${i.full}元赠${i.minus}`
                }
                let data = {    
                    beginTime: this.$regular.timeData(i.start_end[0],1),
                    category:this.form.region,
                    contentMoney: Number(i.full),
                    details: str, 
                    discountMoney: Number(i.minus),
                    id: "",
                    overTime: this.$regular.timeData(i.start_end[1],1),
                    remainder: Number(i.give),
                    source: 0,
                    sum: Number(i.give)
                }
                arr.push(data)
            })
            this.$post('/api/merchant/store/coupon/save',arr).then(res=>{
                if(res.code == 0){
                    this.$message({message: '新增成功',type: 'success'});
                    this.editVisible = false
                }else{
                    this.$message({message: res.mesg,type: 'warning'});
                }
            })
        },
    }
};
</script>

<style scoped lang='less'>
@border-color:#DCDFE6;
#coupons{
    .lab_list{
        span{
            border: 1px solid @border-color;    
            border-radius: 4px;
            padding: 1px 10px;
            margin-right: 20px;
        }
    }
    .com_del{
        width: 50%;
        border-radius: 4px;
        border: 1px solid @border-color;
        padding: 10px;
    }
    .com_del_box{
        overflow:hidden; 
        text-overflow:ellipsis;
        display:-webkit-box; 
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2; 
    }
    .lab_span{
        border: 1px solid #7a7a7a;
        border-radius: 4px;
        margin-right: 10px;
        padding: 1px 10px;
    }
    .handle-box {
        margin-bottom: 20px;
    }
    .mr10 {
        margin-right: 10px;
    }
    .handle-input {
        width: 200px;
        display: inline-block;
    }
    .red {
        color: #ff0000;
    }
    .in_act{
        margin-left: 60px;
        .add_con{
            
            line-height: 32px;
            .tt{
                margin-right: 10px;
            }
            .num{
                height: 32px;
                margin-right: 30px;
            }
       
            .el-input-group{
                width: 100px;
            }
            /deep/ .el-input-group__append{
                padding: 0 10px;
            }
            i{
                cursor: pointer;
            }
        }
        .addCou{
            height: 32px;
            cursor: pointer;
        }
        .el-form-item--small{
            margin-bottom: 30px;
        }

        .block{
            margin-top: 20px;
        }
    }
}

/deep/.table-td-thumb {
    display: inline-block;
    margin: auto;
    width: 80px;
    height: 80px;
    margin-right: 10px;
}
/deep/ .el-dialog{
    width: 55%;
    min-width:850px ;
}
/deep/ .el-dialog__body{
    padding-top: 10px;
}
/deep/ .el-dialog__header{
    padding: 0;
}
/deep/ .el-image-viewer__close{
    color: white;
}
</style>
