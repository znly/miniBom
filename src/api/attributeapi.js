//属性相关api
import request from "./request";

export default {
  //分页查询属性
  pageQueryAttribute(name, curPage, pageSize) {
    return request({
      url: "/idme/attribute/pageQueryAttr",
      method: "post",
      data: {
        name,
        curPage,
        pageSize,
      },
    });
  },
  //添加属性
  createAttr(name, nameEn, description, descriptionEn, type, enableFlag) {
    return request({
      url: "/idme/attribute/createAttr",
      method: "post",
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        type,
        enableFlag,
      },
    });
  },

  //分页查询分类
  pageQueryClass(name,curPage,pageSize){
    return request({
        url:'/idme/classification/page',
        method:'post',
        data:{name,curPage,pageSize}
    })
  }
};
