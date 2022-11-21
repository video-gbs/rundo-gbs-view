<template>
  <div class="router_container2">
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
.router_container2 {
  background: #ececec;
  margin: 20px;
}
</style>
