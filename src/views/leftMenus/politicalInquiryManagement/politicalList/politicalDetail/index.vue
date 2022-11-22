<template>
  <div class="detail_container">
    <el-tabs type="border-card" v-model="activeName" @tab-click="handleClick">
      <template>
        <el-tab-pane
          v-for="(item, index) in tabpaneList"
          :key="item.name"
          :label="item.label"
          :name="item.label"
        >
          <component :is="item.content" v-if="item.isShow"></component>
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import BasicInformation from "../components/DetailList";
import PoliticalReply from "../components/PoliticalReply";
import ReviewResults from "../components/ReviewResults";
import PoliticalRecord from "../components/PoliticalRecord";

export default {
  components: {
    BasicInformation,
    PoliticalReply,
    ReviewResults,
    PoliticalRecord
  },
  data() {
    return {
      activeName: "基本信息",
      tabpaneList: [
        {
          label: "基本信息",
          content: BasicInformation,
          isShow: true
        },
        {
          label: "问政回复",
          content: PoliticalReply,
          isShow: false
        },
        {
          label: "评价结果",
          content: ReviewResults,
          isShow: false
        },
        {
          label: "问政记录",
          content: PoliticalRecord,
          isShow: false
        }
      ]
    };
  },
  watch: {},
  mounted() {},
  methods: {
    handleClick(val, event) {
      this.tabpaneList = this.tabpaneList.map(item => {
        if (item.label === val.label) {
          item.isShow = true;
        } else {
          item.isShow = false;
        }
        return item;
      });
      // this.$nextTick(() => {
      //   document.getElementById("tab").scrollIntoView({
      //     behavior: "smooth",
      //     block: "start"
      //   });
      // });
    }
  }
};
</script>

<style lang="scss" scoped>
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
  position:relative;
  top:4px;
}
::v-deep .el-tabs__nav > .is-active {
  background: #f9f9f9 !important;
}
::v-deep .el-tabs__item {
}
.detail_container {
  background: #ececec;
  margin: 20px;
}
</style>
