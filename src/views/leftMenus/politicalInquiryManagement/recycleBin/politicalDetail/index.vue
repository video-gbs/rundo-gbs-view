<template>
  <div class="politicalDetail_container">
    <div class="act-btn f ai-c">
      <el-button
        v-for="i in Object.keys(btnAll)"
        :key="btnAll[i].id"
        :type="btnAll[i].type || 'primary'"
        style="margin: 0px 1px"
        size="mini"
        @click="btnFn(i, btnAll[i])"
      >
        {{ btnAll[i].label }}
      </el-button>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabpaneList"
        :key="item.name"
        :label="item.label"
        :name="item.label"
      >
        <component :is="item.content" :one="one" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PEditorVue from "@/components/PEditorVue";
import PControlGroup from "@/components/PControlGroup";
import BasicInformation from "../components/DetailList";
import PoliticalReply from "../components/PoliticalReply";
import ReviewResults from "../components/ReviewResults";
import PoliticalRecord from "../components/PoliticalRecord";
import PDialog from "@/components/PDialog";
import { affairsInfoSearch } from "@/api/method/politicalList";
import { reallyDeleteAffairs, editAffairs } from "@/api/method/affairs";

import { getAffairsMoreByOne } from "@/api/method/affairsMore";
import { Local } from "@/utils/storage";

export default {
  components: {
    BasicInformation,
    PoliticalReply,
    ReviewResults,
    PoliticalRecord,
    PDialog,
    PEditorVue,
    PControlGroup,
  },
  data() {
    return {
      activeName: "基本信息",
      tabpaneList: [
        {
          label: "基本信息",
          content: BasicInformation,
          isShow: true,
          author: "all",
        },
        {
          label: "问政回复",
          content: PoliticalReply,
          isShow: true,
          author: "all",
        },
        {
          label: "评价结果",
          content: ReviewResults,
          isShow: true,
          author: "all",
        },
        {
          label: "问政记录",
          content: PoliticalRecord,
          isShow: true,
          author: "admin",
        },
      ],
      btnAll: {
        examine: {
          id: 1,
          label: "恢复数据",
          formName: "recoverData",
        },
        more: {
          id: 2,
          label: "永久删除",
          formName: "reallyDelete",
        },
        back: {
          id: 100,
          label: "返回",
          show: false,
          author: "all",
          type: "normal",
        },
      },
      one: {},
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      // 获取账号所属角色类型
      this.userType = Local.get("rj_wzwz_deptType");
      this.userType !== null && (this.userType = this.userType * 1);
      console.log("this.$route.params.id", this.$route.params.id);
      if (this.$route.params.id) {
        // 获取当前问政信息

        const pid = this.$route.params.id;
        const fn = await affairsInfoSearch(pid);
        console.log("fnnnnnnnn", fn);
        fn.code === 10000 && (this.one = fn.data);
      }
    },
    handleClick(val, event) {
      console.log("val", val);
      this.tabpaneList = this.tabpaneList.map((item) => {
        if (item.label === val.label) {
          item.isShow = true;
        } else {
          item.isShow = false;
        }
        return item;
      });
      console.log("comname", val.name);
      val.name === "问政回复" &&
        PoliticalReply.methods.getReply(this.$route.params.id);
      val.name === "评价结果" &&
        ReviewResults.methods.getAppraiseBy(this.$route.params.id);
      val.name === "问政记录" &&
        PoliticalRecord.methods.getList({ affairsId: this.$route.params.id });
    },

    getMore(v) {
      // 获取补充说明
      getAffairsMoreByOne(v).then((res) => {
        if (res.code === 10000) {
          this.moreData = res.data;
        }
      });
    },
    // getDept() {
    //   unitList({
    //     current: 1,
    //     size: 9999
    //   })
    //     .then((res) => {
    //       if (res.code === 10000) {
    //         this.deptList = res.data.records.filter((i) => {
    //           return i.deptType > 1
    //         })
    //       }
    //     })
    //     .finally(() => {})
    // },
    btnFn(i, obj) {
      console.log("sdfsdfsdf!!");
      obj.id === 100 && this.$router.go(-1); // 返回
      obj.id === 1 && this.recoverData(); // 恢复数据
      obj.id === 2 && this.reallyDelete(); // 永久删除
    },
    reallyDelete(obj) {
      // 永久删除
      this.$confirm(
        `是否永久删除标题为“${this.one.title}”的问政信息，删除后无法恢复`,
        "删除提示",
        {
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          reallyDeleteAffairs(this.one.id).then((res) => {
            if (res.code === 10000) {
              this.$message.success("删除成功！");
              this.$router.push("/recycleBin");
              return;
            }
            this.$message.warning(res.message);
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    recoverData(obj) {
      // 恢复数据
      this.$confirm(
        `是否恢复标题为“${this.one.title}”的问政数据？`,
        "恢复数据",
        {
          confirmButtonText: "确定恢复",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          editAffairs({ id: this.one.id, isDeleted: 0 }).then((res) => {
            if (res.code === 10000) {
              this.$message.success("恢复成功！");
              this.$router.push("/recycleBin");
              return;
            }
            this.$message.warning(res.message);
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
  },
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
  position: relative;
  top: 4px;
}

::v-deep .el-tabs__nav > .is-active {
  background: #f9f9f9 !important;
}

::v-deep .el-tabs__item {
}

.politicalDetail_container {
  background: #ececec;
}

.act-btn {
  position: absolute;
  top: 6px;
  right: 5px;
  z-index: 1999;
}
</style>
