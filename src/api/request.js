//进行axios二次封装:使用请求与响应拦截器
import store from "@/store";
import axios from "axios";
import { ElMessage } from "element-plus";

const request = axios.create({
  //基础路径
  //服务器地址
  baseURL: "http://localhost:8080/",
  timeout: 50000, //超时的时间的设置
});
//第二步:request实例添加请求与响应拦截器

request.interceptors.request.use(
  (config) => {
    //从vuex中获取token
    let token = store.state.token;
    // 设置token到请求头中
    if (token) {
      config.headers["token"] = token;
    }
    return config;
  }
);

//第三步:响应拦截器
request.interceptors.response.use(
  (response) => {
    //成功回调
    //简化数据
    return response.data;
  },
  (error) => {
    // 失败回调:处理http网络错误的
    // 定义一个变量:存储网络错误信息
    // let message = "";
    // //http状态码
    // const status = error.code;
    // switch (status) {
    //   default:
    //     message = "网络出现问题";
    //     break;
    // }
    // ElMessage({ type: "error", message: "出错了" });
    console.log("出错了", error);
    return Promise.reject(error);
  }
);
//对外暴露
export default request;
