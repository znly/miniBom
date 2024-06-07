<template>
  <div>
    <h1>部件管理</h1>
    <div style="margin-left: 20px;margin-right: 20px;">
      <!-- 顶部搜索栏 -->
      <div style="display: flex;align-items: center;justify-content: center;">
        <el-radio-group v-model="findType">
          <el-radio value="id">按编码查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="partId" :disabled="findType != 'id'" />
          </el-radio>
          <el-radio value="name">按部件名称查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="partName"
              :disabled="findType != 'name'" />
          </el-radio>
        </el-radio-group>
        <el-button type="primary" @click="getPartList">查询</el-button>
      </div>
      <!-- 数据表格展示 -->
      <div v-show="partList.data.length> 0">
        <el-table :data="partList.data" style="width: 100%;margin-top: 10px;" empty-text="暂无相关数据" border
          @select="handleSelectionChange" ref="multipleTableRef" height="500px">
          <el-table-column type="selection" width="55" />
          <el-table-column fixed prop="id" label="编码" width="120" />
          <el-table-column prop="name" label="部件名称" width="120" />
          <el-table-column prop="versionCode" label="版本号" width="120" />
          <el-table-column prop="description" label="描述" width="120" />
          <el-table-column prop="" label="分类编码" width="120" />

          <!-- <el-table-column prop="disableFlag" label="是否有效" width="100">
            <template #default="scope">
              <span v-if="scope.row.disableFlag == true">
                失效
              </span>
              <span v-else>
                有效
              </span>
            </template>
          </el-table-column> -->

          <el-table-column label="创建时间" width="200">
            <template #default="scope">
              {{ dateUtil.transformDate(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column label="更新时间" width="200">
            <template #default="scope">
              {{ dateUtil.transformDate(scope.row.lastUpdateTime) }}
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" >
            <template #default="scope">
              <el-button type="primary" :icon="Edit" circle
                @click="editDialog = true" />
              <el-popconfirm title="是否确定删除该部件"
                @confirm="deleteAttribute(scope.row, 'attribute')">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>


        <div>
          <el-button type="primary" @click="addDialog = true">添加部件</el-button>
        </div>

        <div style="display: flex;justify-content: center;margin-top: 10px;">
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="partList.total"
            :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>




        <!-- 创建部件表单弹窗 -->
        <el-dialog v-model="addDialog" title="添加部件" draggable>
          <div>
            <el-form ref="partFormRef" style="max-width: 500px" :model="partForm" :rules="formRules"
              label-width="auto" class="demo-ruleForm" status-icon>
              <el-form-item label="产品">
                <span>笔记本电脑</span>
              </el-form-item>
              <el-form-item label="部件名称" prop="name">
                <el-input v-model="partForm.name" />
              </el-form-item>
              <el-form-item label="默认单位" prop="deafultUnit">
                <el-input v-model="partForm.defaultUnit" />
              </el-form-item>
              <el-form-item label="来源" prop="source">
                <el-input v-model="partForm.source" />
              </el-form-item>
              <el-form-item label="装配模式" prop="mode">
                <el-input v-model="partForm.mode" />
              </el-form-item>
              <el-form-item label="分类" prop="type">
                <el-input v-model="partForm.type" />
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-button type="primary" @click="addPart">确定</el-button>
            <el-button type="danger" @click="addDialog = false">取消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import dateUtil from '@/utils/DateUtil';
import partapi from '@/api/partapi';
import { ElMessage } from 'element-plus';
import {
  Delete,
  Edit,
} from '@element-plus/icons-vue'
export default {
  name: 'part',
  setup() {

    //添加部件弹窗
    const addDialog = ref(false);
    //编辑部件弹窗
    const editDialog = ref(false);
    //添加部件表单
    const partForm = reactive({
      //名称，默认单位，装配模式，来源，分类
      name:'',
      defaultUnit:'',
      source:'',
      mode:'',
      type:'',
    })

    //表单校验
    const formRules = {
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      defaultUnit: [
        { required: true, message: '请输入默认单位', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      source: [
        { required: true, message: '请输入来源', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      mode: [
        { required: true, message: '请输入装配模式', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      type: [
        { required: true, message: '请输入分类', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      enableFlag: [
        { required: true, message: '请输入属性状态', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      aType: [
        { required: true, message: '请输入属性类型', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
    }

    //添加部件方法
    function addPart() {

      //表单置空
    }

    //查询类型 默认id编码
    const findType = ref('id');
    
    //部件编码
    const partId = ref('');
    //部件名称
    const partName = ref('');
    //当前页数
    const curPage = ref(1);
    //每页数量
    const pageSize = ref(10);

    //部件列表数据
    const partList = reactive({
      data: [],
      total: 0
    })
    //获取部件列表数据
    function getPartList() {
        partapi.queryPart(partId.value,curPage.value,pageSize.value).then(res=>{
          console.log(res);
          if(res.code==200){
            partList.data = res.data.resList;
            partList.total = res.data.size;
          }else{
            ElMessage({type:'error',message:res.msg});
          }
        })
    }

    return {
      addDialog, partForm, addPart, partList, getPartList,findType,partId,partName,dateUtil
      ,curPage,pageSize,Delete,Edit,editDialog,formRules
    }
  }

}
</script>

<style></style>