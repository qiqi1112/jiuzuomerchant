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
            >
                <el-table-column prop="id" label="ID" fixed width="180" align="center"></el-table-column>
                <el-table-column prop="title" min-width="200" label="访问标题"></el-table-column>
                <el-table-column prop="uri" min-width="300" label="访问地址"></el-table-column>  
                <el-table-column prop="result" min-width="200" label="备注说明"></el-table-column>
                <!-- <el-table-column prop="order_state" min-width="100" label="访问次数"></el-table-column> -->
                <el-table-column prop="ip" min-width="200" label="最近访问IP"></el-table-column>
                <el-table-column prop="createTime" min-width="200" label="最近访问时间"></el-table-column>  
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
                pageSize: 20,
                tel:'',
            },
            tableData: [],
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
    },
    methods: {
        getData() {
            let data = {
                pageSize: this.query.pageSize,
                pageNo:this.query.pageIndex,
            }
            this.$post('/merchant/store/log/logLimit',data).then((res) => {
                this.tableData = res.data.list
                this.pageTotal = res.data.total
            })
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
