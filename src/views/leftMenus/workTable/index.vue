<template>
  <div class="page-container">
    <div class="container-left">
      <div class="container-left-top">
        <Overview />
      </div>
      <div class="container-left-top-bottom">
        <TodoList />
      </div>
    </div>
    <div class="container-right">
        <Test />
        <NoticeList />
        <Test />
    </div>
  </div>
</template>

<script>
import Overview from "./components/overview.vue";
import TodoList from "./components/todoList.vue";
import Test from "./components/test.vue";

import NoticeList from './components/noticeList.vue'
// import PCard from '@/components/pCard.vue'

export default {
  components: {
    Overview,
    TodoList,
    Test,
    NoticeList
    // PCard
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  background: #f2f2f2;
  min-height: calc(100vh - 98px);
  padding: 1.25rem;
  box-sizing: border-box;
  overflow: hidden;
  display:flex;
  .container-left {
    width: 1070px;
    margin-right: 20px;
  }
  .container-right {
    width: calc(100% - 1070px);
  }
}
</style>
