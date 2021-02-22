<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 我的账户 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- <el-form :inline="true" :model="accountInfo" class="demo-form-inline">
                <el-form-item label="支付宝商户名">
                    <el-input readonly v-model="accountInfo.alipayName"></el-input>
                </el-form-item>
                <el-form-item label="支付宝商户账号">
                    <el-input readonly v-model="accountInfo.alipayAccount"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="">设置</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="accountInfo" class="demo-form-inline">
                <el-form-item label="微信商户名">
                    <el-input readonly v-model="accountInfo.wechatName"></el-input>
                </el-form-item>
                <el-form-item label="微信商户账号">
                    <el-input readonly v-model="accountInfo.wechatAccount"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="">设置</el-button>
                </el-form-item>
            </el-form> -->
            <el-form :inline="true" :model="accountInfo" class="demo-form-inline">
                <el-form-item label="收款人姓名">
                    <el-input
                        readonly
                        v-model.trim="accountInfo.bankName"
                        :placeholder="accountInfo.bankName === '' ? '暂无，请设置' : ''"
                    ></el-input>
                </el-form-item>
                <el-form-item label="收款银行卡卡号">
                    <el-input
                        readonly
                        v-model="accountInfo.bankAccount"
                        :placeholder="accountInfo.bankAccount === '' ? '暂无，请设置' : ''"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="settingBanckInfo">设置</el-button>
                </el-form-item>
            </el-form>

            <!-- 设置密码对话框 -->
            <el-dialog title="设置账户信息" :visible.sync="dialogVisible" width="25%" @close="handleCloseDialog">
                <template v-if="!showSetAcount">
                    <div class="password-box">
                        <span style="color: #f00; font-size: 14px">*请输入收款密码进行身份验证</span>
                        <div class="auth-code">
                            <el-input
                                style="margin-right: 10px"
                                v-model="password"
                                show-password
                                placeholder="请输入收款密码"
                                :onkeyup="(password = password.replace(/[^\w]/g, ''))"
                                maxlength="8"
                            ></el-input>
                            <el-button type="primary" @click="checkPassword">验 证</el-button>
                        </div>
                    </div>
                </template>
                <template v-if="showSetAcount">
                    <div class="input-box">
                        <el-input style="margin-bottom: 10px" v-model.trim="form.bankName" placeholder="请输入姓名"></el-input>
                        <el-input
                            style="margin-bottom: 10px"
                            :onkeyup="(form.bankAccount = form.bankAccount.replace(/^(0+)|[^\d]+/g, ''))"
                            v-model="form.bankAccount"
                            placeholder="请输入银行卡卡号"
                        ></el-input>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="handleCloseDialog">取 消</el-button>
                        <el-button type="primary" @click="handleConfrim">确 定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            accountInfo: {},
            form: {
                bankName: '',
                bankAccount: ''
            },
            password: '', //收款密码
            dialogVisible: false,
            showSetAcount: false
        };
    },

    created() {
        this.getCountInfo();
    },

    methods: {
        //验证收款密码
        checkPassword() {
            let data = {
                password: this.password
            };
            this.$post('/merchant/store/settled/verifyPayPas', data).then((res) => {
                if (res.code === 0) {
                    this.showSetAcount = true;
                    this.password = '';
                    this.$message.success('验证成功');
                } else if (res.code === 500) {
                    this.$message.error('密码错误');
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        //确定设置
        handleConfrim() {
            if (this.form.bankName === '') {
                this.$message.error('请输入收款人姓名');
                return;
            } else if (!this.$regular.bankAcountNum(this.form.bankAccount)) {
                this.$message.error('银行卡卡号格式不对，请重新输入');
                return;
            } else {
                let data = {
                    bankName: this.form.bankName,
                    bankAccount: this.form.bankAccount
                };
                this.$post('/merchant/store/settled/updatePayAccount', data).then((res) => {
                    if (res.code === 0) {
                        this.$message.success('设置成功');
                        this.handleCloseDialog();
                        this.getCountInfo();
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        },

        //关闭弹窗操作
        handleCloseDialog() {
            this.dialogVisible = false;
            this.password = '';
            this.form = {
                bankName: '',
                bankAccount: ''
            };
            this.showSetAcount = false;
        },

        //回显账户信息
        getCountInfo() {
            (async () => {
                const res = await this.$get('/merchant/store/settled/payAccount');
                if (res.code === 0) {
                    this.accountInfo = res.data;
                } else {
                    this.$message.error(res.msg);
                }
            })();
        },

        //设置按钮
        settingBanckInfo() {
            if (this.accountInfo.havePas === false) {
                this.$confirm('未设置收款密码，请先设置收款密码', '提示', {
                    confirmButtonText: '前往设置',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        this.$router.push('/passwordSetting');
                    })
                    .catch(() => {
                        this.dialogVisible = false;
                    });
            } else {
                this.dialogVisible = true;
            }
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

.input-box {
    width: 70%;
    margin: 0 auto;
}

.password-box {
    width: 70%;
    margin: 0 auto;

    .auth-code {
        display: flex;
    }
}
</style>