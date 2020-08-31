<template>
    <div id="comments">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-text"></i> 评论管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.text" placeholder="关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table 
                :data="tableData" border class="table" 
                ref="multipleTable" 
                header-cell-class-name="table-header" 
                @row-dblclick="lineDb"
            >
                <el-table-column prop="id" label="ID" fixed width="80" align="center"></el-table-column>
                <el-table-column prop="user_name" min-width="100" label="评论用户"></el-table-column>
                <el-table-column prop="com_detail" min-width="280" label="评论详情">
                    <template slot-scope="scope">
                        <div class="com_del_box">
                            {{scope.row.com_detail}}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="评论缩略图" align="center" min-width="220">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            v-for="(item,index) in scope.row.com_img_list" :key="index"
                            :src="item"
                            :preview-src-list="scope.row.com_img_list"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="star" min-width="80" label="打分"></el-table-column>  
                <el-table-column prop="com_label" min-width="200" label="标签"></el-table-column>
                <el-table-column prop="com_time" align="center" min-width="150" label="评论日期"></el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >查看</el-button>
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
            <el-form ref="form" :model='form'  label-width="90px" label-position="left">
                <div class="column">
                    <span class="line lw2"></span>
                    <span>评论详情</span>
                </div>

                <div class="top_info">
                    <div class="activity">
                        <div class="in_act">
                            <el-form-item label="评论用户" >
                                <div>{{form.user_name}}</div>
                            </el-form-item>
                            <el-form-item label="打分">
                                <div>{{form.star}}</div>
                            </el-form-item>
                            <el-form-item label="评论时间">
                                <div>{{form.com_time}}</div>
                            </el-form-item>
                            <el-form-item label="标签">
                                <div class="lab_list">
                                    <span v-for="(lab,index) in form.com_label" :key="index">{{lab}}</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="评论内容">
                                <div class="com_del">{{form.com_detail}}</div>
                            </el-form-item>
                            <el-form-item label="评论配图">
                                <div class="img_list">
                                    <el-image
                                        style="width: 150px; height: 150px;margin-right:20px"
                                        class="table-td-thumb"
                                        v-for="(img,index) in form.com_img_list" :key="index"
                                        :src="img"
                                        :preview-src-list="form.com_img_list"
                                    ></el-image>
                                </div>
                            </el-form-item>
                        </div>                   
                    </div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible=false">返回</el-button>
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
                tel:'',
            },
            doing:'',
            form: {},
            pageTotal:null,
            editVisible:false,
            tableData: [
                {
                    id:1,
                    user_name:'张三',
                    com_detail:'艾萨拉桑德兰三菱电机阿拉斯萨拉桑德兰三菱电机阿拉斯萨拉桑德兰三菱电机阿拉斯萨拉桑德兰三菱电机阿拉斯加动力技术的窘境1解耦i距离尽量加快了交流空间离开家了j',
                    com_img_list:['img/2.jpg','img/3.jpg','img/4.jpg'],
                    star:'5.0',
                    com_label:['氛围好','环境好','实惠'],
                    com_time:'2020-11-11',
                },
                {
                    id:2,
                    user_name:'李四',
                    com_detail:'快速的疯狂数独克里夫丝毫覅你噢然后和互惠互利海澜423卡将康佳4可及4看来3加可健康将开4',
                    com_img_list:['img/timg.jpg','img/5.jpg'],
                    star:'4.7',
                    com_label:['氛围好','实惠'],
                    com_time:['2020-11-11'],
                },
            ],
        };
    },
    created() {
        this.getData();
        this.pageTotal = this.tableData.length
    },
    methods: {
        getData() {
            
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
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
#comments{
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
