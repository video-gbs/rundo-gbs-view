<template>
  <div class="politicalDetail_container">
    <div class="act-btn f ai-c">
      <el-button
        v-for="i in Object.keys(actBtn)"
        :key="actBtn[i].id"
        :type="actBtn[i].type || 'primary'"
        style="margin: 0px 1px"
        size="mini"
        @click="btnFn(i, actBtn[i])"
      >
        <div class="f jc-c ai-c">
          <svg-icon :icon-class="actBtn[i].icon" class="btn_svg mr5" />
          {{ actBtn[i].label }}
        </div>
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
    <PDialog ref="commentRef" @submit="examineFn">
      <template slot="title">审核评论</template>
      <template slot="main">
        <el-form
          ref="commentForm"
          :model="checkParams"
          :rules="rules"
          label-width="80px"
        >
          <el-form-item label="审核结果">
            <el-radio v-model="checkParams.auditResult" :label="1"
              >审核通过</el-radio
            >
            <el-radio v-model="checkParams.auditResult" :label="0"
              >审核未通过</el-radio
            >
            <el-input v-model="checkParams.auditResult" />
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="checkParams.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
    <!--可见性设置-->
    <PDialog ref="isShowRef" @submit="isShowFn">
      <template slot="title">可见性开关设置</template>
      <template slot="main">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="当前设置">
            <el-switch
              v-model="one.isShow"
              :active-value="0"
              :inactive-value="1"
              style="display: block"
              active-text="可见"
              inactive-text="不可见"
            />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
  </div>
</template>

