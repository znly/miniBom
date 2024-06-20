//用户登录相关api
import request from "./request";




export default {
  //用户登录
  login(name,password){
    return request({
        url:'/login',
        method:'Post',
        data:{name,password}
    })
  },
  //用户退出登录
  logout(){
    
  },
  //用户注册
  register(name,password){
    return request({
      url:'/register',
      method:'post',
      data:{name,password}
    })
  }
};
