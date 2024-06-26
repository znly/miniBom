<template>
  <el-row justify="space-between" style="margin-bottom: 24px">
    <section>
      <el-button icon="Refresh" @click="reset">重置</el-button>
    </section>
  </el-row>
  <el-table :data="partList.data" style="width: 100%" empty-text="暂无相关数据" border
            v-loading="tableLoading"
            @selection-change="handleSelectionChange" ref="multipleTableRef" height="400px">
    <el-table-column type="selection" width="55" />
    <el-table-column label="数量">
      <template #default="scope">
        <template v-if="editIndex === scope.$index && editField === 'quantity'">
          <el-input v-model="editValue" size="small" style="width: 100px" />
          <el-button type="primary" size="small" @click="submitEdit(scope.row, 'quantity', scope.row.bomLinkId)">确定</el-button>
          <el-button size="small" @click="cancelEdit">取消</el-button>
        </template>
        <template v-else>
          {{ scope.row.quantity }}
          <el-icon style="cursor: pointer; margin-left: 5px;" @click="startEdit(scope.$index, 'quantity', scope.row.quantity)">
            <edit />
          </el-icon>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="位号">
      <template #default="scope">
        <template v-if="editIndex === scope.$index && editField === 'referenceDes'">
          <el-input v-model="editValue" size="small" style="width: 100px" />
          <el-button type="primary" size="small" @click="submitEdit(scope.row, 'referenceDes', scope.row.bomUseOccurrenceId)">确定</el-button>
          <el-button size="small" @click="cancelEdit">取消</el-button>
        </template>
        <template v-else>
          {{ scope.row.referenceDes }}
          <el-icon style="cursor: pointer; margin-left: 5px;" @click="startEdit(scope.$index, 'referenceDes', scope.row.referenceDes)">
            <edit />
          </el-icon>
        </template>
      </template>
    </el-table-column>
    <el-table-column prop="sourceId" label="来源编码" />
    <el-table-column prop="sourceName" label="来源名称" />
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button type="danger" size="small" @click="handleDelete(scope.row.bomLinkId)">删除</el-button>
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
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  props: {
    targetId: String
  },
  mounted() {
    this.getPartList();
  },
  setup(props, {emit}) {
    // 部件列表数据
    const partList = reactive({
      data: [],
      total: 0
    });

    const tableRef = ref(null);
    const curPage = ref(1);
    const pageSize = ref(10);
    const tableLoading =  ref(false)
    const handleSelectionChange = (selection) => {
      emit('selection-change', selection);
    };

    const editIndex = ref(null);
    const editField = ref(null);
    const editValue = ref('');

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
      bomapi.showAllChildren(pageSize.value, curPage.value, props.targetId).then(res => {
        if (res.code == 200) {
          let list = res.data;
          partList.data = list;
          partList.total = res.data.size;
          tableLoading.value = false;
        } else {
          ElMessage({type: 'error', message: res.msg});
          tableLoading.value = false;
        }
      }, error => {
        ElMessage({type: 'error', message: error.message});
        tableLoading.value = false;
      }).finally(()=>{

      });
    }

    function startEdit(index, field, value) {
      editIndex.value = index;
      editField.value = field;
      editValue.value = value;
    }

    function cancelEdit() {
      editIndex.value = null;
      editField.value = null;
      editValue.value = '';
    }

    function submitEdit(row, field, id) {
      row[field] = editValue.value;
      const data = {
        id: id+''
      };
      if (field === 'quantity') {
        data.quantity = editValue.value;
        data.bomLinkId = id + '';

        bomapi.updateDesBOMLink(data).then(res => {
          if (res.code == 200) {
            ElMessage({
              type: 'success',
              message: '修改成功!'
            });
            cancelEdit();
            getPartList();
          } else {
            ElMessage({
              type: 'error',
              message: res.msg
            });
          }
        }, error => {
          ElMessage({
            type: 'error',
            message: error.message
          });
        });
      } else if (field === 'referenceDes') {
        data.referenceDesignator = editValue.value;
        data.bomUseOccurrenceId = id + '';
        bomapi.editBOMUsesOccurrence(data).then(res => {
          if (res.code == 200) {
            ElMessage({
              type: 'success',
              message: '修改成功!'
            });
            cancelEdit();
            getPartList();
          } else {
            ElMessage({
              type: 'error',
              message: res.msg
            });
          }
        }, error => {
          ElMessage({
            type: 'error',
            message: error.message
          });
        });
      }

    }

    function handleDelete(id) {
      ElMessageBox.confirm('此操作将永久删除该项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        bomapi.delete(id+'').then(res => {
          if (res.code == 200) {
            ElMessage({
              type: 'success',
              message: '删除成功!',
            });
            getPartList();
          } else {
            ElMessage({
              type: 'error',
              message: res.msg,
            });
          }
        }, error => {
          ElMessage({
            type: 'error',
            message: error.message,
          });
        });
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消删除',
        });
      });
    }

    return {
      reset,
      partList,
      handleSizeChange,
      curPage,
      pageSize,
      tableRef,
      handleSelectionChange,
      handleCurrentChange,
      getPartList,
      startEdit,
      cancelEdit,
      submitEdit,
      handleDelete,
      editIndex,
      editField,
      tableLoading,
      editValue
    };
  },
};
</script>
