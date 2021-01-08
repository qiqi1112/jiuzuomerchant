<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 我的账户 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- <el-form :inline="true" :model="form1" class="demo-form-inline">
            <el-form-item label="支付宝商户名">
                <el-input readonly v-model="form1.user"></el-input>
            </el-form-item>
            <el-form-item label="支付宝商户账号">
                <el-input readonly v-model="form1.account"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="setting1">设置</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true" :model="form2" class="demo-form-inline">
            <el-form-item label="微信商户名">
                <el-input readonly v-model="form2.user"></el-input>
            </el-form-item>
            <el-form-item label="微信商户账号">
                <el-input readonly v-model="form2.account"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="setting2">设置</el-button>
            </el-form-item>
        </el-form> -->
            <el-form :inline="true" :model="form3" class="demo-form-inline">
                <el-form-item label="收款人姓名">
                    <el-input readonly v-model="form3.user"></el-input>
                </el-form-item>
                <el-form-item label="收款银行卡卡号">
                    <el-input readonly v-model="form3.account"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="setting3">设置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form1: {
                user: '',
                account: ''
            },

            form2: {
                user: '',
                account: ''
            },

            form3: {
                user: '',
                account: ''
            }
        };
    },

    methods: {
        setting1() {},

        setting2() {},

        setting3() {}
    }
};
</script>

<style lang="less" scoped>
/deep/.el-form-item__label {
    padding: 0;
    width: 114px;
    text-align: left;
}

/deep/ .el-form--inline .el-form-item {
    margin-right: 40px;
}
</style>