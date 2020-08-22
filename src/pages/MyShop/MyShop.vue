<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 表单
                </el-breadcrumb-item>
                <el-breadcrumb-item>图片上传</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <h1>我的店铺</h1>

            <el-form
                :model="form"
                status-icon
                :rules="rules"
                ref="form"
                label-width="100px"
                class="demo-ruleForm"
            >
                <!-- <el-form-item label="密码" prop="pass">
                    <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
                </el-form-item>-->
                <el-form-item label="年龄" prop="age">
                    <el-input v-model.number="form.age"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('form')">提交</el-button>
                    <el-button @click="resetForm('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        var checkAge = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('年龄不能为空'));
            }
            // setTimeout(() => {
            if (!Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
            } else {
                // if (value < 18) {
                //     callback(new Error('必须年满18岁'));
                // } else {
                //     callback();
                // }

                callback();
            }
            // }, 1000);
        };
        // var validatePass = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请输入密码'));
        //     } else {
        //         if (this.ruleForm.checkPass !== '') {
        //             this.$refs.ruleForm.validateField('checkPass');
        //         }
        //         callback();
        //     }
        // };
        // var validatePass2 = (rule, value, callback) => {
        //     if (value === '') {
        //         callback(new Error('请再次输入密码'));
        //     } else if (value !== this.ruleForm.pass) {
        //         callback(new Error('两次输入密码不一致!'));
        //     } else {
        //         callback();
        //     }
        // };
        return {
            form: {
                pass: '',
                checkPass: '',
                age: ''
            },
            rules: {
                // pass: [{ validator: validatePass, trigger: 'blur' }],
                // checkPass: [{ validator: validatePass2, trigger: 'blur' }],
                age: [{ validator: checkAge, trigger: 'blur' }]
            }
        };
    },
    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};
</script>

<style scoped>
</style>