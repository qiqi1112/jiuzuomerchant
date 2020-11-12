import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [{
            path: '/',
            redirect: '/login'
        },
        {
            path: '/',
            component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: {
                title: '自述文件'
            },
            children: [
                //--------------自己添加的组件-----------------------
                {
                    path: '/index',
                    component: () => import('../pages/Index/Index.vue'),
                    meta: {
                        title: '系统首页'
                    }
                },
                {
                    path: '/myshop',
                    component: () => import('../pages/MyShop/MyShop.vue'),
                    meta: {
                        title: '我的店铺'
                    }
                },
                {
                    path: '/shopmanage',
                    component: () => import('../pages/ShopManage/ShopManage.vue'),
                    meta: {
                        title: '商品管理'
                    }
                },
                {
                    path: '/clientmanage',
                    component: () => import('../pages/ClientManage/ClientManage.vue'),
                    meta: {
                        title: '客户管理'
                    }
                },
                {
                    path: '/ordermanage',
                    component: () => import('../pages/OrderManage/OrderManage.vue'),
                    meta: {
                        title: '订单管理'
                    }
                },
                {
                    path: '/nummanage',
                    component: () => import('../pages/NumManage/NumManage.vue'),
                    meta: {
                        title: '排号管理'
                    }
                },
                {
                    path: '/adveractivity',
                    component: () => import('../pages/AdverActivity/AdverActivity.vue'),
                    meta: {
                        title: '广告活动'
                    }
                },
                {
                    path: '/comments',
                    component: () => import('../pages/Comments/Comments.vue'),
                    meta: {
                        title: '评论管理'
                    }
                },
                // {
                //     path: '/service',
                //     component: () => import('../pages/Service/Service.vue'),
                //     meta: {
                //         title: '客服管理'
                //     }
                // },
                {
                    path: '/log',
                    component: () => import('../pages/Log/Log.vue'),
                    meta: {
                        title: '操作日志'
                    }
                },
                {
                    path: '/coupons',
                    component: () => import('../pages/Coupons/Coupons.vue'),
                    meta: {
                        title: '优惠券'
                    }
                },
                {
                    path: '/financialAudit',
                    component: () => import('../pages/FinancialAudit/FinancialAudit.vue'),
                    meta: {
                        title: '财务审核'
                    }
                },
                {
                    path: '/setting',
                    component: () => import('../pages/Setting/Setting.vue'),
                    meta: {
                        title: '设置'
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