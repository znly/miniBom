<template>
  <el-drawer :model-value="drawerVisible" @update:model-value="updateDrawerVisibility" title="添加部件" size="60%">
    <template #header="{ close, titleId, titleClass }">
      <h4>{{targetId}}</h4>
    </template>
    <el-row gutter="24">
      <!-- 表格选择区域 -->
      <el-col :span="24">
        <CustomTable @selection-change="handleSelectionChange"></CustomTable>
      </el-col>

      <!-- 表单编辑区域 -->

      <h2 style="margin: 20px 0 20px 20px">BOM信息</h2>
      <el-col :span="24">
        <el-form :model="form" ref="ruleFormRef">
          <el-row :gutter="30">
            <!-- 数量表单项 -->
            <el-col :span="12">
              <el-form-item label="数量">
                <el-input v-model="form.quantity" type="number"></el-input>
              </el-form-item>
            </el-col>
            <!-- 位号表单项 -->
            <el-col :span="12">
              <el-form-item label="位号">
                <el-input v-model="form.referenceDes"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="dialog-footer">
          <el-button @click="closeDrawer">取消</el-button>
          <el-button type="primary" @click="saveItem(ruleFormRef)">保存</el-button>
        </div>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script>
import { ref, watch } from 'vue';
import CustomTable from './CustomTable.vue';
import bomapi from "@/api/bomapi";
import { ElMessage } from 'element-plus';
export default {

  components: { CustomTable },
  props: {
    visible: Boolean,
    initialData: Object,
    targetId:String
  },
  setup(props, { emit }) {
    const ruleFormRef = ref()
    const drawerVisible = ref(false);
    const form = ref({quantity: 0, referenceDes: ''});
    const selectedRows = ref([]);

    watch(() => props.visible, (newVal) => {
      drawerVisible.value = newVal;
    });

    const updateDrawerVisibility = (value) => {
      emit('update:visible', value);
    };

    const closeDrawer = () => {
      updateDrawerVisibility(false);
    };

    const saveItem = (formEl) => {
      if(selectedRows.value.length > 1) {
        ElMessage({type: 'warning', message: '只能选择一条表格数据！'});
        return;
      }
      if(selectedRows.value.length < 1) {
        ElMessage({type: 'warning', message: '至少选择一条数据！'});
        return;
      }
      const selectedIds = selectedRows.value.map(row => row.id);

      bomapi.createBOMLinkTwo({
        ...form.value,
        sourceId: selectedIds[0],
        targetId: props.targetId,
        quantity: form.value.quantity
      }).then(res => {
        ElMessage({type: 'success', message: '保存成功'});
        form.value = {quantity: 0, referenceDes: ''};
        ruleFormRef.value.resetFields();
        closeDrawer();
        emit('saveSuccess');
      }).catch(err => {
        ElMessage({type: 'error', message: '保存失败'});
      });
    };

    const handleSelectionChange = (selection) => {
      selectedRows.value = selection;
      console.log('Selected items:', selection);
    };

    return {
      drawerVisible,
      form,
      closeDrawer,
      saveItem,
      handleSelectionChange,
      updateDrawerVisibility,
      ruleFormRef
    };
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
