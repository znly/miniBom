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
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="partName" :disabled="findType != 'name'" />
          </el-radio>
        </el-radio-group>
        <el-button type="primary" @click="getPartList">查询</el-button>
      </div>
      <!-- 数据表格展示 -->
      <div v-show="partList.data.length > 0">
        <el-table :data="partList.data" style="width: 100%;margin-top: 10px;" empty-text="暂无相关数据" border
          @select="handleSelectionChange" ref="multipleTableRef" height="500px">
          <el-table-column type="selection" width="55" />
          <el-table-column fixed prop="id" label="编码" width="120" />
          <el-table-column prop="name" label="部件名称" width="120" />
          <el-table-column prop="versionCode" label="版本号" width="120" />
          <el-table-column prop="iteration" label="迭代版本号" width="120" />
          <el-table-column prop="description" label="描述" width="120" />
          <el-table-column prop="" label="分类编码" width="120" />
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

          <el-table-column fixed="right" label="操作">
            <template #default="scope">
              <el-button type="primary" :icon="Edit" circle @click="editDialog = true, editPartForm.data = scope.row" />
              <el-popconfirm title="是否确定删除该部件" @confirm="deleteAttribute(scope.row, 'attribute')">
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
        <el-dialog v-model="addDialog" title="添加部件" draggable style="margin-top: 20px;">
          <div>
            <el-radio-group v-model="showMode" size="large">
              <el-radio-button label="基本属性" value="basic" />
              <el-radio-button label="BOM清单" value="bom" />
              <el-radio-button label="版本管理" value="version" />
            </el-radio-group>
          </div>
          <div v-show="showMode == 'basic'">
            <el-form ref="partFormRef" style="max-width: 500px" :model="partForm" :rules="formRules" label-width="auto"
              class="demo-ruleForm" status-icon>
              <el-form-item label="基本属性" style="font-weight: bolder;" />
              <el-form-item label="产品">
                <span>笔记本电脑</span>
              </el-form-item>
              <el-form-item label="部件名称" prop="name">
                <el-input v-model="partForm.name" />
              </el-form-item>
              <el-form-item label="默认单位" prop="deafultUnit">
                <el-select v-model="partForm.defaultUnit" placeholder="请选择默认单位" style="width: 240px">
                  <el-option v-for="(item, key) in options" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="来源" prop="source">
                <!-- <el-input v-model="partForm.source" /> -->
                <el-select v-model="partForm.source" placeholder="请选择来源" style="width: 240px">
                  <el-option v-for="(item, key) in sourceOptions" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="装配模式" prop="pattern">
                <!-- <el-input v-model="partForm.pattern" /> -->
                <el-select v-model="partForm.pattern" placeholder="请选择装配模式" style="width: 240px">
                  <el-option v-for="(item, key) in patternOptions" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="分类" prop="type">
                <!-- <el-input v-model="partForm.type" /> -->
                <el-tree-select v-model="partForm.type" :data="typeOptions.data" render-after-expand="false" accordion
                  :props="treeProps" style="width: 240px" @node-click="nodeClickFun" placeholder="请选择分类">
                  <template #default="{ data: { name } }">
                    {{ name }}
                    <!-- <span style="color: gray">(suffix)</span> -->
                  </template>
                </el-tree-select>
              </el-form-item>

              <el-form-item label="扩展属性" style="font-weight: bolder;" />

              <el-form-item label="分类代码">
                <el-input v-model="partForm.businessCode" disabled />
              </el-form-item>
              <el-form-item label="品牌">
                <el-input v-model="partForm.brand" disabled />
              </el-form-item>
              <el-form-item label="型号">
                <el-input v-model="partForm.mode" disabled />
              </el-form-item>
            </el-form>
          </div>

          <!-- BOM清单 -->

          <!-- 版本管理 -->
          <div v-show="showMode == 'version'">
            <el-table :data="partVersionList">
              <el-table-column label="编码" />
            </el-table>
          </div>
          <div style="margin-top: 20px;">
            <el-button type="primary" @click="addPart">确定</el-button>
            <el-button type="danger" @click="addDialog = false">取消</el-button>
          </div>
        </el-dialog>

        <!-- 编辑部件弹窗 -->
        <el-dialog v-model="editDialog" title="编辑部件" draggable style="margin-top: 20px;">
          <div>
            <el-radio-group v-model="showMode" size="large">
              <el-radio-button label="基本属性" value="basic" />
              <el-radio-button label="BOM清单" value="bom" />
              <el-radio-button label="版本管理" value="version" @click="getVersionList"/>
            </el-radio-group>
          </div>

          <div v-show="showMode == 'basic'">
            <el-form ref="partFormRef" style="max-width: 500px" :model="editPartForm.data" :rules="formRules" label-width="auto"
              class="demo-ruleForm" status-icon>
              <el-form-item label="基本属性" style="font-weight: bolder;" />
              <el-form-item label="产品">
                <span>笔记本电脑</span>
              </el-form-item>
              <el-form-item label="部件名称" prop="name">
                <el-input v-model="editPartForm.data.name" />
              </el-form-item>
              <el-form-item label="默认单位" prop="deafultUnit">
                <el-select v-model="editPartForm.data.defaultUnit" placeholder="请选择默认单位" style="width: 240px">
                  <el-option v-for="(item, key) in options" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="来源" prop="source">
                <el-select v-model="partForm.source" placeholder="请选择来源" style="width: 240px">
                  <el-option v-for="(item, key) in sourceOptions" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="装配模式" prop="pattern">
                <el-select v-model="editPartForm.data.pattern" placeholder="请选择装配模式" style="width: 240px">
                  <el-option v-for="(item, key) in patternOptions" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="分类" prop="type">
                <el-tree-select v-model="editPartForm.data.type" :data="typeOptions.data" render-after-expand="false" accordion
                  :props="treeProps" style="width: 240px" @node-click="nodeClickFun" placeholder="请选择分类">
                  <template #default="{ data: { name } }">
                    {{ name }}
                  </template>
                </el-tree-select>
              </el-form-item>

              <el-form-item label="扩展属性" style="font-weight: bolder;" />

              <el-form-item label="分类代码">
                <el-input v-model="editPartForm.data.businessCode" disabled />
              </el-form-item>
              <el-form-item label="品牌">
                <el-input v-model="editPartForm.data.brand" disabled />
              </el-form-item>
              <el-form-item label="型号">
                <el-input v-model="editPartForm.data.mode" disabled />
              </el-form-item>
            </el-form>
          </div>

          <!-- 版本管理 -->
          <div v-show="showMode=='version'">
            <el-table :data="partVersionList.data">
              <el-table-column label="编码" prop="id"/>
              <el-table-column label="版本号" prop="version"/>
            </el-table>
          </div>

          <div style="margin-top: 20px;">
            <el-button type="primary" @click="editPart">确定</el-button>
            <el-button type="danger" @click="editDialog = false">取消</el-button>
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
import attributeapi from '@/api/attributeapi';
export default {
  name: 'part',
  setup() {
    //基本单位选项
    const options = reactive([
      'PCS', 'SITE', 'SET', 'M', 'EACH', 'HOP', 'M*M', 'TRP', 'MON', 'KG'
    ])
    //分类选项
    const typeOptions = reactive({
      data: []
    })
    //来源选项
    const sourceOptions = reactive([
      '制造', '购买', '购买-单一供应源'
    ])
    //装配模式选项
    const patternOptions = reactive([
      '可分离', '不可分离', '零件'
    ])

    //部件版本列表
    const partVersionList = reactive({
      data: []
    })

    const treeProps = reactive({
      value: 'name',
      label: 'name',
      children: 'children'
    })

    //添加部件弹窗
    const addDialog = ref(false);
    //编辑部件弹窗
    const editDialog = ref(false);

    //编辑部件信息
    const editPartForm = reactive({ data: {} });

    //添加部件表单
    const partForm = reactive({
      //名称，默认单位，装配模式，来源，分类
      name: '',
      defaultUnit: 'PCS',//默认单位
      source: '', //来源
      pattern: '',//装配模式
      type: '', //分类
      businessCode: '',//分类代码
      brand: '',//品牌
      mode: '',//型号
    })

    //表单校验
    const formRules = {
      name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      defaultUnit: [
        { required: true, message: '请选择默认单位', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      source: [
        { required: true, message: '请选择来源', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      pattern: [
        { required: true, message: '请选择装配模式', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      type: [
        { required: true, message: '请选择分类', trigger: 'blur' },
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

    //点击选择分类
    function nodeClickFun(val) {
      // console.log('点击',val);
      partForm.businessCode = val.businessCode;
      partForm.brand = val.name;
      partForm.mode = val.name;
    }

    // TODO 表单整体校验 + 登录
    const partFormRef = ref(null);

    //添加部件方法
    const addPart = () => {
      //表单校验
      partFormRef.value.validate((valid) => {
        if (valid) {
          //调用api创建

        } else {
          ElMessage({ type: 'warning', message: '请按规定填写表单' });
        }
      })
      //表单置空
    }
    //获取分类
    function getType() {
      attributeapi.treeQueryClass().then(res => {
        console.log(res);
        if (res.code == 200) {
          typeOptions.data = res.data;
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }

      })
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
      partapi.queryPart(partId.value, curPage.value, pageSize.value).then(res => {
        console.log(res);
        if (res.code == 200) {
          partList.data = res.data.resList;
          partList.total = res.data.size;
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //编辑部件信息
    function editPart() {

    }

    //获取部件所有版本
    function allVerison() {
      partapi.allVersion('0', '', 1, 10).then(res => {
        // console.log(res);
        if(res.code==200){

          // partVersionList.data = res.data;
        }else{
          ElMessage({type:'error',message:res.msg});
        }
      })
    }

    // 前端分页-切割数据
    //处理当前页面页数变化
    function handleCurrentChange() {
      // 起始位置 = (当前页 - 1) x 每页的大小
      const start = (curPage - 1) * pageSize;
      // 结束位置 = 当前页 x 每页的大小
      const end = curPage * pageSize;
      partList = allList.slice(start, end);
    }
    //展示模式
    const showMode = ref('basic');

    //获取版本管理列表
    function getVersionList(){
      partapi.allVersion(editPartForm.data.id,'',1,100).then(res=>{
        console.log(res);
        partVersionList.data = res.data;
      })
    }

    return {
      addDialog, partForm, addPart, partList, getPartList, findType, partId, partName, dateUtil
      , curPage, pageSize, Delete, Edit, editDialog, formRules, options, typeOptions, getType, treeProps,
      nodeClickFun, partFormRef, sourceOptions, patternOptions, handleCurrentChange, editPart, editPartForm,
      showMode, partVersionList, allVerison,getVersionList
    }
  },
  mounted() {
    this.getType();
    //获取所有版本列表
    // this.allVerison();
  }

}
</script>

<style></style>