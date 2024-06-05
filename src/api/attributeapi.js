//属性相关api
import request from "./request";

export default{
    //分页查询属性
    pageQueryAttribute(name,curPage,pageSize){
        return request({
            url:'/idme/pageQueryAttr',
            method:'post',
            data:{
                name,curPage,pageSize
            }
        })
    }


}