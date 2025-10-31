// plugins/axios.js
export default function({ $axios, redirect }, inject) {
  // 请求拦截器
  $axios.interceptors.request.use(config => {
    // 示例：添加 token
    if (process.client) { // 客户端环境下读取 localStorage
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.common['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  })

  // 响应拦截器
  $axios.interceptors.response.use(
    response => response,
    error => {
      const { status } = error.response || {}
      if (status === 401) {
        redirect('/') // 未授权时跳转到首页
      }
      return Promise.reject(error)
    }
  )

  // 可选：注入自定义 axios 实例（如果需要）
  inject('api', $axios)
}