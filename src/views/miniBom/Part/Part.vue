<template>
  <div>
    <h1>部件管理</h1>
    <div>
      <el-button type="primary" @click="addDialog = true">添加部件</el-button>
    </div>




    <!-- 创建部件表单弹窗 -->
    <el-dialog v-model="addDialog" title="添加部件" draggable>
      <div>
        <el-form ref="attributeFormRef" style="max-width: 500px" :model="partForm" :rules="formRules"
          label-width="auto" class="demo-ruleForm" status-icon>
          <el-form-item label="产品">
            <span>笔记本电脑</span>
          </el-form-item>
          <el-form-item label="部件名称" prop="name">
            <el-input v-model="attributeForm.name" />
          </el-form-item>
          <el-form-item label="默认单位" prop="nameEn">
            <el-input v-model="attributeForm.nameEn" />
          </el-form-item>
          <el-form-item label="来源" prop="description">
            <el-input v-model="attributeForm.description" />
          </el-form-item>
          <el-form-item label="装配模式" prop="descriptionEn">
            <el-input v-model="attributeForm.descriptionEn" />
          </el-form-item>
          <el-form-item label="分类" prop="type">
            <el-input v-model="attributeForm.type" />
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="addPart">确定</el-button>
        <el-button type="danger" @click="addDialog = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
  
</template>

<script>
import { reactive, ref } from 'vue'
export default {
  name:'part',
  setup(){

    //添加部件弹窗
    const addDialog = ref(false);
    //添加部件表单
    const partForm = reactive({
      //名称，默认单位，装配模式，来源，分类

    })
    //添加部件方法
    function addPart(){

      //表单置空
    }

    return{
      addDialog,partForm,addPart
    }
  }

}
</script>

<style>

</style>