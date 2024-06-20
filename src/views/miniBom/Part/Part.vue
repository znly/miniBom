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
      <div>
        <el-table :data="partList.data" style="width: 100%;margin-top: 10px;" empty-text="暂无相关数据" border
          @select="handleSelectionChange" ref="multipleTableRef" height="500px">
          <el-table-column type="selection" width="55" />
          <el-table-column fixed prop="id" label="编码" width="120" />
          <el-table-column prop="name" label="部件名称" width="120" />
          <el-table-column label="版本号" width="120">
            <template #default="scope">
              <span>{{ scope.row.version }}.{{ scope.row.iteration }}</span>
            </template>
          </el-table-column>
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

          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="primary" :icon="Edit" circle @click="editDialog = true, editPartForm.data = scope.row" />
              <el-popconfirm title="是否确定删除该部件" @confirm="deletePart(scope.row)">
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

        <!-- <div style="display: flex;justify-content: center;margin-top: 10px;">
          <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="partList.total"
            :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div> -->




        <!-- 创建部件表单弹窗 -->
        <el-dialog v-model="addDialog" title="添加部件" draggable style="margin-top: 20px;" @closed="showMode = 'basic'">
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
            <el-table :data="partVersionList.data">
              <el-table-column label="编码" />
            </el-table>
          </div>
          <div style="margin-top: 20px;">
            <el-button type="primary" @click="addPart">确定</el-button>
            <el-button type="danger" @click="addDialog = false">取消</el-button>
          </div>
        </el-dialog>

        <!-- 编辑部件弹窗 -->
        <el-dialog v-model="editDialog" title="编辑部件" draggable style="margin-top: 20px;" @closed="showMode = 'basic'">
          <div>
            <el-radio-group v-model="showMode" size="large">
              <el-radio-button label="基本属性" value="basic" />
              <el-radio-button label="BOM清单" value="bom" />
              <el-radio-button label="版本管理" value="version" @click="getVersionList" />
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
                <el-select v-model="partForm.source" placeholder="请选择来源" style="width: 240px">
                  <el-option v-for="(item, key) in sourceOptions" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="装配模式" prop="partType">
                <el-select v-model="editPartForm.data.partType" placeholder="请选择装配模式" style="width: 240px">
                  <el-option v-for="(item, key) in patternOptions" :key="key" :label="item" :value="item" />
                </el-select>
              </el-form-item>
              <el-form-item label="分类" prop="type">
                <!-- 分类树形选择 -->
                <el-tree-select v-model="editPartForm.data.type" :data="typeOptions.data" render-after-expand="false"
                  accordion :props="treeProps" style="width: 240px" @node-click="nodeClickFun" placeholder="请选择分类">
                  <template #default="{ data: { name } }">
                    {{ name }}
                  </template>
                </el-tree-select>
              </el-form-item>

              <el-form-item label="扩展属性" style="font-weight: bolder;" />

              <el-form-item label="小类代码">
                <el-input v-model="editPartForm.data.businessCode" disabled />
              </el-form-item>
              <el-form-item label="PART类型">
                <el-input v-model="editPartForm.data.brand" disabled />
              </el-form-item>
              <el-form-item label="使用产品说明">
                <el-input v-model="editPartForm.data.mode" disabled />
              </el-form-item>
              <el-form-item label="对外名称">
                <el-input v-model="editPartForm.data.mode" disabled />
              </el-form-item>
              <el-form-item label="对外英文名称">
                <el-input v-model="editPartForm.data.mode" disabled />
              </el-form-item>
            </el-form>
          </div>

          <!-- 版本管理 -->
          <div v-show="showMode == 'version'">
            <el-table :data="partVersionList.data">
              <el-table-column label="编码" prop="id" />
              <el-table-column label="版本号" prop="version">
                <template #default="scope">
                  <span>{{ scope.row.version }}.{{ scope.row.iteration }}</span>
                </template>
              </el-table-column>
              <el-table-column label="名称" prop="name" />
              <el-table-column label="查看详细信息" >
                <template #default="scope">
                  <span>查看</span>
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

          <div style="margin-top: 20px;">
            <el-button type="primary" @click="editPart" v-show="showMode == 'basic'">确定</el-button>
            <el-button type="danger" @click="editDialog = false">取消</el-button>
          </div>

        </el-dialog>


      </div>
    </div>
    <!-- 底部分页组件 -->
    <!-- <el-affix position="bottom" offset="10"> -->
    <div style="display: flex;justify-content: center;margin-top: 10px;background-color: white;height: 35px;">
      <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="partList.total"
        :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- </el-affix> -->
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
import store from '@/store';
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
      'Make', 'Buy', '购买-单一供应源'
    ])
    //装配模式选项
    const patternOptions = reactive([
      'Separable', 'Inseparable', '零件'
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
      source: 'Make', //来源
      partType: 'Separable',//装配模式
      //分支和主干
      branch: {},
      master: {},
      extAttrs: [{
        name: 'Classification',
        value: ''//分类id
      }],
      clsAttrs: [
        {
          Classification: {
            "Brand": '8',
            'Length': '0.00',
            'Mode': 'B10',
            "Height or thick": '0.00',
            'width': '0.00',
            weight: '0.00',
          }, //分类
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
      // console.log('当前分类', val);
      //获取该分类的详细属性
      getNodeAttr(val);
    }

    // TODO 表单整体校验 + 登录
    const partFormRef = ref(null);

    //添加部件方法
    const addPart = () => {
      //表单校验
      partFormRef.value.validate((valid) => {
        if (valid) {
          //调用api创建
          partapi.create(partForm.source, partForm.branch, partForm.master, partForm.name,
            partForm.partType, partForm.extAttrs, partForm.clsAttrs).then(res => {
              console.log(res);
              if (res.code == 200) {
                ElMessage({ type: 'success', message: '创建成功' });
              } else {
                ElMessage({ type: 'error', message: res.msg });
              }
            })
        } else {
          ElMessage({ type: 'warning', message: '请按规定填写必要字段' });
        }
      })
      //表单置空
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
    //获取部件列表数据
    function getPartList() {
      partapi.queryPart(partId.value, curPage.value, pageSize.value).then(res => {
        console.log('获取部件列表数据', res);
        if (res.code == 200) {
          //遍历列表 只展示主版本
          let list = res.data.resList;
          let resList = [];
          for (var i = 0; i < list.length; i++) {
            if (list[i].id == list[i].master.id) {
              resList.push(list[i]);
            }
          }
          // partList.data = resList;
          partList.data = list;
          partList.total = res.data.size;
        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //编辑部件信息
    function editPart() {
      console.log('编辑部件信息', editPartForm.data);
      // partapi.updatePart(editPartForm.data.name).then(res=>{
      //   if(res.code==200){

      //   }else{

      //   }
      // })
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
      // console.log('当前部件', val);
      // console.log('当前用户', store.state.user);
      //修改人获取当前用户的id
      partapi.deletePart(val.master.id, store.state.user.id).then(res => {
        console.log(res);
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
      attributeapi.getNodeAttr(val.id).then(res => {
        console.log('获取分类详细信息', res);
        if (res.code == 200) {

        } else {
          ElMessage({ type: 'error', message: res.msg });
        }
      })
    }

    //获取Part某个小版本信息
    function getVersionInfo() {
      partapi.version().then(res => {
        console.log('获取小版本信息', res);
      })
    }


    return {
      addDialog, partForm, addPart, partList, getPartList, findType, partId, partName, dateUtil
      , curPage, pageSize, Delete, Edit, editDialog, formRules, options, typeOptions, getType, treeProps,
      nodeClickFun, partFormRef, sourceOptions, patternOptions, editPart, editPartForm,
      showMode, partVersionList, getVersionList, deleteVersion, handleCurrentChange, handleSizeChange,
      deletePart, getNodeAttr, getVersionInfo
    }
  },
  mounted() {
    this.getType();
    //获取所有版本列表
  }

}
</script>

<style></style>