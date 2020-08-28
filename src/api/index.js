import request from '../utils/request';
import axios from 'axios'

import router from "../router";
// import IP from "./baseUrl";
import Message from "element-ui/packages/message/index.js";

// axios.defaults.timeout = 10000; //请求超时时间 单位(毫秒)

var token = ''
// axios.defaults.baseURL = './baseUrl'; //默认地址
axios.interceptors.request.use(config => {
    token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
    // axios.defaults.headers.common["X-Store-Token"] = token;
    config.headers.common['X-Store-Token'] = token
    return config;
});


axios.interceptors.response.use(
    function (response) {

        if (response.data.code == 0) {
            return response;
        } else if (response.data.code == 700) {
            //未登录 登录失效
            Message.error(response.data.msg);
            return
            localStorage.removeItem('userInfo'); //清除token等保存在本地的参数
            router.push("/login");
            return Promise.reject(response.data);
        } else {
            Message.error(response.data.msg);
            return Promise.reject(response.data);
        }
    },
    function (error) {
        if (error.message.includes("timeout")) {
            // 判断请求异常信息中是否含有超时timeout字符串
            Message.error("网络链接超时...");
            return Promise.reject(error); // reject这个错误信息
        }
        // Do something with response error
        return Promise.reject(error);
    }
);

// export const fetchData = query => {
//     return request({
//         url: './table.json',
//         method: 'get',
//         params: query
//     });
// };

function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.post(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function get(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function Delete(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.delete(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        axios.put(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}


export {
    post,
    get,
    Delete,
    put
}