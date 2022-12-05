<template>
  <div class="reviewResults-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <LineFont
          :line-title="lineTitle"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div class="text item">
        <div class="reviewResults—timeline">
          <el-timeline v-if="activities.length">
            <el-timeline-item
              v-for="(i, index) in activities"
              :key="index"
              :hide-timestamp="true"
              :size="i.size"
              :timestamp="i.timestamp"
              placement="top"
            >
              <svg-icon :icon-class="i.myIcon" class="myIcon_svg" />

              <div>
                <slot v-if="index % 2 === 0" name="timestamp">
                  <svg-icon icon-class="line1" class="line1_svg" />
                </slot>
                <slot v-else name="timestamp">
                  <svg-icon icon-class="line2" class="line2_svg" />
                </slot>
              </div>
              <el-card>
                <p class="reviewResults-h4 fs20 fw600">
                  {{ i.title }}
                </p>
                <p class="reviewResults-p">
                  {{ `${i.updateTime}` }}
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <div v-else class="fs12">暂无记录</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from "@/components/LineFont";
import {
  getAffairsrecordList,
  getAffairsrecordPage,
} from "@/api/method/affairsrecord";
export default {
  name: "",
  components: {
    LineFont,
  },
  data() {
    return {
      actCss: {
        size: "large",
        type: "primary",
        myIcon: "wzjl1",
      },
      activities: [
        // {
        //   content: '支持使用图标',
        //   timestamp: '2018-04-12 20:46',
        //   size: 'large',
        //   type: 'primary',
        //   myIcon: 'wzjl1'
        // },
      ],
      labelPosition: "left",
      textStyle: {
        fontSize: "20px",
        fontFamily: "Microsoft YaHei-Bold, Microsoft YaHei",
        fontWeight: "bold",
        color: "#333333",
      },
      lineBlueStyle: {
        background: "rgba(30, 86, 160, 1)",
        borderRadius: "0px 4px 4px 0px",
      },
      form: {
        content: "",
        content1: "",
      },
      lineTitle: {
        title: "问政记录",
        notShowSmallTitle: false,
      },
      params: {
        affairsId: "",
      },
    };
  },
  watch: {},
  created() {
    console.log("进入问政记录页面");
    if (this.$route.params.id) {
      this.params.affairsId = this.$route.params.id;
      this.getAffairsrecordList();
    }
  },
  mounted() {},
  methods: {
    getAffairsrecordList() {
      getAffairsrecordList(this.params).then((res) => {
        if (res.code === 10000) {
          const r = res.data;
          r.forEach((i) => {
            Object.assign(i, this.actCss);
            i = { ...i, ...this.actCss };
            i["timestamp"] = i.createTime;
            // 可以根据其他字段设置不同的icon
            // fn...
          });
          this.activities = r;
        }
      });
    },
    getAffairsrecordPage() {
      getAffairsrecordPage(this.params).then((res) => {
        if (res.code === 10000) {
          console.log("res", res);
        }
      });
    },
  },
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
