<template>
  <div>
    <h1>{{ findType == 'class' ? '分类' : '属性' }}管理</h1>
    <div style="margin-left: 20px;margin-right: 20px;">
      <!-- 顶部搜索栏 -->
      <div style="display: flex;align-items: center;justify-content: center;">
        <el-radio-group v-model="findType">
          <el-radio value="class" @click="handleSwitch">分类信息查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="className" :disabled="findType != 'class'" />
          </el-radio>
          <el-radio value="attribute" @click="handleSwitch">属性信息查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="attributeName"
              :disabled="findType != 'attribute'" />
          </el-radio>
        </el-radio-group>
        <el-button type="primary" @click="pageQuery">查询</el-button>
      </div>

      <!-- 属性数据表格展示 -->
      <div>
        <el-table :data="tableList.data" style="width: 100%;margin-top: 10px;" empty-text="暂无相关数据" border
          @select="handleSelectionChange" ref="multipleTableRef" height="500px">
          <el-table-column type="selection" width="55" />

          <el-table-column fixed prop="businessCode" :label="findType == 'attribute' ? '编码' : '分类码'" width="120">
            <template #default="scope">
              <span v-if="scope.row.className == 'ClassificationNode'" style="cursor: pointer;color:royalblue"
                @click="showClassInfo(scope.row)">
                {{ scope.row.businessCode }}
              </span>
              <span v-else>
                {{ scope.row.businessCode }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="name" :label="findType == 'class' ? '分类中文名称' : '属性中文名称'" width="120">
            <template #default="scope">
              <span v-if="scope.row.className == 'ClassificationNode'" style="cursor: pointer;color:royalblue"
                @click="showClassInfo(scope.row)">
                {{ scope.row.name }}
              </span>
              <span v-else>
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="nameEn" :label="findType == 'class' ? '分类英文名称' : '属性英文名称'" width="120" />
          <el-table-column prop="description" label="中文描述" width="120" />
          <el-table-column prop="descriptionEn" label="英文描述" width="120" />
          <el-table-column prop="type" label="类型" width="120" v-if="findType == 'attribute'">
            <template #default="scope">
              <span v-if="scope.row.type == 'STRING'">
                字符串
              </span>
              <span v-else>
                数值型
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="disableFlag" label="是否有效" width="100" v-if="findType == 'attribute'">
            <template #default="scope">
              <span v-if="scope.row.disableFlag == true">
                失效
              </span>
              <span v-else>
                有效
              </span>
            </template>
          </el-table-column>

<!--          <el-table-column prop="instantiable" label="是否实例化" width="100" v-if="findType == 'class'">
            <template #default="scope">
              <span v-if="scope.row.instantiable == true">
                是
              </span>
              <span v-else>
                否
              </span>
            </template>
          </el-table-column>-->
          <el-table-column label="属性所在分类" width="120" v-if="findType == 'attribute'">
            <template #default="scope">
              <el-button size="small" @click="showCategory(scope.$index, scope.row)" :disabled="curType == 'class'">
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
              <el-button type="primary" :icon="Edit" circle @click="showEditDialog(scope.row)" />
              <el-popconfirm :title="curType == 'class' ? '确认是否需要删除分E类?' : '确认是否需要删除属性?'"
                @confirm="deleteAttribute(scope.row, 'attribute')">
                <template #reference>
                  <el-button type="danger" :icon="Delete" circle />
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

        <div style="margin-top: 10px;">
          <el-button type="primary" @click="findType == 'attribute'?addDialog = true:addClassDialog = true">
            <span>
              {{ findType == 'attribute' ? '创建属性' : '创建分类' }}
            </span>
          </el-button>
          <el-button type="primary" @click="clearSelection">清除选择</el-button>
          <el-button type="danger">批量删除</el-button>
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
            <el-input v-model="selectAttribute.data.name" disabled/>
          </el-form-item>
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="selectAttribute.data.nameEn" disabled/>
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
<!--          <el-form-item label="属性类型" prop="aType">
            <el-input v-model="selectAttribute.data.aType" disabled />
          </el-form-item>-->
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="editAttribute">提交</el-button>
        <el-button type="danger" @click="editDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 创建分类表单 -->
    <el-dialog v-model="addClassDialog" title="创建分类" draggable>
      <div>
        <el-form ref="classFormRef  " style="max-width: 500px" :model="classForm" :rules="formRules"
          label-width="auto" class="demo-ruleForm" status-icon>
          <el-form-item label="中文名称" prop="name">
            <el-input v-model="classForm.name" />
          </el-form-item>
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="classForm.nameEn" />
          </el-form-item>
          <el-form-item label="中文描述" prop="description">
            <el-input v-model="classForm.description" />
          </el-form-item>
          <el-form-item label="英文描述" prop="descriptionEn">
            <el-input v-model="classForm.descriptionEn" />
          </el-form-item>

          <!-- <el-form-item label="属性状态" prop="enableFlag">
            <el-select v-model="attributeForm.enableFlag" placeholder="请选择" size="large" style="width: 240px">
              <el-option label="有效" value="true" />
              <el-option label="失效" value="false" />
            </el-select>
          </el-form-item>
          <el-form-item label="属性类型" prop="aType">
            <el-input v-model="attributeForm.aType" />
          </el-form-item> -->
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="addClass">确定</el-button>
        <el-button type="danger" @click="addClassDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑分类弹窗 -->
    <el-dialog v-model="editClassDialog" title="编辑分类" draggable>
      <div>
        <el-form ref="attributeFormRef" style="max-width: 500px" :model="selectClass.data" :rules="classFormRules"
          label-width="auto" class="demo-ruleForm" status-icon>
          <el-form-item label="中文名称" prop="name">
            <el-input v-model="selectClass.data.name" />
          </el-form-item>
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="selectClass.data.nameEn" />
          </el-form-item>
          <el-form-item label="中文描述" prop="description">
            <el-input v-model="selectClass.data.description" />
          </el-form-item>
          <el-form-item label="英文描述" prop="descriptionEn">
            <el-input v-model="selectClass.data.descriptionEn" />
          </el-form-item>
          <el-form-item label="是否实例化" prop="instantiable">
            <el-radio-group v-model="selectClass.data.instantiable">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
<!--          <el-form-item label="数据类型" prop="type">
            <el-input v-model="selectClass.data.type" disabled />
          </el-form-item>
          <el-form-item label="属性状态" prop="disableFlag">
            <el-input v-model="selectClass.data.disableFlag" disabled />
          </el-form-item>
          <el-form-item label="属性类型" prop="aType">
            <el-input v-model="selectClass.data.aType" disabled />
          </el-form-item>-->
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="editClass">提交</el-button>
        <el-button type="danger" @click="editClassDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 添加分类表单 -->
    <el-dialog v-model="addClassDialog" title="添加分类" draggable>
      <div>
        <el-form ref="attributeFormRef" style="max-width: 500px" :model="ClassForm" :rules="classFormRules"
                 label-width="auto" class="demo-ruleForm" status-icon>
          <el-form-item label="商业码" prop="businessCode">
            <el-input v-model="ClassForm.businessCode" />
          </el-form-item>
          <el-form-item label="中文名称" prop="name">
            <el-input v-model="ClassForm.name" />
          </el-form-item>
          <el-form-item label="英文名称" prop="nameEn">
            <el-input v-model="ClassForm.nameEn" />
          </el-form-item>
          <el-form-item label="中文描述" prop="description">
            <el-input v-model="ClassForm.description" />
          </el-form-item>
          <el-form-item label="是否实例化" prop="instantiable">
            <el-radio-group v-model="ClassForm.instantiable">
              <el-radio label="true">是</el-radio>
              <el-radio label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否生效" prop="disableFlag">
            <el-radio-group v-model="ClassForm.disableFlag">
              <el-radio label="false">是</el-radio>
              <el-radio label="true">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="父节点" prop="parentNode.id">
            <!-- <el-input v-model="partForm.type" /> -->
            <el-tree-select v-model="ClassForm.parentNode.id" :data="typeOptions.data" render-after-expand="false" accordion
                            :props="treeProps" style="width: 240px" @node-click="nodeClickFun" placeholder="请选择分类">
              <template #default="{ data: { name } }">
                {{ name }}
                <!-- <span style="color: gray">(suffix)</span> -->
              </template>
            </el-tree-select>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="addClass">确定</el-button>
        <el-button type="danger" @click="addClassDialog = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 展示分类详细信息 -->
    <el-dialog title="分类详细信息" v-model="classInfoDialog" draggable style="margin-top: 10px;">
      <div>
        <el-collapse v-model="activeNames" @change="handleActiveChange">
          <el-collapse-item title="分类信息" name="1">
            <div style="text-align: left;">
              <div>
                <span style="font-weight: bold;">
                  分类码:
                </span>
                {{ curClass.data.businessCode }}
              </div>
              <div>
                <span style="font-weight: bold;">
                  中文名称:
                </span>{{ curClass.data.name }}
              </div>
              <div>
                <span style="font-weight: bold;">
                  英文名称:
                </span>{{ curClass.data.nameEn }}
              </div>
              <div>
                <span style="font-weight: bold;">
                  分类父节点:
                </span>
              </div>
            </div>

          </el-collapse-item>
          <el-collapse-item title="属性信息" name="2">
            <el-table :data="curClass.attrList" empty-text="暂无属性">
              <el-table-column label="中文名称" prop="name"></el-table-column>
              <el-table-column label="英文名称" prop="nameEn"></el-table-column>
            </el-table>
          </el-collapse-item>
        </el-collapse>
      </div>

    </el-dialog>

    <div style="display: flex;justify-content: center;margin-top: 10px;height: 35px;background-color: white;">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="tableList.total"
        :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

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
    //存储表格数据
    const tableList = reactive({
      data: [],//数据
      total: 0,//数据总数
    })
    //存储所有数据
    const allList = reactive({
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
    //添加分类弹窗
    const addClassDialog = ref(false);
    //编辑属性弹窗
    const editDialog = ref(false);
    //编辑分类弹窗
    const editClassDialog = ref(false);
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
    //添加分类表单
    const ClassForm = reactive({
      //中英文名称和中英文描述
      businessCode: '',
      name: '',
      nameEn: '',
      description: '',
      disableFlag: '',
      instantiable: '',
      parentNode:{
        id: ''
      }
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

    const classFormRules = {
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
      disableFlag: [
        { required: true, message: '请选择是否生效', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      instantiable: [
        { required: true, message: '请选择是否实例化', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      descriptionEn: [
        { required: true, message: '请输入英文描述', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
    }


    //查询分类名称
    const className = ref('');
    //分类数据列表
    const classList = reactive({
      data: [],
      total: 0
    });

    const treeProps = reactive({
      value: 'id',
      label: 'name',
      children: 'children'
    });

    const typeOptions = reactive({
      data: []
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
    //添加分类
    function addClass(){
      classFormRef.value.validate((valid)=>{
        if(valid){
          //请求api添加分类

        }
        else {
          ElMessage({ type: 'warning', message: '请填写必填字段' })
        }
      })
    }

    //分页查询属性值
    function pageQueryAttribute() {
      attributeapi.pageQueryAttribute(attributeName.value, curPage.value, pageSize.value).then(res => {
        // console.log(res);
        if (res.code == 200) {
          // attributeList.data = res.data.resultList;
          // attributeList.total = res.data.total;
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
          tableList.data = res.data.resultList;
          tableList.total = res.data.total;
          curType.value = 'class';
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //查询信息 根据type判断是查询属性还是分类
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
      //根据类型查询不同的
      if (curType.value == 'attribute') {
        pageQueryAttribute();
      } else {
        pageQueryClass();
      }
    }
    //展示属性分类
    function showCategory(index, row) {
      // console.log(index, row);
    }
    //编辑属性
    function editAttribute() {
      //调用api修改
      // console.log('当前选择的属性',selectAttribute.data);
      attributeapi.updateAttr(selectAttribute.data.id, selectAttribute.data.type, selectAttribute.data.description,
        selectAttribute.data.descriptionEn
      ).then(res => {
        if (res.code == 200) {
          ElMessage({ type: 'success', message: '修改成功' });
          //关闭修改弹窗
          editDialog.value = false;
          //可以刷新页面重新获取数据但没必要
          // setTimeout(() => {
          //   location.reload();
          // }, 500);
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }



    //处理当前页面页数变化
    function handleCurrentChange(val) {
      curPage.value = val;
      //根据类型查询不同的
      if (curType.value == 'attribute') {
        pageQueryAttribute();
      } else {
        pageQueryClass();
      }
    }


    //当前分类信息
    const curClass = reactive({
      data: {},
      attrList: [],//属性列表
    });
    //展示分类详细信息
    function showClassInfo(val) {
      attributeapi.getNodeAttr(val.id).then(res => {
        console.log('获取分类详细信息', res);
        if (res.code == 200) {
          //展示弹窗
          classInfoDialog.value = true;
          curClass.data = val;
          curClass.attrList = res.data;
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }
    //展示分类信息弹窗
    const classInfoDialog = ref(false);
    const activeNames = ref('');
    function handleActiveChange(val) {
      activeNames.value = val;
    }

    //当前选中编辑的分类
    const selectClass = reactive({
      data: {}
    });

    //显示编辑弹窗 分类和属性共用
    function showEditDialog(val) {
      if (val.className == "ClassificationNode") {
        editClassDialog.value = true;
        selectClass.data = val;
      } else {
        editDialog.value = true;
        selectAttribute.data = val;
      }
    }

    //切换查询选择
    function handleSwitch(){
      tableList.data = null;
      tableList.total = 0;
    }

    //编辑分类信息
    function editClass(){
      //console.log(selectClass.data)
      attributeapi.updateClassificationNode(selectClass.data.id, selectClass.data.name,selectClass.data.nameEn,selectClass.data.description,
          selectClass.data.descriptionEn,selectClass.data.instantiable
      ).then(res => {
        if (res.code == 200) {
          ElMessage({ type: 'success', message: '修改成功' });
          //关闭修改弹窗
          editClassDialog.value = false;
          //可以刷新页面重新获取数据但没必要
          // setTimeout(() => {
          //   location.reload();
          // }, 500);
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }
    function getType() {
      attributeapi.treeQueryClass().then(res => {
        //console.log('树形获取分类', res);
        if (res.code == 200) {
          typeOptions.data = res.data;
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }

      })
    }

    function nodeClickFun(val) {
      //获取该分类的详细属性
      getNodeAttr(val);

    }

    function getNodeAttr(val) {
      attributeapi.getNodeAttr(val.id).then(res => {
        console.log('获取分类详细信息', res);
        if (res.code == 200) {

        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }



    return {
      attributeName, curPage, pageSize, pageQueryAttribute, attributeList, dateUtil, handleSelectionChange, selectList,
      handleSizeChange, handleCurrentChange, showCategory, findType, addDialog, attributeForm, formRules,
      addattribute, attributeFormRef, Edit, Delete, editAttribute, editDialog, selectAttribute, pageQuery,
      className, classList, tableList, curType, allList, showClassInfo, classInfoDialog, activeNames, handleActiveChange,
      curClass, editClassDialog, showEditDialog,selectClass,editClass,handleSwitch,addClassDialog,ClassForm,addClass,classFormRules,
      getType,typeOptions,treeProps,nodeClickFun,getNodeAttr
    }
  },
  created() {
  },

  mounted() {
    this.getType();
    //获取所有版本列表
  },
  methods: {
    //清除所有选择
    clearSelection(rows) {
      this.$refs.multipleTableRef.clearSelection();
    }
  }

}
</script>

<style scoped>

</style>