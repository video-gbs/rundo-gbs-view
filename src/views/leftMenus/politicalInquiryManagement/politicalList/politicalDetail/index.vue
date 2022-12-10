<template>
  <div class="politicalDetail_container">
    <div class="act-btn f ai-c">
      <el-button
        v-for="i in Object.keys(actBtn)"
        :key="actBtn[i].id"
        :type="actBtn[i].type || 'primary'"
        style="margin: 0px 1px"
        size="mini"
        @click="btnFn(i, actBtn[i])"
      >
        {{ actBtn[i].label }}
      </el-button>
    </div>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane
        v-for="item in tabpaneList"
        :key="item.name"
        :label="item.label"
        :name="item.label"
      >
        <component :is="item.content" :one="one" />
      </el-tab-pane>
    </el-tabs>
    <!--问政审核-->
    <PDialog ref="examineRef" @submit="examineFn" @cancel="examineFn('c')">
      <template slot="title">问政审核</template>
      <template slot="main">
        <el-form
          ref="examineFormRef"
          label-width="80px"
          :model="examineForm"
          :rules="auditResultRules"
        >
          <el-form-item label="审核结果">
            <el-radio v-model="examineForm.auditResult" :label="1"
              >审核通过</el-radio
            >
            <el-radio v-model="examineForm.auditResult" :label="2"
              >审核不通过</el-radio
            >
          </el-form-item>
          <el-form-item label="审核说明" prop="content">
            <el-input v-model="examineForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--补充说明审核-->
    <PDialog ref="moreRef" @submit="moreFn" @cancel="moreFn('c')">
      <template slot="title">补充说明审核</template>
      <template slot="main">
        <el-form
          ref="moreFormRef"
          :rules="auditResultRules"
          label-width="80px"
          :model="moreForm"
        >
          <el-form-item label="审核结果">
            <el-radio v-model="moreForm.auditResult" :label="1"
              >审核通过</el-radio
            >
            <el-radio v-model="moreForm.auditResult" :label="2"
              >审核不通过</el-radio
            >
          </el-form-item>
          <el-form-item label="补充内容">
            <span class="success-color fs12">
              {{ moreData ? moreData.content : "无" }}</span
            >
          </el-form-item>
          <el-form-item label="审核说明" prop="content">
            <el-input v-model="moreForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--受理部门-->
    <PDialog ref="deptRef" @submit="deptFn" @cancel="deptFn('c')">
      <template slot="title">受理部门</template>
      <template slot="main">
        <el-form
          ref="deptFormRef"
          label-width="80px"
          :model="deptForm"
          :rules="deptRules"
        >
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
    <PDialog ref="acceptRef" @submit="acceptFn" @cancel="acceptFn('c')">
      <template slot="title">受理问政</template>
      <template slot="main">
        <el-form label-width="80px" :model="acceptForm">
          <el-form-item label="受理说明">
            <el-input v-model="acceptForm.content" type="textarea" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--问政回复-->
    <PDialog ref="replyRef" @submit="replyFn" @cancel="replyFn('c')">
      <template slot="title">问政回复</template>
      <template slot="main">
        <el-form
          ref="replyFormRef"
          label-width="80px"
          :model="replyForm"
          :rules="contentRules"
        >
          <el-form-item label="回复说明" prop="content">
            <PEditorVue
              ref="replyEditorRef"
              :value="replyContent"
              @input="replyChange"
            />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--协助回复-->
    <PDialog
      ref="otherDeptReplyRef"
      @submit="otherDeptReplyFn"
      @cancel="otherDeptReplyFn('c')"
    >
      <!--样式和问政回复一样，接口不同-->
      <template slot="title">问政回复</template>
      <template slot="main">
        <el-form
          ref="otherDeptReplyFormRef"
          label-width="80px"
          :model="otherDeptReplyForm"
          :rules="otherDeptReplyRules"
        >
          <el-form-item label="回复内容" prop="content">
            <PEditorVue
              ref="replyEditorRef"
              :value="otherDeptReplyContent"
              @input="otherDeptReplyChange"
            />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--问政转移-->
    <PDialog ref="transferRef" @submit="transferFn" @cancel="transferFn('c')">
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
          <el-form-item label="转移说明">
            <el-input v-model="transferForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--审核回复-->
    <PDialog
      ref="replyCheckRef"
      @submit="replyCheckFn"
      @cancel="replyCheckFn('c')"
      @opened="getReplyListFn"
    >
      <template slot="title">审核回复</template>
      <template slot="main">
        <el-form
          ref="replyCheckFormRef"
          label-width="80px"
          :model="replyCheckForm"
          :rules="auditResultRules"
        >
          <el-form-item label="审核结果">
            <el-radio v-model="replyCheckForm.auditResult" :label="1"
              >审核通过</el-radio
            >
            <el-radio v-model="replyCheckForm.auditResult" :label="2"
              >审核不通过</el-radio
            >
          </el-form-item>
          <el-form-item label="审核说明" prop="content">
            <PEditorVue
              ref="replyCheckEditorRef"
              :value="replyCheckContent"
              @input="replyCheckChange"
            />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--申请邀请回复-->
    <PDialog
      ref="applyInviteRef"
      @submit="applyInviteFn"
      @cancel="applyInviteFn('c')"
    >
      <template slot="title">申请邀请回复</template>
      <template slot="main">
        <el-form
          label-width="80px"
          :model="applyInviteForm"
          :rules="applyInviteRules"
        >
          <el-form-item label="邀请单位">
            <el-select
              v-model="applyInviteForm.deptId"
              collapse-tags
              multiple
              placeholder="请选择"
              @clear="applyInviteSelectClear"
              @change="applyInviteSelect"
            >
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
              :key="i.name + 'tag'"
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
    <!--审核邀请回复-->
    <el-dialog ref="applyInviteCheckRef" title="审核邀请回复" width="30%">
      <PControlGroup
        :data="auditPopData.controlData"
        @onBtnClick="applyInviteCheckFn"
        @onBtnCancel="auditPopData.show = false"
      />
    </el-dialog>

    <!--申请问政转移-->
    <PDialog
      ref="applyTransferRef"
      @submit="applyTransferFn"
      @cancel="applyTransferFn('c')"
    >
      <template slot="title">申请问政转移</template>
      <template slot="main">
        <el-form label-width="80px" :model="applyTransferForm">
          <el-form-item label="部门">
            <el-select
              v-model="applyTransferForm.deptId"
              collapse-tags
              placeholder="请选择"
            >
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

    <!--审核问政转移的申请-->
    <PDialog
      ref="applyTransferCheckRef"
      @submit="applyTransferCheckFn"
      @cancel="applyTransferCheckFn('c')"
    >
      <template slot="title">转移审核</template>
      <template slot="main">
        <el-form
          label-position="left"
          label-width="80px"
          :model="applyTransferCheckForm"
        >
          <el-form-item label="审核结果">
            <el-radio-group
              v-model="applyTransferCheckForm.auditResult"
              @input="applyTransferCheckRadioChange"
            >
              <el-radio :label="1">通过</el-radio>
              <el-radio :label="2">驳回</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="受理单位">
            <el-select
              v-if="applyTransferCheckForm.auditResult === 1"
              v-model="applyTransferCheckForm.targetDeptId"
              :disabled="applyTransferCheckForm.auditResult === 2"
              placeholder="请选择受理单位"
            >
              <el-option
                v-for="i in deptList.filter((i) => {
                  return i.deptType > 1;
                })"
                :key="i.id"
                :label="i.name"
                :value="i.id"
              />
            </el-select>
            <template v-else>
              {{ oneByDept.affairsAudit.operateDeptName }}
            </template>
          </el-form-item>
          <el-form-item label="审核说明">
            <el-input v-model="applyTransferCheckForm.content" />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--可见性设置-->
    <PDialog ref="isShowRef" @submit="isShowFn">
      <template slot="title">可见性开关设置</template>
      <template slot="main">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="当前设置">
            <el-switch
              v-model="one.isShow"
              :active-value="0"
              :inactive-value="1"
              style="display: block"
              active-text="可见"
              inactive-text="不可见"
            />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>

    <!--评论开关s设置-->
    <PDialog ref="openCommentRef" @submit="openCommentFn">
      <template slot="title">评论开关设置</template>
      <template slot="main">
        <el-form label-position="left" label-width="80px">
          <el-form-item label="当前设置">
            <el-switch
              v-model="one.isReview"
              :active-value="0"
              :inactive-value="1"
              style="display: block"
              active-color="#13ce66"
              inactive-color="#eee"
              active-text="开启"
              inactive-text="关闭"
            />
          </el-form-item>
        </el-form>
      </template>
    </PDialog>
  </div>
