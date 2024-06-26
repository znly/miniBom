<template>

  <el-row justify="space-between" style="margin-bottom: 24px">
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
      <el-button  icon="Refresh" @click="reset">重置</el-button>
    </section>
  </el-row>
  <el-table :data="partList.data" style="width: 100%" empty-text="暂无相关数据" border
            @selection-change="handleSelectionChange" ref="multipleTableRef" height="400px">
    <el-table-column type="selection" width="55" />
    <el-table-column fixed prop="id" label="编码"  width="180px">
      <template #default="scope">
        <span style="white-space: nowrap;">{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="部件名称"  />
    <el-table-column label="版本号" >
      <template #default="scope">
        <span>{{ scope.row.version }}.{{ scope.row.iteration }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="iteration" label="迭代版本号"  />
    <el-table-column prop="description" label="描述"  />
    <el-table-column prop="" label="分类编码"  />
    <el-table-column prop="workingState" label="工作状态"  />
    <el-table-column label="创建时间" width="200">
      <template #default="scope"  >
        {{ dateUtil.transformDate(scope.row.createTime) }}
      </template>
    </el-table-column>
    <el-table-column label="更新时间" width="200">
      <template #default="scope">
        {{ dateUtil.transformDate(scope.row.lastUpdateTime) }}
      </template>
    </el-table-column>
  </el-table>
 <el-row justify="end" style="margin-top: 20px">
   <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="partList.total"
                  :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
                  @size-change="handleSizeChange" @current-change="handleCurrentChange" />
 </el-row>
</template>

<script>
import { reactive, ref } from 'vue'
import partapi from "@/api/partapi";
import {ElMessage} from "element-plus";
import dateUtil from '@/utils/DateUtil';

export default {
  props: {
    targetId:String
  },
  mounted() {
    this.search();
  },
  setup(props, { emit }) {
    // 初始数据可能来自 API 调用或本地数据定义
    //部件列表数据
    const partList = reactive({
      data: [],
      total: 0
    })
    const tableRef = ref(null);
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
    const handleSelectionChange = (selection) => {
      emit('selection-change', selection);
    };
    function search(){
      curPage.value = 1;
      getPartList()
    }
    function reset(){
      curPage.value = 1;
      findType.value = 'id'
      partId.value = ''
      partName.value = ''
      getPartList()
    }

    function handleSizeChange(val) {
      pageSize.value = val;
      getPartList();
    }
    function handleCurrentChange(val) {
      // console.log('页数',val);
      curPage.value = val;
      getPartList();
    }
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
            ElMessage({type: 'error', message: res.msg});
          }
        }, error => {
          ElMessage({type: 'error', message: error.message});
        })
      } else {
        partapi.queryPart(null, partName.value, curPage.value, pageSize.value).then(res => {
          console.log('获取部件列表数据', res);
          if (res.code == 200) {
            let list = res.data.resList;
            partList.data = list;
            partList.total = res.data.size;
          } else {
            ElMessage({type: 'error', message: res.msg});
          }
        }, error => {
          ElMessage({type: 'error', message: error.message});
        })
      }
    }

    return {
      reset,
      search,
      partId,
      findType,
      partName,
      partList,
      dateUtil,
      handleSizeChange,
      curPage,
      pageSize,
      tableRef,
      handleSelectionChange,
      handleCurrentChange
    };
  },
};
</script>
