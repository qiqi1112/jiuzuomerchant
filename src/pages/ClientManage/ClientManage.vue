<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 客户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 头部模块 -->
            <div class="handle-box">
                <el-button
                    type="primary"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="delAllSelection"
                >批量删除</el-button>
                <el-button
                    type="success"
                    icon="el-icon-delete"
                    class="handle-del mr10"
                    @click="addInfo"
                >添加</el-button>
                <el-input v-model="searchVal" placeholder="请输入" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <!-- 表格部分 -->
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection"></el-table-column>
                <el-table-column label="编号" type="index" fixed></el-table-column>
                <el-table-column prop="name" label="用户昵称"></el-table-column>
                <el-table-column label="用户手机" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.number | phoneNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="conNum" label="到店消费次数" min-width="100"></el-table-column>
                <el-table-column prop="AANum" label="AA拼单次数" min-width="90"></el-table-column>
                <el-table-column prop="reserveNum" label="预定桌消费次数" min-width="110"></el-table-column>
                <el-table-column prop="rowNum" label="排号次数"></el-table-column>
                <el-table-column prop="vaildNum" label="生效排号次数" min-width="100"></el-table-column>
                <el-table-column prop="cancelNum" label="取消排号次数" min-width="100"></el-table-column>
                <el-table-column prop="collect" label="是否收藏本店" min-width="100"></el-table-column>
                <el-table-column prop="evalNum" label="评价次数"></el-table-column>
                <el-table-column prop="visitNum" label="访问店铺次数" min-width="100"></el-table-column>
                <el-table-column prop="conDate" label="最近一次消费时间" min-width="135"></el-table-column>
                <el-table-column prop="visitDate" label="最近一次访问店铺时间" min-width="135"></el-table-column>
                <el-table-column prop="conMoney" label="本店累计消费金额" min-width="75"></el-table-column>
                <el-table-column label="操作" fixed="right" min-width="160">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 对话框 -->
            <el-dialog title="修改信息" :visible.sync="dialogFormVisible" @close="handleClose">
                <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="用户昵称" :label-width="formLabelWidth">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户手机" :label-width="formLabelWidth">
                        <el-input v-model.number="form.number"></el-input>
                    </el-form-item>
                    <el-form-item label="到店消费次数" :label-width="formLabelWidth" prop="conNum">
                        <el-input v-model.number="form.conNum"></el-input>
                    </el-form-item>
                    <el-form-item label="AA拼单次数" :label-width="formLabelWidth" prop="AANum">
                        <el-input v-model.number="form.AANum"></el-input>
                    </el-form-item>
                    <el-form-item label="预定桌消费次数" :label-width="formLabelWidth" prop="reserveNum">
                        <el-input v-model.number="form.reserveNum"></el-input>
                    </el-form-item>
                    <el-form-item label="排号次数" :label-width="formLabelWidth" prop="rowNum">
                        <el-input v-model.number="form.rowNum"></el-input>
                    </el-form-item>
                    <el-form-item label="生效排号次数" :label-width="formLabelWidth" prop="vaildNum">
                        <el-input v-model.number="form.vaildNum"></el-input>
                    </el-form-item>
                    <el-form-item label="取消排号次数" :label-width="formLabelWidth" prop="cancelNum">
                        <el-input v-model.number="form.cancelNum"></el-input>
                    </el-form-item>
                    <el-form-item label="是否收藏本店" :label-width="formLabelWidth">
                        <el-select v-model="form.collect" placeholder="请选择" style="width:100%">
                            <el-option label="是" value="1"></el-option>
                            <el-option label="否" value="0"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="评价次数" :label-width="formLabelWidth" prop="evalNum">
                        <el-input v-model.number="form.evalNum"></el-input>
                    </el-form-item>
                    <el-form-item label="访问店铺次数" :label-width="formLabelWidth" prop="visitNum">
                        <el-input v-model.number="form.visitNum"></el-input>
                    </el-form-item>
                    <el-form-item label="最近一次消费时间" :label-width="formLabelWidth">
                        <el-date-picker
                            v-model="form.conDate"
                            type="datetime"
                            placeholder="选择日期时间"
                            style="width:100%"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="最近一次访问店铺时间" :label-width="formLabelWidth">
                        <el-date-picker
                            v-model="form.visitDate"
                            type="datetime"
                            placeholder="选择日期时间"
                            style="width:100%"
                        ></el-date-picker>
                    </el-form-item>
                    <el-form-item label="本店累计消费金额" :label-width="formLabelWidth">
                        <el-input v-model="form.conMoney"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="handleCancel">取 消</el-button>
                    <el-button type="primary" @click="handleSure">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 分页 -->
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="dataListCount"
                :current-page="currentPage"
                :page-size="pagesize"
                class="page"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        //表单验证规则函数
        let checkConNum = (rule, value, callback) => {
            if (!value) {
                if (value == 0) {
                    callback();
                } else {
                    return callback(new Error('到店消费次数不能为空'));
                }
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数值'));
                } else {
                    callback();
                }
            }, 1000);
        };

        let checkAANum = (rule, value, callback) => {
            if (!value) {
                if (value == 0) {
                    callback();
                } else {
                    return callback(new Error('AA拼单次数不能为空'));
                }
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数值'));
                } else {
                    callback();
                }
            }, 1000);
        };

        let checkReserveNum = (rule, value, callback) => {
            if (!value) {
                if (value == 0) {
                    callback();
                } else {
                    return callback(new Error('预定桌消费次数不能为空'));
                }
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数值'));
                } else {
                    callback();
                }
            }, 1000);
        };

        let checkRowNum = (rule, value, callback) => {
            if (!value) {
                if (value == 0) {
                    callback();
                } else {
                    return callback(new Error('排号次数不能为空'));
                }
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数值'));
                } else {
                    callback();
                }
            }, 1000);
        };

        let checkVaildNum = (rule, value, callback) => {
            if (!value) {
                if (value == 0) {
                    callback();
                } else {
                    return callback(new Error('生效排号次数不能为空'));
                }
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数值'));
                } else {
                    callback();
                }
            }, 1000);
        };

        let checkCancelNum = (rule, value, callback) => {
            if (!value) {
                if (value == 0) {
                    callback();
                } else {
                    return callback(new Error('取消排号次数不能为空'));
                }
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数值'));
                } else {
                    callback();
                }
            }, 1000);
        };

        let checkEvalNum = (rule, value, callback) => {
            if (!value) {
                if (value == 0) {
                    callback();
                } else {
                    return callback(new Error('评价次数不能为空'));
                }
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数值'));
                } else {
                    callback();
                }
            }, 1000);
        };

        let checkVisitNum = (rule, value, callback) => {
            if (!value) {
                if (value == 0) {
                    callback();
                } else {
                    return callback(new Error('访问店铺次数不能为空'));
                }
            }
            setTimeout(() => {
                if (!Number.isInteger(value)) {
                    callback(new Error('请输入整数值'));
                } else {
                    callback();
                }
            }, 1000);
        };

        return {
            // 头部模块---------------------------------------
            searchVal: '',

            // 表格相关属性------------------------------------
            tableData: [
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                },
                {
                    name: '你说的覅好久开始',
                    number: '14781828227',
                    AANum: '289',
                    conNum: '292',
                    reserveNum: '282',
                    rowNum: '322',
                    vaildNum: '229',
                    cancelNum: '322',
                    collect: '是',
                    evalNum: '283',
                    visitNum: '384',
                    conDate: '2018-04-12 20:46',
                    visitDate: '2018-04-12 20:46',
                    conMoney: '2899.99'
                }
            ],
            multipleSelection: [], //勾选中的信息数组
            rowNumber: 0,

            // 分页相关属性------------------------------------
            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 10, //默认每页要显示多少条数据

            // 对话框相关属性-----------------------------------
            dialogFormVisible: false, //对话框的开启与隐藏
            //表单属性
            form: {
                name: '',
                number: '',
                conNum: '',
                AANum: '',
                reserveNum: '',
                rowNum: '',
                vaildNum: '',
                cancelNum: '',
                collect: '',
                evalNum: '',
                visitNum: '',
                conDate: '',
                visitDate: '',
                conMoney: ''
            },
            formLabelWidth: '160px', //表单标题的宽度

            //验证规则------------------------------------------
            rules: {
                conNum: [{ validator: checkConNum, trigger: 'blur' }],
                AANum: [{ validator: checkAANum, trigger: 'blur' }],
                reserveNum: [{ validator: checkReserveNum, trigger: 'blur' }],
                rowNum: [{ validator: checkRowNum, trigger: 'blur' }],
                vaildNum: [{ validator: checkVaildNum, trigger: 'blur' }],
                cancelNum: [{ validator: checkCancelNum, trigger: 'blur' }],
                evalNum: [{ validator: checkEvalNum, trigger: 'blur' }],
                visitNum: [{ validator: checkVisitNum, trigger: 'blur' }]
            }
        };
    },

    methods: {
        //勾选中的数据
        handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val);
        },

        // 页码发生变化后
        handleCurrentChange(val) {
            //将当前跳转的页码赋给显在页面上的页码
            this.currentPage = val;

            if (this.isSearchObj == false) {
                //请求相关数据，实现页面数据变化
                this.ajax1(this.currentPage);
            } else {
                //根据页码的改变，要显示的数据也跟着改变
                this.tableData = this.searchData.slice((this.currentPage - 1) * this.pagesize, this.currentPage * this.pagesize);
            }
        },

        //清空表单属性值
        emptyForm() {
            this.form.name = '';
            this.form.number = '';
            this.form.conNum = '';
            this.form.AANum = '';
            this.form.reserveNum = '';
            this.form.rowNum = '';
            this.form.vaildNum = '';
            this.form.cancelNum = '';
            this.form.collect = '';
            this.form.evalNum = '';
            this.form.visitNum = '';
            this.form.conDate = '';
            this.form.visitDate = '';
            this.form.conMoney = '';
        },

        //编辑按钮
        handleEdit(index, row) {
            this.dialogFormVisible = true;
            this.rowNumber = index; //当前编辑的是第几行
            //回显数据
            this.form.name = row.name;
            this.form.number = row.number;
            this.form.conNum = row.conNum;
            this.form.AANum = row.AANum;
            this.form.reserveNum = row.reserveNum;
            this.form.rowNum = row.rowNum;
            this.form.vaildNum = row.vaildNum;
            this.form.cancelNum = row.cancelNum;
            this.form.collect = row.collect;
            this.form.evalNum = row.evalNum;
            this.form.visitNum = row.visitNum;
            this.form.conDate = row.conDate;
            this.form.visitDate = row.visitDate;
            this.form.conMoney = row.conMoney;
        },

        //对话框关闭的操作
        handleClose() {
            this.emptyForm();
        },

        //批量删除操作
        delAllSelection() {
            this.$message.success(`删除成功`);
        },

        //添加按钮
        addInfo() {
            this.dialogFormVisible = true;
            this.tableData.push({
                name: this.form.name,
                number: this.form.number,
                AANum: this.form.AANum,
                conNum: this.form.conNum,
                reserveNum: this.form.reserveNum,
                rowNum: this.form.rowNum,
                vaildNum: this.form.vaildNum,
                cancelNum: this.form.cancelNum,
                collect: this.form.collect,
                evalNum: this.form.evalNum,
                visitNum: this.form.visitNum,
                conDate: this.form.conDate,
                visitDate: this.form.visitDate,
                conMoney: this.form.conMoney
            });
        },

        //搜索按钮
        handleSearch() {
            console.log(this.searchVal);
        },

        //删除按钮
        handleDelete(index, row) {
            console.log(index, row);
            if (confirm('确定要删除吗')) {
                this.tableData.splice(index, 1);
            }
        },

        //对话框里的取消按钮
        handleCancel() {
            this.emptyForm();
            this.dialogFormVisible = false;
        },

        //对话框里的确认按钮
        handleSure() {
            this.tableData[this.rowNumber].name = this.form.name;
            this.tableData[this.rowNumber].number = this.form.number;
            this.tableData[this.rowNumber].conNum = this.form.conNum;
            this.tableData[this.rowNumber].AANum = this.form.AANum;
            this.tableData[this.rowNumber].reserveNum = this.form.reserveNum;
            this.tableData[this.rowNumber].rowNum = this.form.rowNum;
            this.tableData[this.rowNumber].vaildNum = this.form.vaildNum;
            this.tableData[this.rowNumber].cancelNum = this.form.cancelNum;
            this.tableData[this.rowNumber].collect = this.form.collect;
            this.tableData[this.rowNumber].evalNum = this.form.evalNum;
            this.tableData[this.rowNumber].visitNum = this.form.visitNum;
            this.tableData[this.rowNumber].conDate = this.$timestampToTime(this.form.conDate.getTime());
            this.tableData[this.rowNumber].visitDate = this.form.visitDate;
            this.tableData[this.rowNumber].conMoney = this.form.conMoney;

            console.log('zzzz', this.$timestampToTime(this.form.conDate.getTime()));

            this.emptyForm();
            this.dialogFormVisible = false;
        },
    }
};
</script>

<style>
.el-table td,
.el-table th {
    text-align: center !important;
}

.page {
    text-align: right;
    margin-top: 20px;
}

.handle-box {
    margin-bottom: 20px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.mr10 {
    margin-right: 10px;
}
</style>