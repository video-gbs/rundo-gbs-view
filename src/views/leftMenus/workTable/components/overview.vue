<template>
  <div class="overview-container">
    <div
      v-for="(item, idx) in pageData"
      :key="idx"
      class="view-item"
      :class="'item-color' + idx"
      @click="checkItem(item.status)"
    >
      <div class="item-img">
        <svg-icon :icon-class="item.imgSrcName" class="svg" />
      </div>
      <div class="value">{{ item.value }}</div>
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Overview",
  props: {
    homeLists: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      pageData: [
        {
          title: "平台用户",
          value: this.homeLists.num,
          color: "red",
          imgSrcName: "ptyh",
        },
        {
          title: "单位部门",
          value: this.homeLists.deptNum,
          color: "blue",
          imgSrcName: "dwbm",
        },
      ],
    };
  },
  watch: {
    "$store.getters.plateId"(n, o) {
      this.getTopStatic();
    },
  },
  mounted() {
    if (this.$store.getters.plateId) {
      this.getTopStatic();
    }
  },
  methods: {
    /**
     * @description: 获取顶部公文统计数据
     * @param {*}
     * @return {*}
     */
    getTopStatic() {
      // {} 用于触发板块ID写入
      this.$api.document.getTopStatic({}).then((res) => {
        const data = res.data.data;
        if (data) {
          this.pageData = [
            {
              title: "即将到期",
              value: data.prepareToExpireCount || 0,
              color: "red",
              status: 7,
            },
            {
              title: "已超时未完成",
              value: data.timeoutCount || 0,
              color: "blue",
              status: 8,
            },
            {
              title: "已完成",
              value: data.finishCount || 0,
              color: "green",
              status: 6,
            },
            {
              title: "特急公文",
              value: data.keyCount || 0,
              color: "orange",
              status: 9,
            },
          ];
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.overview-container {
  padding: 0;
  margin: -5px -8px 10px;
  width: 1070px;
  height: 152px;
  background: url(../../../../assets/imgs/logo1.png) no-repeat;
  background-size: 100% 100%;
  position: relative;
  // border:1px solid red;

  .view-item {
    padding: 10px;
    background: #fff;
    margin-right: 16px;
    border-radius: 4px;
    cursor: pointer;
    z-index: 2;
    position: absolute;
    right: 20px;
    width: 310px;
    height: 105px;
    top: 50%;
    transform: translate(0%, -50%);

    .item-img {
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      float: left;

      img {
        width: 28px;
        height: 28px;
      }
    }

    .value {
      font-weight: bold;
      font-size: 28px;
      line-height: 36px;
      text-align: left;
      color: #ffab3c;
    }

    .title {
      line-height: 28px;
      font-size: 1rem;
      text-align: left;
      color: #333;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-weight: 400;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    }

    &:last-of-type {
      margin-right: 0;
    }

    &.item-color0 {
      border-color: #ec2f2f;
      right: 300px;
      background: url(../../../../assets/imgs/logo4.png) no-repeat;
      background-size: 100% 100%;

      .value {
        color: #1e56a0;
        font-size: 2.75rem;
        margin-top: 0.5rem;
        font-weight: bold;
        text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        font-family: DIN-Bold, DIN;
      }
    }

    &.item-color1 {
      background: url(../../../../assets/imgs/logo3.png) no-repeat;
      background-size: 100% 100%;
      border-color: #104ecb;

      .value {
        color: #008c96;
        font-size: 2.75rem;
        margin-top: 0.5rem;
        font-weight: bold;
        text-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        font-family: DIN-Bold, DIN;
      }
    }

    &:hover {
      font-weight: bold;
    }
  }
}
.svg {
  position: absolute;
  right: 58px;
  width: 54px;
  height: 54px;
}
</style>
