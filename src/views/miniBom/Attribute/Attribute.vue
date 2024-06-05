<template>
  <div>
    <h1>属性管理</h1>
    <div style="margin-left: 20px;margin-right: 20px;">
      <!-- 顶部搜索栏 -->
      <div style="display: flex;align-items: center;">
        <el-radio-group v-model="findType">
          <el-radio value="category">分类信息查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="categoryName"
              :disabled="findType != 'category'" />
          </el-radio>
          <el-radio value="attribute">属性信息查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="attributeName"
              :disabled="findType != 'attribute'" />
          </el-radio>
        </el-radio-group>
        <el-button type="primary" @click="pageQueryAttribute">查询</el-button>
      </div>
      <!-- 数据表格展示 -->
      <el-table :data="attributeList.data" style="width: 100%" empty-text="暂无相关数据" border
        @select="handleSelectionChange" ref="multipleTableRef">
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="businessCode" label="编码" />
        <el-table-column prop="name" label="属性中文名称" />
        <el-table-column prop="nameEn" label="属性英文名称" />
        <el-table-column prop="description" label="中文描述" />
        <el-table-column prop="descriptionEn" label="英文描述" />
        <el-table-column prop="type" label="类型" />
        <el-table-column label="属性所在分类">
          <template #default="scope">
            <el-button size="small" @click="showCategory(scope.$index, scope.row)">
              <el-icon>
                <View />
              </el-icon>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template #default="scope">
            {{ dateUtil.transformDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间">
          <template #default="scope">
            {{ dateUtil.transformDate(scope.row.lastUpdateTime) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations">
          <template #default>
            <el-button link type="primary" size="small" @click="handleClick">
              Detail
            </el-button>
            <el-button link type="primary" size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div style="margin-top: 10px;">
        <el-button type="primary" @click="addDialog = true">添加属性</el-button>
        <el-button type="primary" @click="clearSelection">清除选择</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>

      <div style="display: flex;justify-content: center;margin-top: 10px;">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="attributeList.total"
          :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>

    </div>

    <!-- 添加属性表单 -->
    <el-dialog v-model="addDialog" title="添加属性" draggable>
      <div>
        <el-form ref="attributeFormRef" style="max-width: 500px" :model="attributeForm" :rules="formRules"
          label-width="auto" class="demo-ruleForm" status-icon >
          <el-form-item label="中文名称" prop="name">
            <el-input v-model="attributeForm.name" />
          </el-form-item>
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="attributeForm.nameEn" />
          </el-form-item>
          <el-form-item label="中文描述" prop="description">
            <el-input v-model="attributeForm.description" />
          </el-form-item>
          <el-form-item label="英文描述" prop="descriptionEn">
            <el-input v-model="attributeForm.descriptionEn" />
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="addattribute">确定</el-button>
        <el-button type="danger" @click="addDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import attributeapi from '@/api/attributeapi'
import { reactive, ref } from 'vue'
import dateUtil from '@/utils/DateUtil'
import { ElMessage } from 'element-plus'

export default {
  name: 'attribute',

  setup() {
    //查询方式
    const findType = ref('attribute');
    //种类名称
    const categoryName = ref('');
    //属性名称
    const attributeName = ref('');
    //当前页数
    const curPage = ref(1);
    //每页数量
    const pageSize = ref(10);
    //属性列表
    const attributeList = reactive({
      data: [],//属性数据
      total: 0,//属性总数
    })
    //选中的记录列表
    const selectList = reactive({
      data: [],
    })
    //添加属性弹窗
    const addDialog = ref(false);
    //添加属性表单
    const attributeForm = reactive({
      //中英文名称和中英文描述
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
    })
    //表单校验
    const formRules = {
      name: [
        { required: true, message: '请输入中文名称', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      nameEn: [
        { required: true, message: '请输入英文名称', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
    }
    // TODO 表单整体校验 + 登录
    const attributeFormRef = ref(null);
    //添加属性
    const addattribute = () => {
      //表单校验
      attributeFormRef.value.validate((valid) => {
        if (valid) {
          console.log('通过');
        } else {
          ElMessage({ type: 'warning', message: '请填写必填字段' })
        }
      })
    }


    //分页查询属性值
    function pageQueryAttribute() {
      attributeapi.pageQueryAttribute(attributeName.value, curPage.value, pageSize.value).then(res => {
        console.log(res);
        if (res.code == 200) {
          attributeList.data = res.data.resultList;
          attributeList.total = res.data.total;
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }
    //选择多条记录
    function handleSelectionChange(value) {
      //将选中的加入选择列表中
      selectList.data.push(value);
    }
    //改变页面展示数目
    function handleSizeChange(val) {
      pageSize.value = val;
    }
    //跳转页数
    function handleCurrentChange(val) {
      curPage.value = val;
    }
    //展示属性分类
    function showCategory(index, row) {
      // console.log(index, row);
    }

    return {
      attributeName, curPage, pageSize, pageQueryAttribute, attributeList, dateUtil, handleSelectionChange, selectList,
      handleSizeChange, handleCurrentChange, showCategory, findType, categoryName, addDialog, attributeForm, formRules,
      addattribute,attributeFormRef
    }
  },
  created() {
    // this.pageQueryAttribute();
  },
  methods: {
    //清除所有选择
    clearSelection(rows) {
      this.$refs.multipleTableRef.clearSelection();
    }
  }

}
</script>

<style></style>