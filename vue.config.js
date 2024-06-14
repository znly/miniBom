const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  //输出文件夹名称
  outputDir: "miniBOM",
  publicPath: "/", //资源路径
  devServer: {
    open: false, //默认关闭自动打开浏览器
    port: 9010,
    //关闭客户端错误弹窗
    client: {
      overlay: false,
    },
  },
});
