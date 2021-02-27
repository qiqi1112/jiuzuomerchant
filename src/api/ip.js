let api, tengxun, file, imgHead, token, rongyunKey
import axios from 'axios'
import router from "../router";
import Message from "element-ui/packages/message/index.js";


if (process.env.NODE_ENV === "development") {
  api = "/api";
  file = "/file"
  tengxun = "/map";
  imgHead = '/file/merchant/store/system/upload/down?keyName=';
  rongyunKey = '82hegw5u8vgdx'
} else if (process.env.NODE_ENV === "testing") {
  api = 'https://storetest.cdhqht.com'
  file = 'https://storetest.cdhqht.com'
  tengxun = 'https://apis.map.qq.com'
  imgHead = 'https://storetest.cdhqht.com/merchant/store/system/upload/down?keyName=';
  rongyunKey = '82hegw5u8vgdx'
} else {
  api = 'https://store.cdhqht.com'
  file = 'https://store.cdhqht.com'
  tengxun = 'https://apis.map.qq.com'
  imgHead = 'https://store.cdhqht.com/merchant/store/system/upload/down?keyName=';
  rongyunKey = 'e0x9wycfepwtq'
}



const api_request = axios.create({
  baseURL: api,
  timeout: 20000
})

const file_request = axios.create({
  baseURL: file,
  timeout: 20000
})

const map_request = axios.create({
  baseURL: tengxun,
  timeout: 20000
})

api_request.interceptors.request.use(config => {
  token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
  config.headers.common['X-Store-Token'] = token
  return config;
});

api_request.interceptors.response.use(
  function (response) {
    if (response.data.code == 700) {
      //如果未登录或者被禁用，就直接跳到登录页面
      localStorage.removeItem('userInfo');
      router.push("/login");
      RongIMClient.getInstance().logout(); //退出登录
      RongIMClient.getInstance().disconnect(); //断开链接
      // Message.error(response.data.msg);
      return Promise.reject(response.data);
    }

    if (response.data.code == 600) {
      // Message.error(response.data.msg);
      return response;
    }

    return Promise.resolve(response);
  },
  function (error) {
    return Promise.reject(error);
  }
)

map_request.interceptors.request.use(config => {
  return config;
});

file_request.interceptors.request.use(config => {
  token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
  config.headers.common['X-Store-Token'] = token
  return config;
});
export {
  api_request,
  map_request,
  file_request,
  imgHead,
  rongyunKey
};