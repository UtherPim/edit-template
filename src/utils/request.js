import axios from 'axios'
import { Message } from 'element-ui'
import vm from '../main'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // baseURL: 'http://192.168.0.139:8081', // url = base url + request url
  // baseURL: 'http://192.168.0.99:8081', // url = base url + request url
  // baseURL: 'http://192.168.0.139:8081', // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if ('condition') {
      // let each request carry token
      // ['token'] is a custom headers key
      // please modify it according to the actual situation
    }
    // console.log(config)
    return config
  },
  error => {
    // do something with request error
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // if the custom code is not 20000, it is judged as an error.
    if (res.sign !== 'SUCCESS') {
      if (res.desc === '密码错误') {
        Message({
          message: res.desc || 'Error',
          type: 'error',
          duration: 2 * 1000
        })
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.sign === 'LOGIN') {
        // to re-login
        // MessageBox.confirm('您已被登出或未登录，您可以取消以停留在此页面，或重新登录', '确认登出', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(_ => {
        //     vm.$router.push(`/login?redirect=${vm.$route.fullPath}`)
        //   })
        // })
        return res
      }
      vm.$notify.error({
        title: 'error',
        message: res.desc || res || 'error',
        position: 'bottom-right',
        duration: 2 * 1000
      })
      // return Promise.reject(new Error(res.desc))
      // if (res.sign === 'FAIL') {
      //   return { ...res, data: { list: [] }}
      // }
      if (res.sign === 'FAIL') {
        return Promise.reject(res)
      }
      return res
    } else {
      if (!res.data) {
        return { ...res, data: { list: [], total: 0 }}
      }
      return res
    }
  },
  error => {
    vm.$notify.error({
      title: 'error',
      message: error.desc || error || 'error',
      position: 'bottom-right',
      duration: 2 * 1000
    })
    // 返回登录页,不包含fail的处理，只处理断网的情况
    if (error.sign != 'FAIL') {
      var redirectPath = vm.$route.fullPath
      var prefix = '/login?redirect='
      if (redirectPath.indexOf(prefix) === -1) { // 是否包含了登录路径前缀
        redirectPath = prefix + redirectPath
      }
    }
    // Message({
    //   message: error.desc || error || 'error',
    //   type: 'error',
    //   duration: 2 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service