<script>
import PEditorVue from "@/components/PEditorVue";
import PControlGroup from "@/components/PControlGroup";
import BasicInformation from "../components/politicsDetail.vue";
import CommentInfo from "../components/commentInfo.vue";
import auditRecord from "../components/auditRecord";
// import CommentList from '../components/commentList.vue'
import PDialog from "@/components/PDialog";
import { affairsInfoSearch } from "@/api/method/politicalList";
import {
  setShowReview,
  auditReview,
  deleteReview,
  reallyDeleteReview,
} from "@/api/method/commentManagement";
export default {
  components: {
    BasicInformation,
    auditRecord,
    CommentInfo,
    PDialog,
    PEditorVue,
    PControlGroup,
  },
  data() {
    return {
      activeName: "评论信息",
      tabpaneList: [
        {
          label: "评论信息",
          content: CommentInfo,
          isShow: true,
          author: "all",
        },
        {
          label: "问政信息",
          content: BasicInformation,
          isShow: true,
          author: "all",
        },
        {
          label: "审核记录",
          content: auditRecord,
          isShow: true,
          author: "all",
        },
      ],
      admin: [0, 1],
      spokeman: [2, 3, 4],
      all: [0, 1, 2, 3, 4],

      btnAll: {
        comment: {
          id: 1,
          label: "审核评论",
          formName: "commentRef",
          show: false,
          author: "admin",
          icon: "right1",
        },
        isShow: {
          id: 2,
          label: "设为可见",
          dialog: "isShowRef",
          show: false,
          author: "admin",
          icon: "right7",
        },
        refresh: {
          id: 3,
          label: "恢复数据",
          show: false,
          author: "admin",
          icon: "right9",
        },
        delete: {
          id: 4,
          label: "删除",
          show: false,
          author: "admin",
          type: "danger",
          icon: "del-svg",
        },
        reallyDelete: {
          id: 5,
          label: "永久删除",
          show: false,
          author: "admin",
          type: "danger",
          icon: "del-svg",
        },
        back: {
          id: 100,
          label: "返回",
          show: false,
          author: "all",
          type: "normal",
          icon: "back-svg",
        },
      },
      dialogName: "",
      actBtn: {},
      one: {},
      auditId: "",
      firstLoading: true,
      userType: "",
    };
  },
  watch: {
    one: {
      handler: function (n) {
        console.log("获取了新的状态", n.status);
        if (this.firstLoading) {
          this.firstLoading = false;
        } else {
          this.accountPermission();
        }
      },
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      if (this.$route.params.id) {
        // 获取当前问政信息
        // 根据评论id获取单条评论，再用单条评论的affairesId获取问政信息
        const pid = this.$route.params.id;
        const fn = await affairsInfoSearch(pid);

        fn.code === 10000 && (this.one = fn.data);
        // fn().then((res) => {
        //   fn.code === 10000 && (this.one = fn.data)
        // })
        // 获取当前问政的受邀单位
        // 账号权限判断
        this.accountPermission();
      }
    },
    async accountPermission() {
      // 是否有补充说明

      this.btnAll.isShow.label =
        this.one.isShow === 1 ? "关闭可见" : "开启可见";
      this.btnAll.isShow.icon = this.one.isShow === 1 ? "right9" : "right7";
      const arr = [];
      if (this.one.delFlag === 1) {
        // 已删除，从回收站进来的
        arr.push("refresh", "reallyDelete", "back");
      } else {
        // 从评论列表进来的
        arr.push("isShow", "delete", "back");
      }

      Object.keys(this.btnAll).forEach((i) => {
        arr.includes(i) && this.$set(this.actBtn, i, this.btnAll[i]);
      });
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
      val.name === "评论信息" &&
        CommentInfo.methods.getOne(this.$route.params.id);
      val.name === "问政信息" &&
        BasicInformation.methods.getOne(this.$route.params.id);
      val.name === "审核记录" &&
        auditRecord.methods.getList(this.$route.params.id2);
    },
    async getOne(v) {
      console.log("水电费地方 个");
      await affairsInfoSearch(v).then((res) => {
        res.code === 10000 && (this.one = res.data);
      });
    },

    btnFn(i, obj) {
      obj.dialog && this.comDialog(obj);
      obj.id === 100 && this.$router.go(-1); // 返回
      obj.id === 4 && this.deleteItem(); // 删除
      obj.id === 5 && this.reallyDeleteItem(); // 永久删除
    },
    comDialog(v) {
      this.dialogName = v.dialog || "";
      console.log("vvsafsafsaf", v);
      this.$refs[v.dialog] && (this.$refs[v.dialog].visible = true);
    },
    comDialogHide() {
      this.$message.success("操作成功。");
      this.$refs[this.dialogName].visible = false;
      this.getOne(this.one.id);
    },

    examine(v) {
      this.checkParams.id = v.id;
      this.$refs["commentRef"].visible = true;
    },
    examineFn() {
      this.$refs["commentForm"].validate((v) => {
        if (v) {
          auditReview(this.checkParams).then((res) => {
            if (res.code === 10000) {
              this.$message.success("审核成功");
              this.$refs["commentRef"].visible = false;
            }
          });
        }
      });
    },
    deleteItem(v) {
      this.$alert(
        `确定要删除 '${v.title || v.realName || v.name}' 吗?`,
        "删除操作",
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
        }
      ).then((action) => {
        deleteReview(v.id).then((res) => {
          res.code === 10000 &&
            (this.$message.success("删除成功"), this.getDataList());
        });
      });
    },

    reallyDeleteItem(v) {
      this.$alert(
        `确定要删除 '${v.title || v.realName || v.name}' 吗?`,
        "删除操作",
        {
          dangerouslyUseHTMLString: true,
          showCancelButton: true,
        }
      ).then((action) => {
        reallyDeleteReview(v.id).then((res) => {
          res.code === 10000 &&
            (this.$message.success("删除成功"), this.getDataList());
        });
      });
    },
    isShowFn() {
      // 是否可见
      // 设置可见性

      setShowReview(this.one.id, this.one.isShow)
        .then((res) => {
          if (res.code === 10000) {
            this.comDialogHide();
          } else {
            this.one.isShow = this.one.isShow === 0 ? 1 : 0;
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.one.isShow = this.one.isShow === 0 ? 1 : 0;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-tabs--border-card {
  box-shadow: none;
  border: 0;
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

.politicalDetail_container {
  background: #ececec;
  position: relative;
  margin: 20px;
}

.act-btn {
  position: absolute;
  top: 6px;
  right: 0px;
  z-index: 10;

  ::v-deep .el-button {
    display: flex;
    align-items: center;
  }

  ::v-deep .el-button--danger {
    .btn_svg {
      color: #fff;
    }
  }
}
</style>
