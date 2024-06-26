<template>
  <el-row justify="space-between" style="margin-bottom: 24px">
    <section>
      <el-button icon="Refresh" @click="reset">重置</el-button>
    </section>
  </el-row>
  <el-table :data="partList.data" style="width: 100%" empty-text="暂无相关数据" border
            @selection-change="handleSelectionChange" ref="multipleTableRef"
            :loading="tableLoading">
    <el-table-column type="selection" width="55" />
    <el-table-column fixed prop="id" label="编码" width="180px">
      <template #default="scope">
        <span style="white-space: nowrap;">{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="creator" label="创建者" />
    <el-table-column prop="className" label="类名" />
    <el-table-column prop="rdmExtensionType" label="RDM扩展类型" />
    <el-table-column prop="creator" label="创建者" />
    <el-table-column prop="modifier" label="修改者" />
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
  </el-table>
  <el-row justify="end" style="margin-top: 20px">
    <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="partList.total"
                   :page-size="pageSize" v-model:current-page="curPage" :page-sizes="[10, 20, 30, 40]"
                   @size-change="handleSizeChange" @current-change="handleCurrentChange" />
  </el-row>
</template>

<script>
import {reactive, ref} from 'vue'
import bomapi from "@/api/bomapi";
import {ElMessage} from "element-plus";
import dateUtil from '@/utils/DateUtil';

export default {
  props: {
    targetId: String
  },
  mounted() {
    this.getPartList();
  },
  setup(props, {emit}) {
    // 初始数据可能来自 API 调用或本地数据定义
    // 部件列表数据
    const partList = reactive({
      data: [],
      total: 0
    });
    const tableRef = ref(null);
    const tableLoading = ref(false);

    // 当前页数
    const curPage = ref(1);
    // 每页数量
    const pageSize = ref(10);

    const handleSelectionChange = (selection) => {
      emit('selection-change', selection);
    };

    function reset() {
      curPage.value = 1;
      getPartList();
    }

    function handleSizeChange(val) {
      pageSize.value = val;
      getPartList();
    }

    function handleCurrentChange(val) {
      curPage.value = val;
      getPartList();
    }

    function getPartList() {
      tableLoading.value = true;
      bomapi.queryRelatedPart(pageSize.value, curPage.value, props.targetId).then(res => {
        tableLoading.value = false;
        if (res.code == 200) {
          let list = res.data;
          partList.data = list;
          partList.total = res.data.size;
        } else {
          ElMessage({type: 'error', message: res.msg});
        }
      }, error => {
        tableLoading.value = false;
        ElMessage({type: 'error', message: error.message});
      });
    }

    return {
      reset,
      partList,
      dateUtil,
      handleSizeChange,
      curPage,
      pageSize,
      tableRef,
      tableLoading,
      handleSelectionChange,
      handleCurrentChange,
      getPartList
    };
  },
};
</script>
