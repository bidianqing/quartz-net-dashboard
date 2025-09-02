<template>
  <el-form :inline="true" :model="filterJobOptions">
    <el-form-item label="JOB_NAME">
      <el-input v-model="filterJobOptions.JOB_NAME" />
    </el-form-item>
    <el-form-item label="JOB_GROUP">
      <el-input v-model="filterJobOptions.JOB_GROUP" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="queryJob">Query</el-button>
      <el-button @click="reset">Reset</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="jobData" v-loading="loading">
    <el-table-column prop="SCHED_NAME" label="SCHED_NAME" />
    <el-table-column prop="JOB_NAME" label="JOB_NAME" />
    <el-table-column prop="JOB_GROUP" label="JOB_GROUP" />
    <el-table-column prop="JOB_CLASS_NAME" label="JOB_CLASS_NAME" />
    <el-table-column prop="DESCRIPTION" label="DESCRIPTION" />
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button type="primary" @click="visibleTriggerJobDialog(scope.row)">
          TriggerJob
        </el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog
    v-model="triggerJobDialogOptions.visible"
    :title="triggerJobDialogOptions.title"
    :close-on-click-modal="false"
    v-if="triggerJobDialogOptions.visible"
  >
    <el-form :model="triggerJobDialogOptions.form">
      <el-table :data="triggerJobDialogOptions.form.variables">
        <el-table-column prop="variableName" label="变量名">
          <template #default="scope">
            <el-input v-model="scope.row.variableName" />
          </template>
        </el-table-column>
        <el-table-column prop="variableValue" label="变量值">
          <template #default="scope">
            <el-input v-model="scope.row.variableValue" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="scope">
            <el-button
              type="danger"
              :icon="Delete"
              @click="removeVariable(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-button @click="addJobData">AddJobData</el-button>
    </el-form>
    <template #footer>
      <el-button @click="triggerJobDialogOptions.visible = false"
        >Cancel</el-button
      >
      <el-button type="primary" @click="triggerJob">
        Trigger This Job
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

import { getJobs, TriggerJob } from "@/api";
onMounted(() => {
  queryJob();
});

const filterJobOptions = reactive({});

const jobData = ref([]);
const loading = ref(false);

const queryJob = () => {
  loading.value = true;
  getJobs(filterJobOptions).then((res) => {
    jobData.value = res.data;
    loading.value = false;
  });
};

const triggerJobDialogOptions = reactive({
  visible: false,
  title: "",
  row: null,
  form: {},
});

const visibleTriggerJobDialog = (row) => {
  triggerJobDialogOptions.visible = true;
  triggerJobDialogOptions.title = `Trigger[${row.JOB_GROUP}.${row.JOB_NAME}]`;
  triggerJobDialogOptions.row = row;
  triggerJobDialogOptions.form = {
    JOB_NAME: row.JOB_NAME,
    JOB_GROUP: row.JOB_GROUP,
    variables: [],
  };
};

const triggerJob = () => {
  TriggerJob(triggerJobDialogOptions.form).then((res) => {
    triggerJobDialogOptions.visible = false;
    ElMessage({
      message: "执行成功",
      type: "success",
    });
  });
};

const addJobData = () => {
  triggerJobDialogOptions.form.variables.push({
    variableId: Date.now(),
    variableName: "",
    variableName: "",
  });
};

const removeVariable = (item) => {
  const index = triggerJobDialogOptions.form.variables.indexOf(item);
  if (index !== -1) {
    triggerJobDialogOptions.form.variables.splice(index, 1);
  }
};

const reset = () => {
  filterJobOptions.JOB_NAME = null
  filterJobOptions.JOB_GROUP = null
  queryJob()
}
</script>