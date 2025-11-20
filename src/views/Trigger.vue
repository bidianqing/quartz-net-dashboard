<template>
  <el-form :inline="true" :model="filterTriggerOptions">
    <el-form-item label="TriggerName">
      <el-input v-model="filterTriggerOptions.triggerName" clearable />
    </el-form-item>
    <el-form-item label="JobName">
      <el-input v-model="filterTriggerOptions.jobName" clearable />
    </el-form-item>
    <el-form-item label="JobGroup">
      <el-input v-model="filterTriggerOptions.jobGroup" clearable />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="btnQueryTrigger">Query</el-button>
    </el-form-item>
  </el-form>

  <el-space>
    <el-button type="primary" @click="showAddTriggerDialog('新建触发器')"
      >新建</el-button
    >
  </el-space>

  <el-table :data="triggerData" style="width: 100%" v-loading="loading">
    <el-table-column prop="SCHED_NAME" label="SCHED_NAME" width="180" />
    <el-table-column prop="TRIGGER_NAME" label="TRIGGER_NAME" width="310" />
    <el-table-column prop="TRIGGER_GROUP" label="TRIGGER_GROUP" width="180" />
    <el-table-column prop="JOB_NAME" label="JOB_NAME" width="180" />
    <el-table-column prop="JOB_GROUP" label="JOB_GROUP" width="180" />
    <el-table-column prop="DESCRIPTION" label="DESCRIPTION" width="180" />
    <el-table-column prop="prevFireTime" label="PREV_FIRE_TIME" width="180" />
    <el-table-column prop="nextFireTime" label="NEXT_FIRE_TIME" width="180" />
    <el-table-column prop="MISFIRE_INSTR" label="MISFIRE_INSTR" width="180" />
    <el-table-column prop="TRIGGER_STATE" label="TRIGGER_STATE" width="180" />
    <el-table-column prop="TRIGGER_TYPE" label="TRIGGER_TYPE" width="180" />
    <el-table-column
      prop="CALENDAR_INTERVAL"
      label="CALENDAR_INTERVAL"
      width="180"
    />
    <el-table-column
      prop="REPEAT_INTERVAL"
      label="REPEAT_INTERVAL"
      width="180"
    />
    <el-table-column
      prop="CRON_EXPRESSION"
      label="CRON_EXPRESSION"
      width="180"
    />
    <el-table-column prop="startTime" label="START_TIME" width="180" />
    <el-table-column prop="endTime" label="END_TIME" width="180" />
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-dropdown
          @command="
            command => {
              handleCommand(command, scope.row)
            }
          "
          trigger="click"
        >
          <el-button type="primary">
            Action<el-icon><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="edit" v-if="scope.row.JOB_NAME == 'http'">Edit</el-dropdown-item>
              <el-dropdown-item command="viewJobData"
                >View JobData</el-dropdown-item
              >
              <el-dropdown-item command="pause">Pause</el-dropdown-item>
              <el-dropdown-item command="resume">Resume</el-dropdown-item>
              <el-dropdown-item command="unschedule"
                >Unschedule</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-model:current-page="filterTriggerOptions.pageIndex"
    v-model:page-size="filterTriggerOptions.pageSize"
    :page-sizes="[10, 20, 50, 100]"
    :background="true"
    layout="sizes, prev, pager, next"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
  <el-dialog
    v-model="viewJobDataDialogOptions.visible"
    title="JobData"
    width="800"
  >
    <el-table :data="viewJobDataDialogOptions.jobData" style="width: 100%">
      <el-table-column prop="key" label="KEY"> </el-table-column>
      <el-table-column prop="value" label="VALUE"> </el-table-column>
    </el-table>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="viewJobDataDialogOptions.visible = false"
          >Close</el-button
        >
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="addTriggerDialogOptions.visible"
    :title="addTriggerDialogOptions.title"
    width="900"
  >
    <el-form :model="addTriggerDialogOptions.form" label-width="auto">
      <el-form-item label="Cron表达式">
        <el-input v-model="addTriggerDialogOptions.form.cron" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="addTriggerDialogOptions.form.description" />
      </el-form-item>
      <el-form-item label="选择任务">
        <el-select
          v-model="addTriggerDialogOptions.form.jobName"
          placeholder="请选择"
        >
          <el-option key="HttpJob" label="HttpJob" value="HttpJob" />
        </el-select>
      </el-form-item>
      <el-form-item label="参数">
        <el-table
          :data="addTriggerDialogOptions.form.variables"
          style="width: 100%"
        >
          <el-table-column prop="variableName" label="变量名" width="200">
            <template #default="scope">
              <el-input v-model="scope.row.variableName" />
            </template>
          </el-table-column>
          <el-table-column prop="variableValue" label="变量值">
            <template #default="scope">
              <el-input v-model="scope.row.variableValue" />
            </template>
          </el-table-column>
          <el-table-column width="80">
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
        <el-button @click="addJobDataRow">AddJobData</el-button>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addTriggerDialogOptions.visible = false"
          >Close</el-button
        >
        <el-button @click="saveTrigger" type="primary">Save</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { ElMessage } from 'element-plus'

