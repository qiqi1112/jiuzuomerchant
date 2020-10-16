<template>
    <div class="wrap">
        <el-form :inline="true" :model="form1" class="demo-form-inline">
            <el-form-item label="支付宝商户名">
                <el-input :readonly="!isSetting1" v-model="form1.user" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="支付宝商户账号">
                <el-input :readonly="!isSetting1" v-model="form1.account" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="setting1">{{ isSetting1 == true ? '确定' : '设置' }}</el-button>
                <el-button v-if="isSetting1" @click="handleCancel1">取消</el-button>
            </el-form-item>
        </el-form>
        <el-form :inline="true" :model="form2" class="demo-form-inline">
            <el-form-item label="微信商户名">
                <el-input :readonly="!isSetting2" v-model="form2.user" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="微信商户账号">
                <el-input :readonly="!isSetting2" v-model="form2.account" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="setting2">{{ isSetting2 == true ? '确定' : '设置' }}</el-button>
                <el-button v-if="isSetting2" @click="handleCancel2">取消</el-button>
            </el-form-item>
        </el-form>
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

            isSetting1: false,
            isSetting2: false
        };
    },

    methods: {
        setting1() {
            this.isSetting1 = !this.isSetting1;
        },

        setting2() {
            this.isSetting2 = !this.isSetting2;
        },

        handleCancel1() {
            this.isSetting1 = false;
        },

        handleCancel2() {
            this.isSetting2 = false;
        }
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

.wrap {
    margin-top: 30px;
}
</style>