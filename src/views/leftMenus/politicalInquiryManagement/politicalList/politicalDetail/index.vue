<template>
  <div class="politicalDetail_container">
    <div class="act-btn f ai-c">
      <el-button v-for="i in Object.keys(actBtn)" :key="actBtn[i].id" :disabled="!actBtn[i].show" :type="actBtn[i].type||'primary'" style="margin:0px 1px" size="mini" @click="btnFn(actBtn[i])">
        {{ actBtn[i].label }}
      </el-button>

    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">

      <el-tab-pane
        v-for="(item) in tabpaneList"
        :key="item.name"
        :label="item.label"
        :name="item.label"
      >
        <component :is="item.content" :one="one" />
      </el-tab-pane>

    </el-tabs>
    <!--问政审核 管理员-->
    <PDialog ref="examineRef" @submit="examineFn">
      <template slot="title">问政审核</template>
      <template slot="main">
        <el-form label-width="80px" :model="examineForm">
          <el-form-item label="审核结果">
            <el-radio v-model="examineForm.auditResult" :label="1">审核通过</el-radio>
            <el-radio v-model="examineForm.auditResult" :label="0">审核不通过</el-radio>
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
            <el-radio v-model="moreForm.result" :label="1">审核通过</el-radio>
            <el-radio v-model="moreForm.result" :label="0">审核不通过</el-radio>
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
        <el-form ref="deptFormRef" label-width="80px" :model="deptForm" :rules="deptRules">
          <el-form-item label="选择单位" prop="targetDeptId">
            <el-select v-model="deptForm.targetDeptId" placeholder="请选择">
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
    <PDialog ref="applyInviteRef" @submit="applyInviteFn">
      <template slot="title">邀请回复</template>
      <template slot="main">
        <el-form label-width="80px" :model="applyInviteForm" :rules="applyInviteRules">
          <el-form-item label="邀请单位">
            <el-select v-model="applyInviteForm.deptId" collapse-tags multiple placeholder="请选择" @clear="applyInviteSelectClear" @change="applyInviteSelect">
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
              v-for="i in applyInviteList"
              :key="i.name+'tag'"
              class="mr5"
              closable
              @close="applyInviteCloseTag(i)"
            >
              {{ i.name }}
            </el-tag>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="applyInviteForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
    <!--审核回复-->
    <PDialog ref="replyCheckRef" @submit="replyCheckFn" @opened="getReplyListFn">
      <template slot="title">审核回复</template>
      <template slot="main">
        <el-form label-width="80px" :model="replyCheckForm">
          <el-form-item label="审核结果">
            <el-radio v-model="replyCheckForm.auditResult" :label="1">审核通过</el-radio>
            <el-radio v-model="replyCheckForm.auditResult" :label="0">审核不通过</el-radio>
          </el-form-item>
          <el-form-item label="审核说明">
            <PEditorVue ref="replyCheckEditorRef" :value="replyCheckContent" @input="replyCheckChange" />

          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--申请转移-->
    <PDialog ref="applyTransferRef" @submit="applyTransferFn">
      <template slot="title">申请问政转移</template>
      <template slot="main">
        <el-form label-width="80px" :model="applyTransferForm">
          <el-form-item label="部门">
            <el-select v-model="applyTransferForm.deptId" collapse-tags placeholder="请选择">
              <el-option
                v-for="i in deptList"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="转移说明">
            <el-input v-model="applyTransferForm.content" />

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
import { examineAffairs, secondExamineAffairs, acceptAffairs, replyExamineAffairs } from '@/api/method/affairscheck'
import { applyTransferAffair } from '@/api/method/transfer'
import { replyAffairs } from '@/api/method/affairscheck'
import { unitList } from '@/api/method/unitManagement'
import { transfer } from '@/api/method/transfer'
import { getReplyList } from '@/api/method/reply'
import { addAffairsassist } from '@/api/method/affairsassist'
import { Local } from '@/utils/storage'

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
      tabpaneList: (function() {
        let u = localStorage.getItem('rj_wzwz_deptType')
        u && (u = u * 1)
        if (u > 1) {
          return [
            {
              label: '基本信息',
              content: BasicInformation,
              isShow: true,
              author: 'all'

            },
            {
              label: '问政回复',
              content: PoliticalReply,
              isShow: true,
              author: 'all'
            },
            {
              label: '评价结果',
              content: ReviewResults,
              isShow: true,
              author: 'all'
            }
          ]
        }

        return [
          {
            label: '基本信息',
            content: BasicInformation,
            isShow: true,
            author: 'all'

          },
          {
            label: '问政回复',
            content: PoliticalReply,
            isShow: true,
            author: 'all'
          },
          {
            label: '评价结果',
            content: ReviewResults,
            isShow: true,
            author: 'all'
          },
          {
            label: '问政记录',
            content: PoliticalRecord,
            isShow: true,
            author: 'admin'
          }
        ]
      })(),
      admin: [0, 1],
      spokeman: [2, 3, 4],
      all: [0, 1, 2, 3, 4],
      btnAll: {
        'examine': { id: 1, label: '问政审核', dialog: 'examineRef', show: false, author: 'admin' },
        'more': { id: 2, label: '审核补充说明', dialog: 'moreRef', show: false, author: 'admin' },
        'dept': { id: 3, label: '受理部门', dialog: 'deptRef', show: false, author: 'admin' },
        'accept': { id: 4, label: '受理问政', dialog: 'acceptRef', show: false, author: 'all' },
        'reply': { id: 5, label: '回复问政', dialog: 'replyRef', show: false, author: 'all' },
        'transfer': { id: 6, label: '问政转移', dialog: 'transferRef', show: false, author: 'admin' },
        'invite': { id: 7, label: '邀请回复', dialog: 'inviteRef', show: false, author: 'admin' },
        'replyCheck': { id: 8, label: '审核回复', dialog: 'replyCheckRef', show: false, author: 'admin' },
        'isShow': { id: 9, label: '设为可见', dialog: 'isShowRef', show: false, author: 'admin' },
        'openComment': { id: 10, label: '开启评论', dialog: 'openCommentRef', show: false, author: 'admin' },
        'applyTransfer': { id: 11, label: '申请问政转移', dialog: 'applyTransferRef', show: false, author: 'spokeman' },
        'applyInvite': { id: 12, label: '申请邀请回复', dialog: 'applyInviteRef', show: false, author: 'spokeman' },
        'delete': { id: 99, label: '删除', show: false, author: 'admin', type: 'danger' },
        'back': { id: 100, label: '返回', show: false, author: 'all', type: 'normal' }
      },
      actBtn: {},
      one: {},
      deptList: [],
      examineForm: {
        // 问政审核参数
        'affairsId': '',
        'auditResult': 1,
        'content': ''

      },

      moreForm: {
        result: 0,
        affairsId: '',
        content: ''
      },
      deptForm: {
        'affairsId': '',
        'content': '',
        'targetDeptId': '',
        'targetDeptName': ''
      },
      deptRules: {
        targetDeptId: [
          { required: true, message: '请选择一个单位', trigger: 'change' }
        ]
      },
      acceptForm: {
        'affairsId': '',
        'content': ''

      },
      replyContent: '',
      replyForm: {
        'affairsId': '',
        'content': ''
      },
      transferForm: {
        'affairsId': '',
        'content': '',

        'deptId': ''

      },

      inviteForm: {
        'affairsId': '',
        'content': '',
        'deptId': []
      },
      replyCheckContent: '',
      replyCheckForm: {
        auditResult: 1,
        affairsId: '',
        content: ''
      },
      applyTransferForm: {
        // 申请问政转移
        'affairsId': '',
        'content': '',
        'deptId': '',
        'deptName': ''
      },
      applyInviteRules: {
        deptList: [{ required: true, message: '请选择至少一个单位', trigger: 'change' }]
      },
      applyInviteList: [],
      applyInviteForm: {
        // 邀请回复
        'affairsId': '',
        'content': '',
        'deptId': [],
        'deptList': []
      },
      userType: ''

    }
  },
  watch: {},
  created() {
    this.init()
  },
  mounted() {
    setTimeout(() => {
      this.userType = Local.get('rj_wzwz_deptType')
      this.userType !== null && (this.userType = this.userType * 1)
      // console.log('actBtn', this.$_config.admin.indexOf(3))
    }, 0)
  },
  methods: {
    async init() {
      // 获取账号所属角色类型
      this.userType = Local.get('rj_wzwz_deptType')
      this.userType !== null && (this.userType = this.userType * 1)
      if (this.$route.params.id) {
        await this.getOne(this.$route.params.id)
        // 设置问政id
        const arr = [
          'examineForm',
          'moreForm',
          'deptForm',
          'acceptForm',
          'replyForm',
          'transferForm',
          'inviteForm',
          'replyCheckForm',
          'applyTransferForm',
          'applyInviteForm'
        ]
        arr.forEach(i => {
          this[i].affairsId = this.$route.params.id
        })
      }
      // 账号权限判断
      this.accountPermission()
      // 流程按钮显示权限判断
      this.processPermission()
      // 获取部门
      this.getDept()
    },
    accountPermission() {
      // 账号权限判断,左侧tabs和右侧按钮

      Object.keys(this.btnAll).forEach(i => {
        (this[this.btnAll[i].author].indexOf(this.userType) > -1) && this.$set(this.actBtn, i, this.btnAll[i])
      })

      const arr = JSON.parse(JSON.stringify(this.tabpaneList))
      // this.tabpaneList = []
      // arr.forEach(i => {
      //   this[i.author].indexOf(this.userType) > -1 && this.tabpaneList.push(i)
      // })

      console.log('this.actBtn', this.actBtn)
    },
    setShow(arr) {
      console.log('arrrrrr', arr)
      Object.keys(this.actBtn).forEach(i => {
        // console.log('this.btnAll[i]', this.btnAll[i])
        arr.indexOf(i) > -1 && (this.actBtn[i].show = true)
      })
    },
    processPermission() {
      // 根据账号角色和 问政状态 判断操作按钮显示与否
      const ut = this.userType * 1 // ut 0超管 1 市长、书记发言人 2 市级单位发言人 3  县区发言人 4 其他部门发言人
      const status = this.one.status
      console.log(ut, status)
      let arr = []
      if (ut === 0) {
        // 超管
        // 全部权限
        arr = ['examine', 'more', 'dept', 'accept', 'reply', 'transfer',
          'invite', 'replyCheck', 'isShow', 'openComment', 'delete']
      }
      if (ut === 1) {
        // 书记， 市长 发言人
        // 审核通过  可以审核转移、受理部门
        '20'.indexOf(status) > -1 && (arr = arr.concat(['dept']))
        '5'.indexOf(status) > -1 && (arr = arr.concat(['replyCheck', 'dept']))
        '23'.indexOf(status) > -1 && (arr = arr.concat(['replyCheck']))
      }

      if (ut > 1) {
        // 一般 发言人
        // 审核通过未受理,市领导指派后  可以申请审核转移、受理
        '4,13,14,21'.indexOf(status) > -1 && (arr = arr.concat(['applyTransfer', 'accept', 'reply', 'applyInvite']))
        // // 已受理  发起邀请回复、回复问政
        '5'.indexOf(status) > -1 && (arr = arr.concat(['applyInvite', 'applyTransfer', 'reply']))
        // 转移申请已提交，待审核  什么也不能干
        '12'.indexOf(status) > -1 && (arr = arr.concat([]))

        // 转移申请不通过，仍是需要自己选择是否受理  什么也不能干
        '13'.indexOf(status) > -1 && (arr = arr.concat(['accept']))
      }
      '100'.indexOf(status) > -1 && (arr = arr.concat([]))
      arr.push('back')
      this.setShow(arr)
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
    async  getOne(v) {
      console.log('水电费地方 个')
      await affairsInfoSearch(v).then(res => {
        res.code === 10000 && (this.one = res.data)
      })
    },
    getDept() {
      unitList({
        'current': 1,
        'size': 9999
      }).then(res => {
        if (res.code === 10000) {
          this.deptList = res.data.records
        }
      }).finally(() => {

      })
    },
    btnFn(i) {
      console.log(i.dialog)
      i.dialog && this.comDialog(i.dialog)
      i.id === 100 && this.$router.go(-1)// 返回
      i.id === 99 && this.$router.go(-1)// 删除
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
      this.$refs['deptFormRef'].validate(v => {
        if (v) {
          this.deptForm.targetDeptName = this.deptList.filter(i => {
            return i.id === this.deptForm.targetDeptId
          })[0].name
          secondExamineAffairs(this.deptForm).then(res => {
          })
        }
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
      replyAffairs(this.replyForm)
    },

    getReplyListFn() {
      getReplyList(this.replyCheckForm.affairsId).then(res => {
        if (res.code === 10000) {
          const rd = res.data.filter(i => { return i.mainFlag === 2 })
          this.replyCheckContent = rd[0] ? rd[0].content : ''
        }
      })
    },
    replyCheckFn() {
      // 审核回复
      // console.log('this.replyCheckForm', this.replyCheckForm)
      // return
      replyExamineAffairs(this.replyCheckForm)
    },
    replyCheckChange(v) {
      // 回复问政审核的编辑器内容同步
      this.replyCheckForm.content = v
    },
    applyInviteSelect(v) {
      this.applyInviteList = this.deptList.filter(i => {
        return this.applyInviteForm.deptId.indexOf(i.id) !== -1
      })
    },
    applyInviteSelectClear() {
      console.log('sdfsdf', this.applyInviteList)
    },
    applyInviteCloseTag(v) {
      console.log('vvvvss', v)
      this.applyInviteList = this.applyInviteList.filter(i => {
        return i.id !== v.id
      })
      this.applyInviteForm.deptList = this.applyInviteForm.deptList.filter(i => {
        return i.deptId !== v.id
      })
    },
    applyInviteFn() {
      // 邀请回复
      console.log('sfsdffapplyInviteFn', this.applyInviteList)
      this.applyInviteForm.deptList = []
      this.applyInviteList.forEach(i => { this.applyInviteForm.deptList.push({ deptId: i.id, deptName: i.name }) })
      console.log(this.applyInviteForm)
      const p = Object.assign({}, this.applyInviteForm)
      delete p.deptId

      addAffairsassist(p)
    },
    applyTransferFn() {
      // 申请问政转移
      this.applyTransferForm.deptName = this.deptList.filter(i => {
        return i.id === this.applyTransferForm.deptId
      })[0].name
      applyTransferAffair(this.applyTransferForm)
    },
    transferFn() {
      // 问政转移
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
  top: 6px;
  right: 5px;
  z-index: 1999;
}
</style>