</template>

<script>
import PEditorVue from "@/components/PEditorVue";
import PControlGroup from "@/components/PControlGroup";
import BasicInformation from "../components/DetailList";
import PoliticalReply from "../components/PoliticalReply";
import ReviewResults from "../components/ReviewResults";
import PoliticalRecord from "../components/PoliticalRecord";
import PDialog from "@/components/PDialog";
import {
  affairsInfoSearch,
  affairsInfoSearchApply,
} from "@/api/method/politicalList";
import {
  examineAffairs,
  secondExamineAffairs,
  acceptAffairs,
  replyExamineAffairs,
} from "@/api/method/affairscheck";
import { applyTransferAffair } from "@/api/method/transfer";
import { replyAffairs, affairAudit } from "@/api/method/affairscheck";
import { unitList } from "@/api/method/unitManagement";
import { transfer, transferCheckAo } from "@/api/method/transfer";
import { getReplyList } from "@/api/method/reply";
import {
  setAffairsShow,
  setAffairsReview,
  deleteAffairs,
} from "@/api/method/affairs";
import {
  addAffairsassist,
  otherDeptReply,
  assistDeptList,
  inviteReplyAudit,
} from "@/api/method/affairsassist";
import {
  getAffairsMoreByOne,
  affairsMoreCheck,
} from "@/api/method/affairsMore";
import { Local } from "@/utils/storage";

