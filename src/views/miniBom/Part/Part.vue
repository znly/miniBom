<template>
  <div class="part-container">
    <el-card class="box-card" shadow="always">
      <template #header>
        <div class="card-header">
          <span>条件筛选</span>
        </div>
      </template>
      <el-row justify="space-between" style="margin-top: 14px">
        <el-radio-group v-model="findType">
          <el-radio :label="'id'">按编码查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="partId" :disabled="findType != 'id'" />
          </el-radio>
          <el-radio :label="'name'">按部件名称查询
            <el-input placeholder="请输入关键词" style="width: 300px;" v-model="partName" :disabled="findType != 'name'" />
          </el-radio>
        </el-radio-group>
        <section>
          <el-button type="primary" icon="Search" @click="search">查询</el-button>
          <el-button icon="Refresh" @click="reset">重置</el-button>
        </section>
      </el-row>

      <el-row style="margin-top: 30px">
        <el-button icon="CirclePlus" type="primary"
          @click="addDialog = true, tempClsAttrs[0].Classification = {}, partForm.classification = null, partForm.extAttrs[0].value = '', partForm.name = ''">添加部件</el-button>
        <el-button type="danger" icon="Delete" @click="deletePart" plain>删除</el-button>
      </el-row>

      <el-row style="margin-top: 30px">
        <!--        <el-table :data="partList.data" style="width: 100%">-->
        <!--          <el-table-column prop="date" label="Date" width="180" />-->
        <!--          <el-table-column prop="name" label="Name" width="180" />-->
        <!--          <el-table-column prop="address" label="Address" />-->
        <!--        </el-table>-->
        <el-table :data="partList.data" style="width: 100%" empty-text="暂无相关数据" border
          @selection-change="handleSelectionChange" ref="multipleTableRef" height="400px">
          <el-table-column type="selection" width="55" />
          <el-table-column fixed prop="id" label="编码" width="180px">
            <template #default="scope">
              <span style="white-space: nowrap;">{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="部件名称" />
          <el-table-column label="版本号">
            <template #default="scope">
              <span>{{ scope.row.version }}.{{ scope.row.iteration }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="iteration" label="迭代版本号" />
          <el-table-column prop="description" label="描述" />
          <el-table-column prop="" label="分类编码" />
          <el-table-column prop="workingState" label="工作状态" />
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
              <el-button type="primary" :icon="Edit" circle @click="handleEditPartForm(scope.row)" />
              <!--              <el-popconfirm title="是否确定删除该部件" @confirm="deletePart(scope.row)">-->
              <!--                <template #reference>-->
              <!--                  <el-button type="danger" :icon="Delete" circle />-->
              <!--                </template>-->
              <!--              </el-popconfirm>-->
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <!--   分页   -->
      <el-row style="margin-top: 20px;" justify="end">
        <!-- 底部分页组件 -->
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="partList.total"
          :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
          @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </el-row>
    </el-card>
    <!--    <h1>部件管理</h1>-->
    <div style="margin-left: 20px;margin-right: 20px;">
      <!-- 顶部搜索栏 -->

      <!-- 数据表格展示 -->
      <div>



        <!--        <div>-->
        <!--          <el-button type="primary" @click="addDialog = true">添加部件</el-button>-->
        <!--        </div>-->

        <!-- <div style="display: flex;justify-content: center;margin-top: 10px;">
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="partList.total"
            :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div> -->




        <!-- 创建部件表单弹窗 -->
        <el-drawer v-model="addDialog" title="创建部件" draggable @closed="showMode = 'basic'" size="70%">
          <template #header="{ close, titleId, titleClass }">
            <h4 :id="titleId" :class="titleClass" style="text-align: left">创建部件</h4>
          </template>
          <!--          <el-tabs v-model="showMode" class="demo-tabs" >-->
          <!--            <el-tab-pane label="基本属性" name="basic"></el-tab-pane>-->
          <!--            <el-tab-pane label="BOM清单" name="bom"></el-tab-pane>-->
          <!--            <el-tab-pane label="版本管理" name="version"></el-tab-pane>-->
          <!--          </el-tabs>-->
          <!--          <div>-->
          <el-radio-group v-model="showMode" size="large">
            <el-radio-button label="基本属性" value="basic" />
            <!--              <el-radio-button label="BOM清单" value="bom" />-->
            <el-radio-button label="版本管理" value="version" />
            <!--              <el-radio-button label="树形结构" value="tree" @click="getTree" />-->
          </el-radio-group>
          <!--          </div>-->
          <div v-show="showMode == 'basic'">
            <el-form ref="partFormRef" :model="partForm" :rules="formRules" label-width="auto" class="demo-ruleForm"
              status-icon>
              <el-form-item label="基本属性" style="font-weight: bolder;" />

              <el-row gutter="20">
                <el-col :span="12">
                  <el-form-item label="产品">
                    <!--                    <span>笔记本电脑</span>-->
                    <el-input value="笔记本电脑" disabled />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="部件名称" prop="name">
                    <el-input v-model="partForm.name" />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="默认单位" prop="deafultUnit">
                    <el-select v-model="partForm.defaultUnit" placeholder="请选择默认单位" style="width: 100%">
                      <el-option v-for="(item, key) in options" :key="key" :label="item" :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="来源" prop="source">
                    <el-select v-model="partForm.source" placeholder="请选择来源" style="width: 100%">
                      <el-option v-for="(item, key) in sourceOptions" :key="key" :label="item" :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="装配模式" prop="partType">
                    <el-select v-model="partForm.partType" placeholder="请选择装配模式" style="width: 100%">
                      <el-option v-for="(item, key) in patternOptions" :key="key" :label="item" :value="item" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="分类" prop="classification">
                    <el-tree-select v-model="partForm.classification" :data="typeOptions.data"
                      render-after-expand="false" accordion :props="treeProps" style="width: 100%"
                      @node-click="nodeClickFun" placeholder="请选择分类">
                      <template #default="{ data: { name } }">
                        {{ name }}
                      </template>
                    </el-tree-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="扩展属性" style="font-weight: bolder;" />

              <el-form-item label="分类代码">
                <el-input v-model="partForm.businessCode" disabled />
              </el-form-item>

              <el-form-item v-for="(value, name) in tempClsAttrs[0].Classification" :label="name">
                <el-input v-model="partForm.clsAttrs[0].Classification[name]"></el-input>
              </el-form-item>

            </el-form>
          </div>

          <!-- BOM清单 -->
          <div v-show="showMode == 'bom'">
            <div v-if="curBOMLink.data != null">
              123
            </div>
            <div v-else style="margin-top:20px">
              暂无任何数据add
            </div>
          </div>
          <!-- 版本管理 -->
          <div v-show="showMode == 'version'">
            <el-table :data="partVersionList.data">
              <el-table-column label="编码" />
            </el-table>
          </div>
          <div style="margin-top: 20px;">
            <el-button type="primary" @click="addPart">确定</el-button>
            <el-button type="danger" @click="addDialog = false">取消</el-button>
          </div>
        </el-drawer>

        <!-- 编辑部件弹窗 -->
        <el-dialog v-model="editDialog" title="编辑部件" draggable style="margin-top: 20px;"
          @closed="showMode = 'basic', expands = []">
          <div>
            <el-radio-group v-model="showMode" size="large">
              <el-radio-button label="基本属性" value="basic" />
              <!-- 点击时获取BOMlinks -->
              <el-radio-button label="BOM清单" value="bom" @click="getBOMLinks(editPartForm.data)" />
              <el-radio-button label="版本管理" value="version" @click="getVersionList" />
              <el-radio-button label="树形结构" value="tree" @click="getTree" />
            </el-radio-group>


          </div>
          <div v-show="showMode == 'basic'">
            <el-form ref="partFormRef" style="max-width: 500px" :model="editPartForm.data" :rules="formRules"
              label-width="auto" class="demo-ruleForm" status-icon>
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
                <el-select v-model="editPartForm.source" placeholder="请选择来源" style="width: 240px">
                  <el-option v-for="(item, key) in sourceOptions" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="装配模式" prop="partType">
                <el-select v-model="editPartForm.partType" placeholder="请选择装配模式" style="width: 240px">
                  <el-option v-for="(item, key) in patternOptions" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="分类" prop="type">
                <!-- 分类树形选择 -->
                <el-tree-select v-model="editPartForm.data.classification" :data="typeOptions.data"
                  render-after-expand="false" accordion :props="treeProps" style="width: 240px"
                  @node-click="handleEditClick" placeholder="请选择分类">
                  <template #default="{ data: { name } }">
                    {{ name }}
                  </template>
                </el-tree-select>
              </el-form-item>

              <el-form-item label="扩展属性" style="font-weight: bolder;" />

              <el-form-item label="分类代码">
                <el-input v-model="editPartForm.data.businessCode" disabled />
              </el-form-item>

              <el-form-item v-for="(value, name) in tempClsAttrs[0].Classification" :label="name">
                <el-input v-model="editPartForm.data.clsAttrs[0].Classification[name]"></el-input>
              </el-form-item>


            </el-form>
          </div>
          <div v-show="showMode == 'tree'">

            <div v-if="treeData.data.length <= 0">
              数据加载中...
            </div>

            <el-tree v-else :data="treeData.data" default-expand-all :props="defaultProps" node-key="partMasterId"
              show-checkbox></el-tree>
          </div>
          <!-- 版本管理 -->
          <div v-show="showMode == 'version'">
            <el-table :data="partVersionList.data" ref="expandTable" row-key="id" :expand-row-keys="expands"
              :header-cell-style="{ background: '#EFF3F5', color: '#6B7275' }">
              <el-table-column type="expand" width="1">
                <template #default>
                  <div>
                    <!-- <div>{{ smallVersion.data}}</div> -->
                    <div>创建时间:{{ dateUtil.transformDate(smallVersion.data.createTime) }}</div>
                    <div>更新时间:{{ dateUtil.transformDate(smallVersion.data.lastUpdateTime) }}</div>
                    <div>中文描述:{{ smallVersion.data.description }}</div>
                    <div>英文描述:{{ smallVersion.data.descriptionEn }}</div>
                    <div>工作状态:{{ smallVersion.data.workingState }}</div>
                    <div>
                      扩展属性
                      <span>{{ smallVersion.data.extAttrs }}</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="编码" prop="id" />
              <el-table-column label="版本号" prop="version">
                <template #default="scope">
                  <span>{{ scope.row.version }}.{{ scope.row.iteration }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="name" />
              <el-table-column label="查看详细信息">
                <template #default="scope">
                  <el-button :icon="Pointer" circle @click="handleRowClick(scope.row)" />
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template #default="scope">
                  <el-popconfirm title="是否确定删除当前小版本" @confirm="deleteVersion(scope.row)">
                    <template #reference>
                      <el-button type="danger" :icon="Delete" circle />
                    </template>
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- BOMlink展示 -->
          <div v-show="showMode == 'bom'">
            <div v-if="curBOMLink.data != null">
              数据加载中...
            </div>
            <div v-else style="margin-top:20px">
              <DataTable @getDataCustom="getDataCustom" :targetId="targetId" />
              <CustomTableBom ref="CustomTableBomRef" :targetId="targetId" />
            </div>

          </div>

          <div style="margin-top: 20px;">
            <el-button type="primary" @click="editPart" v-show="showMode == 'basic'">确定</el-button>
            <el-button type="danger" @click="editDialog = false">取消</el-button>
          </div>

        </el-dialog>


      </div>
    </div>
    <!-- 底部分页组件 -->
    <!--    <div style="display: flex;justify-content: center;margin-top: 10px;background-color: white;height: 35px;">-->
    <!--      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="partList.total"-->
    <!--                     :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"-->
    <!--                     @size-change="handleSizeChange" @current-change="handleCurrentChange" />-->
    <!--    </div>-->
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
  Pointer
} from '@element-plus/icons-vue'
import attributeapi from '@/api/attributeapi';
import store from '@/store';
import bomapi from '@/api/bomapi';
import DataTable from "@/views/miniBom/components/DataTable.vue";
import CustomTableBom from "@/views/miniBom/components/CustomTableBom.vue";
export default {
  name: 'part',
  setup() {
    let CustomTableBomRef = ref()
    const tableData = [
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ]
    //基本单位选项
    const options = reactive([
      'PCS', 'SITE', 'SET', 'M', 'EACH', 'HOP', 'M*M', 'TRP', 'MON', 'KG'
    ])
    //分类选项
    const typeOptions = reactive({
      data: []
    })
    // tree
    const treeData = reactive({
      data: []
    })
    const multipleSelection = ref([])
    //来源选项
    const sourceOptions = reactive([
      'Make', 'Buy', 'Buy_SingleSource'
    ])
    //装配模式选项
    const patternOptions = reactive([
      'Separable', 'Inseparable', 'Part'
    ])

    //部件版本列表
    const partVersionList = reactive({
      data: []
    })
    const defaultProps = {
      children: 'children',
      label: 'partMasterNumber'
    };
    const treeProps = reactive({
      value: 'id',
      label: 'name',
      children: 'children'
    })

    //添加部件弹窗
    const addDialog = ref(false);
    const targetId = ref('');
    //编辑部件弹窗
    const editDialog = ref(false);

    //编辑部件信息
    const editPartForm = reactive({ data: {} });

    //添加部件表单
    const partForm = reactive({
      //名称，默认单位，装配模式，来源，分类
      name: '',
      defaultUnit: 'PCS',//默认单位
      source: 'Make', //来源
      partType: 'Separable',//装配模式
      //分支和主干
      branch: {},
      master: {},
      //分类
      classification: null,
      //分类代码
      businessCode: '',
      extAttrs: [
        {
          "name": 'Classification',
          'value': '',//分类id
        }],
      clsAttrs: [
        {
          'Classification': {
          }
        }
      ],
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
      partType: [
        { required: true, message: '请选择装配模式', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
      classification: [
        { required: true, message: '请选择分类', trigger: 'blur' },
        { min: 1, max: 250, message: 'Length should be 1 to 250', trigger: 'blur' },
      ],
    }

    function getDataCustom() {
      console.log('调用 getDataCustom 方法');
      // 确保 CustomTableBomRef 已经初始化
      if (CustomTableBomRef.value) {
        CustomTableBomRef.value.getPartList();
      } else {
        console.log('CustomTableBomRef 未初始化');
      }
    }
    function getTree() {
      console.log(targetId.value)
      bomapi.createTree(targetId.value).then(res => {
        console.log(res)
        if (res.code === 200) {
          console.log('xxxxxxxxxxxxxxxxx-x--x-x-')
          treeData.data = [res.data];

        }
      })
    }

    //点击选择分类
    function nodeClickFun(val) {
      // console.log('当前分类', val);
      //获取该分类的详细属性
      tempClsAttrs[0].Classification = {};
      console.log(tempClsAttrs[0].Classification);
      getNodeAttr(val);
    }


    const handleSelectionChange = (val) => {
      multipleSelection.value = val
    }

    // TODO 表单整体校验 + 登录
    const partFormRef = ref(null);

    //添加部件方法
    const addPart = () => {
      console.log(partForm);
      表单校验
      partFormRef.value.validate((valid) => {
        if (valid) {
          //调用api创建
          partapi.create(partForm.source, partForm.branch, partForm.master, partForm.name,
            partForm.partType, partForm.extAttrs, partForm.clsAttrs).then(res => {
              console.log(res);
              if (res.code == 200) {
                ElMessage({ type: 'success', message: '创建成功' });
                //直接重载页面
                getPartList();
                addDialog.value = false;

                // addDialog.value=false
                // getPartList()
              } else {
                ElMessage({ type: 'error', message: res.msg });
              }
            })
        } else {
          ElMessage({ type: 'warning', message: '请按规定填写必要字段' });
        }
      })

    }

    //获取分类
    function getType() {
      attributeapi.treeQueryClass().then(res => {
        console.log('树形获取分类', res);
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

    const tempClsAttrs = reactive([{
      "Classification": {
      }
    }]);


    function reset() {
      findType.value = 'id'
      partId.value = ''
      partName.value = ''
      getPartList()
    }

    function search() {
      curPage.value = 1;
      getPartList()
    }

    //获取部件列表数据
    function getPartList() {
      //根据编码和名称查询
      if (findType.value == 'id') {
        partapi.queryPart(partId.value, null, curPage.value, pageSize.value).then(res => {
          console.log('获取部件列表数据', res);
          if (res.code == 200) {
            let list = res.data.resList;
            partList.data = list;
            partList.total = res.data.size;
          } else {
            ElMessage({ type: 'error', message: res.msg });
          }
        }, error => {
          ElMessage({ type: 'error', message: error.message });
        })
      } else {
        partapi.queryPart(null, partName.value, curPage.value, pageSize.value).then(res => {
          console.log('获取部件列表数据', res);
          if (res.code == 200) {
            let list = res.data.resList;
            partList.data = list;
            partList.total = res.data.size;
          } else {
            ElMessage({ type: 'error', message: res.msg });
          }
        }, error => {
          ElMessage({ type: 'error', message: error.message });
        })
      }
    }

    //编辑部件信息
    function editPart() {
      console.log('编辑部件信息', editPartForm.data);
      partapi.updatePart2(editPartForm.data.name, editPartForm.data.master, editPartForm.data.branch,
        editPartForm.source, editPartForm.partType, editPartForm.data.extAttrs, editPartForm.data.clsAttrs).then(res => {
          console.log('编辑部件返回结果', res);
          if (res.code == 200) {
            ElMessage({ type: 'success', message: '修改成功' });
            getPartList();
            tempClsAttrs[0].Classification = {};
            //关闭弹窗
            editDialog.value = false;
          } else {
            ElMessage({ type: 'error', message: res.msg });
          }
        })
    }

    //处理当前页面页数变化
    function handleCurrentChange(val) {
      // console.log('页数',val);
      curPage.value = val;
      getPartList();
    }

    //改变页面展示数目
    function handleSizeChange(val) {
      pageSize.value = val;
      getPartList();
    }

    //展示模式
    const showMode = ref('basic');

    //获取版本管理列表
    function getVersionList() {
      // console.log('当前选中部件',editPartForm.data);
      //获取当前部件的所有版本 一次查询10000条
      partapi.allVersion(editPartForm.data.master.id, '', 1, 10000).then(res => {
        console.log('获取版本管理列表', res);
        if (res.code == 200) {
          partVersionList.data = res.data;
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //删除小版本
    function deleteVersion(val) {
      // console.log('当前版本信息', val);
      //调用api删除
      partapi.delVersion(val.master.id, val.version).then(res => {
        console.log(res);
        if (res.code == 200) {
          ElMessage({ type: 'success', message: '删除成功' })
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }

      })
    }

    //删除部件part
    function deletePart(val) {
      console.log('删除部件', val);
      console.log(multipleSelection.value)
      if (multipleSelection.value.length <= 0) {
        ElMessage({ type: 'warning', message: '请选择数据' });
        return;
      }

      if (store.state.user == null) {
        ElMessage({ type: 'error', message: '请先登录' });
        return;
      }
      val = multipleSelection.value.map(item => item.id).join(',')
      //修改人获取当前用户的id
      partapi.deletePart(val, store.state.user.id).then(res => {
        console.log('删除部件part', res);
        if (res.code == 200) {
          ElMessage({ type: 'success', message: '删除成功' })
          //刷新页面
          setTimeout(() => {
            location.reload();
          }, 500);
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //查询分类的属性
    function getNodeAttr(val) {
      console.log('当前分类', val);
      //赋值分类分类id和编码
      partForm.businessCode = val.businessCode;
      partForm.extAttrs[0].value = val.id;
      attributeapi.getNodeAttr(val.id).then(res => {
        console.log('获取分类详细信息', res);
        if (res.code == 200) {
          //赋值分类属性
          for (let datum of res.data) {
            tempClsAttrs[0].Classification[datum.nameEn] = '';
          }

          console.log(tempClsAttrs[0])

        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //获取Part某个小版本信息
    function getVersionInfo(val) {
      //获取当前小版本具体信息
      partapi.version(val.master.id, val.version, val.iteration).then(res => {
        console.log('获取当前小版本具体信息', res);
        if (res.code == 200) {
          //这里返回的是一个列表 很奇怪
          smallVersion.data = res.data[0];
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //通过自定义按钮实现展开查看分类详细属性
    const expands = ref([]);
    //当前展示的小版本
    const smallVersion = reactive({
      data: {},
    });
    const handleRowClick = (row) => {
      //如果当前已经展开就收起
      if (expands.value.includes(row.id)) {
        expands.value = expands.value.filter((val) => val !== row.id);
      } else {

        //先获取版本信息
        getVersionInfo(row);
        //实现手风琴模式 一次只能打开一个
        expands.value = [];
        expands.value.push(row.id);
      }
    }

    //修订大版本


    //BOMlink相关

    //当前展示的BOMlink
    const curBOMLink = reactive({
      data: {},
    })

    //获取bomlink
    function getBOMLinks(val) {
      bomapi.getBOMlinks(val.id).then(res => {
        if (res.code == 200) {
          console.log('获取bomlink', res);
          curBOMLink.data = res.data;
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    function handleEditClick(val) {
      tempClsAttrs[0].Classification = {};
      editPartForm.data.clsAttrs[0].Classification = {};
      editPartForm.data.businessCode = val.businessCode;
      editPartForm.data.extAttrs[0].value = val.id;
      editFormGetNodeAttr(val.id);
    }

    function editFormGetNodeAttr(id) {
      //console.log('当前分类', val);
      //赋值分类分类id和编码
      //editPartForm.data.businessCode = val.businessCode;
      // editPartForm.data.extAttrs[0].value = val.id;
      attributeapi.getNodeAttr(id).then(res => {
        //console.log('获取分类详细信息', res);
        if (res.code == 200) {
          //赋值分类属性
          for (let datum of res.data) {
            tempClsAttrs[0].Classification[datum.nameEn] = '';
          }

          console.log(tempClsAttrs[0])

        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    function handleEditPartForm(val) {
      targetId.value = val.id
      partapi.getPart(val.id).then(res => {
        if (res.code == 200) {
          //editFormGetNodeAttr(res.data.extAttrs[0].value.id);
          tempClsAttrs[0].Classification = {};
          editPartForm.data = res.data;
          if (editPartForm.data.clsAttrs == null) {
            editPartForm.data.clsAttrs = [
              {
                'Classification': {
                }
              }
            ];
          }
          editPartForm.data.classification = editPartForm.data.extAttrs[0].value.name;
          editPartForm.data.businessCode = editPartForm.data.extAttrs[0].value.businessCode;
          //editPartForm.data.extAttrs[0].value = editPartForm.data.extAttrs[0].value.id;
          editFormGetNodeAttr(editPartForm.data.extAttrs[0].value.id);
          editPartForm.data.defaultUnit = 'PCS';
          editDialog.value = true;
          console.log(editPartForm.data)
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }





    return {
      getTree,
      search,
      targetId,
      addDialog,
      partForm,
      addPart,
      partList,
      getPartList,
      findType,
      partId,
      reset,
      partName,
      dateUtil,
      curPage,
      pageSize,
      Delete,
      Edit,
      Pointer,
      editDialog,
      formRules,
      options,
      typeOptions,
      getType,
      treeProps,
      defaultProps,
      nodeClickFun,
      partFormRef,
      sourceOptions,
      patternOptions,
      editPart,
      editPartForm,
      showMode,
      partVersionList,
      getVersionList,
      deleteVersion,
      handleCurrentChange,
      handleSizeChange,
      deletePart,
      CustomTableBomRef,
      getNodeAttr,
      getVersionInfo,
      treeData,
      handleRowClick,
      expands,
      smallVersion,
      getBOMLinks,
      curBOMLink,
      getDataCustom,
      handleSelectionChange,
      tableData,
      DataTable,
      handleEditClick,
      tempClsAttrs,
      editFormGetNodeAttr,
      handleEditPartForm,
    }
  },
  mounted() {
    //获取所有分类
    this.getType();
    //获取所有版本列表
  },
  components: {
    CustomTableBom,
    DataTable
  }

}
</script>

<style scoped>
.el-drawer__header {
  margin-bottom: 0px !important;
}


.part-container {
  padding: 20px 20px;
}

.part-container .card-header {
  display: flex;
  justify-content: start;
}

.no-wrap {
  white-space: nowrap;
  overflow: hidden;
  /* 防止内容溢出容器 */
  text-overflow: ellipsis;
  /* 当内容溢出时显示省略号 */
}
</style>
