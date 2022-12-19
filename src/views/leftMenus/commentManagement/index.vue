<!--问政评论管理-->
<template>
  <div class="detail_container">
    <el-button
      v-if="recycleShow"
      size="mini"
      type="primary"
      class="recycle-btn"
      @click="$router.push('/commentManagementRecycleBin')"
      >回收站</el-button
    >
    <el-button
      v-if="listShow"
      size="mini"
      type="primary"
      class="recycle-btn"
      @click="$router.push('/commentManagementList')"
      >返回评论列表</el-button
    >
    <el-tabs
      v-model="activeName"
      class="f1 f fd-c"
      type="border-card"
      @tab-click="handleClick"
    >
      <template>
        <el-tab-pane
          v-for="(item, index) in tabpaneList"
          :key="index"
          :label="item.label"
          :name="item.label"
        >
          <!-- <component :is="item.content" v-if="item.isShow" /> -->
        </el-tab-pane>
        <router-view :status="activeName" />
      </template>
    </el-tabs>
  </div>
</template>
<script>
export default {
  name: "CommentManagementListIndex",
  data() {
    return {
      recycleShow: false,
      listShow: false,
      activeName: "全部",
      tabDict: {
        0: [],
        1: [2],
        2: [4, 12, 13, 14, 20, 21],
        3: [5],
      },
      tabpaneList: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "待审核",
          value: 1,
        },
        {
          label: "审核通过",
          value: 2,
        },
        {
          label: "审核未通过",
          value: 3,
        },
      ],
    };
  },
  watch: {
    "$route.path": {
      handler: function (v) {
        console.log("vvv", v);
        if (v === "/commentManagementList") {
          this.listShow = false;
          this.recycleShow = true;
        } else if (v === "/commentManagementRecycleBin") {
          this.listShow = true;
          this.recycleShow = false;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    // const ut = +(localStorage.getItem('rj_wzwz_deptType') || 999)
    // this.recycleShow = ut === 0
  },
  methods: {
    handleClick() {},
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tabs__content {
  flex: 1;
}
::v-deep .el-tabs--border-card {
  box-shadow: none;
  border: 0;
}
.recycle-btn {
  position: absolute;
  top: 7px;
  right: 7px;
  z-index: 10;
}
::v-deep .el-tabs__item.is-active {
  border: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 20px 24px;
}
::v-deep .el-tabs--border-card {
  background: #f9f9f9;
  border-top: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border: 0 none;
  background: #ececec;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: 0 none;
  height: 36px;
  margin: 0 4px 4px 0;
  border-radius: 2px;
  background: #f6f6f6 !important;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  position: relative;
  top: 4px;
}
::v-deep .el-tabs__nav > .is-active {
  background: #f9f9f9 !important;
}
::v-deep .el-tabs__item {
}

.detail_container {
  background: #ececec;
  margin: 20px;
  position: relative;
  overflow-y: auto;
  // .right-btns-ul {
  //   position: absolute;
  //   right: 10px;
  //   top: 4px;
  //   margin: 0;
  //   padding: 0;
  //   z-index: 99;

  //   .right-btns-li {
  //     float: left;
  //     margin: 0 8px;

  //     height: 32px;
  //     line-height: 32px;
  //     .right-btns-button {
  //       height: 32px;
  //       background: #1e56a0;
  //       border-radius: 1px;
  //     }
  //     .btn_svg {
  //       width: 1rem;
  //       height: 1rem;
  //       position: relative;
  //       top: 1px;
  //       left: -2px;
  //     }
  //   }
  // }
}
</style>
