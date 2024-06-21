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
  //更新属性
  updateAttr(id,type,description,descriptionEn){
    return request({
      url:'/idme/attribute/update',
      method:'post',
      data:{
        id,type,description,descriptionEn
      }
    })
  },

  //删除属性
  deleteAttr(id){
    return request({
      url:'/idme/attribute/delete/'+id,
      method:'delete'
    })
  },
  





  // ----------分类相关api---------

  //分页查询分类节点
  pageQueryClass(name,curPage,pageSize){
    return request({
        url:'/idme/classification/page',
        method:'post',
        data:{name,curPage,pageSize}
    })
  },
  //树状查询分类
  treeQueryClass(){
    return request({
      url:'/idme/classification/tree',
      method:'get'
    })
  },
  //删除分类


  //获取分类详细信息
  getNodeAttr(id){
    return request({
      url:'/idme/classification/getAttr/'+id
    })
  },

  //更新分类
  updateClassificationNode(id,name,nameEn,description,descriptionEn,instantiable){
    return request({
      url:'/idme/classification/update',
      method:'post',
      data:{
        id,name,nameEn,description,descriptionEn,instantiable
      }
    })
  },

  //添加属性
  createClassificationNode(businessCode,name,nameEn,description,disableFlag,instantiable,parentNode) {
    return request({
      url: "/idme/classification/create",
      method: "post",
      data: {
        businessCode,
        name,
        nameEn,
        description,
        disableFlag,
        instantiable,
        parentNode
      },
    });
  },
};
