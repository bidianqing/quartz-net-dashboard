<template>
  <div>
    <el-container>
      <el-aside>
        <el-menu router>
          <el-menu-item index="/jobs">Jobs</el-menu-item>
          <el-menu-item index="/triggers">Triggers</el-menu-item>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
 
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<style>
</style>
