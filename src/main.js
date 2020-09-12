import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import store from './store/store'
import VueSocketIO from 'vue-socket.io'
import {
    messages
} from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import {
    post,
    get,
    Delete,
    put
} from './api/index';
import 'element-ui/lib/theme-chalk/index.css';
import regular from './utils/regular'
import less from 'less'
import filter from './utils/filter'

Vue.use(less)
Vue.prototype.$regular = regular
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$Delete = Delete;
Vue.prototype.$put = put;


Vue.use(new VueSocketIO({
    debug: true,
    connection: 'http://192.168.31.94:9210',
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    },
    options: {
        path: "/socket.io",
        transports: [/*'polling', */'websocket'],
        query: {
        token: `eyJhbGciOiJSUzI1NiJ9.eyJpZCI6MywiZXhwIjoxNTk5OTg0MjIxLCJwaG9uZSI6IjE4MjgxOTExMDU0IiwidXNlcm5hbWUiOiLlvpDnrJEifQ.0exQHSnN172xd1RQAlZKu1aXmik1pMun02xgBzEh6eGQe0SpDWDhpzhPali_Fa9K6XAx_Idza4M3m_i4Wkdzq3uuRvYEK_6ziQRhdzimZ1-p1ikAs6K3fptLTpU2uGUXjBHCkfc2aU4mxZap_fvu8dP3o-jdAUqgNcC5D6k-PuA`,
        signature:'123456'
    }}
}))

// Vue.use(VueSocketio, SocketIO('http://192.168.31.94:9210'),{
//     query: {
//         token: JSON.parse(localStorage.getItem('userInfo')).token,
//         signature:'123456'
//     }
// });


Vue.config.productionTip = false;
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | 上座`;


//     const role = JSON.parse(localStorage.getItem('userInfo'))|| ''
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === '1' ? next() : next('/403');
//     } else {
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// });

new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app');