export default {
  components: {
    BasicInformation,
    PoliticalReply,
    ReviewResults,
    PoliticalRecord,
    PDialog,
    PEditorVue,
    PControlGroup,
  },
  data() {
    const _that = this;
    const checkContent = function (rule, value, callback) {
      if (+_that[_that.paramsObj].auditResult === 2) {
        if (value === "") {
          callback(new Error("请输入审核不通过的原因。"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    return {
      activeName: "基本信息",
      tabpaneList: (function () {
        let u = localStorage.getItem("rj_wzwz_deptType");
        u && (u = u * 1);
        if (u > 1) {
          return [
            {
              label: "基本信息",
              content: BasicInformation,
              isShow: true,
              author: "all",
            },
            {
              label: "问政回复",
              content: PoliticalReply,
              isShow: true,
              author: "all",
            },
            {
              label: "评价结果",
              content: ReviewResults,
              isShow: true,
              author: "all",
            },
          ];
        }

        return [
          {
            label: "基本信息",
            content: BasicInformation,
            isShow: true,
            author: "all",
          },
          {
            label: "问政回复",
            content: PoliticalReply,
            isShow: true,
            author: "all",
          },
          {
            label: "评价结果",
            content: ReviewResults,
            isShow: true,
            author: "all",
          },
          {
            label: "问政记录",
            content: PoliticalRecord,
            isShow: true,
            author: "admin",
          },
        ];
      })(),
      admin: [0, 1],
      spokeman: [2, 3, 4],
      all: [0, 1, 2, 3, 4],
      auditResultRules: {
        // 审核不通过时候 必须校验 审核说明字段不能为空
        content: [{ validator: checkContent, trigger: ["blur", "change"] }],
      },
      contentRules: {
        content: [
          {
            required: true,
            message: "请输入回复内容",
            trigger: ["blur", "change"],
          },
        ],
      },
      btnAll: {
        examine: {
          id: 1,
          label: "问政审核",
          formName: "examineFormRef",
          dialog: "examineRef",
          show: false,
          author: "admin",
        },
        more: {
          id: 2,
          label: "审核补充说明",
          formName: "moreFormRef",
          dialog: "moreRef",
          show: false,
          author: "admin",
        },
        dept: {
          id: 3,
          label: "受理部门",
          dialog: "deptRef",

          show: false,
          author: "admin",
        },
        accept: {
          id: 4,
          label: "受理问政",

          dialog: "acceptRef",
          show: false,
          author: "all",
        },
        reply: {
          id: 5,
          label: "回复问政",

          dialog: "replyRef",
          show: false,
          author: "all",
        },
        transfer: {
          id: 6,
          label: "问政转移",

          dialog: "transferRef",
          show: false,
          author: "admin",
        },
        invite: {
          id: 7,
          label: "邀请回复",

          dialog: "inviteRef",
          show: false,
          author: "admin",
        },
        replyCheck: {
          id: 8,
          label: "审核回复",
          formName: "replyCheckFormRef",
          dialog: "replyCheckRef",
          show: false,
          author: "admin",
        },
        isShow: {
          id: 9,
          label: "设为可见",
          dialog: "isShowRef",
          show: false,
          author: "admin",
        },
        openComment: {
          id: 10,
          label: "开启评论",
          dialog: "openCommentRef",
          show: false,
          author: "admin",
        },
        applyTransfer: {
          id: 11,
          label: "申请问政转移",
          formName: "applyTransferForm",
          dialog: "applyTransferRef",
          show: false,
          author: "spokeman",
        },
        applyTransferCheck: {
          id: 12,
          label: "审核问政转移",
          formName: "applyTransferCheckForm",
          dialog: "applyTransferCheckRef",
          show: false,
          author: "admin",
        },
        applyInvite: {
          id: 13,
          label: "申请邀请回复",
          formName: "applyInviteForm",

          dialog: "applyInviteRef",
          show: false,
          author: "spokeman",
        },
        applyInviteCheck: {
          id: 14,
          label: "审核邀请回复",
          formName: "applyInviteChecForm",

          dialog: "applyInviteCheckRef",
          show: false,
          author: "admin",
        },
        otherDeptReply: {
          id: 15,
          label: "回复问政",
          // 实际上是 其他单位的协助回复，只是按钮名字和  受理单位的 回复问政一样
          formName: "otherDeptReplyForm",
          dialog: "otherDeptReplyRef",
          show: false,
          author: "spokeman",
        },
        delete: {
          id: 99,
          label: "删除",
          show: false,
          author: "admin",
          type: "danger",
        },
        back: {
          id: 100,
          label: "返回",
          show: false,
          author: "all",
          type: "normal",
        },
      },
      actBtn: {},
      one: {},
      auditId: "",
      oneByDept: null,
      deptList: [],
      dialogName: "", // 当前弹出的dialog ref
      paramsObj: {}, // 当前弹出的dialog 中 form绑定的 对象名
      examineForm: {
        // 问政审核参数
        affairsId: "",
        auditResult: 1,
        content: "",
      },

      moreForm: {
        affairsId: "",
        auditResult: 1,
        content: "",
        id: "",
      },
      deptForm: {
        affairsId: "",
        content: "",
        targetDeptId: "",
        targetDeptName: "",
      },
      deptRules: {
        targetDeptId: [
          { required: true, message: "请选择一个单位", trigger: "change" },
        ],
      },
      acceptForm: {
        affairsId: "",
        content: "",
      },
      replyContent: "",
      replyForm: {
        affairsId: "",
        content: "",
      },
      transferForm: {
        affairsId: "",
        content: "",
        deptId: "",
      },

      inviteForm: {
        affairsId: "",
        content: "",
        deptId: [],
      },
      replyCheckContent: "",
      replyCheckForm: {
        auditResult: 1,
        affairsId: "",
        content: "",
      },
      applyTransferForm: {
        // 申请问政转移
        affairsId: "",
        content: "",
        deptId: "",
        deptName: "",
      },
      applyTransferCheckForm: {
        // 审核问政转移
        affairsId: "",
        auditResult: 1,
        content: "",
        targetDeptId: "",
        targetDeptName: "",
      },
      applyInviteRules: {
        deptList: [
          { required: true, message: "请选择至少一个单位", trigger: "change" },
        ],
      },
      applyInviteList: [],
      applyInviteForm: {
        // 邀请回复
        affairsId: "",
        content: "",
        deptId: [],
        deptList: [],
      },
      applyInviteCheckForm: {
        // 审核问政邀请
        affairsId: "",
      },
      auditPopData: {
        // 审核问政邀请的组件绑定参数
        show: false,
        controlData: null,
      },
      otherDeptReplyContent: "",
      otherDeptReplyForm: {
        // 协助回复
        affairsId: "",
        content: "",
      },
      otherDeptReplyRules: {
        content: [
          { required: true, message: "请输入回复内容", trigger: "change" },
        ],
      },
      assistDept: {},
      moreData: {},
      firstLoading: true,
      userType: "",
    };
  },
  watch: {
    one: {
      handler: function (n) {
        console.log("获取了新的状态", n.status);
        if (this.firstLoading) {
          this.firstLoading = false;
        } else {
          this.accountPermission();
        }
      },
    },
  },
  created() {
    this.init();
  },
  mounted() {
    setTimeout(() => {
      this.userType = Local.get("rj_wzwz_deptType");
      this.userType !== null && (this.userType = this.userType * 1);
      // console.log('actBtn', this.$_config.admin.indexOf(3))
    }, 0);
  },
  methods: {
    async init() {
      // 获取账号所属角色类型
      this.userType = Local.get("rj_wzwz_deptType");
      this.userType !== null && (this.userType = this.userType * 1);
      console.log("this.$route.params.id", this.$route.params.id);
      if (this.$route.params.id) {
        // 获取当前问政信息
        // affairsInfoSearchApply
        const pid = this.$route.params.id;
        const fn = ["audit"].includes(this.$route.params.type)
          ? await affairsInfoSearchApply(pid)
          : await affairsInfoSearch(pid);
        console.log("fnnnnnnnn", fn);
        fn.code === 10000 && (this.one = fn.data);
        // fn().then((res) => {
        //   fn.code === 10000 && (this.one = fn.data)
        // })
        // 获取当前问政的受邀单位

        // 设置问政id
        const arr = [
          "examineForm",
          "moreForm",
          "deptForm",
          "acceptForm",
          "replyForm",
          "transferForm",
          "inviteForm",
          "replyCheckForm",
          "applyTransferForm",
          "applyTransferCheckForm",
          "applyInviteForm",
          "otherDeptReplyForm",
        ];
        arr.forEach((i) => {
          this[i].affairsId = this.one.id;
        });
        // 账号权限判断
        this.accountPermission();
        // 流程按钮显示权限判断
        // this.processPermission()
        // 获取部门
        this.getDept();
      }
    },
    async accountPermission() {
      console.log(1, this.one);
      // 判断路径和参数是否正确

      if (["reply", "list", "audit"].indexOf(this.$route.params.type) === -1) {
        // 如果跳转前的页面不来至问政列表、问政转移、问政邀请，去掉所有按钮
        return;
      }
      // 账号权限判断,左侧tabs和右侧按钮
      // 如果是不是主单位问政数据，是为协助回复，只能显示 协助回复按钮

      // 如果是来至问政邀请审核
      // const r = (this.$route.params.type === 'reply') && !this.one.isMainDept
      // if (r) {
      //   this.$set(this.actBtn, 'otherDeptReply', this.btnAll.otherDeptReply)
      // } else {
      //   // 否则
      //   Object.keys(this.btnAll).forEach((i) => {
      //     this[this.btnAll[i].author].indexOf(this.userType) > -1 &&
      //       this.$set(this.actBtn, i, this.btnAll[i])
      //   })
      // }

      // 根据账号角色和 问政状态 判断操作按钮显示与否
      const ut = this.userType * 1; // ut 0超管 1 市长、书记发言人 2 市级单位发言人 3  县区发言人 4 其他部门发言人
      const { status, isMainDept } = this.one;

      console.log(ut, status);
      this.actBtn = {};
      const arr = [
        // 'examine',
        // 'more',
        // 'dept',
        // 'accept',
        // 'reply',
        // 'transfer',
        // 'invite',
        // 'replyCheck',
        // 'applyTransfer',
        // 'applyTransferCheck',
        // 'applyInvite',
        // 'otherDeptReply'
      ];

      // // 检查是否有受邀单位
      // const hasAssistDept = await assistDeptList({ affairsId: this.one.id }).then(res => {
      //   if (res.code === 10000 && res.data.affairsAudit) {
      //     return res.data.affairsAudit
      //   }
      //   return false
      // }).catch(() => {
      //   return false
      // })
      // 是否有补充说明
      await getAffairsMoreByOne(this.one.id)
        .then((res) => {
          if (res.code === 10000) {
            this.moreData = res.data;
          }
        })
        .catch(() => {});

      this.btnAll.isShow.label =
        this.one.isShow === 0 ? "关闭可见" : "开启可见";
      this.btnAll.openComment.label =
        this.one.isReview === 0 ? "关闭评论" : "开启评论";
      if (ut === 0) {
        // 超管 '1,2,3,5,13,14,21,100'均不可操作

        [2].includes(status) && arr.push("examine");
        arr.push("isShow"); // openComment
        arr.push("delete");

        if (
          ["audit"].indexOf(this.$route.params.type) !== -1 &&
          [12].includes(status)
        ) {
          arr.push("applyTransferCheck");
        }
      }
      if (ut === 1) {
        // 市长信箱，书记信箱发言人
        this.moreData && this.moreData.auditStatus === -1 && arr.push("more");
        [4, 20].includes(status) && arr.push("dept", "reply");
        [23].includes(status) && arr.push("replyCheck");
        // 可否审核问政转移
        if (
          ["audit"].indexOf(this.$route.params.type) !== -1 &&
          [12].includes(status)
        ) {
          arr.push("applyTransferCheck");
        }
      }
      if (ut > 1) {
        // 一般网络发言人
        // 待受理
        if (isMainDept) {
          // 待受理
          [4].includes(status) && arr.push("accept", "reply", "applyTransfer");
          // 已受理 待回复
          [5].includes(status) && arr.push("reply");
          // 市领导制定了部门
          [21].includes(status) && arr.push("accept", "reply", "applyTransfer");

          // 申请转移未通过、 申请转移已通过、 市领导流程已审核已分配单位
          [13, 14].includes(status) &&
            arr.push("accept", "reply", "applyTransfer");
        } else {
          // 如果受理单位不是本单位，又显示了这条数据，看一下状态，只有待受理和已受理以及转移的过程才可以 协助回复
          ![1, 2, 3, 20, 21, 23, 100].includes(status) &&
            arr.push("otherDeptReply");
        }

        // 获取受邀单位
        // await assistDeptList({ affairsId: this.one.id, auditId: this.one.auditId }).then((res) => {
        //   if (res.code === 10000 && res.data.affairsAudit) {
        //     // 如果有受邀单位 就判断受邀单位有没有当前账号的所在单位
        //     const names = res.data.affairsAudit.targetDeptName.split(',')
        //     let udn = localStorage.getItem('rj_wzwz_deptName') || 'none'
        //     udn = udn.replace('"', '').replace('"', '')
        //     if (names.includes(udn)) {
        //       // 如果当前账号是受邀单位
        //       arr.push('otherDeptReply')
        //     } else {
        //       [5, 13, 14, 21].includes(status) &&
        //         arr.push('reply', 'applyTransfer', 'applyInvite')
        //     }
        //   }
        // })
      }
      arr.push("back");
      Object.keys(this.btnAll).forEach((i) => {
        arr.includes(i) && this.$set(this.actBtn, i, this.btnAll[i]);
      });
      // arr.forEach((i) => {
      //   this.$set(this.actBtn, i, this.btnAll[i])
      // })
      // Object.keys(this.btnAll).forEach((i) => {
      //   this[this.btnAll[i].author].indexOf(this.userType) > -1 &&
      //     this.$set(this.actBtn, i, this.btnAll[i])
      // })

      console.log("this.actBtn123", this.actBtn);
    },
    // setShow(arr) {
    // 设置按钮可点击
    //   console.log('arrrrrr', arr)
    //   Object.keys(this.actBtn).forEach((i) => {
    //     this.actBtn[i].show = false
    //     arr.indexOf(i) > -1 && (this.actBtn[i].show = true)
    //   })
    // },
    // processPermission() {
    //   console.log(2)
    //   // 根据账号角色和 问政状态 判断操作按钮显示与否
    //   const ut = this.userType * 1 // ut 0超管 1 市长、书记发言人 2 市级单位发言人 3  县区发言人 4 其他部门发言人
    //   const { status, isMainDept } = this.one

    //   console.log(ut, status)
    //   let arr = [
    //     'examine',
    //     'more',
    //     'dept',
    //     'accept',
    //     'reply',
    //     'transfer',
    //     'invite',
    //     'replyCheck',
    //     'applyTransfer',
    //     'applyTransferCheck',
    //     'applyInvite',
    //     'otherDeptReply'
    //   ]
    //   if (ut === 0) {
    //     // 超管
    //     // 全部权限
    //     // 初次审核网友问政，可以审核
    //     '2'.indexOf(status) > -1 && (arr = arr.concat(['examine']))
    //   }
    //   if (ut === 1) {
    //     // 书记， 市长 发言人
    //     // 审核通过  可以审核转移、受理部门
    //     '20'.indexOf(status) > -1 && (arr = arr.concat(['dept']))
    //     '5'.indexOf(status) > -1 && (arr = arr.concat(['replyCheck', 'dept']))
    //     '23'.indexOf(status) > -1 && (arr = arr.concat(['replyCheck']))
    //     '12'.indexOf(status) > -1 && (arr = arr.concat(['applyTransfer']))
    //   }

    //   if (ut > 1) {
    //     // 一般 发言人
    //     // 审核通过未受理,市领导指派后  可以申请审核转移、受理
    //     '4,13,14,21'.indexOf(status) > -1 &&
    //       (arr = arr.concat([
    //         'applyTransfer',
    //         'accept',
    //         'reply',
    //         'applyInvite'
    //       ]))
    //     // // 已受理  发起邀请回复、回复问政
    //     '5'.indexOf(status) > -1 &&
    //       (arr = arr.concat(['applyInvite', 'reply']))
    //     // 转移申请已提交，待审核  什么也不能干
    //     '12'.indexOf(status) > -1 && (arr = arr.concat([]))
    //     // 转移申请不通过，仍是需要自己选择是否受理  什么也不能干
    //     '13'.indexOf(status) > -1 && (arr = arr.concat(['accept']))

    //     // 如果是不是主单位问政数据，是为协助回复，只能显示 协助回复按钮
    //     !this.one.isMainDept && (arr = ['otherDeptReply'])
    //   }

    //   // 100 已完成  不可做任何操作
    //   '100'.indexOf(status) > -1 && (arr = arr.concat([]))
    //   arr.push('back')
    //   this.setShow(arr)
    // },
    handleClick(val, event) {
      console.log("val", val);
      this.tabpaneList = this.tabpaneList.map((item) => {
        if (item.label === val.label) {
          item.isShow = true;
        } else {
          item.isShow = false;
        }
        return item;
      });
      console.log("comname", val.name);
      val.name === "问政回复" &&
        PoliticalReply.methods.getReply(this.$route.params.id);
      val.name === "评价结果" &&
        ReviewResults.methods.getAppraiseBy(this.$route.params.id);
      val.name === "问政记录" &&
        PoliticalRecord.methods.getList({ affairsId: this.$route.params.id });
      // this.$nextTick(() => {
      //   document.getElementById("tab").scrollIntoView({
      //     behavior: "smooth",
      //     block: "start"
      //   });
      // });
    },
    async getOne(v) {
      console.log("水电费地方 个");
      await affairsInfoSearch(v).then((res) => {
        res.code === 10000 && (this.one = res.data);
      });
    },
    getMore(v) {
      // 获取补充说明
      getAffairsMoreByOne(v).then((res) => {
        if (res.code === 10000) {
          this.moreData = res.data;
        }
      });
    },
    getDept() {
      unitList({
        current: 1,
        size: 9999,
      })
        .then((res) => {
          if (res.code === 10000) {
            this.deptList = res.data.records.filter((i) => {
              return i.deptType > 1;
            });
          }
        })
        .finally(() => {});
    },
    btnFn(i, obj) {
      this.paramsObj = i + "Form";
      console.log("this.paramsObj1121", this.paramsObj);
      this.formName = obj.formName || "";
      console.log(obj.dialog);
      obj.dialog && this.comDialog(obj);
      obj.id === 100 && this.$router.go(-1); // 返回
      obj.id === 99 && this.removeitem(); // 删除
    },
    removeitem() {
      // 删除问政
      this.$confirm(`是否删除标题为“${this.one.title}”的问政信息`, "删除提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteAffairs(this.one.id).then((res) => {
            if (res.code === 10000) {
              this.$message.success("删除成功！");
              this.$router.push("/politicalList");
              return;
            }
            this.$message.warning(res.message);
          });
        })
        .catch(() => {
          console.log("取消");
        });
    },
    comDialog(v) {
      this.dialogName = v.dialog;

      console.log("vvsafsafsaf", v);

      this.$refs[v.dialog] && (this.$refs[v.dialog].visible = true);
      v.dialog === "replyRef" && (this.replyContent = "");
      v.dialog === "replyCheckRef" && (this.replyCheckContent = "");
      // 如果是弹出审核问政转移的窗口，要先获取转移的对象
      v.dialog === "applyTransferCheckRef" &&
        affairAudit({ affairsId: this.one.id, auditId: this.one.auditId }).then(
          (res) => {
            if (res.code === 10000) {
              this.oneByDept = res.data;
              this.applyTransferCheckForm.targetDeptId =
                res.data.affairsAudit.targetDeptId;
              this.applyTransferCheckForm.targetDeptName =
                res.data.affairsAudit.targetDeptName;
            }
          }
        );
      v.dialog === "applyInviteCheckRef" &&
        (this.applyInviteCheckShowFn(), (this.auditPopData.show = true));
    },
    comDialogHide() {
      this.$message.success("操作成功。");
      this.$refs[this.dialogName].visible = false;
      this.getOne(this.one.id);
    },

    examineFn(v) {
      if (v && v === "c") {
        // 重置数据
        this.examineForm.content = "";
        this.examineForm.auditResult = 1;
        return;
      }
      // 审核问政
      this.$refs[this.formName].validate((v) => {
        if (v) {
          examineAffairs(this.examineForm)
            .then((res) => {
              res.code === 10000 && this.comDialogHide();
            })
            .catch((err) => {
              this.$message.warning("操作失败：" + JSON.stringify(err));
            });
        }
      });
    },
    moreFn(v) {
      // 补充说明审核
      if (v && v === "c") {
        // 重置数据
        this.moreForm.content = "";
        this.moreForm.auditResult = 1;
        return;
      }
      if (!this.moreData) {
        this.$message.warning("未查找到当前问政的补充说明");
        return;
      }
      this.moreForm.id = this.moreData.id;

      this.$refs[this.formName].validate((v) => {
        if (v) {
          affairsMoreCheck(this.moreForm)
            .then((res) => {
              res.code === 10000 &&
                (this.comDialogHide(), delete this.actBtn["more"]);
            })
            .catch((err) => {
              this.$message.warning("操作失败：" + JSON.stringify(err));
            });
        }
      });
    },
    deptFn(v) {
      if (v && v === "c") {
        // 重置数据
        this.deptForm.content = "";
        this.deptForm.targetDeptId = "";
        this.deptForm.targetDeptName = "";
        return;
      }
      // 受理部门
      this.$refs["deptFormRef"].validate((v) => {
        if (v) {
          this.deptForm.targetDeptName = this.deptList.filter((i) => {
            return i.id === this.deptForm.targetDeptId;
          })[0].name;
          secondExamineAffairs(this.deptForm)
            .then((res) => {
              res.code === 10000 && this.comDialogHide();
            })
            .catch((err) => {
              this.$message.warning("操作失败：" + JSON.stringify(err));
            });
        }
      });
    },
    acceptFn(v) {
      // 受理问政
      if (v && v === "c") {
        // 重置数据
        this.acceptForm.content = "";
        return;
      }
      acceptAffairs(this.acceptForm)
        .then((res) => {
          res.code === 10000 && this.comDialogHide();
        })
        .catch((err) => {
          this.$message.warning("操作失败：" + JSON.stringify(err));
        });
    },
    replyChange(v) {
      // 回复问政的编辑器内容同步
      this.replyForm.content = v;
    },

    replyFn(v) {
      // 回复问政
      if (v && v === "c") {
        // 重置数据
        this.replyForm.content = "";
        this.replyContent = "";
        return;
      }
      replyAffairs(this.replyForm)
        .then((res) => {
          res.code === 10000 && this.comDialogHide();
        })
        .catch((err) => {
          this.$message.warning("操作失败：" + JSON.stringify(err));
        });
    },

    getReplyListFn() {
      // 终审，获取所有单位的问政回复(含受邀单位)
      getReplyList(this.replyCheckForm.affairsId).then((res) => {
        if (res.code === 10000) {
          const rd = res.data.filter((i) => {
            return i.mainFlag < 3;
          });

          rd.forEach((i) => {
            this.replyCheckContent += i.content;
          });

          // this.replyCheckContent = rd[0] ? rd[0].content : ''
        }
      });
    },
    replyCheckFn(v) {
      // 审核回复
      if (v && v === "c") {
        // 重置数据
        this.replyForm.content = "";
        this.replyCheckForm.auditResult = 1;
        this.replyCheckContent = "";
        return;
      }
      // console.log('this.replyCheckForm', this.replyCheckForm)
      // return
      this.$refs[this.formName].validate((v) => {
        if (v) {
          replyExamineAffairs(this.replyCheckForm)
            .then((res) => {
              res.code === 10000 && this.comDialogHide();
            })
            .catch((err) => {
              this.$message.warning("操作失败：" + JSON.stringify(err));
            });
        }
      });
    },
    replyCheckChange(v) {
      // 回复问政审核的编辑器内容同步
      console.log("回复问政 编辑框内容", v);
      this.replyCheckForm.content = v;
    },

    transferFn(v) {
      // 问政转移
      if (v && v === "c") {
        // 重置数据
        this.replyForm.content = "";
        this.replyForm.deptId = "";
        return;
      }
      transfer(this.transferForm)
        .then((res) => {
          res.code === 10000 && this.comDialogHide();
        })
        .catch((err) => {
          this.$message.warning("操作失败：" + JSON.stringify(err));
        });
    },
    applyInviteSelect(v) {
      this.applyInviteList = this.deptList.filter((i) => {
        return this.applyInviteForm.deptId.indexOf(i.id) !== -1;
      });
    },
    applyInviteSelectClear() {
      console.log("sdfsdf", this.applyInviteList);
    },
    applyInviteCloseTag(v) {
      console.log("vvvvss", v);
      this.applyInviteList = this.applyInviteList.filter((i) => {
        return i.id !== v.id;
      });
      this.applyInviteForm.deptList = this.applyInviteForm.deptList.filter(
        (i) => {
          return i.deptId !== v.id;
        }
      );
    },
    applyInviteFn(v) {
      // 邀请回复
      if (v && v === "c") {
        // 重置数据
        this.replyForm.deptList = [];
        this.replyForm.deptId = [];
        return;
      }
      console.log("sfsdffapplyInviteFn", this.applyInviteList);
      this.applyInviteForm.deptList = [];
      this.applyInviteList.forEach((i) => {
        this.applyInviteForm.deptList.push({ deptId: i.id, deptName: i.name });
      });
      console.log(this.applyInviteForm);
      const p = Object.assign({}, this.applyInviteForm);
      delete p.deptId;

      addAffairsassist(p)
        .then((res) => {
          res.code === 10000 && this.comDialogHide();
        })
        .catch((err) => {
          this.$message.warning("操作失败：" + JSON.stringify(err));
        });
    },
    applyTransferFn(v) {
      // 申请问政转移
      if (v && v === "c") {
        // 重置数据
        this.applyTransferForm.deptName = "";
        this.applyTransferForm.deptId = "";
        this.applyTransferForm.content = "";
        return;
      }
      this.applyTransferForm.deptName = this.deptList.filter((i) => {
        return i.id === this.applyTransferForm.deptId;
      })[0].name;
      applyTransferAffair(this.applyTransferForm)
        .then((res) => {
          res.code === 10000 && this.comDialogHide();
        })
        .catch((err) => {
          this.$message.warning("操作失败：" + JSON.stringify(err));
        });
    },

    applyTransferCheckFn(v) {
      if (v && v === "c") {
        // 重置数据
        this.applyTransferCheckForm.auditResult = 1;
        this.applyTransferCheckForm.targetDeptId = "";
        this.applyTransferCheckForm.targetDeptName = "";
        this.applyTransferCheckForm.content = "";
        return;
      }
      // 审核申请转移
      this.applyTransferCheckForm.targetDeptName = this.deptList.filter((i) => {
        return i.id === this.applyTransferCheckForm.targetDeptId;
      })[0].name;
      console.log("this.applyTransferCheckForm", this.applyTransferCheckForm);
      this.applyTransferCheckForm.auditId = this.one.auditId;
      // 执行 问政转移审核方法
      // fn...
      transferCheckAo(this.applyTransferCheckForm)
        .then((res) => {
          res.code === 10000 && this.comDialogHide();
        })
        .catch((err) => {
          this.$message.warning("操作失败：" + JSON.stringify(err));
        });
    },
    applyTransferCheckRadioChange() {
      // 审核申请转移 单选框事件
      console.log("转移问政改变了", this.oneByDept.affairsAudit);
      if (this.applyTransferCheckForm.auditResult === 2) {
        // 重置转移对象为原对象
        // this.checkParams.targetDeptId = this.oneByDept
        this.applyTransferCheckForm.targetDeptId =
          this.oneByDept.affairsAudit.operateDeptId;
        this.applyTransferCheckForm.targetDeptName =
          this.oneByDept.affairsAudit.operateDeptName;
      } else {
        this.applyTransferCheckForm.targetDeptId =
          this.oneByDept.affairsAudit.targetDeptId;
        this.applyTransferCheckForm.targetDeptName =
          this.oneByDept.affairsAudit.targetDeptName;
      }
    },

    applyInviteCheckShowFn() {
      // 审核问政邀请的弹窗前置方法
      this.auditPopData.controlData = {
        layout: "vertical",
        controls: [
          {
            label: "审核结果",
            type: "radio",
            key: "auditResult",
            isRequired: true,
            value: "1",
            options: [
              { label: "同意", value: "1" },
              { label: "驳回", value: "2" },
            ],
          },
          {
            label: "协助单位",
            type: "transfer",
            key: "targetDepts",
            isRequired: true,
            btnText: "选择单位",
            value: [],
            rightDefaultChecked: [],
            titles: ["不可邀请单位", "可邀请单位"],
            options: [],
          },
          {
            label: "审核说明",
            type: "textarea",
            key: "content",
            autosize: { minRows: 3, maxRows: 5 },
            maxlength: 1000,
            value: "",
          },
        ],
      };

      // 获取受邀单位
      assistDeptList({ affairsId: this.one.id }).then((res) => {
        if (res.code === 10000) {
          const ids = res.data.affairsAudit.targetDeptId.split(",");
          const names = res.data.affairsAudit.targetDeptName.split(",");
          ids.forEach((i, idx) => {
            this.transferDeptList.push({ label: names[idx], key: i });
            this.auditPopData.controlData.controls[1].options.push({
              label: names[idx],
              key: i,
            });
            this.auditPopData.controlData.updateControls([
              {
                key: "targetDepts",
                value: this.transferDeptList.map((i) => {
                  return i.key;
                }),
              },
            ]);
            // this.auditPopData.controlData.controls[1].value = this.transferDeptList.map(i => { return i.key })
            this.auditPopData.controlData.controls[1].rightDefaultChecked =
              this.transferDeptList.map((i) => {
                return i.key;
              });
          });
        }
      });
    },
    async applyInviteCheckFn() {
      const isPass = await this.auditPopData.controlData.regCheck();
      if (!isPass) {
        return;
      }

      const data = this.auditPopData.controlData.getData();
      console.log(data);
      const arr = JSON.parse(JSON.stringify(data.targetDepts));
      data.targetDepts = [];
      this.transferDeptList.forEach((i) => {
        if (arr.indexOf(i.key) > -1) {
          data.targetDepts.push({ deptId: i.key, deptName: i.label });
        }
      });
      console.log(data);
      const p = Object.assign(this.applyInviteCheckForm, data);
      p.targetDeptIds = p.targetDepts
        .map((i) => {
          return i.deptId;
        })
        .join(",");
      p.targetDeptNames = p.targetDepts
        .map((i) => {
          return i.deptName;
        })
        .join(",");
      delete p.targetDepts;
      inviteReplyAudit(p)
        .then((res) => {
          res.code === 10000 && this.comDialogHide();
        })
        .catch((err) => {
          this.$message.warning("操作失败：" + JSON.stringify(err));
        });
    },
    otherDeptReplyFn() {
      // 协助回复

      this.$refs["otherDeptReplyFormRef"].validate((v) => {
        if (v) {
          otherDeptReply(this.otherDeptReplyForm)
            .then((res) => {
              res.code === 10000 && this.comDialogHide();
            })
            .catch((err) => {
              this.$message.warning("操作失败：" + JSON.stringify(err));
            });
        }
      });
    },
    otherDeptReplyChange(v) {
      this.otherDeptReplyForm.content = v;
      console.log(this.otherDeptReplyForm);
      // this.otherDeptReplyForm.content = this.otherDeptReplyContent
    },
    isShowFn() {
      // 是否可见
      // 设置可见性

      setAffairsShow(this.one.id, this.one.isShow)
        .then((res) => {
          if (res.code === 10000) {
            this.comDialogHide();
          } else {
            this.one.isShow = this.one.isShow === 0 ? 1 : 0;
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.one.isShow = this.one.isShow === 0 ? 1 : 0;
        });
    },
    openCommentFn() {
      // 是否开启评论
      setAffairsReview(this.one.id, this.one.isReview)
        .then((res) => {
          if (res.code === 10000) {
            this.comDialogHide();
          } else {
            this.one.isReview = this.one.isReview === 0 ? 1 : 0;
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.one.isReview = this.one.isReview === 0 ? 1 : 0;
        });
    },
  },
};
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
  position: relative;
  top: 4px;
}

::v-deep .el-tabs__nav > .is-active {
  background: #f9f9f9 !important;
}

::v-deep .el-tabs__item {
}

.politicalDetail_container {
  background: #ececec;
}

.act-btn {
  position: absolute;
  top: 6px;
  right: 5px;
  z-index: 1999;
}
</style>
