<template>
  <div class="detail_container">
    <el-button
      v-if="recycleShow"
      size="mini"
      type="primary"
      class="recycle-btn"
      @click="$router.push('/recycleBin')"
      >回收站</el-button
    >
    <el-tabs
      v-if="!this.showDetails"
      v-model="activeName"
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
        <All ref="listRef" />
      </template>
    </el-tabs>

    <ul v-if="this.showDetails" class="right-btns-ul">
      <li v-for="(btn, i) in btnLists" :key="i" class="right-btns-li">
        <el-button type="primary" class="right-btns-button" size="mini"
          ><svg-icon :icon-class="btn.iconName" class="btn_svg" />{{
            btn.name
          }}</el-button
        >
      </li>
    </ul>
    <div v-if="this.showDetails">
      <DetailView ref="details" />
    </div>
  </div>
</template>

<script>
import All from "./components/All.vue";
// import Dsh from './components/Dsh.vue'
// import Shwtg from './components/Shwtg.vue'
// import Whf from './components/Whf.vue'
// import Yhf from './components/Yhf.vue'
// import Ysl from './components/Ysl.vue'
import DetailView from "./politicalDetail/index.vue";

export default {
  components: {
    All,
    // Dsh,
    // Shwtg,
    // Whf,
    // Yhf,
    // Ysl,
    DetailView,
  },
  data() {
    return {
      showDetails: false,
      activeName: "全部",
      btnLists: [
        {
          name: "审核问政",
          iconName: "right1",
        },
        {
          name: "审核补充说明",
          iconName: "right2",
        },
        {
          name: "受理问政",
          iconName: "right3",
        },
        {
          name: "回复问政",
          iconName: "right4",
        },
        {
          name: "问政转移",
          iconName: "right5",
        },
        {
          name: "邀请回复",
          iconName: "right6",
        },
        {
          name: "设为可见",
          iconName: "right7",
        },
        {
          name: "开启评论",
          iconName: "right8",
        },
        // {
        //   name:'设为隐藏',
        //   iconName:'right9'
        // },
        // {
        //   name:'开启评论',
        //   iconName:'right10'
        // }
      ],
      tabDict: {
        0: [],
        1: [2],
        2: [4, 12, 13, 14, 20, 21],
        3: [5],
        4: [100, 23],
        5: [3],
      },
      tabpaneList: [
        {
          label: "全部",
          value: "",
          isShow: true,
        },
        {
          label: "待审核",
          value: 1,
          isShow: false,
        },
        {
          label: "未回复",
          value: 2,
          isShow: false,
        },
        {
          label: "已受理",
          value: 3,
          isShow: false,
        },
        {
          label: "已回复",
          value: 4,
          isShow: false,
        },
        {
          label: "审核未通过",
          value: 5,
          isShow: false,
        },
      ],
      recycleShow: false,
    };
  },
  watch: {},
  mounted() {
    const ut = +(localStorage.getItem("rj_wzwz_deptType") || 999);
    this.recycleShow = ut === 0;
    console.log(
      "this.$route.querythis.$route.querythis.$route.querythis.$route.query",
      this.$route.query
    );
    if (this.$route.query.t !== undefined) {
      this.activeName = this.tabpaneList[+this.$route.query.t].label;
      this.$refs["listRef"].query.statusList =
        this.tabDict[this.$route.query.t];
      this.$refs["listRef"].getDataList();
    }
    // this.getAffairsInfoList()
  },
  methods: {
    getAffairsInfoList() {
      // affairsInfoList(this.pages).then((res) => {
      //   if (res.code === 10000) {
      //     this.tableData = res.data.rows
      //   }
      // })
    },
    handleClick(val, event) {
      // 切换 tabs
      this.$router.push("/politicalList");
      this.$refs["listRef"].query.statusList = this.tabDict[val.index];
      this.$refs["listRef"].getDataList();
      // this.tabpaneList = this.tabpaneList.map((item) => {
      //   if (item.label === val.label) {
      //     item.isShow = true
      //   } else {
      //     item.isShow = false
      //   }
      //   return item
      // })
      // this.$nextTick(() => {
      //   document.getElementById("tab").scrollIntoView({
      //     behavior: "smooth",
      //     block: "start"
      //   });
      // });
    },
  },
};
</script>

<style lang="scss" scoped>
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
  .right-btns-ul {
    position: absolute;
    right: 10px;
    top: 4px;
    margin: 0;
    padding: 0;
    z-index: 99;

    .right-btns-li {
      float: left;
      margin: 0 8px;

      height: 32px;
      line-height: 32px;
      .right-btns-button {
        height: 32px;
        background: #1e56a0;
        border-radius: 1px;
      }
      .btn_svg {
        width: 1rem;
        height: 1rem;
        position: relative;
        top: 1px;
        left: -2px;
      }
    }
  }
}
</style>
