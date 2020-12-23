<template>
    <div id="comments">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-text"></i> 评论管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="query.text" placeholder="关键字" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @row-dblclick="lineDb"
            >
                <el-table-column label="ID" fixed type="index"></el-table-column>
                <el-table-column prop="userName" min-width="150" label="评论用户"></el-table-column>
                <el-table-column prop="content" min-width="280" label="评论详情">
                    <template slot-scope="scope">
                        <div class="com_del_box">
                            {{ scope.row.content }}
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="评论缩略图" align="center" min-width="320">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            v-for="(item, index) in scope.row.appraisePictureList"
                            :key="index"
                            :src="imgHead + item"
                        ></el-image>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="appraiseLevel" min-width="80" label="打分"></el-table-column>
                <el-table-column prop="com_label" min-width="200" label="标签">
                    <template slot-scope="scope">
                        <div class="com_del_box">
                            <span v-for="(item, index) in scope.row.labels" :key="index">
                                <span class="lab_span" v-if="item">{{ item }}</span>
                            </span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" align="center" min-width="180" label="评论日期"></el-table-column>
                <el-table-column label="操作" width="100" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
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
            <el-form ref="form" :model="form" label-width="90px" label-position="left">
                <div class="column">
                    <span class="line lw2"></span>
                    <span>评论详情</span>
                </div>

                <div class="top_info">
                    <div class="activity">
                        <div class="in_act">
                            <el-form-item label="评论用户">
                                <div>{{ form.userName }}</div>
                            </el-form-item>
                            <el-form-item label="打分">
                                <div>{{ form.appraiseLevel }}</div>
                            </el-form-item>
                            <el-form-item label="评论时间">
                                <div>{{ form.createTime }}</div>
                            </el-form-item>
                            
                            <el-form-item label="标签" v-if="form.labels">
                                <div class="lab_list">
                                    <span v-for="(lab, index) in form.labels" :key="index">{{ lab }}</span>
                                </div>
                            </el-form-item>
                            <el-form-item label="评论内容">
                                <div class="com_del">{{ form.content }}</div>
                            </el-form-item>
                            <el-form-item label="配图/视频：" v-if="form.appraisePictureList">
                                <div class="imgs">
                                    <div v-for="(item, i) in form.appraisePictureList" :key="i">
                                        <img v-if="item.substr(item.length - 3) != 'mp4'" :src="imgHead + item" />
                                        <video v-else width="320" height="200" controls class="video">
                                            <source :src="imgHead + item" type="video/mp4" />
                                            您的浏览器不支持 video 标签。
                                        </video>
                                    </div>
                                </div>
                            </el-form-item>
                            <div class="look_more" @click="moreComs" v-if="!more">查看评论</div>
                            <div class="look_more" v-if="more" @click="more = false">收回评论</div>
                            <div class="coms_box" v-if="more">
                                <div class="reply_num">回复（{{ coms_total }}）：</div>
                                <div class="coms">
                                    <div v-for="(item, index) in coms_list" :key="index" class="com_li">
                                        <div class="com_top">
                                            <div class="user">
                                                <span class="user_name">{{ item.userName }}</span>
                                                <span class="com_time">{{ item.createTime }}</span>
                                            </div>
                                            <div class="like">
                                                <i class="iconfont icon-dianzan"></i>
                                                <span class="like_num">{{ item.fabulous }}</span>
                                                <span>{{ index + 1 }}楼</span>
                                            </div>
                                        </div>
                                        <div class="com_text">
                                            <span>{{ item.comment }}</span>
                                            <template v-if="item.childList.length > 0">
                                                <div v-for="(child, i) in item.childList" :key="i" class="child_com">
                                                    <div class="com_text">
                                                        <span class="reply" v-if="child.userId == child.master">楼主回复:</span>
                                                        <span class="reply" v-else>{{ child.userName }}:</span>
                                                        <span>{{ child.comment }}</span>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editVisible = false">返回</el-button>
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
                pageSize: 20,
                tel: ''
            },
            com: {
                pageIndex: 1,
                pageSize: 200
            },
            imgHead: this.$imgHead,
            doing: '',
            form: {},
            pageTotal: null,
            editVisible: false,
            tableData: [],
            coms_list: [], //子评论列表
            more: false,
            coms_total: '' //子评论总数
        };
    },
    created() {
        this.getData();
    },
    methods: {
        getData() {
            let data = {
                pageNo: this.query.pageIndex,
                pageSize: this.query.pageSize,
                keywords: this.query.text
            };
            this.$post('/merchant/store/appraise/appraiseListByStoreId', data).then((res) => {
                if (res.code == 0) {
                    let lab = '';
                    res.data.list.forEach((i) => {
                        lab = i.labels.split(',');
                        this.$set(i, 'labels', lab);
                    });
                    this.tableData = res.data.list;
                    this.pageTotal = res.data.total;
                } else {
                    this.$message({ message: res.mesg, type: 'warning' });
                }
            });
        },
        // 触发搜索按钮
        handleSearch() {
            // if(!this.query.text){
            //     this.$message.error('请输入关键字');
            //     return
            // }
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 编辑操作
        handleEdit(index = '', row = '') {
            this.more = false;
            this.$get(`/merchant/store/appraise/getById/${row.id}`).then((res) => {
                console.log(res)
                if (res.code == 0) {
                    res.data.labels = res.data.labels.split(',');
                    this.editVisible = true;
                    this.idx = index;
                    this.form = res.data;
                } else {
                    this.$message.error(res.data);
                }
            });
            // this.form = {};
            // if (row) {
            //     this.idx = index;
            //     this.form = this.$regular.deep(row);
            // }
            // this.editVisible = true;
        },
        // 双击某一行
        lineDb(row, column, event) {
            this.form = {};
            if (row) {
                this.form = this.$regular.deep(row);
            }
            this.editVisible = true;
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        },
        // 查看帖子详情
        moreComs() {
            let data = {
                pageNo: this.com.pageIndex,
                pageSize: this.com.pageSize,
                aid: this.form.id
            };
            this.$post(`/merchant/store/appraise/firstList`, data).then((res) => {
                if (res.code == 0) {
                    this.more = true;
                    this.coms_list = res.data.list;
                    this.coms_total = res.data.total;
                } else {
                    this.$message.error(res.msg);
                }
            });
        }
    }
};
</script>

