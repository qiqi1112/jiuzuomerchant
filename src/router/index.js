import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: {
                title: '自述文件'
            },
            children: [{
                    path: '/index',
                    component: () => import( /* webpackChunkName: "index" */ '../pages/Index/Index.vue'),
                    meta: {
                        title: '系统首页'
                    }
                },
                {
                    path: '/myshop',
                    component: () => import( /* webpackChunkName: "myshop" */ '../pages/MyShop/MyShop.vue'),
                    meta: {
                        title: '我的店铺'
                    }
                },
                {
                    path: '/shopmanage',
                    component: () => import( /* webpackChunkName: "shopmanage" */ '../pages/ShopManage/ShopManage.vue'),
                    meta: {
                        title: '商品管理'
                    }
                },

                {
                    path: '/clientmanage',
                    component: () => import( /* webpackChunkName: "clientmanage" */ '../pages/ClientManage/ClientManage.vue'),
                    meta: {
                        title: '客户管理'
                    }
                },
                {
                    path: '/ordermanage',
                    component: () => import( /* webpackChunkName: "ordermanage" */ '../pages/OrderManage/OrderManage.vue'),
                    meta: {
                        title: '订单管理'
                    }
                },
                {
                    path: '/nummanage',
                    component: () => import( /* webpackChunkName: "nummanage" */ '../pages/NumManage/NumManage.vue'),
                    meta: {
                        title: '排号管理'
                    }
                },
                {
                    path: '/adveractivity',
                    component: () => import( /* webpackChunkName: "adveractivity" */ '../pages/AdverActivity/AdverActivity.vue'),
                    meta: {
                        title: '广告活动'
                    }
                },
                {
                    path: '/comments',
                    component: () => import( /* webpackChunkName: "comments" */ '../pages/Comments/Comments.vue'),
                    meta: {
                        title: '评论管理'
                    }
                },
                // {
                //     path: '/service',
                //     component: () => import( /* webpackChunkName: "service" */ '../pages/Service/Service.vue'),
                //     meta: {
                //         title: '客服管理'
                //     }
                // },
                {
                    path: '/log',
                    component: () => import( /* webpackChunkName: "log" */ '../pages/Log/Log.vue'),
                    meta: {
                        title: '操作日志'
                    }
                },
                {
                    path: '/coupons',
                    component: () => import( /* webpackChunkName: "coupons" */ '../pages/Coupons/Coupons.vue'),
                    meta: {
                        title: '优惠券'
                    }
                },
                {
                    path: '/financialAudit',
                    component: () => import( /* webpackChunkName: "financialAudit" */ '../pages/FinancialAudit/FinancialAudit.vue'),
                    meta: {
                        title: '财务审核'
                    }
                },
                {
                    path: '/setting',
                    component: () => import( /* webpackChunkName: "setting" */ '../pages/Setting/Setting.vue'),
                    meta: {
                        title: '设置'
                    }
                },
                {
                    path: '/entrepotManage',
                    component: () => import( /* webpackChunkName: "entrepotManage" */ '../pages/EntrepotManage/EntrepotManage.vue'),
                    meta: {
                        title: '仓库管理'
                    }
                },
                {
                    path: '/staffManage',
                    component: () => import( /* webpackChunkName: "staffManage" */ '../pages/StaffManage/StaffManage.vue'),
                    meta: {
                        title: '员工管理'
                    }
                },
                {
                    path: '/financeManage',
                    component: () => import( /* webpackChunkName: "financeManage" */ '../pages/FinanceManage/FinanceManage.vue'),
                    meta: {
                        title: '财务管理'
                    }
                },
                {
                    path: '/404',
                    component: () => import( /* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: {
                        title: '404'
                    }
                },
                {
                    path: '/403',
                    component: () => import( /* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: {
                        title: '403'
                    }
                },
            ]
        },
        {
            path: '/login',
            component: () => import( /* webpackChunkName: "login" */ '../components/page/Login.vue'),
            meta: {
                title: '登录'
            }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});