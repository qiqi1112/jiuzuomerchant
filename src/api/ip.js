let api, tengxun, file, token
import axios from 'axios'

if (process.env.NODE_ENV === "development") {
  api = "/api";
  file = "/file"
  tengxun = "/map";
} else if (process.env.NODE_ENV === "testing") {
  api = 'https://storetest.cdhqht.com'
  file = 'https://storetest.cdhqht.com'
  tengxun = 'https://apis.map.qq.com'
} else {
  api = 'https://store.cdhqht.com'
  file = 'https://store.cdhqht.com'
  tengxun = 'https://apis.map.qq.com'
}

console.log(api)


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
  file_request
};