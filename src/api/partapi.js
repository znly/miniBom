//部件管理相关api
import request from "./request"

export default{
    //创建部件
    create(partType,source,){
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