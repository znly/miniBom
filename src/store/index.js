// store.js
import { createStore } from 'vuex';
 
export default createStore({
  state() {
    return {
      // 状态定义
      language:'zh-cn',//全局语言
      user:null,//存储用户信息
      token:null,//用户token
    };
  },
  mutations: {
    // 状态变更函数
  },
  actions: {
    // 异步操作
  },
  modules: {
    // 模块化状态管理
  }
});