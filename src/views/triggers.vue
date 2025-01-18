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

  <el-table :data="triggerData" style="width: 100%" v-loading="loading">
    <el-table-column prop="SCHED_NAME" label="SCHED_NAME" width="180" />
    <el-table-column prop="TRIGGER_NAME" label="TRIGGER_NAME" width="310" />
    <el-table-column prop="TRIGGER_GROUP" label="TRIGGER_GROUP" width="180" />
    <el-table-column prop="JOB_NAME" label="JOB_NAME" width="180" />
    <el-table-column prop="JOB_GROUP" label="JOB_GROUP" width="180"/>
    <el-table-column prop="DESCRIPTION" label="DESCRIPTION" width="180"/>
    <el-table-column prop="prevFireTime" label="PREV_FIRE_TIME" width="180"/>
    <el-table-column prop="nextFireTime" label="NEXT_FIRE_TIME" width="180"/>
    <el-table-column prop="MISFIRE_INSTR" label="MISFIRE_INSTR" width="180"/>
    <el-table-column prop="TRIGGER_STATE" label="TRIGGER_STATE" width="180"/>
    <el-table-column prop="TRIGGER_TYPE" label="TRIGGER_TYPE" width="180"/>
    <el-table-column prop="CALENDAR_INTERVAL" label="CALENDAR_INTERVAL" width="180"/>
    <el-table-column prop="REPEAT_INTERVAL" label="REPEAT_INTERVAL" width="180"/>
    <el-table-column prop="CRON_EXPRESSION" label="CRON_EXPRESSION" width="180"/>
    <el-table-column prop="startTime" label="START_TIME" width="180"/>
    <el-table-column prop="endTime" label="END_TIME" width="180"/>
    <el-table-column fixed="right" label="Operations" min-width="120">
      <template #default="scope">
        <el-dropdown @command="(command) => { handleCommand(command, scope.row) }" trigger="click">
            <el-button type="primary">
                Action<el-icon ><arrow-down /></el-icon>
            </el-button>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="pause">Pause</el-dropdown-item>
                    <el-dropdown-item command="resume">Resume</el-dropdown-item>
                    <el-dropdown-item command="unschedule">Unschedule</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination 
      v-model:current-page="filterTriggerOptions.pageIndex"
      v-model:page-size="filterTriggerOptions.pageSize"
      :page-sizes="[1, 2, 50, 100]"
      :background="true"
      layout="sizes, prev, pager, next"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
</template>

<script setup>
import {
    ref,
    onMounted,
    reactive
} from 'vue'
import { ElMessage } from 'element-plus'

import { TriggerAction, TriggerJob, getTriggers } from "@/api";
onMounted(() => {
    queryTrigger()
});

const total = ref(0)

const filterTriggerOptions = reactive({
    pageIndex: 1,
    pageSize: 1,
    triggerName: null,
    jobName: null,
    jobGroup: null
})

const triggerData = ref([])
const loading = ref(false)

const handleSizeChange = (number) => {
    filterTriggerOptions.pageIndex = 1
    queryTrigger()
}

const handleCurrentChange = (number) => {
    queryTrigger()
}

const btnQueryTrigger = () => {
    filterTriggerOptions.pageIndex = 1
    queryTrigger()
}

const queryTrigger = () => {
    loading.value = true
    getTriggers(filterTriggerOptions).then((res)=>{
        triggerData.value = res.data.list
        total.value = res.data.total
        loading.value = false
    })
}

const handleCommand = (command, row) => {
    TriggerAction({
        triggerName: row.TRIGGER_NAME,
        triggerGroup: row.TRIGGER_GROUP,
        command: command
    }).then((res)=>{
        ElMessage(`${command} success`)
        queryTrigger()
    })
}

</script>