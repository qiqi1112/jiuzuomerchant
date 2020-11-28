let api, tengxun, file,imgHead, token
import axios from 'axios'

if (process.env.NODE_ENV === "development") {
  api = "/api";
  file = "/file"
  tengxun = "/map";
  imgHead = '/file/merchant/store/system/upload/down?keyName=';
} else if(process.env.NODE_ENV === "testing"){
  api = 'https://storetest.cdhqht.com'
  file = 'https://storetest.cdhqht.com'
  tengxun = 'https://apis.map.qq.com'
  imgHead = 'https://storetest.cdhqht.com/merchant/store/system/upload/down?keyName=';
}else{
  api = 'https://store.cdhqht.com'
  file = 'https://store.cdhqht.com'
  tengxun = 'https://apis.map.qq.com'  
  imgHead = 'https://store.cdhqht.com/merchant/store/system/upload/down?keyName=';
}


const api_request = axios.create({
  baseURL: api,
  timeout: 20000
})
console.log(imgHead)
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
  // axios.defaults.headers.common["X-Store-Token"] = token;
  config.headers.common['X-Store-Token'] = token
  return config;
});

map_request.interceptors.request.use(config => {
  return config;
});

file_request.interceptors.request.use(config => {
  token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''
  // axios.defaults.headers.common["X-Store-Token"] = token;
  config.headers.common['X-Store-Token'] = token
  return config;
});

export {
  api_request,
  map_request,
  file_request,
  imgHead
};