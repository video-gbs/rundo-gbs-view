<template>
  <div class="reviewResults-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <LineFont :lineTitle="lineTitle" :testStyle="testStyle" />
      </div>
      <div class="text item">
        <div class="reviewResults—timeline">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :hide-timestamp="true"
              :size="activity.size"
              :timestamp="activity.timestamp"
              placement="top"
            >
              <svg-icon :icon-class="activity.myIcon" class="myIcon_svg" />

              <div>
                <slot name="timestamp" v-if="index % 2 === 0">
                  <svg-icon icon-class="line1" class="line1_svg" />
                </slot>
                <slot name="timestamp" v-else>
                  <svg-icon icon-class="line2" class="line2_svg" />
                </slot>
              </div>
              <el-card>
                <h4 class="reviewResults-h4">
                  {{ activity.content }}
                </h4>
                <p class="reviewResults-p">王小虎 提交于 2018/4/12 20:46</p>
                <p class="reviewResults-p" v-if="activity.shyj">
                  【审核意见】照片拍摄不清晰；需增加描述内容。
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from "@/components/LineFont";
import {
  getAffairsrecordList,
  getAffairsrecordPage
} from "@/api/method/affairsrecord";
export default {
  name: "",
  components: {
    LineFont
  },
  data() {
    return {
      activities: [
        {
          content: "支持使用图标",
          timestamp: "2018-04-12 20:46",
          size: "large",
          type: "primary",
          myIcon: "wzjl1"
        },
        {
          content: "支持自定义颜色",
          timestamp: "2018-04-03 20:46",
          color: "#0bbd87",
          myIcon: "wzjl2",
          shyj: true
        },
        {
          content: "支持自定义尺寸",
          timestamp: "2018-04-03 20:46",
          size: "large",
          myIcon: "wzjl3"
        },
        {
          content: "默认样式的节点",
          timestamp: "2018-04-03 20:46",
          myIcon: "wzjl4",
          shyj: true
        },
        {
          content: "默认样式的节点",
          timestamp: "2018-04-03 20:46",
          myIcon: "wzjl5"
        },
        {
          content: "默认样式的节点",
          timestamp: "2018-04-03 20:46",
          myIcon: "wzjl6"
        }
      ],
      labelPosition: "left",
      testStyle: {
        fontSize: "20px",
        fontFamily: "Microsoft YaHei-Bold, Microsoft YaHei",
        fontWeight: "bold",
        color: "#333333"
      },
      form: {
        content: "",
        content1: ""
      },
      lineTitle: {
        title: "问政记录",
        notShowSmallTitle: false
      }
    };
  },
  watch: {},
  mounted() {},
  methods: {
    getAffairsrecordList() {
      getAffairsrecordList(this.params).then(res => {
        if (res.code === 10000) {
          console.log("res", res);
        }
      });
    },
    getAffairsrecordPage() {
      getAffairsrecordPage(this.params).then(res => {
        if (res.code === 10000) {
          console.log("res", res);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 0;
}
::v-deep .el-card__header {
  padding: 0;
}
::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #8b8b8b;
}
::v-deep .el-timeline-item__tail {
  display: none;
}
::v-deep .el-timeline-item__node {
  display: none;
}
::v-deep .el-timeline-item {
  position: relative;
}

::v-deep .el-card__body {
  padding: 0 1rem;
}
::v-deep .el-timeline-item {
  &:last-child {
    .line2_svg {
      display: none;
    }
  }
}
::v-deep .el-timeline-item__content {
  box-shadow: 0px 3px 12px 1px rgba(22, 49, 114, 0.2);
  &:after {
    position: absolute;
    top: 20px;
    left: 21px;
    content: "";
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 8px solid #fff;
  }
}

.reviewResults-container {
  height: 100%;
  .box-card {
    height: 100%;
  }
  .text {
    // margin-left:-2rem;
  }
  .span-text {
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }
  .reviewResults—timeline {
    margin: 16px;
    .myIcon_svg {
      width: 2rem;
      height: 2rem;
      position: absolute;
      top: 10px;
      left: -2rem;
    }
    .line1_svg {
      width: 15px;
      height: 60px;
      position: absolute;
      top: 46px;
      left: -24px;
    }
    .line2_svg {
      width: 15px;
      height: 80px;
      position: absolute;
      top: 50px;
      left: -24px;
    }
    .reviewResults-h4 {
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .reviewResults-p {
    }
  }
}
</style>
