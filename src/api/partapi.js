//部件管理相关api
import request from "./request"

export default{
    //分页查询部件
    queryPart(id,curPage,pageSize){
        return request({
            url:'/idme/part/query',
            method:'post',
            data:{id,curPage,pageSize}
        })
    },
    //创建部件
    create(partType,source){
        return request({
            url:'/createPart',
            method:'post',
            data:{
                
            }
        })
    },
    //删除部件
    deletePart(masterId,modifier){
        return request({
            url:'/deletePart',
            method:'post',
            data:{
                masterId,modifier
            }
        })
    }

}