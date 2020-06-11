import axios from 'axios'
import QS from 'qs'

//是否运行后端携带cookies
axios.defaults.withCredentials = true
    //处理post请求
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    //经过proxy代理后的接口地址
axios.defaults.baseURL = '/api/'
    //请求拦截器
axios.interceptors.request.use(
        function(config) {
            return config
        },
        function(error) {
            return Promise.reject(error)
        }
    )
    //响应拦截器
axios.interceptors.response.use(
    function(response) {
        return response
    },
    function(error) {
        return Promise.reject(error)
    }
)

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .get(url, {
                params: params,
            })
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
    return new Promise((resolve, reject) => {
        axios
            .post(url, QS.stringify(params))
            .then((res) => {
                resolve(res.data)
            })
            .catch((err) => {
                reject(err.data)
            })
    })
}