import { TriggerAction, TriggerJob, getTriggers, scheduleJob } from '@/api'
onMounted(() => {
  queryTrigger()
})

const total = ref(0)

const saveTrigger = () => {
  console.log(addTriggerDialogOptions.form)
  scheduleJob(addTriggerDialogOptions.form).then(res => {
    if (!res.data.success) {
      ElMessage(res.data.message)
      return
    }

    ElMessage('Save success')
    addTriggerDialogOptions.visible = false
    queryTrigger()
  })
}

const removeVariable = item => {
  const index = addTriggerDialogOptions.form.variables.indexOf(item)
  if (index !== -1) {
    addTriggerDialogOptions.form.variables.splice(index, 1)
  }
}

const addJobDataRow = () => {
  addTriggerDialogOptions.form.variables.push({
    variableId: Date.now(),
    variableName: '',
    variableValue: ''
  })
}

const showAddTriggerDialog = title => {
  addTriggerDialogOptions.visible = true
  addTriggerDialogOptions.title = title
  addTriggerDialogOptions.form = {
    variables: []
  }
}

const addTriggerDialogOptions = reactive({
  visible: false,
  title: '新建触发器',
  form: {
    variables: []
  }
})

const viewJobDataDialogOptions = reactive({
  visible: false,
  jobData: []
})

const filterTriggerOptions = reactive({
  pageIndex: 1,
  pageSize: 10,
  triggerName: null,
  jobName: null,
  jobGroup: null
})

const triggerData = ref([])
const loading = ref(false)

const handleSizeChange = number => {
  filterTriggerOptions.pageIndex = 1
  queryTrigger()
}

const handleCurrentChange = number => {
  queryTrigger()
}

const btnQueryTrigger = () => {
  filterTriggerOptions.pageIndex = 1
  queryTrigger()
}

const queryTrigger = () => {
  loading.value = true
  getTriggers(filterTriggerOptions).then(res => {
    triggerData.value = res.data.list
    total.value = res.data.total
    loading.value = false
  })
}

const handleCommand = (command, row) => {
  if (command == 'viewJobData') {
    viewJobDataDialogOptions.jobData = []
    for (const [key, value] of Object.entries(row.jobData)) {
      viewJobDataDialogOptions.jobData.push({ key: key, value: value })
    }
    viewJobDataDialogOptions.visible = true

    return
  } else if (command == 'edit') {
    addTriggerDialogOptions.visible = true
    addTriggerDialogOptions.title = '编辑触发器'
    addTriggerDialogOptions.form.triggerName = row.TRIGGER_NAME
    addTriggerDialogOptions.form.triggerGroup = row.TRIGGER_GROUP
    addTriggerDialogOptions.form.cron = row.CRON_EXPRESSION
    addTriggerDialogOptions.form.description = row.DESCRIPTION
    addTriggerDialogOptions.form.jobName = row.JOB_NAME
    addTriggerDialogOptions.form.variables = []
    for (const [key, value] of Object.entries(row.jobData)) {
      addTriggerDialogOptions.form.variables.push({ variableName: key, variableValue: value })
    }

    return
  }
  
  TriggerAction({
    triggerName: row.TRIGGER_NAME,
    triggerGroup: row.TRIGGER_GROUP,
    command: command
  }).then(res => {
    ElMessage(`${command} success`)
    queryTrigger()
  })
}
</script>