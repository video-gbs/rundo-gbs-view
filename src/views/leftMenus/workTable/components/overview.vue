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
        <!-- <img :src="imgSrc(item)" alt="" /> -->
      </div>
      <div class="value">{{ item.value }}</div>
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Overview",
  data() {
    return {
      pageData: [
        {
          title: "平台用户",
          value: 0,
          color: "red",
        },
        {
          title: "单位部门",
          value: 0,
          color: "blue",
        }
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
    /**
     * @description: 返回加载图片路径
     * @param {*} item
     * @return {*}
     */
    // imgSrc(item) {
    //   return require(`@/assets/workbench/overview_${item.color}.png`);
    // },
    /**
     * @description: 跳转我的工作台列表页
     * @param {*} data
     * @return {*}
     */
    // toPath(data) {
    //   const queryData = {
    //     docType: 0,
    //   };
    //   this.$router.push({
    //     path: "/workbench/mine",
    //     query: queryData,
    //   });
    // },
    // checkItem(status) {
    //   this.$router.push({
    //     path: "/workbench/mine",
    //     query: {
    //       status,
    //     },
    //   });
    // },
  },
};
</script>

<style lang="scss" scoped>
.overview-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top:20px;
  padding:20px;

  .view-item {
    flex: 1;
    // display: flex;
    padding: 10px;
    background: #fff;
    margin-right: 16px;
    border-radius: 4px;
    cursor: pointer;

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
      text-align: center;
      color: #ffab3c;
    }

    .title {
      line-height: 28px;
      font-size: 14px;
      text-align: center;
      color: #333;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    border-left: solid 8px #ffab3c;

    &:last-of-type {
      margin-right: 0;
    }

    &.item-color0 {
      border-color: #ec2f2f;

      .value {
        color: #ec2f2f;
      }
    }

    &.item-color1 {
      // border-color: #FF5B5F;
      border-color: #104ecb;

      .value {
        // color: #FF5B5F;
        color: #104ecb;
      }
    }

    &.item-color2 {
      // border-color: #61D7B4;
      border-color: #18c394;

      .value {
        // color: #61D7B4;
        color: #18c394;
      }
    }

    &.item-color3 {
      // border-color: #ADA1ED;
      border-color: #e78d06;

      .value {
        // color: #ADA1ED;
        color: #e78d06;
      }
    }

    &:hover {
      font-weight: bold;
    }
  }
}
</style>
