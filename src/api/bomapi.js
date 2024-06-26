//bom管理相关api

import request from "./request";

export default {
  showAllChildren(pageSize, curPage, objectId) {
    return request({
      url: "/api/BOM/show/" + pageSize + "/" + curPage,
      method: "post",
      data: {
        isNeedTotal: true,
        latestOnly: true,
        objectId: objectId,
        role: "",
      },
    });
  },

  // queryRelatedPart(pageSize, curPage, objectId) {
  //   return request({
  //     url: "/api/BOM/show/" + pageSize + "/" + curPage,
  //     method: "post",
  //     data: {
  //       isNeedTotal: true,
  //       latestOnly: true,
  //       objectId: objectId,
  //       role: "",
  //     },
  //   });
  // },

  //创建bom子项
  createChildren(quantity, sourceId, targetId, referenceDes) {
    return request({
      url: "/api/BOM/create",
      method: "post",
      data: {
        quantity,
        sourceId,
        targetId,
        referenceDes,
      },
    });
  },

  //创建bom树
  createTree(id) {
    return request({
      url: "/api/BOM/createTree",
      method: "post",
      data: {
        id
      },
    });
  },

  //修改位号
  editBOMUsesOccurrence(data) {
    return request({
      url: "/api/BOMUsesOccurrence/update",
      method: "put",
      data: data,
    });
  },

  //删除所选子项
  delete(id) {
    return request({
      url: "/api/BOM/delete",
      method: "delete",
      data: {
        id: id,
        bomLinkId:id,
        modifier: "",
      },
    });
  },

  //----------bomlinks接口-----------
  //根据ID查询
  getBOMlinks(id) {
    return request({
      url: "/api/BOMLink/getBOMLinks",
      method: "post",
      data: {
        decrypt: true,
        id: id,
      },
    });
  },

  //创建BOMlink
  createBOMLink(data) {
    return request({
      url: "/api/BOMLink/create",
      method: "post",
      data: data,
    });
  },
  createBOMLinkTwo(data) {
    return request({
      url: "/api/BOM/create",
      method: "post",
      data: data,
    });
  },
  createBOMLinkbatchCreate(data) {
    return request({
      url: "/api/BOMLink/batchCreate",
      method: "post",
      data: data,
    });
  },

  //删除BOMlink
  deleteBOMLink(id) {
    return request({
      url: "/api/BOMLink/delete",
      method: "delete",
      data: { id: id, modifier: "" },
    });
  },

  //修改BOMlink
  updateBOMLink() {
    return request({
      url: "/api/BOMLink/update",
      method: "put",
      data: {},
    });
  },

  //修改BOMlink
  updateDesBOMLink(data) {
    return request({
      url: "/api/BOMLink/update",
      method: "put",
      data: data,
    });
  },

  //获取父项
  queryTarget(pageSize, curPage,id) {
    return request({
      url: "/api/BOMLink/queryTarget/" + pageSize + "/" + curPage,
      method: "post",
      data: {
        latestOnly: true,
        sourceId: id,
        targetType: "",
      },
    });
  },

  //获取子项
  queryRelatedPart(pageSize, curPage,id) {
    return request({
      url: "/api/BOMLink/queryRelatedPart/" + pageSize + "/" + curPage,
      method: "post",
      data: {
        isNeedTotal: true,
        latestOnly: true,
        objectId: id,
        role: "Source",
      },
    });
  },
};
