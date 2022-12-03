<template>
  <div class="base-container">
    <el-card class="page-box-card">
      <div slot="header" class="clearfix">
        <LineFont
          :line-title="box1"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div class="page-box-content p20">
        <PControlGroup v-if="controlData1" :data="controlData1" />
      </div>
    </el-card>

    <el-card class="page-box-card mt20">
      <div slot="header" class="clearfix">
        <LineFont
          :line-title="box2"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div class="page-box-content p20">
        <PControlGroup v-if="controlData2" :data="controlData2" />
      </div>
    </el-card>

    <el-card class="page-box-card mt20">
      <div slot="header" class="clearfix">
        <LineFont
          :line-title="box3"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div class="page-box-content p20">
        <PControlGroup v-if="controlData3" :data="controlData3" />
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from "@/components/LineFont";
import PControlGroup from "@/components/PControlGroup";

export default {
  components: {
    LineFont,
    PControlGroup,
  },
  data() {
    return {
      box1: {
        title: "补充说明",
        notShowSmallTitle: false,
      },
      box2: {
        title: "问政信息",
        notShowSmallTitle: false,
      },
      box3: {
        title: "发布账号",
        notShowSmallTitle: false,
      },
      controlData1: null,
      controlData2: null,
      controlData3: null,
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
    };
  },
  created() {
    this.initControl1();
    this.initControl2();
    this.initControl3();
  },
  methods: {
    initControl1() {
      this.controlData1 = {
        controls: [
          {
            label: "补充内容",
            type: "text",
            key: "text1",
            span: 24,
            value:
              "根据广西壮族自治区实施的《中华人民共和国老年人权益保障法》办法中的只要是独生子女都可以享受每年累计不超过15天带薪陪护假。但现在事实上单位（参公）并没有依法实施，不给本单位独生子女提供以上所述假期，导致家里老人住院无法陪护，请问梧州市是否能依法出一份通知，让各级单位依法执行该假期！谢谢。 ",
          },
          {
            label: "提交时间",
            type: "text",
            key: "text2",
            span: 24,
            value: " 2022-06-30 12:00:56",
          },
        ],
        layoutConfig: {
          hideButton: true,
          // showColon: false,
        },
      };
    },
    initControl2() {
      this.controlData2 = {
        controls: [
          {
            label: "留言对象",
            type: "text",
            key: "text1",
            value: "万秀区",
          },
          {
            label: "分类",
            type: "text",
            key: "text2",
            value: "咨询",
          },
          {
            label: "领域",
            type: "text",
            key: "text3",
            value: "人社",
          },
          {
            label: "标题",
            type: "text",
            key: "text4",
            span: 24,
            value: "梧州市是否按自治区实施的独生子女带薪陪护假？",
          },
          {
            label: "内容",
            type: "text",
            key: "text5",
            span: 24,
            value:
              "根据广西壮族自治区实施的《中华人民共和国老年人权益保障法》办法中的只要是独生子女都可以享受每年累计不超过15天带薪陪护假。但现在事实上单位（参公）并没有依法实施，不给本单位独生子女提供以上所述假期，导致家里老人住院无法陪护，请问梧州市是否能依法出一份通知，让各级单位依法执行该假期！谢谢。",
          },
          {
            label: "附件补充",
            type: "upload",
            key: "text5",
            span: 24,
            canAdd: false,
            canDown: false,
            canDel: false,
            value: [
              {
                name: "2500f00c825b47208232f588c2955423.png",
                url: "https://staticoss.runjian.com/upload/202212/2500f00c825b47208232f588c2955423.png",
              },
              {
                name: "340d7d1c352546858c00bad3c3207ac0.png",
                url: "https://staticoss.runjian.com/upload/202212/340d7d1c352546858c00bad3c3207ac0.png",
              },
            ],
          },
        ],
        layoutConfig: {
          hideButton: true,
          // showColon: false,
        },
      };
    },
    initControl3() {
      this.controlData3 = {
        controls: [
          {
            label: "提问人",
            type: "text",
            key: "text1",
            span: 12,
            value: "鲁迅",
          },
          {
            label: "提交时间",
            type: "text",
            key: "text2",
            span: 12,
            value: "2022-06-30 12:00:56",
          },
          {
            label: "真实姓名",
            type: "text",
            key: "text3",
            span: 12,
            value: "周树人",
          },
          {
            label: "联系方式",
            type: "text",
            key: "text4",
            span: 12,
            value: "13412351235",
          },
        ],
        layoutConfig: {
          hideButton: true,
          // showColon: false,
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../index.scss";
</style>
