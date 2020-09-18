<template>
    <div id="order_msg">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 操作日志
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-download" class="handle-del mr10" @click="handleEdit()" >Excel导出</el-button>
            </div>
            <el-table 
                :data="tableData" border class="table" 
                ref="multipleTable" 
                header-cell-class-name="table-header" 
                @row-dblclick="lineDb"
            >
                <el-table-column prop="id" label="ID" fixed width="80" align="center"></el-table-column>
                <el-table-column prop="order_id" min-width="120" label="角色"></el-table-column>
                <el-table-column prop="user_name" min-width="200" label="访问标题"></el-table-column>
                <el-table-column prop="order_type" min-width="300" label="访问地址"></el-table-column>  
                <el-table-column prop="tel" min-width="200" label="备注说明"></el-table-column>
                <el-table-column prop="order_state" min-width="100" label="访问次数"></el-table-column>
                <el-table-column prop="creat_time" min-width="200" label="最近访问IP"></el-table-column>
                <el-table-column prop="remark" min-width="200" label="最近访问时间"></el-table-column>  
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
            id: -1,
            formData:[],
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
/deep/.handle-input{
    width: 150px;
}
</style>
