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
                    path: '/dashboard',
                    component: () => import( /* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: {
                        title: '系统首页'
                    }
                },
                {
                    path: '/icon',
                    component: () => import( /* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
                    meta: {
                        title: '自定义图标'
                    }
                },
                {
                    path: '/table',
                    component: () => import( /* webpackChunkName: "table" */ '../components/page/BaseTable.vue'),
                    meta: {
                        title: '基础表格'
                    }
                },
                {
                    path: '/tabs',
                    component: () => import( /* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
                    meta: {
                        title: 'tab选项卡'
                    }
                },
                {
                    path: '/form',
                    component: () => import( /* webpackChunkName: "form" */ '../components/page/BaseForm.vue'),
                    meta: {
                        title: '基本表单'
                    }
                },
                {
                    // 富文本编辑器组件
                    path: '/editor',
                    component: () => import( /* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
                    meta: {
                        title: '富文本编辑器'
                    }
                },
                {
                    // markdown组件
                    path: '/markdown',
                    component: () => import( /* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
                    meta: {
                        title: 'markdown编辑器'
                    }
                },
                {
                    // 图片上传组件
                    path: '/upload',
                    component: () => import( /* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
                    meta: {
                        title: '文件上传'
                    }
                },
                {
                    // vue-schart组件
                    path: '/charts',
                    component: () => import( /* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
                    meta: {
                        title: 'schart图表'
                    }
                },
                {
                    // 拖拽列表组件
                    path: '/drag',
                    component: () => import( /* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
                    meta: {
                        title: '拖拽列表'
                    }
                },
                {
                    // 拖拽Dialog组件
                    path: '/dialog',
                    component: () => import( /* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
                    meta: {
                        title: '拖拽弹框'
                    }
                },
                {
                    // 国际化组件
                    path: '/i18n',
                    component: () => import( /* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
                    meta: {
                        title: '国际化'
                    }
                },
                {
                    // 权限页面
                    path: '/permission',
                    component: () => import( /* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
                    meta: {
                        title: '权限测试',
                        permission: true
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
                {
                    path: '/donate',
                    component: () => import( /* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
                    meta: {
                        title: '支持作者'
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