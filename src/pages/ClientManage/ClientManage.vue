<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 客户管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 头部模块 -->
            <div class="handle-box">
                <el-input
                    clearable
                    @keydown.13.native="handleSearch"
                    v-model="searchName"
                    placeholder="用户昵称"
                    class="handle-input mr10"
                ></el-input>
                <el-select clearable v-model="collectVal" placeholder="收藏本店" style="width: 100px" class="mr10">
                    <el-option v-for="item in selectOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-select clearable v-model="isVipVal" placeholder="本店会员" style="width: 100px" class="mr10">
                    <el-option v-for="item in selectOpt" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <!-- 表格部分 -->
            <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
                <el-table-column label="ID" fixed type="index"></el-table-column>
                <el-table-column prop="petName" label="用户昵称"></el-table-column>
                <el-table-column label="用户手机" min-width="130">
                    <template slot-scope="scope">
                        <el-link @click="getPhone(scope.row.userId)" type="primary"
                            >{{ scope.row.phone }}<i class="el-icon-phone el-icon--right" style="margin-left: 10px"></i>
                        </el-link>
                    </template>
                </el-table-column>
                <el-table-column label="本店会员" min-width="80">
                    <template slot-scope="scope">
                        <span>{{ scope.row.vip | yesOrNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="aaMakeUpATableTimes" label="AA拼单次数" min-width="90"></el-table-column>
                <el-table-column prop="reserveConsumptionTimes" label="预定桌消费次数" min-width="110"></el-table-column>
                <el-table-column prop="numberOfTimes" label="排号次数"></el-table-column>
                <el-table-column prop="takeEffectNumberOfTimes" label="生效排号次数" min-width="100"></el-table-column>
                <el-table-column prop="cancelEffectNumberOfTimes" label="取消排号次数" min-width="100"></el-table-column>
                <el-table-column label="收藏本店" min-width="100">
                    <template slot-scope="scope">
                        <span>{{ scope.row.collectionMerchantStatus | yesOrNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="numberOfComments" label="评价次数"></el-table-column>
                <el-table-column prop="visitMerchantTimes" label="访问店铺次数" min-width="100"></el-table-column>
                <el-table-column prop="lastConsumptionTime" label="最近一次消费时间" min-width="135"></el-table-column>
                <el-table-column prop="lastVisitMerchantTime" label="最近一次访问时间" min-width="135"></el-table-column>
                <el-table-column prop="totalConsumptionAmount" label="本店累计消费金额" min-width="135"></el-table-column>
                <el-table-column label="操作" fixed="right" min-width="80">
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="lookInfo(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 获取用户隐私号码 -->
            <el-dialog :visible.sync="priNumberDialog" class="priNumber-dialog">
                <span class="add-classify-title">动态号码</span>
                <h2 style="margin-bottom: 10px">用户动态号码请在2分钟内使用</h2>
                <h2>{{ priNumber }}</h2>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="priNumberDialog = false">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 对话框 -->
            <el-dialog :visible.sync="dialogFormVisible" @close="handleClose">
                <span class="add-classify-title">用户信息</span>
                <div class="basic-info">
                    <div>
                        <p>
                            <span>昵称：</span>
                            <span>{{ userInfo.petName }}</span>
                        </p>
                        <p>
                            <span>手机：</span>
                            <span>{{ userInfo.phone }}</span>
                        </p>
                    </div>
                    <div>
                        <p>
                            <span>本店会员：</span>
                            <span>{{ userInfo.vip }}</span>
                        </p>
                        <p>
                            <span>收藏本店：</span>
                            <span>{{ userInfo.collectionMerchantStatus }}</span>
                        </p>
                        <p>
                            <span>累计消费：</span>
                            <span>{{ userInfo.totalConsumptionAmount }}</span>
                        </p>
                    </div>
                </div>

                <!-- 对话框里的标签页 -->
                <el-tabs style="margin-top: 20px" v-model="activeName" type="border-card">
                    <el-tab-pane label="排号记录" name="rowRecord">
                        <row-record-tab :propUserInfo="propUserInfo" v-if="activeName == 'rowRecord'"></row-record-tab>
                    </el-tab-pane>
                    <el-tab-pane label="评价记录" name="evalRecord">
                        <row-record-tab :propUserInfo="propUserInfo" v-if="activeName == 'evalRecord'"></row-record-tab>
                    </el-tab-pane>
                    <el-tab-pane label="消费记录" name="conRecord">
                        <row-record-tab :propUserInfo="propUserInfo" v-if="activeName == 'conRecord'"></row-record-tab>
                    </el-tab-pane>
                    <!-- <el-tab-pane label="访问记录" name="visitRecord">
                        <row-record-tab :propUserInfo="propUserInfo" v-if="activeName == 'visitRecord'"></row-record-tab>
                    </el-tab-pane> -->
                </el-tabs>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="handleClose">确 定</el-button>
                </div>
            </el-dialog>

            <!-- 表格数据分页 -->
            <el-pagination
                v-if="tableData.length > 0"
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
import rowRecordTab from './RowRecordTab';

export default {
    components: {
        rowRecordTab
    },

    data() {
        return {
            searchName: '', //用户昵称
            collectVal: '', //收藏本店
            isVipVal: '', //本店会员
            //是否收藏本店
            selectOpt: [
                {
                    value: 1,
                    label: '是'
                },
                {
                    value: 0,
                    label: '否'
                }
            ],

            tableData: [], //表格数据

            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 10, //默认每页要显示多少条数据

            dialogFormVisible: false, //对话框的开启与隐藏
            activeName: 'rowRecord', //默认显示的标签页

            userInfo: {}, //用户相关属性

            priNumber: '', //用户隐私号码
            priNumberDialog: false, //用户隐私号码弹窗开关

            //传给子组件的值
            propUserInfo: {
                userId: '',
                activeName: 'rowRecord'
            }
        };
    },

    watch: {
        activeName(newVal) {
            this.propUserInfo.activeName = newVal;
        }
    },

    methods: {
        //获取用户隐私号码
        getPhone(userId) {
            this.$post(`/merchant/store/customer/customer/${userId}`).then((res) => {
                if (res.code === 0) {
                    this.priNumber = res.data;
                    this.priNumberDialog = true;
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        //表格数据页码发生变化后
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getClientInfo(); //请求翻页后的数据
        },

        //查看按钮
        lookInfo(index, row) {
            this.dialogFormVisible = true;
            this.userInfo = row;
            this.propUserInfo.userId = row.userId;
        },

        //关闭对话框
        handleClose() {
            this.dialogFormVisible = false;
            this.activeName = 'rowRecord';
        },

        //搜索操作
        handleSearch() {
            this.currentPage = 1;
            this.getClientInfo();
        },

        //获取客户信息
        getClientInfo() {
            let data = {
                pageNo: this.currentPage,
                pageSize: this.pagesize,
                petName: this.searchName,
                collectionMerchantStatus: this.collectVal,
                vip: this.isVipVal
            };

            this.$post('/merchant/store/customer/customerLimit', data).then((res) => {
                if (res.code == 0) {
                    this.tableData = res.data.list;
                    this.dataListCount = res.data.total; //总数据条数
                }
            });
        }
    },

    created() {
        this.getClientInfo();
    }
};
</script>

<style scoped lang='less'>
/deep/.page {
    text-align: right;
    margin-top: 20px;
}

.handle-box {
    margin-bottom: 20px;

    .handle-input {
        width: 170px;
        display: inline-block;
    }

    .mr10 {
        margin-right: 10px;
    }
}

/deep/.el-dialog__header {
    padding: 0;
}

/deep/.priNumber-dialog {
    .el-dialog {
        text-align: center;
        width: 30%;
    }
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

.basic-info {
    div {
        display: flex;

        p {
            margin-bottom: 20px;
            display: flex;
            min-width: 260px;

            span:first-child {
                display: block;
                min-width: 80px;
            }
        }
    }
}
</style>