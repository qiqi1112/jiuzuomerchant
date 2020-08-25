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
                <el-input v-model="searchName" placeholder="用户昵称" class="handle-input mr10"></el-input>
                <el-select v-model="value1" placeholder="收藏本店" style="width:100px" class="mr10">
                    <el-option
                        v-for="item in options1"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-select v-model="value2" placeholder="本店会员" style="width:100px" class="mr10">
                    <el-option
                        v-for="item in options2"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <!-- 表格部分 -->
            <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
            >
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
                <el-table-column label="操作" fixed="right" min-width="80">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="lookInfo(scope.$index, scope.row)"
                        >查看</el-button>
                        <!-- <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            @click="handleDelete(scope.$index, scope.row)"
                        >删除</el-button>-->
                    </template>
                </el-table-column>
            </el-table>

            <!-- 对话框 -->
            <el-dialog title="用户信息" :visible.sync="dialogFormVisible">
                <!-- <el-form :model="form" :rules="rules" ref="form">
                    <el-form-item label="用户昵称" :label-width="formLabelWidth">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户手机" :label-width="formLabelWidth" prop="number">
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
                    <el-form-item label="本店累计消费金额" :label-width="formLabelWidth" prop="conMoney">
                        <el-input v-model="form.conMoney"></el-input>
                    </el-form-item>
                </el-form>-->
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="sure('form')">确 定</el-button>
                    <!-- <el-button @click="handleCancel('form')">取 消</el-button> -->
                    <!-- <el-button type="primary" @click="submitForm('form')">确 定</el-button> -->
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
        return {
            // 头部模块---------------------------------------
            searchName: '', //用户昵称输入框
            options1: [
                {
                    value: '不限',
                    label: '不限'
                },
                {
                    value: '是',
                    label: '是'
                },
                {
                    value: '否',
                    label: '否'
                }
            ],
            value1: '',
            options2: [
                {
                    value: '不限',
                    label: '不限'
                },
                {
                    value: '是',
                    label: '是'
                },
                {
                    value: '否',
                    label: '否'
                }
            ],
            value2: '',

            // 表格相关属性------------------------------------
            tableData: [
                {
                    name: '张三1',
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
                    name: '张三2',
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
                    name: '张三3',
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
                    name: '张三4',
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
                    name: '张三5',
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
                    name: '张三6',
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
                    name: '张三7',
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
                    name: '张三8',
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
                    name: '张三9',
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
                    name: '张三10',
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
                    name: '张三11',
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
                    name: '张三12',
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
            // multipleSelection: [], //勾选中的信息数组

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
            formLabelWidth: '160px' //表单标题的宽度

            //验证规则------------------------------------------
            // rules: {
            //     conNum: [{ validator: checkConNum, trigger: 'blur' }],
            //     AANum: [{ validator: checkAANum, trigger: 'blur' }],
            //     reserveNum: [{ validator: checkReserveNum, trigger: 'blur' }],
            //     rowNum: [{ validator: checkRowNum, trigger: 'blur' }],
            //     vaildNum: [{ validator: checkVaildNum, trigger: 'blur' }],
            //     cancelNum: [{ validator: checkCancelNum, trigger: 'blur' }],
            //     evalNum: [{ validator: checkEvalNum, trigger: 'blur' }],
            //     visitNum: [{ validator: checkVisitNum, trigger: 'blur' }],
            //     number: [{ validator: checkNumber, trigger: 'blur' }],
            //     conMoney: [{ validator: checkMoney, trigger: 'blur' }]
            // }
        };
    },

    methods: {
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

        //查看按钮
        lookInfo(index, row) {
            this.dialogFormVisible = true;
        },

        //搜索按钮
        handleSearch() {
            let searchName = this.searchName;
            if (searchName) {
                // this.tableData.filter(item => {
                //     if(item.name == searchName) {
                //         this.tableData = item;
                //     }
                //     return item
                // });

                let fragArr = [];
                this.tableData.forEach((item, i) => {
                    if (item.name.indexOf(searchName) !== -1) {
                        console.log('xxx', item);
                        // this.tableData.slice(0,3);

                        fragArr.push(item);
                        // this.tableData.push(item);
                    }
                });
                this.tableData = [];
                this.tableData = fragArr;

                console.log(this.tableData);
            }

            this.searchName = ''; //清空输入框
        },

        //对话框里的确认按钮
        sure() {
            this.dialogFormVisible = false;
        }

        //批量删除操作
        // delAllSelection() {
        //     this.$message.success(`删除成功`);
        // },

        //添加按钮
        // addInfo() {
        //     this.dialogFormVisible = true;
        // },

        //勾选中的数据
        // handleSelectionChange(val) {
        //     this.multipleSelection = val;
        //     console.log(val);
        // },

        //清空表单属性值
        // emptyForm() {
        //     this.form.name = '';
        //     this.form.number = '';
        //     this.form.conNum = '';
        //     this.form.AANum = '';
        //     this.form.reserveNum = '';
        //     this.form.rowNum = '';
        //     this.form.vaildNum = '';
        //     this.form.cancelNum = '';
        //     this.form.collect = '';
        //     this.form.evalNum = '';
        //     this.form.visitNum = '';
        //     this.form.conDate = '';
        //     this.form.visitDate = '';
        //     this.form.conMoney = '';
        // },

        //对话框关闭的操作
        // handleClose() {
        // this.emptyForm();
        // this.$refs['form'].resetFields();
        // },

        //编辑按钮
        // handleEdit(index, row) {
        //     this.dialogFormVisible = true;
        //     this.rowNumber = index; //当前编辑的是第几行
        //     //回显数据
        //     this.form.name = row.name;
        //     this.form.number = row.number;
        //     this.form.conNum = row.conNum;
        //     this.form.AANum = row.AANum;
        //     this.form.reserveNum = row.reserveNum;
        //     this.form.rowNum = row.rowNum;
        //     this.form.vaildNum = row.vaildNum;
        //     this.form.cancelNum = row.cancelNum;
        //     this.form.collect = row.collect;
        //     this.form.evalNum = row.evalNum;
        //     this.form.visitNum = row.visitNum;
        //     this.form.conDate = row.conDate;
        //     this.form.visitDate = row.visitDate;
        //     this.form.conMoney = row.conMoney;
        // },

        //删除按钮
        // handleDelete(index, row) {
        //     console.log(index, row);
        //     if (confirm('确定要删除吗')) {
        //         this.tableData.splice(index, 1);
        //     }
        // },

        //对话框里的取消按钮
        // handleCancel(formName) {
        //     this.$refs[formName].resetFields();
        //     this.emptyForm();
        //     this.dialogFormVisible = false;
        // },

        //对话框里的确认按钮
        // submitForm(formName) {
        //     // this.tableData[this.rowNumber].name = this.form.name;
        //     // this.tableData[this.rowNumber].number = this.form.number;
        //     // this.tableData[this.rowNumber].conNum = this.form.conNum;
        //     // this.tableData[this.rowNumber].AANum = this.form.AANum;
        //     // this.tableData[this.rowNumber].reserveNum = this.form.reserveNum;
        //     // this.tableData[this.rowNumber].rowNum = this.form.rowNum;
        //     // this.tableData[this.rowNumber].vaildNum = this.form.vaildNum;
        //     // this.tableData[this.rowNumber].cancelNum = this.form.cancelNum;
        //     // this.tableData[this.rowNumber].collect = this.form.collect;
        //     // this.tableData[this.rowNumber].evalNum = this.form.evalNum;
        //     // this.tableData[this.rowNumber].visitNum = this.form.visitNum;
        //     // this.tableData[this.rowNumber].conDate = this.form.conDate;
        //     // // this.tableData[this.rowNumber].conDate = this.$timestampToTime(this.form.conDate.getTime());
        //     // this.tableData[this.rowNumber].visitDate = this.form.visitDate;
        //     // this.tableData[this.rowNumber].conMoney = this.form.conMoney;

        //     // console.log('zzzz', this.$timestampToTime(this.form.conDate.getTime()));

        //     this.$refs[formName].validate((valid) => {
        //         if (valid) {
        //             alert('submit!');

        //             this.emptyForm();
        //             this.dialogFormVisible = false;
        //         } else {
        //             console.log('error submit!!');
        //             return false;
        //         }
        //     });
        // }
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
    width: 170px;
    display: inline-block;
}

.mr10 {
    margin-right: 10px;
}
</style>