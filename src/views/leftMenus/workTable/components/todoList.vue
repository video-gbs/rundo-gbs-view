<template>
  <div class="todo-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="dbsx" class="dbsx_svg" />
        <span>待办事项</span>
      </div>
      <div class="text item">
        <LineFont :lineTitle="lineTitle" />
        <ul class="todo-ul-scoll">
          <li v-for="(item, index) in noticeList" :key="index">
            <LineFont
              :lineTitle="item.name"
              :textStyle="textStyle"
              :lineBlueStyle="lineBlueStyle"
            />
            <div class="type" :data-index="index">{{ item.num }}</div>
            <div class="go-router">
              前往处理 <span class="rightArrow_svg">></span>
            </div>
          </li>
        </ul>
      </div>

      <div class="text item">
        <LineFont :lineTitle="lineTitle1" />
        <ul class="todo-ul-scoll">
          <li v-for="(item1, index) in noticeList1" :key="index">
            <LineFont
              :lineTitle="item1.name"
              :textStyle="textStyle"
              :lineBlueStyle="lineBlueStyle"
            />
            <div class="type" :data-index="index">{{ item1.num }}</div>
            <div class="go-router">
              前往处理 <span class="rightArrow_svg">></span>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from "@/components/LineFont";
export default {
  name: "",
  components: {
    LineFont
  },
  props: {
    homeLists: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      textStyle: {
        fontSize: "14px",
        fontFamily: "Microsoft YaHei-Bold, Microsoft YaHei",
        fontWeight: "bold",
        color: "#333333"
      },
      lineBlueStyle: {
        background: "rgba(30, 86, 160, 1)",
        width: "2px",
        height: "19px"
      },

      lineTitle: {
        title: "问政待办",
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: "综合处理",
        notShowSmallTitle: false
      },
      noticeList: [
        {
          name: { title: "待审核问政", notShowSmallTitle: false },
          num: this.homeLists.auditNum
        },
        {
          name: { title: "待受理问政", notShowSmallTitle: false },
          num: this.homeLists.acceptNum
        },
        {
          name: { title: "待回复问政", notShowSmallTitle: false },
          num: this.homeLists.replyNum
        },
        {
          name: { title: "逾期未审核", notShowSmallTitle: false },
          num: this.homeLists.overdueAuditNum
        },
        {
          name: { title: "逾期未受理", notShowSmallTitle: false },
          num: this.homeLists.overdueAcceptNum
        },
        {
          name: { title: "逾期未回复", notShowSmallTitle: false },
          num: this.homeLists.overdueReplyNum
        }
      ],
      noticeList1: [
        {
          name: { title: "转移审核", notShowSmallTitle: false },
          num: this.homeLists.moveAuditNum
        },
        {
          name: { title: "邀请审核", notShowSmallTitle: false },
          num: this.homeLists.inviteAuditNum
        }
      ]
    };
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.todo-container {
  height: 100%;
  .box-card {
    height: 100%;
  }
  .clearfix {
    height: 80px;
    line-height: 80px;
    .dbsx_svg {
      width: 1.5rem;
      height: 1.5rem;
      position: relative;
      top: 5px;
      left: -3px;
    }
  }
  .todo-ul-scoll {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin-left: -4rem;
  }
  .todo-ul-scoll > li {
    width: 240px;
    margin: 10px 2rem;
    height: 108px;
    background: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    position: relative;
    .type {
      margin-left: 20px;
      font-size: 40px;
      font-family: DIN-Medium, DIN;
      font-weight: 500;
      color: #333333;
      margin-top: -5px;
    }
    .go-router {
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #4b8afe;
      position: absolute;
      bottom: 20px;
      right: 20px;
      cursor:pointer;
      .rightArrow_svg{
        width:14px;
        height:14px;
        color:#4b8afe;
      }
    }
  }
}
</style>
