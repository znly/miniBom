<template>
  <div>
    <!-- <h1>属性管理</h1> -->
    <div style="margin-left: 20px;margin-right: 20px;">
      <!-- 顶部搜索栏 -->
      <div style="display: flex;align-items: center;justify-content: center;">
        <el-radio-group v-model="findType">
          <el-radio value="class">分类信息查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="className" :disabled="findType != 'class'" />
          </el-radio>
          <el-radio value="attribute">属性信息查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="attributeName"
              :disabled="findType != 'attribute'" />
          </el-radio>
        </el-radio-group>
        <el-button type="primary" @click="pageQuery">查询</el-button>
      </div>

      <!-- 分类数据表格展示 -->
      <!-- <div v-show="classList.data.length > 0">
        <el-table :data="classList.data" style="width: 100%;margin-top: 10px;" empty-text="暂无相关数据" border
          ref="classTableRef">
          <el-table-column type="selection" width="55" />
          <el-table-column fixed prop="businessCode" label="编码" width="120" />
          <el-table-column prop="name" label="属性中文名称" width="120" />
          <el-table-column prop="nameEn" label="属性英文名称" width="120" />
          <el-table-column prop="description" label="中文描述" width="120" />
          <el-table-column prop="descriptionEn" label="英文描述" width="120" />
          <el-table-column prop="disableFlag" label="是否有效" width="100">
            <template #default="scope">
              <span v-if="scope.row.disableFlag == true">
                失效
              </span>
              <span v-else>
                有效
              </span>
            </template>
          </el-table-column>
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
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" :icon="Edit" circle
                @click="editDialog = true, selectAttribute.data = scope.row" />
              <el-popconfirm title="确认是否需要删除分类?" @confirm="deleteAttribute(scope.row, 'class')">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 10px;">
          <el-button type="primary" @click="addDialog = true">添加分类</el-button>
          <el-button type="primary" @click="clearSelection">清除选择</el-button>
          <el-button type="danger">批量删除</el-button>
        </div>

        <div style="display: flex;justify-content: center;margin-top: 10px;">
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="classList.total"
            :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
      </div> -->

      <!-- 属性数据表格展示 -->
      <div v-show="tableList.data.length>0">
        <el-table :data="tableList.data" style="width: 100%;margin-top: 10px;" empty-text="暂无相关数据" border
          @select="handleSelectionChange" ref="multipleTableRef" height="500px">
          <el-table-column type="selection" width="55" />
          <el-table-column fixed prop="businessCode" label="编码" width="120" />
          <el-table-column prop="name" label="属性中文名称" width="120" />
          <el-table-column prop="nameEn" label="属性英文名称" width="120" />
          <el-table-column prop="description" label="中文描述" width="120" />
          <el-table-column prop="descriptionEn" label="英文描述" width="120" />
          <el-table-column prop="type" label="类型" width="120" />
          <el-table-column prop="disableFlag" label="是否有效" width="100">
            <template #default="scope">
              <span v-if="scope.row.disableFlag == true">
                失效
              </span>
              <span v-else>
                有效
              </span>
            </template>
          </el-table-column>
          <el-table-column label="属性所在分类" width="120" :hidden="curType=='class'">
            <template #default="scope">
              <el-button size="small" @click="showCategory(scope.$index, scope.row)" :disabled="curType=='class'">
                <el-icon>
                  <View />
                </el-icon>
              </el-button>
            </template>
          </el-table-column>
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
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" :icon="Edit" circle
                @click="editDialog = true, selectAttribute.data = scope.row" />
              <el-popconfirm :title="curType=='class'?'确认是否需要删除分类?':'确认是否需要删除属性?'" @confirm="deleteAttribute(scope.row, 'attribute')">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle />
                </template>
              </el-popconfirm>
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

    </div>

    <!-- 添加属性表单 -->
    <el-dialog v-model="addDialog" title="添加属性" draggable>
      <div>
        <el-form ref="attributeFormRef" style="max-width: 500px" :model="attributeForm" :rules="formRules"
          label-width="auto" class="demo-ruleForm" status-icon>
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
          <el-form-item label="数据类型" prop="type">
            <el-select v-model="attributeForm.type" placeholder="请选择" size="large" style="width: 240px">
              <el-option label="字符串" value="STRING" />
              <el-option label="浮点型" value="DECIMAL" />
            </el-select>
          </el-form-item>
          <el-form-item label="属性状态" prop="enableFlag">
            <el-select v-model="attributeForm.enableFlag" placeholder="请选择" size="large" style="width: 240px">
              <el-option label="有效" value="true" />
              <el-option label="失效" value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="属性类型" prop="aType">
            <el-input v-model="attributeForm.aType" />
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="addattribute">确定</el-button>
        <el-button type="danger" @click="addDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑属性弹窗 -->
    <el-dialog v-model="editDialog" title="编辑属性" draggable>
      <div>
        <el-form ref="attributeFormRef" style="max-width: 500px" :model="selectAttribute.data" :rules="formRules"
          label-width="auto" class="demo-ruleForm" status-icon>
          <el-form-item label="中文名称" prop="name">
            <el-input v-model="selectAttribute.data.name" />
          </el-form-item>
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="selectAttribute.data.nameEn" />
          </el-form-item>
          <el-form-item label="中文描述" prop="description">
            <el-input v-model="selectAttribute.data.description" />
          </el-form-item>
          <el-form-item label="英文描述" prop="descriptionEn">
            <el-input v-model="selectAttribute.data.descriptionEn" />
          </el-form-item>
          <el-form-item label="数据类型" prop="type">
            <el-input v-model="selectAttribute.data.type" disabled />
          </el-form-item>
          <el-form-item label="属性状态" prop="disableFlag">
            <el-input v-model="selectAttribute.data.disableFlag" disabled />
          </el-form-item>
          <el-form-item label="属性类型" prop="aType">
            <el-input v-model="selectAttribute.data.aType" disabled />
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="editAttribute">提交</el-button>
        <el-button type="danger" @click="editDialog = false">取消</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import attributeapi from '@/api/attributeapi'
