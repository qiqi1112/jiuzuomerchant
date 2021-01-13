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
                    path: '/carMyShop',
                    component: () => import( /* webpackChunkName: "carMyShop" */ '../pages/MyShop/CarMyShop.vue'),
                    meta: {
                        title: '车行信息'
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
                    path: '/carShopManage',
                    component: () => import( /* webpackChunkName: "carShopManage" */ '../pages/ShopManage/CarShopManage.vue'),
                    meta: {
                        title: '车辆管理'
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
                    path: '/carOrderManage',
                    component: () => import( /* webpackChunkName: "carOrderManage" */ '../pages/OrderManage/CarOrderManage.vue'),
                    meta: {
                        title: '订单管理'
                    }
                },
                {
                    path: '/begintabledetails',
                    component: () => import( /* webpackChunkName: "ordermanage" */ '../pages/Begintabledetails/Begintabledetails.vue'),
                    meta: {
                        title: '开台详情'
                    }
                },
                {
                    path: '/ktv',
                    component: () => import( /* webpackChunkName: "ordermanage" */ '../pages/Begintabledetails/ktv.vue'),
                    meta: {
                        title: '开台详情'
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
                    path: '/tradeOrder',
                    component: () => import( /* webpackChunkName: "tradeOrder" */ '../pages/FinancialAudit/TradeOrder.vue'),
                    meta: {
                        title: '交易订单'
                    }
                },
                {
                    path: '/carTradeOrder',
                    component: () => import( /* webpackChunkName: "carTradeOrder" */ '../pages/FinancialAudit/CarTradeOrder.vue'),
                    meta: {
                        title: '交易订单'
                    }
                },
                // {
                //     path: '/tradeRecord',
                //     component: () => import( /* webpackChunkName: "tradeRecord" */ '../pages/FinancialAudit/TradeRecord.vue'),
                //     meta: {
                //         title: '交易记录'
                //     }
                // },
                {
                    path: '/myAccount',
                    component: () => import( /* webpackChunkName: "myAccount" */ '../pages/FinancialAudit/MyAccount.vue'),
                    meta: {
                        title: '收款账户'
                    }
                },
                {
                    path: '/carMyAccount',
                    component: () => import( /* webpackChunkName: "carMyAccount" */ '../pages/FinancialAudit/CarMyAccount.vue'),
                    meta: {
                        title: '收款账户'
                    }
                },
                {
                    path: '/passwordSetting',
                    component: () => import( /* webpackChunkName: "passwordSetting" */ '../pages/Setting/PasswordSetting.vue'),
                    meta: {
                        title: '收款密码设置'
                    }
                },
                {
                    path: '/carPasswordSetting',
                    component: () => import( /* webpackChunkName: "carPasswordSetting" */ '../pages/Setting/CarPasswordSetting.vue'),
                    meta: {
                        title: '收款密码设置'
                    }
                },
                {
                    path: '/carLog',
                    component: () => import( /* webpackChunkName: "carLog" */ '../pages/Log/CarLog.vue'),
                    meta: {
                        title: '操作日志'
                    }
                },
                {
                    path: '/reserveSetting',
                    component: () => import( /* webpackChunkName: "reserveSetting" */ '../pages/Setting/ReserveSetting.vue'),
                    meta: {
                        title: '预定权限'
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
                    path: '/carEntrepotManage',
                    component: () => import( /* webpackChunkName: "carEntrepotManage" */ '../pages/EntrepotManage/CarEntrepotManage.vue'),
                    meta: {
                        title: '仓库管理'
                    }
                },
                {
                    path: '/carStaffManage',
                    component: () => import( /* webpackChunkName: "carStaffManage" */ '../pages/StaffManage/CarStaffManage.vue'),
                    meta: {
                        title: '员工管理'
                    }
                },
                {
                    path: '/carFinanceManage',
                    component: () => import( /* webpackChunkName: "carFinanceManage" */ '../pages/FinanceManage/CarFinanceManage.vue'),
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