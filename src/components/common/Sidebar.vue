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
            @select="gowhere"
        >
            <template>
                <template v-for="item in showItems">
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
            showItems: [],
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
                    icon: 'iconfont icon-zuowei side',
                    index: 'seatManage',
                    title: '座位管理'
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
                    title: '财务审核',
                    subs: [
                        {
                            index: 'tradeOrder',
                            title: '交易订单'
                        },
                        // {
                        //     index: 'tradeRecord',
                        //     title: '交易记录'
                        // },
                        {
                            index: 'myAccount',
                            title: '收款账户'
                        }
                    ]
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
                    title: '设置',
                    subs: [
                        // {
                        //     index: 'reserveSetting',
                        //     title: '预定权限'
                        // },
                        {
                            index: 'passwordSetting',
                            title: '收款密码设置'
                        }
                    ]
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
                }
            ],
            carItems: [
                {
                    icon: 'el-icon-s-shop',
                    index: 'carMyShop',
                    title: '车行信息'
                },
                {
                    icon: 'el-icon-goods',
                    index: 'carShopManage',
                    title: '车辆管理'
                },
                {
                    icon: 'el-icon-s-order',
                    index: 'carOrderManage',
                    title: '订单管理'
                },
                {
                    icon: 'el-icon-lx-redpacket_fill',
                    index: 'carFinancialAudit',
                    title: '财务审核',
                    subs: [
                        {
                            index: 'carTradeOrder',
                            title: '交易订单'
                        },
                        {
                            index: 'carMyAccount',
                            title: '收款账户'
                        }
                    ]
                },
                {
                    icon: 'iconfont icon-shezhi side',
                    index: 'setting',
                    title: '设置',
                    subs: [
                        {
                            index: 'carPasswordSetting',
                            title: '收款密码设置'
                        }
                    ]
                },
                {
                    icon: 'iconfont icon-icon_rzhi side',
                    index: 'carLog',
                    title: '操作日志'
                },
                {
                    icon: 'iconfont icon-cangku side',
                    index: 'carEntrepotManage',
                    title: '仓库管理'
                },
                {
                    icon: 'iconfont icon-yuangongguanli side',
                    index: 'carStaffManage',
                    title: '员工管理'
                },
                {
                    icon: 'iconfont icon-caiwu side',
                    index: 'carFinanceManage',
                    title: '财务管理'
                }
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
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            const storeLocation = JSON.parse(userInfo).storeLocation;
            const accountLocation = JSON.parse(userInfo).accountLocation;
            //根据不同的商家类型展示不同的菜单栏
            if (accountLocation === 1) {
                this.showItems = this.carItems;
            } else {
                this.showItems = this.items;
            }

            //如果是Ktv商家，就隐藏下面的模块
            if (storeLocation === 3) {
                this.items.forEach((item, index) => {
                    if (item.title === '开台详情' || item.title === '座位管理') {
                        this.items.splice(index, 1);
                    }
                });
            }
        }
    },
    methods: {
        gowhere(e) {
            // console.log(e)
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
