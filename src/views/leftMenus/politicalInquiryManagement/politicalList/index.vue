<template>
  <div class="detail_container">
    <el-tabs
      type="border-card"
      v-model="activeName"
      @tab-click="handleClick"
      v-if="!this.showDetails"
    >
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
    <ul class="right-btns-ul" v-if="this.showDetails">
      <li v-for="(btn, i) in btnLists" :key="i" class="right-btns-li">
        <el-button type="primary" class="right-btns-button" size="mini"
          ><svg-icon :icon-class="btn.iconName" class="btn_svg" />{{ btn.name
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
import Dsh from "./components/Dsh.vue";
import Shwtg from "./components/Shwtg.vue";
import Whf from "./components/Whf.vue";
import Yhf from "./components/Yhf.vue";
import Ysl from "./components/Ysl.vue";
import DetailView from "./politicalDetail/index.vue";

export default {
  components: {
    All,
    Dsh,
    Shwtg,
    Whf,
    Yhf,
    Ysl,
    DetailView
  },
  data() {
    return {
      showDetails: true,
      activeName: "全部",
      btnLists:[
        {
          name:'审核问政',
          iconName:'right1'
        },
        {
          name:'审核补充说明',
          iconName:'right2'
        },
        {
          name:'受理问政',
          iconName:'right3'
        },
        {
          name:'回复问政',
          iconName:'right4'
        },
        {
          name:'问政转移',
          iconName:'right5'
        },
        {
          name:'邀请回复',
          iconName:'right6'
        },
        {
          name:'设为可见',
          iconName:'right7'
        },
        {
          name:'开启评论',
          iconName:'right8'
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
      tabpaneList: [
        {
          label: "全部",
          content: All,
          isShow: true
        },
        {
          label: "待审核",
          content: Dsh,
          isShow: false
        },
        {
          label: "未回复",
          content: Whf,
          isShow: false
        },
        {
          label: "已受理",
          content: Ysl,
          isShow: false
        },
        {
          label: "已回复",
          content: Yhf,
          isShow: false
        },
        {
          label: "审核未通过",
          content: Shwtg,
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
    top:4px;
    margin: 0;
    padding: 0;
    z-index:99;

    .right-btns-li {
      float:left;
      margin:0 8px;

        height: 32px;
        line-height:32px;
      .right-btns-button{

        height: 32px;
        background: #1E56A0;
        border-radius:1px;
      }
      .btn_svg {
        width: 1rem;
        height: 1rem;
        position: relative;
        top: 1px;
        left:-2px;
      }
    }
  }
}
</style>
