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
                <el-select v-model="collectVal" placeholder="收藏本店" style="width:100px" class="mr10">
                    <el-option
                        v-for="item in collectValOpt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-select v-model="isVipVal" placeholder="本店会员" style="width:100px" class="mr10">
                    <el-option
                        v-for="item in isVipOpt"
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
                <el-table-column label="ID" type="index" fixed></el-table-column>
                <el-table-column prop="name" label="用户昵称"></el-table-column>
                <el-table-column label="用户手机" min-width="100">
                    <template slot-scope="scope">
                        <span>{{scope.row.number | phoneNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="isVip" label="本店会员" min-width="80"></el-table-column>
                <el-table-column prop="AANum" label="AA拼单次数" min-width="90"></el-table-column>
                <el-table-column prop="reserveNum" label="预定桌消费次数" min-width="110"></el-table-column>
                <el-table-column prop="rowNum" label="排号次数"></el-table-column>
                <el-table-column prop="vaildNum" label="生效排号次数" min-width="100"></el-table-column>
                <el-table-column prop="cancelNum" label="取消排号次数" min-width="100"></el-table-column>
                <el-table-column prop="collect" label="是否收藏本店" min-width="100"></el-table-column>
                <el-table-column prop="evalNum" label="评价次数"></el-table-column>
                <el-table-column prop="visitNum" label="访问店铺次数" min-width="100"></el-table-column>
                <el-table-column prop="conDate" label="最近一次消费时间" min-width="135"></el-table-column>
                <el-table-column prop="visitDate" label="最近一次访问时间" min-width="135"></el-table-column>
                <el-table-column prop="conMoney" label="本店累计消费金额" min-width="135"></el-table-column>
                <el-table-column label="操作" fixed="right" min-width="80">
                    <template slot-scope="scope">
                        <el-button
                            type="primary"
                            size="mini"
                            @click="lookInfo(scope.$index, scope.row)"
                        >查看</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 对话框 -->
            <el-dialog :visible.sync="dialogFormVisible">
                <span class="add-classify-title">用户信息</span>
                <div class="basic-info">
                    <div>
                        <p>
                            <span>昵称：</span>
                            <span>{{userInfo.name}}</span>
                        </p>
                        <p>
                            <span>手机：</span>
                            <span>{{userInfo.number}}</span>
                        </p>
                    </div>
                    <div>
                        <p>
                            <span>本店会员：</span>
                            <span>{{userInfo.isVip}}</span>
                        </p>
                        <p>
                            <span>收藏本店：</span>
                            <span>{{userInfo.collect}}</span>
                        </p>
                        <p>
                            <span>累计消费：</span>
                            <span>{{userInfo.conMoney}}</span>
                        </p>
                    </div>
                </div>

                <!-- 对话框里的标签页 -->
                <el-tabs
                    style="margin-top:20px"
                    v-model="activeName"
                    type="border-card"
                    @tab-click="handleClick"
                >
                    <el-tab-pane label="排号记录" name="rowRecord">
                        <ul class="tabs-box">
                            <li>
                                <p>
                                    <span>排号预计人数：</span>
                                    <span>5人</span>
                                </p>
                                <p>
                                    <span>座位选择：</span>
                                    <span>无要求</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>排号预计人数：</span>
                                    <span>5人</span>
                                </p>
                                <p>
                                    <span>座位选择：</span>
                                    <span>无要求</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>排号预计人数：</span>
                                    <span>5人</span>
                                </p>
                                <p>
                                    <span>座位选择：</span>
                                    <span>无要求</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>排号预计人数：</span>
                                    <span>5人</span>
                                </p>
                                <p>
                                    <span>座位选择：</span>
                                    <span>无要求</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="评价记录" name="evalRecord">
                        <ul class="tabs-box">
                            <li>
                                <p>
                                    <span>消费类型：</span>
                                    <span>AA拼桌</span>
                                </p>
                                <p>
                                    <span>打分：</span>
                                    <span>5.0</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>消费类型：</span>
                                    <span>AA拼桌</span>
                                </p>
                                <p>
                                    <span>打分：</span>
                                    <span>5.0</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>消费类型：</span>
                                    <span>AA拼桌</span>
                                </p>
                                <p>
                                    <span>打分：</span>
                                    <span>5.0</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>消费类型：</span>
                                    <span>AA拼桌</span>
                                </p>
                                <p>
                                    <span>打分：</span>
                                    <span>5.0</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="访问记录" name="visitRecord">
                        <ul class="visit-tab tabs-box">
                            <li>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <el-tab-pane label="消费记录" name="conRecord">
                        <ul class="tabs-box">
                            <li>
                                <p>
                                    <span>支付方式：</span>
                                    <span>支付宝</span>
                                </p>
                                <p>
                                    <span>金额：</span>
                                    <span>264.00</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>支付方式：</span>
                                    <span>会员积分</span>
                                </p>
                                <p>
                                    <span>金额：</span>
                                    <span>264.00</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>支付方式：</span>
                                    <span>支付宝</span>
                                </p>
                                <p>
                                    <span>金额：</span>
                                    <span>264.00</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                            <li>
                                <p>
                                    <span>支付方式：</span>
                                    <span>会员积分</span>
                                </p>
                                <p>
                                    <span>金额：</span>
                                    <span>264.00</span>
                                </p>
                                <p>
                                    <span>2020-09-29 23:46:41</span>
                                    <span>星期五</span>
                                </p>
                            </li>
                        </ul>
                    </el-tab-pane>

                    <!-- 对话框里的标签页数据分页 -->
                    <el-pagination
                        background
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange2"
                        :total="dataListCount2"
                        :current-page="currentPage2"
                        :page-size="pagesize2"
                        class="page"
                    ></el-pagination>
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleSure">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 表格数据分页 -->
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
            // 头部模块----------------------------------------------
            searchName: '', //用户昵称输入框
            collectVal: '', //收藏本店下拉框选择值
            //收藏本店下拉框数组
            collectValOpt: [
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
            isVipVal: '', //本店会员下拉框选择值
            //本店下拉框数组
            isVipOpt: [
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

            // 表格相关属性--------------------------------------------
            tableData: [
                {
                    name: '张三1',
                    number: '14781828227',
                    AANum: '289',
                    isVip: '是',
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
                    isVip: '是',
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
                    isVip: '是',
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
                    isVip: '否',
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
                    isVip: '否',
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
                    isVip: '否',
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
                    isVip: '是',
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
                    isVip: '否',
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
                    isVip: '是',
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
                    isVip: '是',
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
                    isVip: '是',
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
                    isVip: '否',
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
            // 表格数据分页相关属性
            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 10, //默认每页要显示多少条数据

            // 对话框里的相关属性---------------------------------------
            dialogFormVisible: false, //对话框的开启与隐藏
            activeName: 'rowRecord', //默认显示的标签页
            //用户相关属性
            userInfo: {
                name: '',
                number: '',
                isVip: '',
                collect: '',
                conMoney: ''
            },
            //标签页数据分页相关属性
            dataListCount2: 0, //默认当前要显示的数据条数
            currentPage2: 1, //默认显示的页码所在位置（第一页）
            pagesize2: 10 //默认每页要显示多少条数据
        };
    },

    methods: {
        //表格数据页码发生变化后
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

        //标签页数据发生变化后
        handleCurrentChange2() {},

        //查看按钮
        lookInfo(index, row) {
            this.dialogFormVisible = true;
            this.userInfo.name = row.name;
            this.userInfo.number = row.number;
            this.userInfo.isVip = row.isVip;
            this.userInfo.collect = row.collect;
            this.userInfo.conMoney = row.conMoney;
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
        handleSure() {
            this.dialogFormVisible = false;
        },

        //标签页切换操作
        handleClick(tab, event) {
            console.log(this.activeName);
        }
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

.el-dialog__header {
    padding: 0;
}

.add-classify-title {
    display: flex;
    align-items: center;
    margin-bottom: 30px;
}

.add-classify-title::before {
    display: inline-block;
    content: '';
    width: 4px;
    height: 20px;
    margin-right: 10px;
    background-color: #999;
}

.basic-info div {
    display: flex;
}

.basic-info div p {
    margin-bottom: 20px;
    /* margin-right: 50px; */
    display: flex;
    min-width: 230px;
}

.basic-info div p span:first-child {
    display: block;
    min-width: 100px;
}

.tabs-box li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px dashed #ddd;
    padding: 14px 0;
}

.tabs-box li p {
    width: 33.3333%;
}

.tabs-box li p:last-child {
    text-align: right;
}

.visit-tab.tabs-box li p:last-child {
    width: 100%;
    text-align: right;
}

.tabs-box li p span:first-child {
    margin-right: 10px;
}
</style>