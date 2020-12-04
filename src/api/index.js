import request from '../utils/request';
import axios from 'axios'

import router from "../router";
import {
    api_request,
    map_request,
    file_request,
    imgHead
} from "./ip";
import Message from "element-ui/packages/message/index.js";

// axios.defaults.timeout = 10000; //请求超时时间 单位(毫秒)
// axios.defaults.baseURL = 'http://47.108.204.66:8077'
// axios.defaults.baseURL = './baseUrl'; //默认地址

// axios.interceptors.response.use(
//     function (response) {
//         console.log(response.data.code)

//         debugger


//         if (response.status == 200) {
//             return response;
//         } else if (response.data.code === 0) {
//             return response;
//         } else if (response.data.code === 660 || response.data.code == 700) {
//             //如果未登录或者被禁用，就直接跳到登录页面
//             localStorage.removeItem('userInfo');
//             router.push("/login");
//             Message.error(response.data.msg);
//             return Promise.reject(response.data);
//         } else {
//             return Promise.reject(response.data);
//         }
//     },
//     function (error) {
//         console.log(error)

//         debugger


//         console.log(error)
//         if (error.message.includes("timeout")) {
//             // 判断请求异常信息中是否含有超时timeout字符串
//             Message.error("网络链接超时...");
//             return Promise.reject(error); // reject这个错误信息
//         }
//         return Promise.reject(error);
//     }
// );

// export const fetchData = query => {
//     return request({
//         url: './table.json',
//         method: 'get',
//         params: query
//     });
// };

const fileUploadUrl = '/merchant/store/system/upload/create';


function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        api_request.post(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function map_get(url, data = {}) {
    return new Promise((resolve, reject) => {
        map_request.get(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function file_get(url, data = {}) {
    return new Promise((resolve, reject) => {
        file_request.get(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function file_post(url, data = {}) {
    return new Promise((resolve, reject) => {
        file_request.post(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}



function get(url, data = {}) {
    return new Promise((resolve, reject) => {
        api_request.get(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function Delete(url, data = {}) {
    return new Promise((resolve, reject) => {
        api_request.delete(url, data).then(response => {
            resolve(response.data);
        }, err => {
            reject(err)
        })
    })
}

function put(url, data = {}) {
    return new Promise((resolve, reject) => {
        api_request.put(url, data).then(response => {
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
    put,
    map_get,
    file_get,
    file_post,
    imgHead,
    fileUploadUrl
}