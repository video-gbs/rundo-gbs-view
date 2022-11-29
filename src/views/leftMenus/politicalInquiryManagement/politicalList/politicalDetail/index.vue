<template>
  <div class="politicalDetail_container">
    <div class="act-btn f ai-c">
      <el-button v-for="i in actBtn" :key="i.id" size="mini" @click="btnFn(i.fn)">
        {{ i.label }}
      </el-button>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <template>
        <el-tab-pane
          v-for="(item, index) in tabpaneList"
          :key="item.name"
          :label="item.label"
          :name="item.label"
        >
          <component :is="item.content" v-if="item.isShow" :one="one" />
        </el-tab-pane>
      </template>
    </el-tabs>
    <!--问政审核-->
    <PDialog ref="examineRef" @submit="examineFn">
      <template slot="title">问政审核</template>
      <template slot="main">
        <el-form label-width="80px" :model="examineForm">
          <el-form-item label="审核结果">
            <el-radio v-model="examineForm.result" :label="0">审核通过</el-radio>
            <el-radio v-model="examineForm.result" :label="2">审核不通过</el-radio>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="examineForm.content" />
          </el-form-item>
        </el-form>

      </template>
    </PDialog>
  </div>
</template>

<script>
import BasicInformation from '../components/DetailList'
import PoliticalReply from '../components/PoliticalReply'
import ReviewResults from '../components/ReviewResults'
import PoliticalRecord from '../components/PoliticalRecord'
import PDialog from '@/components/PDialog'
import {

  affairsInfoSearch
} from '@/api/method/politicalList'
import { examineAffairs } from '@/api/method/affairscheck'
export default {
  components: {
    BasicInformation,
    PoliticalReply,
    ReviewResults,
    PoliticalRecord,
    PDialog
  },
  data() {
    return {
      activeName: '基本信息',
      tabpaneList: [
        {
          label: '基本信息',
          content: BasicInformation,
          isShow: true
        },
        {
          label: '问政回复',
          content: PoliticalReply,
          isShow: false
        },
        {
          label: '评价结果',
          content: ReviewResults,
          isShow: false
        },
        {
          label: '问政记录',
          content: PoliticalRecord,
          isShow: false
        }
      ],
      actBtn: [
        { id: 1, label: '问政审核', fn: 'examineDialog' },
        { id: 2, label: '审核补充说明' },
        { id: 3, label: '受理部门' },
        { id: 4, label: '受理问政' },
        { id: 5, label: '回复问政' },
        { id: 6, label: '问政转移' },
        { id: 7, label: '邀请回复' },
        { id: 8, label: '审核回复' },
        { id: 9, label: '设为可见' },
        { id: 10, label: '开启评论' },
        { id: 11, label: '删除' },
        { id: 12, label: '返回' }

      ],
      one: {},
      examineForm: {
        result: 0,
        affairsId: '',
        content: ''
      }

    }
  },
  watch: {},
  created() {
    if (this.$route.params.id) {
      this.getOne(this.$route.params.id)
      this.examineForm.affairsId = this.$route.params.id
    }
  },
  mounted() {

  },
  methods: {
    getACC() {
      alert('acc')
    },
    handleClick(val, event) {
      this.tabpaneList = this.tabpaneList.map(item => {
        if (item.label === val.label) {
          item.isShow = true
        } else {
          item.isShow = false
        }
        return item
      })
      // this.$nextTick(() => {
      //   document.getElementById("tab").scrollIntoView({
      //     behavior: "smooth",
      //     block: "start"
      //   });
      // });
    },
    getOne(v) {
      affairsInfoSearch(v).then(res => {
        res.code === 10000 && (this.one = res.data)
      })
    },
    btnFn(fn) {
      this[fn]()
    },
    examineDialog() {
      this.$refs['examineRef'].visible = true
    },
    // 审核问政
    examineFn() {
      examineAffairs(this.examineForm).then(res => {

      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__item.is-active {
  border: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__content {
  padding: 20px 24px;
}
::v-deep .el-tabs--border-card {
  background: #f9f9f9;
  border-top: 0 none;
}
::v-deep .el-tabs--border-card > .el-tabs__header {
  border: 0 none;
  background: #ececec;
}
::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item {
  border: 0 none;
  height: 36px;
  margin: 0 4px 4px 0;
  border-radius: 2px;
  background: #f6f6f6 !important;
}

::v-deep .el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  position:relative;
  top:4px;
}
::v-deep .el-tabs__nav > .is-active {
  background: #f9f9f9 !important;
}
::v-deep .el-tabs__item {
}
.politicalDetail_container {
  background: #ececec;
}
.act-btn{
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 9999;
}
</style>
