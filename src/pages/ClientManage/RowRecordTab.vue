<template>
    <div>
        <template v-if="recordList.length > 0">
            <ul class="tabs-box">
                <li v-for="(item, index) in recordList" :key="index">
                    <div v-if="propUserInfo.activeName == 'rowRecord'">
                        <p>
                            <span>取号类型：</span>
                            <span>{{ item.type }}</span>
                        </p>
                        <p>
                            <span>取号状态：</span>
                            <span>{{ item.isOff == 1 ? '取消' : '未取消' }}</span>
                        </p>
                    </div>
                    <div v-if="propUserInfo.activeName == 'evalRecord'">
                        <p>
                            <span>消费类型：</span>
                            <span>{{ item.orderType | conType }}</span>
                        </p>
                        <p>
                            <span>打分：</span>
                            <span>{{ item.appraiseLevel }}</span>
                        </p>
                    </div>
                    <div v-if="propUserInfo.activeName == 'conRecord'">
                        <p>
                            <span>支付方式：</span>
                            <span>{{ item.payWay | payType }}</span>
                        </p>
                        <p>
                            <span>金额：</span>
                            <span>{{ item.payAmount }}</span>
                        </p>
                    </div>

                    <p>
                        <span>{{ item.createTime }}</span>
                        <span>{{ item.dayOfWeak | dayOfWeek }}</span>
                    </p>
                </li>
            </ul>
            <!-- 对话框里的标签页数据分页 -->
            <el-pagination
                background
                layout="prev, pager, next"
                @current-change="handleCurrentChange"
                :total="dataListCount"
                :current-page="currentPage"
                :page-size="pagesize"
                class="page"
            ></el-pagination>
        </template>
        <template v-else>暂无更多记录</template>
    </div>
</template>

<script>
export default {
    props: ['propUserInfo'],

    data() {
        return {
            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 6, //默认每页要显示多少条数据
            recordList: [], //记录数据
            url: '' //请求地址
        };
    },

    methods: {
        //翻页操作
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getRowRecord(); //重新请求翻页后的数据
        },

        //获取请求地址
        getUrl() {
            switch (this.propUserInfo.activeName) {
                case 'rowRecord':
                    this.url = '/merchant/store/ly/userHistory';
                    break;
                case 'evalRecord':
                    this.url = '/merchant/store/appraise/appraiseLimitByUser';
                    break;
                case 'conRecord':
                    this.url = '/merchant/store/appraise/storeListByUser';
                    break;
            }
        },

        //获取记录数据
        getRowRecord() {
            let data = {
                pageNo: this.currentPage,
                pageSize: this.pagesize,
                userId: this.propUserInfo.userId
            };

            this.$post(this.url, data).then((res) => {
                if (res.code == 0) {
                    this.recordList = res.data.list; //当前页的数据
                    this.dataListCount = res.data.total; //总数据条数
                }
            });
        }
    },

    created() {
        this.getUrl();
    },

    mounted() {
        this.getRowRecord();
    }
};
</script>

<style lang="less" scoped>
.tabs-box {
    li {
        display: flex;
        border-bottom: 1px dashed #ddd;
        padding: 14px 0;

        > div {
            width: 66.6666%;
            display: flex;

            > p {
                width: 50%;
            }
        }

        > p:last-child {
            width: 33.3333%;

            span:first-child {
                margin-right: 20px;
            }
        }
    }
}
</style>