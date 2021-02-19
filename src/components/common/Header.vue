<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold"></i>
            <i v-else class="el-icon-s-unfold"></i>
        </div>
        <div class="logo">玖座商家管理系统</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
                        <i class="el-icon-rank"></i>
                    </el-tooltip>
                </div>
                <!-- 消息中心 -->
                <div class="btn-bell" @click="information">
                    <el-tooltip
                        effect="dark"
                        :content="$store.state.headerUnread ? `有${$store.state.headerUnread}条未读消息` : `消息中心`"
                        placement="bottom"
                    >
                        <i class="el-icon-bell"></i>
                    </el-tooltip>
                    <span class="btn-bell-badge" v-if="$store.state.headerUnread > 0"></span>
                </div>
                <div class="btn-bell" @click="mute">
                    <el-tooltip effect="dark" :content="$store.state.headerClickMute ? `已静音` : `静音`" placement="bottom">
                        <i
                            style="font-size: 20px"
                            :class="$store.state.headerClickMute ? 'icon-jingyin' : 'icon-laba'"
                            class="iconfont"
                        ></i>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <div class="user-avator">
                    <img :src="logo" />
                </div>
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ username }}
                        <i class="el-icon-caret-bottom"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="setPassword">修改密码</el-dropdown-item>
                        <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>

                <!-- 修改密码对话框 -->
                <el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%" @close="handleCloseDialog">
                    <el-form :model="form">
                        <el-form-item label="原密码" label-width="100px">
                            <el-input v-model="form.oldPass" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="新密码" label-width="100px">
                            <el-input v-model="form.newPass" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="重复新密码" label-width="100px">
                            <el-input v-model="form.sureNewPass" show-password></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="handleCloseDialog">取 消</el-button>
                        <el-button type="primary" @click="handleConfrim">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';

export default {
    data() {
        return {
            imgHead: this.$imgHead,
            collapse: false,
            fullscreen: false,
            name: 'admin',
            message: 2,
            dialogVisible: false,
            form: {
                oldPass: '',
                newPass: '',
                sureNewPass: ''
            }
        };
    },
    computed: {
        //商家名称
        username() {
            let username = JSON.parse(localStorage.getItem('userInfo')).loginName;
            return username ? username : this.name;
        },

        //商家logo
        logo() {
            let logo = JSON.parse(localStorage.getItem('userInfo')).logo;
            return logo ? this.$imgHead + logo : require('../../assets/head.png');
        }
    },
    created() {
        if (localStorage.getItem('mute')) {
            this.$store.commit('headerClickMuteFun', localStorage.getItem('mute') == 1 ? false : true);
        } else {
            this.$store.commit('headerClickMuteFun', false);
        }
    },
    methods: {
        information() {
            this.$store.commit('headerClickMsgFun', !this.$store.state.headerClickMsg);
        },
        mute() {
            this.$store.commit('headerClickMuteFun', !this.$store.state.headerClickMute);
            localStorage.setItem('mute', this.$store.state.headerClickMute == true ? 2 : 1);
        },
        //对话框里的确认操作
        handleConfrim() {
            let data = {
                oldPassword: this.form.oldPass,
                newPassword: this.form.newPass
            };

            if (this.form.newPass !== this.form.sureNewPass) {
                this.$message.error('两次输入密码不一致，请重新输入！');
                return;
            } else {
                this.$post('/merchant/store/updatePassword', data).then((res) => {
                    console.log(res);
                    if (res.code === 0) {
                        localStorage.removeItem('userInfo');
                        this.$message.success('修改成功');
                        this.$router.push('/login');
                    } else {
                        this.$message.error(res.msg);
                    }
                });
            }
        },

        //关闭对话框操作
        handleCloseDialog() {
            this.form = {
                oldPass: '',
                newPass: '',
                sureNewPass: ''
            };
            this.dialogVisible = false;
        },

        // 用户名下拉菜单选择事件
        handleCommand(command) {
            if (command == 'loginout') {
                this.$get('/merchant/store/logout').then(
                    (res) => {
                        localStorage.removeItem('userInfo');
                        this.$message.success('退出成功');
                        this.$router.push('/login');
                        RongIMClient.getInstance().logout(); //退出登录
                        // RongIMClient.getInstance().disconnect(); //断开链接
                    },
                    (err) => {
                        console.log(err);
                    }
                );
            }

            if (command == 'setPassword') {
                this.dialogVisible = true;
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>
<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.header .logo {
    float: left;
    width: 250px;
    line-height: 70px;
}
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
}
</style>
