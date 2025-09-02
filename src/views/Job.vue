<template>
  <el-form :inline="true" :model="filterJobOptions">
    <el-form-item label="JobName">
      <el-input v-model="filterJobOptions.jobName" clearable />
    </el-form-item>
    <el-form-item label="JobGroup">
      <el-input v-model="filterJobOptions.jobGroup" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="queryJob">Query</el-button>
    </el-form-item>
  </el-form>

  <el-table :data="jobData" style="width: 100%" v-loading="loading">
    <el-table-column prop="scheD_NAME" label="SCHED_NAME" width="180" />
    <el-table-column prop="joB_NAME" label="JOB_NAME" width="180" />
    <el-table-column prop="joB_GROUP" label="JOB_GROUP" />
    <el-table-column prop="description" label="DESCRIPTION" />
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-button
          link
          type="primary"
          size="small"
          @click="visibleTriggerJobDialog(scope.row)"
        >
          TriggerJob
        </el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    v-model="triggerJobDialogOptions.visible"
    title="TriggerJob"
    width="600"
  >
    <el-form :model="triggerJobDialogOptions.form">
      <el-table
        :data="triggerJobDialogOptions.form.variables"
        style="width: 100%"
      >
        <el-table-column prop="variableName" label="变量名" width="180">
          <template #default="scope">
            <el-input v-model="scope.row.variableName" />
          </template>
        </el-table-column>
        <el-table-column prop="variableValue" label="变量值" width="300">
          <template #default="scope">
            <el-input v-model="scope.row.variableValue" />
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-button
              type="danger"
              :icon="Delete"
              circle
              @click="removeVariable(scope.row)"
            />
          </template>
        </el-table-column>
      </el-table>

      <el-button @click="addJobData">AddJobData</el-button>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="triggerJobDialogOptions.visible = false"
          >Cancel</el-button
        >
        <el-button type="primary" @click="triggerJob">
          Trigger This Job
        </el-button>
      </div>
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

const filterJobOptions = reactive({
  jobName: null,
  jobGroup: null,
});

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
  row: null,
  form: {},
});

const visibleTriggerJobDialog = (row) => {
  triggerJobDialogOptions.visible = true;
  triggerJobDialogOptions.row = row;
  triggerJobDialogOptions.form = {
    jobName: row.joB_NAME,
    jobGroup: row.joB_GROUP,
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
</script>