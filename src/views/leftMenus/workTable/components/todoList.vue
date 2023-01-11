<template>
  <div class="todo-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="dbsx" class="dbsx_svg" />
        <span>待办事项</span>
      </div>
      <div v-if="nl.length" class="text item">
        <span class="under_line">问政待办</span>
        <ul class="todo-ul-scoll">
          <li v-for="(item, index) in nl" :key="index">
            <LineFont
              :line-title="item.name"
              :text-style="textStyle"
              :line-blue-style="index < 3 ? lineBlueStyle : lineBlueStyle1"
            />
            <div class="type" :data-index="index">{{ item.num }}</div>
            <div class="go-router" @click="goPage(item)">
              前往处理 <span class="rightArrow_svg">></span>
            </div>
          </li>
        </ul>
      </div>

      <div v-if="nl1.length" class="text item" style="margin-top: 40px">
        <span class="under_line">综合处理</span>
        <ul class="todo-ul-scoll">
          <li v-for="(item1, index) in nl1" :key="index">
            <LineFont
              :line-title="item1.name"
              :text-style="textStyle"
              :line-blue-style="lineBlueStyle"
            />
            <div class="type" :data-index="index">{{ item1.num }}</div>
            <div class="go-router" @click="goPage(item1)">
              前往处理 <span class="rightArrow_svg">></span>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from '@/components/LineFont'
export default {
  name: '',
  components: {
    LineFont
  },
  props: {
    homeLists: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      textStyle: {
        fontSize: '14px',
        fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
        fontWeight: 'bold',
        color: '#333333'
      },
      textStyle1: {
        fontSize: '16px',
        fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
        fontWeight: 'bold',
        color: '#1E56A0'
      },
      lineBlueStyle: {
        background: 'rgba(30, 86, 160, 1)',
        width: '2px',
        height: '19px'
      },
      lineBlueStyle1: {
        background: '#A0791E',
        width: '2px',
        height: '19px'
      },
      lineBlueStyleNone: {
        background: 'rgba(30, 86, 160, 1)',
        width: '0px',
        height: '19px'
      },

      lineTitle: {
        title: '问政待办',
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: '综合处理',
        notShowSmallTitle: false
      },
      noticeList: [
        {
          name: { title: '待审核问政', notShowSmallTitle: true },
          num: this.homeLists.auditNum || 0,
          author: [0],
          path: '/politicalList',
          params: 1
        },
        // {
        //   name: { title: "待受理问政", notShowSmallTitle: false },
        //   num: this.homeLists.acceptNum || 0,
        //   author: [0, 1, 2, 3, 4],
        //   path: "/politicalList",
        //   params: 2,
        // },
        {
          name: { title: '待回复问政', notShowSmallTitle: false },
          num: this.homeLists.replyNum || 0,
          author: [0, 1, 2, 3, 4],
          path: '/politicalList',
          params: 2
        }
        // {
        //   name: { title: '逾期未审核', notShowSmallTitle: false },
        //   num: this.homeLists.overdueAuditNum,
        //   show: false
        // },
        // {
        //   name: { title: '逾期未受理', notShowSmallTitle: false },
        //   num: this.homeLists.overdueAcceptNum,
        //   show: false
        // },
        // {
        //   name: { title: '逾期未回复', notShowSmallTitle: false },
        //   num: this.homeLists.overdueReplyNum,
        //   show: false
        // }
      ],
      nl: [],
      noticeList1: [
        {
          name: { title: '转移审核', notShowSmallTitle: false },
          num: this.homeLists.moveAuditNum || 0,
          author: [1],
          path: '/politicalAudit'
        },
        {
          name: { title: '邀请审核', notShowSmallTitle: false },
          num: this.homeLists.inviteAuditNum || 0,
          author: []
        }
      ],
      nl1: [],
      userDeptType: 123
    }
  },
  watch: {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      console.log(this.noticeList, this.noticeList1)
      // 判断哪些账号类型可以显示哪些处理模块
      this.userDeptType = +(localStorage.getItem('rj_wzwz_deptType') || 123)

      console.log(
        'this.userDeptType',
        this.userDeptType,
        typeof this.userDeptType
      )
      this.noticeList.forEach((i) => {
        i.author.includes(this.userDeptType) && this.nl.push(i)
      })
      this.noticeList1.forEach((i) => {
        i.author.includes(this.userDeptType) && this.nl1.push(i)
      })
    },
    goPage(v) {
      this.$router.push({ path: v.path, query: { t: v.params } })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-card__header {
  padding: 0 16px;
  height: 79px;
}
.todo-container {
  height: 100%;
  width: 100%;
  .box-card {
    height: 100%;
  }
  .clearfix {
    height: 80px;
    line-height: 80px;
    span {
      font-size: 20px;
      font-family: Microsoft YaHei-Bold, Microsoft YaHei;
      font-weight: bold;
      color: #333333;
    }
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
    background: #f8f8f8;
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
      cursor: pointer;
      .rightArrow_svg {
        width: 14px;
        height: 14px;
        color: #4b8afe;
      }
    }
  }
  .under_line {
    padding-bottom: 5px;
    margin-left: 10px;
    border-bottom: 1px solid #1e56a0;
    font-size: 16px;
    font-family: Microsoft YaHei-Bold, Microsoft YaHei;
    font-weight: bold;
    color: #1e56a0;
  }
}
</style>
