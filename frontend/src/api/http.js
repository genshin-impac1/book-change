import axios from 'axios'
import router from '@/router'
import { Message } from 'element-ui'

const service = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 15000
})

// 请求拦截
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截
service.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      Message.error('登录过期，请重新登录')
      localStorage.removeItem('token')
      this.$store.commit('setUser', null)
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service