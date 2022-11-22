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
      <Weather />
      <NoticeList style="margin:5px 0 20px 0;" />
      <Statistical />
    </div>
  </div>
</template>

<script>
import Overview from "./components/overview.vue";
import TodoList from "./components/todoList.vue";
import Weather from "./components/Weather.vue";
import Statistical from "./components/statistical.vue";
import NoticeList from "./components/noticeList.vue";

import { editAffiche } from "@/api/method/appraise";
import { getAfficheList } from '@/api/method/affiche'

export default {
  components: {
    Overview,
    TodoList,
    Weather,
    NoticeList,
    Statistical
    // PCard
  },
  data() {
    return {
      params: {}
    };
  },
  watch: {},
  mounted() {
    this.editAffiche();
    this.getAfficheList();
  },
  methods: {
    editAffiche() {
      editAffiche(this.params).then(res => {
        if (res.code === 10000) {
          console.log("res", res);
          // this.tableData = res.data.records
          // this.params.total = res.data.total
        }
      });
    },
    getAfficheList() {
      getAfficheList(this.params).then(res => {
        if (res.code === 10000) {
          console.log("res", res);
          // this.tableData = res.data.records
          // this.params.total = res.data.total
        }
      });
    }
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
  display: flex;
  .container-left {
    width: 1070px;
    margin-right: 20px;
  }
  .container-left-top-bottom {
    height: calc(100% - 152px);
  }
  .container-right {
    width: calc(100% - 1070px);
  }
}
</style>
