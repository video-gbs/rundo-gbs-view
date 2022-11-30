<template>
  <div class="politicalDetail_container">
    <div class="act-btn f ai-c">
      <el-button v-for="i in actBtn" :key="i.id" size="mini" @click="comDialog(i.dialog)">
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

    <!--补充说明审核-->
    <PDialog ref="moreRef" @submit="moreFn">
      <template slot="title">补充说明审核</template>
      <template slot="main">
        <el-form label-width="80px" :model="moreForm">
          <el-form-item label="审核结果">
            <el-radio v-model="moreForm.result" :label="0">审核通过</el-radio>
            <el-radio v-model="moreForm.result" :label="2">审核不通过</el-radio>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="moreForm.content" />
          </el-form-item>
        </el-form>

      </template>
    </PDialog>

    <!--受理部门-->
    <PDialog ref="deptRef" @submit="deptFn">
      <template slot="title">受理部门</template>
      <template slot="main">
        <el-form label-width="80px" :model="deptForm">
          <el-form-item label="选择单位">
            <el-select v-model="deptForm.processingDeptId" placeholder="请选择">
              <el-option
                v-for="i in deptList"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="deptForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--受理问政-->
    <PDialog ref="acceptRef" @submit="acceptFn">
      <template slot="title">受理问政</template>
      <template slot="main">
        <el-form label-width="80px" :model="acceptForm">
          <el-form-item label="选择单位">
            <el-select v-model="acceptForm.deptId" placeholder="请选择">
              <el-option
                v-for="i in deptList"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="acceptForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--问政回复-->
    <PDialog ref="replyRef" @submit="replyFn">
      <template slot="title">问政回复</template>
      <template slot="main">
        <el-form label-width="80px" :model="replyForm">
          <el-form-item label="回复说明">
            <PEditorVue ref="replyEditorRef" :value="replyContent" @input="replyChange" />

          </el-form-item>
        </el-form>
      </template>
    </PDialog>
    <!--问政转移-->
    <PDialog ref="transferRef" @submit="transferFn">
      <template slot="title">问政转移</template>
      <template slot="main">
        <el-form label-width="80px" :model="transferForm">
          <el-form-item label="受理单位">
            <el-select v-model="transferForm.deptId" placeholder="请选择">
              <el-option
                v-for="i in deptList"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="transferForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
    <!--邀请回复-->
    <PDialog ref="inviteRef" @submit="inviteFn">
      <template slot="title">邀请回复</template>
      <template slot="main">
        <el-form label-width="80px" :model="transferForm">
          <el-form-item label="邀请单位">
            <el-select v-model="inviteForm.deptId" placeholder="请选择">
              <el-option
                v-for="i in deptList"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="inviteForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
  </div>
</template>

<script>
import PEditorVue from '@/components/PEditorVue'
import BasicInformation from '../components/DetailList'
import PoliticalReply from '../components/PoliticalReply'
import ReviewResults from '../components/ReviewResults'
import PoliticalRecord from '../components/PoliticalRecord'
import PDialog from '@/components/PDialog'
import { affairsInfoSearch } from '@/api/method/politicalList'
import { examineAffairs, acceptAffairs } from '@/api/method/affairscheck'
import { unitList } from '@/api/method/unitManagement'
import { transfer } from '@/api/method/transfer'
export default {
  components: {
    BasicInformation,
    PoliticalReply,
    ReviewResults,
    PoliticalRecord,
    PDialog,
    PEditorVue
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
        { id: 1, label: '问政审核', dialog: 'examineRef' },
        { id: 2, label: '审核补充说明', dialog: 'moreRef' },
        { id: 3, label: '受理部门', dialog: 'deptRef' },
        { id: 4, label: '受理问政', dialog: 'acceptRef' },
        { id: 5, label: '回复问政', dialog: 'replyRef' },
        { id: 6, label: '问政转移', dialog: 'transferRef' },
        { id: 7, label: '邀请回复', dialog: 'inviteRef' },
        { id: 8, label: '审核回复', dialog: 'replyCheckRef' },
        { id: 9, label: '设为可见', dialog: 'isShowRef' },
        { id: 10, label: '开启评论', dialog: 'openCommentRef' },
        { id: 11, label: '删除' },
        { id: 12, label: '返回' }

      ],
      one: {},
      examineForm: {
        result: 0,
        affairsId: '',
        content: ''
      },
      moreForm: {
        result: 0,
        affairsId: '',
        content: ''
      },
      deptList: [],
      deptForm: {
        'affairsId': '',
        'content': '',
        // 'createBy': '',
        // 'createTime': '',
        'processingDeptId': '',
        'processingDeptName': ''
        // 'id': '',
        // 'result': '',
        // 'status': '',
        // 'updateBy': '',
        // 'updateTime': '',
        // 'userId': ''
      },
      acceptForm: {
        'affairsId': '',
        'content': '',
        // 'createBy': '',
        // 'createTime': '',
        'deptId': ''
      },
      replyContent: '',
      replyForm: {
        'affairsId': '',
        'deptId': ''
      }, transferForm: {
        'affairsId': '',
        'content': '',
        // 'createBy': '',
        // 'createTime': '',
        'deptId': ''
        // 'id': '',
        // 'result': '',
        // 'status': '',
        // 'updateBy': '',
        // 'updateTime': '',
        // 'userId': ''
      }

    }
  },
  watch: {},
  created() {
    if (this.$route.params.id) {
      this.getOne(this.$route.params.id)
      // 设置问政id
      this.examineForm.affairsId = this.$route.params.id
      this.moreForm.affairsId = this.$route.params.id
      this.deptForm.affairsId = this.$route.params.id
      this.acceptForm.affairsId = this.$route.params.id
      this.transferForm.affairsId = this.$route.params.id
    }
    // 获取部门
    this.getDept()
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
    getDept() {
      unitList({
        'current': 1,
        'size': 299
      }).then(res => {
        if (res.code === 10000) {
          this.deptList = res.data.records
        }
      })
    },

    comDialog(v) {
      this.$refs[v].visible = true
    },

    examineFn() {
      // 审核问政
      examineAffairs(this.examineForm).then(res => {

      })
    },
    moreFn() {
      // 补充说明审核
    },
    deptFn() {
      // 受理部门
      this.deptForm.processingDeptName = this.deptList.filter(i => {
        i.id === this.deptForm.processingDeptId
      })
      acceptAffairs(this.deptForm).then(res => {
      })
    },
    acceptFn() {
      // 受理问政
      acceptAffairs(this.acceptForm).then(res => {
      })
    },
    replyChange(v) {
      // 回复问政的编辑器内容同步
      this.replyForm.content = v
    },
    replyFn() {
      // 回复问政
    },
    transferFn() {
      transfer(this.transferForm).then(res => {
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