import { reactive, ref } from 'vue'
import dateUtil from '@/utils/DateUtil'
import { ElMessage } from 'element-plus'
import {
  Delete,
  Edit,
} from '@element-plus/icons-vue'

export default {
  name: 'attribute',

  setup() {
    const tableList = reactive({
      data: [],//数据
      total: 0,//数据总数
    })
    //当前展示的是属性或者分类
    const curType = ref('');
    //查询方式
    const findType = ref('attribute');
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
    //编辑属性弹窗
    const editDialog = ref(false);
    //添加属性表单
    const attributeForm = reactive({
      //中英文名称和中英文描述
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      //数据类型、属性状态、属性类型等
      type: '',
      enableFlag: '',
      aType: '扩展属性'
    })
    //选中要编辑的属性
    const selectAttribute = reactive({
      data: {}
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
      description: [
        { required: true, message: '请输入中文描述', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      descriptionEn: [
        { required: true, message: '请输入英文描述', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      type: [
        { required: true, message: '请输入数据类型', trigger: 'blur' },
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


    //查询分类名称
    const className = ref('');
    //分类数据列表
    const classList = reactive({
      data: [],
      total: 0
    })


    // TODO 表单整体校验 + 登录
    const attributeFormRef = ref(null);
    //添加属性值
    const addattribute = () => {
      //表单校验
      attributeFormRef.value.validate((valid) => {
        if (valid) {
          //通过后调用api创建属性
          attributeapi.createAttr(attributeForm.name, attributeForm.nameEn, attributeForm.description, attributeForm.descriptionEn,
            attributeForm.type, attributeForm.enableFlag).then(res => {
              // console.log(res);
              if (res.code == 200) {
                //创建成功后清空表单
                ElMessage({ type: 'success', message: '创建成功' });
                addDialog.value = false;
                //刷新页面重载数据
                location.reload();
              } else {
                ElMessage({ type: 'error', message: res.msg });
              }
            })
        } else {
          ElMessage({ type: 'warning', message: '请填写必填字段' })
        }
      })
    }

    //分页查询属性值
    function pageQueryAttribute() {
      attributeapi.pageQueryAttribute(attributeName.value, curPage.value, pageSize.value).then(res => {
        // console.log(res);
        if (res.code == 200) {
          attributeList.data = res.data.resultList;
          attributeList.total = res.data.total;
          tableList.data = res.data.resultList;
          tableList.total = res.data.total;
          curType.value = 'attribute';
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //分页查询分类
    function pageQueryClass() {
      attributeapi.pageQueryClass(className.value, curPage.value, pageSize.value).then(res => {
        console.log(res);
        if (res.code == 200) {
          classList.data = res.data.resultList;
          classList.total = res.data.total;
          tableList.data = res.data.resultList;
          tableList.total = res.data.total;
          curType.value = 'class';
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //查询信息
    function pageQuery() {
      //判断根据查询分类还是属性
      if (findType.value == 'attribute') {
        pageQueryAttribute();
      } else {
        pageQueryClass();
      }
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
    //编辑属性
    function editAttribute() {
      //调用api修改


    }
    //删除单个属性
    function deleteAttribute(val, type) {
      console.log('删除当前属性', val, type);
      //调用api删除

    }

    return {
      attributeName, curPage, pageSize, pageQueryAttribute, attributeList, dateUtil, handleSelectionChange, selectList,
      handleSizeChange, handleCurrentChange, showCategory, findType, addDialog, attributeForm, formRules,
      addattribute, attributeFormRef, Edit, Delete, editAttribute, editDialog, selectAttribute, deleteAttribute, pageQuery,
      className, classList,tableList,curType
    }
  },
  created() {
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