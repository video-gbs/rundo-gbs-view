<template>
  <div class="todo-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>待办事项</span>
      </div>
      <div v-for="o in 1" :key="o" class="text item">
        {{'列表内容 ' + o }}
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
    };
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.todo-container {

}
</style>
