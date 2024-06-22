//bom管理相关api

import request from "./request"

export default {

    showAllChildren(pageSize, curPage, objectId) {
        return request({
            url: '/api/BOM/show/' + pageSize + '/' + curPage,
            method: 'post',
            data: {
                "isNeedTotal": true,
                "latestOnly": true,
                "objectId": objectId,
                "role": ""
            }
        })
    },

    //创建bom子项
    createChildren(quantity, sourceId, targetId, referenceDes) {
        return request({
            url: '/api/BOM/create',
            method: 'post',
            data: {
                quantity, sourceId, targetId, referenceDes
            }
        })
    },

    //创建bom树
    createTree(id) {
        return request({
            url: '/api/BOM/createTree',
            method: 'post',
            data: {
                "id": id,
                "modifier": ""
            }
        })
    },

    //删除所选子项
    delete(id) {
        return request({
            url: '/api/BOM/delete',
            method: 'delete',
            data: {
                "id": id,
                "modifier": ""
            }
        })
    },
    

}