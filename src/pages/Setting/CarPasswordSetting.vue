<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 收款密码设置 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="box">
                <span>注意：查看或编辑收款账户需设置此密码，请注意周围环境安全</span>
                <el-button type="primary" @click="dialogVisible = true">设置密码</el-button>
            </div>

            <!-- 设置密码对话框 -->
            <el-dialog title="设置收款密码" :visible.sync="dialogVisible" width="25%" @close="handleCloseDialog">
                <div class="input-box">
                    <span style="color: #f00">*密码仅限数组或字母，长度必须为8位</span>
                    <el-input
                        style="margin-bottom: 10px"
                        :onkeyup="(form.password = form.password.replace(/[^\w]/g, ''))"
                        v-model="form.password"
                        show-password
                        placeholder="请输入密码"
                    ></el-input>
                    <el-input
                        style="margin-bottom: 10px"
                        :onkeyup="(form.surePassword = form.surePassword.replace(/[^\w]/g, ''))"
                        v-model="form.surePassword"
                        show-password
                        placeholder="请确认密码"
                    ></el-input>
                    <div class="auth-code">
                        <el-input
                            style="margin-right: 10px"
                            v-model="form.authCode"
                            placeholder="验证码"
                            :onkeyup="(form.authCode = form.authCode.replace(/^(-1+)|[^\d]+/g, ''))"
                        ></el-input>
                        <el-button :type="waitTime ? '' : 'primary'" @click="sendCode" :disabled="waitTime">{{
                            waitTime ? countDown + 's' : '发送'
                        }}</el-button>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="handleCloseDialog">取 消</el-button>
                    <el-button type="primary" @click="handleConfrim">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                password: '',
                surePassword: '',
                authCode: ''
            },
            dialogVisible: false,
            waitTime: false,
            countDown: 59
        };
    },

    methods: {
        //发送验证码操作
        sendCode() {
            this.waitTime = true;
            let timer = setInterval(() => {
                this.countDown--;
                if (this.countDown === 0) {
                    this.countDown = 59;
                    this.waitTime = false;
                    clearInterval(timer);
                }
            }, 1000);
            this.getAuthCode();
        },

        //获取验证码操作
        getAuthCode() {
            this.$get('/merchant/store/settled/sendCode').then((res) => {
                if (res.code === 0) {
                    this.$message.success('发送成功');
                } else {
                    this.$message.error(res.msg);
                }
            });
        },

        //关闭弹窗操作
        handleCloseDialog() {
            this.dialogVisible = false;
            this.form = {
                password: '',
                surePassword: '',
                authCode: ''
            };
        },

        //确认操作
        handleConfrim() {
            if (this.form.password.length !== 8 || this.form.surePassword.length !== 8) {
                this.$message.error('密码长度必须为8位');
                return;
            } else if (this.form.password !== this.form.surePassword) {
                this.$message.error('两次密码不一致，请重新输入');
                return;
            } else if (this.form.authCode === '') {
                this.$message.error('请输入验证码');
                return;
            } else {
                this.requestSubmit();
            }
        },

        //请求操作
        requestSubmit() {
            let data = {
                code: this.form.authCode,
                password: this.form.password
            };
            this.$post('/merchant/store/settled/updatePassword', data).then((res) => {
                if (res.code === 0) {
                    this.$message.success('设置成功');
                    this.dialogVisible = false;
                } else {
                    this.$message.error(res.msg);
                }
            });
        }
    }
};
</script>

<style lang="less" scoped>
.box {
    display: flex;
    align-items: center;

    > span {
        font-size: 14px;
        margin-right: 20px;
    }
}

.input-box {
    width: 60%;
    margin: 0 auto;

    .auth-code {
        display: flex;
    }
}
</style>