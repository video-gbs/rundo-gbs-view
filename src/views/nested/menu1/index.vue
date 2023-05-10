<template>
  <div style="padding: 30px">
    <el-alert :closable="false" title="menu 1">
      <router-view :key="$route.fullpath" />
    </el-alert>
  </div>
</template>
