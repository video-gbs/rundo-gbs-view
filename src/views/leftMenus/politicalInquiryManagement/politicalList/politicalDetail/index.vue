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
import DetailList from "../components/DetailList";

export default {
  components: {
    DetailList
  },
  data() {
    return {
      activeName: "基本信息",
      tabpaneList: [
        {
          label: "基本信息",
          content: DetailList,
          isShow: true
        },
        {
          label: "问政回复",
          content: '',
          isShow: false
        },
        {
          label: "评价结果",
          content: '',
          isShow: false
        },
        {
          label: "问政记录",
          content: '',
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
.detail_container{
  background: #ECECEC;
  margin:20px;
}
</style>
