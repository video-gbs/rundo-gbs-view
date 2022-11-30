<template>
  <div class="politicalDetail_container">
    <div class="act-btn f ai-c">
      <el-button v-for="i in actBtn" v-if="i.show" :key="i.id" type="primary" style="margin:0px 1px" size="mini" @click="btnFn(i)">
        {{ i.label }}
      </el-button>
      <el-button v-for="i in actBtn2" v-if="i.show" :key="i.id" :type="i.id===11?'danger':''" style="margin:0px 1px" size="mini" @click="btnFn(i)">
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
          <el-form-item label="受理说明">
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
            <el-select v-model="inviteForm.deptId" collapse-tags multiple placeholder="请选择" @change="inviteSelect">
              <el-option
                v-for="i in deptList"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="已选部门">
            <el-tag
              v-for="i in inviteList"
              :key="i.name+'tag'"
              class="mr5"
              closable
              @close="inviteCloseTag(i)"
            >
              {{ i.name }}
            </el-tag>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="inviteForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
    <!--审核回复-->
    <PDialog ref="replyCheckRef" @submit="replyCheckFn">
      <template slot="title">审核回复</template>
      <template slot="main">
        <el-form label-width="80px" :model="replyCheckForm">
          <el-form-item label="审核结果">
            <el-radio v-model="replyCheckForm.result" :label="0">审核通过</el-radio>
            <el-radio v-model="replyCheckForm.result" :label="2">审核不通过</el-radio>
          </el-form-item>
          <el-form-item label="审核说明">
            <PEditorVue ref="replyCheckEditorRef" :value="replyCheckContent" @input="replyCheckChange" />

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
        { id: 1, label: '问政审核', dialog: 'examineRef', show: true },
        { id: 2, label: '审核补充说明', dialog: 'moreRef', show: true },
        { id: 3, label: '受理部门', dialog: 'deptRef', show: true },
        { id: 4, label: '受理问政', dialog: 'acceptRef', show: true },
        { id: 5, label: '回复问政', dialog: 'replyRef', show: true },
        { id: 6, label: '问政转移', dialog: 'transferRef', show: true },
        { id: 7, label: '邀请回复', dialog: 'inviteRef', show: true },
        { id: 8, label: '审核回复', dialog: 'replyCheckRef', show: true },
        { id: 9, label: '设为可见', dialog: 'isShowRef', show: true },
        { id: 10, label: '开启评论', dialog: 'openCommentRef', show: true }
      ],
      one: {},
      actBtn2: [
        { id: 11, label: '删除', show: true },
        { id: 12, label: '返回', show: true }
      ],
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
        'content': ''
        // 'createBy': '',
        // 'createTime': ''
      },
      replyContent: '',
      replyForm: {
        'affairsId': '',
        'deptId': ''
      },
      transferForm: {
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
      },
      inviteList: [],
      inviteForm: {
        'affairsId': '',
        'content': '',
        'deptId': []
      },
      replyCheckContent: '',
      replyCheckForm: {
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
    btnFn(i) {
      i.dialog && this.comDialog(i.dialog)
      i.id === 12 && this.$router.go(-1)
    },
    comDialog(v) {
      console.log('vvsafsafsaf', v)

      this.$refs[v] && (this.$refs[v].visible = true)
      v === 'replyRef' && (this.replyContent = '')
      v === 'replyCheckRef' && (this.replyCheckContent = '')
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
    replyCheckChange(v) {
      // 回复问政审核的编辑器内容同步
      this.replyCheckForm.content = v
    },
    replyFn() {
      // 回复问政
    },
    transferFn() {
      transfer(this.transferForm).then(res => {
      })
    },
    inviteSelect(v) {
      this.inviteList = this.deptList.filter(i => {
        return this.inviteForm.deptId.indexOf(i.id) !== -1
      })
    },
    inviteCloseTag(v) {
      console.log('vvvvss', v)
      this.inviteList = this.inviteList.filter(i => {
        return i.id !== v.id
      })
      this.inviteForm.deptId = this.inviteForm.deptId.filter(i => {
        return i !== v.id
      })
    },
    replyCheckFn() {
      // 审核回复
    },
    inviteFn() {
      // 邀请回复
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
  top: 6px;
  right: 5px;
  z-index: 1999;
}
</style>
