<template>
  <div class="politicalAuditDetail-container m20">
    <el-tabs
      v-model="activeName"
      type="border-card"
      @tab-click="handleClick"
    >
      <template>
        <el-tab-pane
          v-for="(item, index) in tabpaneList"
          :key="index"
          :label="item.label"
          :name="item.key"
        >
          <component :is="item.component" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script>
import Base from './components/base.vue';
import Reply from './components/reply.vue';
import Evaluation from './components/evaluation.vue';
import Log from './components/log.vue';

export default {
  data() {
    return {
      activeName: 'base',
      tabpaneList: [
        {
          label: '基本信息',
          key: 'base',
          component: Base
        }, {
          label: '问政回复',
          key: 'reply',
          component: Reply
        }, {
          label: '评价结果',
          key: 'evaluation',
          component: Evaluation
        }, {
          label: '问政记录',
          key: 'log',
          component: Log
        }
      ],
    };
  },
  components: {
    Base,
    Reply,
    Evaluation,
    Log
  },
  methods: {
    handleClick() {

    }
  }
};
</script>

<style lang="scss" scoped>

.politicalAuditDetail-container ::v-deep {
  .el-tabs--border-card {
    background: #f9f9f9;
    border-top: 0 none;
    & > .el-tabs__content {
      padding: 20px 24px;
    }

    & > .el-tabs__header {
      border: 0 none;
      background: #ececec;
      .el-tabs__item {
        border: 0 none;
        height: 36px;
        margin: 0 4px 4px 0;
        border-radius: 2px;
        background: #f6f6f6 !important;
        &.is-active {
          position: relative;
          top: 4px;
        }
      }
    }

    .el-tabs__item.is-active {
      border: 0 none;
    }
  }

  .el-tabs__nav > .is-active {
    background: #f9f9f9 !important;
  }
}

</style>
