<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#bfcbd9"
            active-text-color="#20a0ff"
            unique-opened
            router
            @select = "gowhere"
        >
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">{{
                                    threeItem.title
                                }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }}</el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            items: [
                {
                    icon: 'el-icon-lx-home',
                    index: 'index',
                    title: '系统首页'
                },
                {
                    icon: 'el-icon-s-shop',
                    index: 'myshop',
                    title: '我的店铺'
                },
                {
                    icon: 'el-icon-goods',
                    index: 'shopmanage',
                    title: '商品管理'
                },
                {
                    icon: 'el-icon-s-custom',
                    index: 'clientmanage',
                    title: '客户管理'
                },
                {
                    icon: 'el-icon-s-order',
                    index: 'ordermanage',
                    title: '订单管理'
                },
                {
                    icon: 'el-icon-goblet-square-full',
                    index: 'begintabledetails',
                    title: '开台详情'
                },
                {
                    icon: 'el-icon-s-grid',
                    index: 'nummanage',
                    title: '排号管理'
                },
                {
                    icon: 'el-icon-s-flag',
                    index: 'adverActivity',
                    title: '广告活动'
                },
                {
                    icon: 'el-icon-lx-text',
                    index: 'comments',
                    title: '评论管理'
                },
                {
                    icon: 'iconfont icon-youhuiquan side',
                    index: 'coupons',
                    title: '优惠券'
                },
                {
                    icon: 'el-icon-lx-redpacket_fill',
                    index: 'financialAudit',
                    title: '财务审核'
                },
                // {
                //     icon: 'el-icon-lx-text',
                //     index: 'service',
                //     title: '客服管理'
                // },
                {
                    icon: 'iconfont icon-icon_rzhi side',
                    index: 'log',
                    title: '操作日志'
                },
                {
                    icon: 'iconfont icon-shezhi side',
                    index: 'setting',
                    title: '设置'
                },
                {
                    icon: 'iconfont icon-cangku side',
                    index: 'entrepotManage',
                    title: '仓库管理'
                },
                {
                    icon: 'iconfont icon-yuangongguanli side',
                    index: 'staffManage',
                    title: '员工管理'
                },
                {
                    icon: 'iconfont icon-caiwu side',
                    index: 'financeManage',
                    title: '财务管理'
                },
                // {
                //     icon: 'el-icon-s-flag',
                //     title: '广告活动',
                //     index: 'AdverActivity',
                //     subs: [
                //         {
                //             index: 'AdverActivity',
                //             title: '活动列表'
                //         },
                //         {
                //             index: 'Advertising',
                //             title: '广告栏'
                //         }
                //     ]
                // },

                // {
                //     icon: 'el-icon-lx-home',
                //     index: 'dashboard',
                //     title: '系统首页'
                // },
                // {
                //     icon: 'el-icon-lx-cascades',
                //     index: 'table',
                //     title: '基础表格'
                // },
                // {
                //     icon: 'el-icon-lx-copy',
                //     index: 'tabs',
                //     title: 'tab选项卡'
                // },
                // {
                //     icon: 'el-icon-lx-calendar',
                //     index: '3',
                //     title: '表单相关',
                //     subs: [
                //         {
                //             index: 'form',
                //             title: '基本表单'
                //         },
                //         {
                //             index: '3-2',
                //             title: '三级菜单',
                //             subs: [
                //                 {
                //                     index: 'editor',
                //                     title: '富文本编辑器'
                //                 },
                //                 {
                //                     index: 'markdown',
                //                     title: 'markdown编辑器'
                //                 }
                //             ]
                //         },
                //         {
                //             index: 'upload',
                //             title: '文件上传'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-emoji',
                //     index: 'icon',
                //     title: '自定义图标'
                // },
                // {
                //     icon: 'el-icon-pie-chart',
                //     index: 'charts',
                //     title: 'schart图表'
                // },
                // {
                //     icon: 'el-icon-rank',
                //     index: '6',
                //     title: '拖拽组件',
                //     subs: [
                //         {
                //             index: 'drag',
                //             title: '拖拽列表'
                //         },
                //         {
                //             index: 'dialog',
                //             title: '拖拽弹框'
                //         }
                //     ]
                // },
                // {
                //     icon: 'el-icon-lx-global',
                //     index: 'i18n',
                //     title: '国际化功能'
                // },
                {
                    icon: 'el-icon-lx-warn',
                    index: '7',
                    title: '错误处理',
                    subs: [
                        {
                            index: 'permission',
                            title: '权限测试'
                        },
                        {
                            index: '404',
                            title: '404页面'
                        }
                    ]
                },
                // {
                //     icon: 'el-icon-lx-redpacket_fill',
                //     index: '/donate',
                //     title: '支持作者'
                // }
            ]
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', (msg) => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
        // 获取店铺类型
        this.$get('/merchant/store/getStoreInfo')
        .then(res=>{
            console.log(res.data.storeLocation)
            if(res.data.storeLocation==3){
                this.items[5].index='ktv'
            }
        })
    },
    methods:{
        gowhere(e){
            console.log(e)
        }
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 250px;
}
.sidebar > ul {
    height: 100%;
}
</style>
