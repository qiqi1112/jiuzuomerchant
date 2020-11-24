let api, tengxun, file, token
import axios from 'axios'
if (process.env.NODE_ENV === "development") {
  api = "/api";
  file = "/file"
  tengxun = "/map";
} else {
  api = 'http://47.108.204.66:8077'
  // api = 'http://192.168.31.100:8077'
  file = 'http://47.108.204.66:8078'
  tengxun = 'http://apis.map.qq.com'
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
  file_request
};