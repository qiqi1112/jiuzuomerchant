<template>
    <div>
        <ul class="tabs-box" v-for="(item,index) in recordList" :key="index">
            <li>
                <p>
                    <span>消费类型：</span>
                    <span>{{item.orderType | conType}}</span>
                </p>
                <p>
                    <span>打分：</span>
                    <span>{{item.appraiseLevel}}</span>
                </p>
                <p>
                    <span>{{item.createTime}}</span>
                    <span>{{item.dayOfWeak | dayOfWeek}}</span>
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
    </div>
</template>

<script>
export default {
    props: ['userID'],

    data() {
        return {
            dataListCount: 0, //默认当前要显示的数据条数
            currentPage: 1, //默认显示的页码所在位置（第一页）
            pagesize: 6, //默认每页要显示多少条数据
            recordList: [] //记录数据
        };
    },
    methods: {
        //翻页操作
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getRowRecord(); //重新请求翻页后的数据
        },

        //获取记录数据
        getRowRecord() {
            let data = {
                pageNo: this.currentPage,
                pageSize: this.pagesize,
                userId: this.userID
            };
            this.$post('/api/merchant/store/appraise/appraiseLimitByUser', data).then((res) => {
                if (res.code == 0) {
                    this.recordList = res.data.list; //当前页的数据
                    this.dataListCount = res.data.total; //总数据条数
                    // console.log(this.recordList);
                }
            });
        }
    },

    created() {
        this.getRowRecord();
    }
};
</script>