<style scoped lang='less'>
@border-color: #7a7a7a;
#comments {
    .lab_list {
        span {
            border: 1px solid @border-color;
            border-radius: 4px;
            padding: 1px 10px;
            margin-right: 20px;
        }
    }
    .com_del {
        width: 50%;
        border-radius: 4px;
        border: 1px solid @border-color;
        padding: 10px;
    }
    .com_del_box {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
    .imgs{
        &>div{
            display: inline-block;
            height:200px;
            img,.video{
                height:200px;
                width:auto;
                margin-right:12px;
                border-radius: 6px;
            }
        }
    }
    .lab_span {
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
    .look_more {
        padding-left: 90px;
        cursor: pointer;
        &:hover {
            color: #409eff;
        }
    }
    .coms_box {
        height: 300px;
        overflow-y: scroll;
        .reply_num {
            line-height: 42px;
        }
        .coms {
            margin-left: 30px;
            padding-right: 40px;
            .com_li {
                padding-bottom: 12px;
                margin-bottom: 12px;
                border-bottom: 1px solid #999;
                .com_top {
                    display: flex;
                    margin-bottom: 8px;
                    font-size: 14px;
                    .user {
                        flex: 1;
                        .user_name {
                            margin-right: 24px;
                        }
                        .com_time {
                            color: #bbb;
                        }
                    }
                    .like {
                        flex: 1;
                        text-align: right;
                        .like_num {
                            margin: 0 30px 0 8px;
                        }
                    }
                }
                .com_text {
                    font-size: 14px;
                    position: relative;
                    .iconfont {
                        position: absolute;
                        left: -25px;
                        cursor: pointer;
                    }
                    .icon-dui {
                        color: #409eff;
                    }
                    .child_com {
                        margin-top: 10px;
                    }
                    .reply {
                        color: #409eff;
                        margin-right: 15px;
                    }
                }
            }
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
/deep/ .el-dialog {
    width: 55%;
    min-width: 850px;
}
/deep/ .el-dialog__body {
    padding-top: 10px;
}
/deep/ .el-dialog__header {
    padding: 0;
}
/deep/ .el-image-viewer__close {
    color: white;
}
</style>
