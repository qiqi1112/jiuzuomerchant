<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 预定权限 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="switch-box" v-for="(item, index) in switchList" :key="index">
                <span>{{ item.title }}</span>
                <el-switch v-model="item.value" active-color="#13ce66" inactive-color="#ff4949"> </el-switch>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            switchList: [
                {
                    title: '客户预定桌功能',
                    value: false
                },
                {
                    title: '客户AA拼单功能',
                    value: false
                },
                {
                    title: '客户抢座排号功能',
                    value: false
                }
            ]
        };
    },
    methods: {}
};
</script>

<style lang="less" scoped>
.switch-box {
    display: flex;
    margin-bottom: 20px;
    > span {
        display: block;
        min-width: 190px;
    }
}
</style>