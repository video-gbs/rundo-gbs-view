<!--相关评论-->
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
              v-for="(activity, index) in activities"
              :key="index"
              :size="activity.size"
              :color="activity.color"
              :timestamp="activity.timestamp"
              placement="top"
            >
              <!-- <svg-icon :icon-class="activity.myIcon" class="myIcon_svg mt10" /> -->

              <!-- <div>
                <slot v-if="index % 2 === 0" name="timestamp">
                  <svg-icon icon-class="line1" class="line1_svg" />
                </slot>
                <slot v-else name="timestamp">
                  <svg-icon icon-class="line2" class="line2_svg" />
                </slot>
              </div> -->
              <el-card class="p20">
                <div class="f">
                  <div class="mr10 reply-avatar" />
                  <div class="f1">
                    <div class="nickName f ai0c jc-sb mb20">
                      <div>
                        {{
                          activity.name ||
                          "网友名称" + `  ${activity.deptName}  `
                        }}
                      </div>
                      <!-- <el-tag
                        size="mini"
                        :type="activity.mainFlag === 3 ? '' : 'danger'"
                        effect="dark"
                      >
                        {{
                          activity.mainFlag === 3 ? "官方回复" : "邀请单位回复"
                        }}
                      </el-tag> -->
                    </div>
                    <div>{{ activity.createTime }}</div>
                    <div v-html="activity.content" />
                  </div>
                </div>
                <h4 class="reviewResults-h4" />
                <!-- <p class="reviewResults-p">{{`${} 提交于 ${activity.createTime}`}}</p> -->
                <p v-if="activity.shyj" class="reviewResults-p">
                  【审核意见】照片拍摄不清晰；需增加描述内容。
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <div v-else class="fs12">暂无评论</div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from "@/components/LineFont";
import { getCommentList } from "@/api/method/commentManagement";
export default {
  name: "",
  components: {
    LineFont,
  },
  data() {
    return {
      actCss: {
        // content: '支持使用图标',
        timestamp: "2018-04-12 20:46",
        size: "large",
        type: "primary",
        myIcon: "wzjl1",
        color: "rgba(30, 86, 160, 1)",
      },
      activities: [
        // {
        //   content: '支持使用图标',
        //   timestamp: '2018-04-12 20:46',
        //   size: 'large',
        //   type: 'primary',
        //   myIcon: 'wzjl1',
        //   color: 'rgba(30, 86, 160, 1)'
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
        title: "相关评论",
        notShowSmallTitle: false,
      },
    };
  },
  watch: {},
  created() {
    this.$route.params.id && this.getReply(this.$route.params.id);
  },
  mounted() {},
  methods: {
    getList(v) {
      console.log("获取官方回复");
      getCommentList(v).then((res) => {
        if (res.code === 10000) {
          const r = Object.assign([], res.data);
          r.forEach((i) => {
            Object.assign(i, this.actCss);
            // i = { ...i, ...this.actCss }
            i["timestamp"] = i.createTime;
          });
          this.activities = r;
          console.log(" this.activities~~~~~~~~~~~~~~~", this.activities);
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
  height: 78%;
  top: 20px;
  border-left: 2px dashed #1e56a0;
}
::v-deep .el-timeline-item {
  position: relative;
}
::v-deep .el-timeline-item__node {
  box-shadow: 0px 0px 0px 3px rgba(30, 86, 160, 0.12);
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

::v-deep .el-timeline-item__timestamp {
  position: absolute;
  left: -130px;
  top: -1px;
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #333333;
}
::v-deep .el-timeline {
  padding-left: 115px;
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
.reply-avatar {
  width: 46px;
  height: 46px;
  background-image: url("~@/assets/imgs/user-center-avatar.png");
  background-size: cover;
}
::v-deep .el-timeline-item__timestamp {
  font-size: 12px;
}
</style>
