<template>
  <div>
    <el-button type="primary" @click="showEditor">新增子项</el-button>
    <el-button type="primary" @click="showParentDrawer">查看父项</el-button>
    <ItemEditor @saveSuccess="saveSuccess" :targetId="targetId" :visible="editorVisible" :initialData="editorData" @update:visible="editorVisible = $event" />

    <el-drawer
        title="父项清单"
        :model-value.sync="parentDrawerVisible"
        direction="rtl"
        @close="parentDrawerVisible=false"
        size="65%"
    >
      <query-related-part  :targetId="targetId"/>
    </el-drawer>
  </div>
</template>

<script>
import { ref } from 'vue';
import ItemEditor from './ItemEditor.vue';
import CustomTableBom from "@/views/miniBom/components/CustomTableBom.vue";
import QueryRelatedPart from "@/views/miniBom/components/queryRelatedPart.vue";

export default {
  components: {QueryRelatedPart, CustomTableBom, ItemEditor },
  props: {
    targetId: String
  },
  setup(props, { emit }) {
    const tableData = ref([]);
    const editorVisible = ref(false);
    const parentDrawerVisible = ref(false);
    const editorData = ref({});

    const showEditor = (data = { targetId: '', quantity: 0, referenceDes: '' }) => {
      console.log('Opening editor', data);
      editorData.value = data;
      editorVisible.value = true;
    };

    const showParentDrawer = () => {
      parentDrawerVisible.value = true;
    };

    const editItem = (item) => {
      showEditor(item);
    };

    const saveSuccess = (itemData) => {
      console.log('xxxxx-x-x-x-x--x')
      emit('getDataCustom');
    };

    return {
      tableData,
      editorVisible,
      parentDrawerVisible,
      editorData,
      showEditor,
      showParentDrawer,
      editItem,
      saveSuccess,
    };
  },
};
</script>
