import axios  from 'axios'
import {Promise} from "q";
import router from '@/router/index'
import './api'


axios.defaults.timeout = 20000;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


axios.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return Promise.resolve(response)
        }else {
            return Promise.reject(response)
        }
    },
    error => {
        if (error.response.status) {
            switch (error.response.status) {
                //未登录
                case 401:
                    router.replace({
                        path: '/login',
                        query: {
                            redirect: router.currentRoute.fullPath
                        }
                    });
                    break;
                //token过期
                case 403:
                    plus.nativeUI.toast(`登录过期，请重新登录`);
                    //清除token
                    setTimeout(() => {
                        router.replace({
                            path: '/login',
                            query: {
                                redirect: router.currentRoute.fullPath
                            }
                        });
                    }, 1000);
                    break;
                default:{
                    let msg;
                    msg = showStatus(error.response.status);
                    plus.nativeUI.toast(msg)}
            }
            return Promise.reject(error.response)
        }
        else {return Promise.reject(error.response)}
    });

export default axios;

//
//根据不同的状态码，生成不同的提示信息
const showStatus = status => {
    let message = "";
    // 这一坨代码可以使用策略模式进行优化
    switch (status) {
        case 400:
            message = "请求错误(400)";
            break;
        case 401:
            message = "未授权，请重新登录(401)";
            break;
        case 403:
            message = "拒绝访问(403)";
            break;
        case 404:
            message = "请求出错(404)";
            break;
        case 408:
            message = "请求超时(408)";
            break;
        case 500:
            message = "服务器错误(500)";
            break;
        case 501:
            message = "服务未实现(501)";
            break;
        case 502:
            message = "网络错误(502)";
            break;
        case 503:
            message = "服务不可用(503)";
            break;
        case 504:
            message = "网络超时(504)";
            break;
        case 505:
            message = "HTTP版本不受支持(505)";
            break;
        default:
            message = `连接出错(${status})!`;
    }
    return `${message}，请检查网络或联系管理员！`;
};


