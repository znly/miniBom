//部件管理相关api
import request from "./request";

export default {
  //分页查询部件
  queryPart(id,name,curPage, pageSize) {
    return request({
      url: "/idme/part/query",
      method: "post",
      data: { id, name,curPage, pageSize },
    });
  },
  //创建部件
  create(source,branch,master,name,partType,extAttrs,clsAttrs) {
    return request({
      url: "/idme/part/create",
      method: "post",
      data: {source,branch,master,name,partType,extAttrs,clsAttrs},
    });
  },

  //删除部件
  deletePart(masterId, modifier) {
    return request({
      url: "/idme/part/delete",
      method: "post",
      data: {
        masterId,
        modifier,
      },
    });
  },
  //更新部件
  updatePart(id, name, creator, modifier, description, source, partType) {
    return request({
      url: "/idme/part/update",
      method: "post",
      data: { id, name, creator, modifier, description, source, partType },
    });
  },
  //获取部件的所有版本
  allVersion(masterId, version, curPage, pageSize) {
    return request({
      url: "/idme/part/allversions",
      method: "post",
      data: { masterId, version, curPage, pageSize },
    });
  },

  //获取Part对应版本信息
  version(masterId,version,Iteration){
    return request({
      url:'/idme/part/version',
      method:'post',
      data:{masterId,version,Iteration}
    })
  },

  //删除小版本 传入id和版本号
  delVersion(masterId,version){
    return request({
      url:'/idme/part/delbranch',
      method:'post',
      data:{masterId,version}
    })
  },

  //修订part
  revisePart(masterId){
    return request({
      url:'/idme/part/revise/'+masterId,
      method:'post',
    })
  }
};
