<!--
* @Author: duminquan
* @Date: 2022-03-23 11:16:02
 * @LastEditors: luojunyao
 * @LastEditTime: 2022-10-18 17:02:35
* @Description: 查询内容框
-->
<template>
  <div class="p-data-box" :class="{'is-back': isBack}">
    <div v-if="isBack" class="back">
      <el-button v-if="isSubmit" type="theme" size="small" @click="submit">保存</el-button>
      <el-button v-if="isBack" size="small" @click="back">返回</el-button>
    </div>
    <div v-if="title" class="operation">
      <div v-if="title" class="title">
        <svg-icon :icon-class="titleIcon" />
        <span>{{ title }}</span>
      </div>
      <div v-if="operation" class="operation-right">
        <slot name="operation" />
        <el-button v-if="isAdd" v-has-p="type ? `${type}:add` : ''" type="theme" class="icon" size="small" @click="add">
          <svg-icon icon-class="add" /> {{ addText }}
        </el-button>
        <el-button v-if="isDel" v-has-p="type ?`${type}:delete` : ''" type="theme" class="icon" size="small" @click="del">
          <svg-icon icon-class="delete" /> 删除
        </el-button>
        <el-button v-if="isExport" v-has-p="type ?`${type}:export` : ''" type="theme" class="icon" size="small" @click="exportFile">
          <svg-icon icon-class="export" /> 导出
        </el-button>
      </div>
      <!-- <template v-if="type === 'doc'">
        <el-button v-has-p="'doc:add'" type="blue" @click="add">
          <i class="el-icon-document" /> 下发公文
        </el-button>
      </template>
      <template v-else>
        <el-button v-has-p="type ? `${type}:add`: ''" type="blue" @click="add">
          <i class="el-icon-plus" /> 新增
        </el-button>
        <el-button v-has-p="type ? `${type}:delete`:''" type="orange" @click="del">
          <i class="el-icon-close" /> 删除
        </el-button>
      </template> -->
    </div>

    <div v-if="$slots.cover">
      <slot name="cover" />
    </div>
    <div v-loading="loading" class="container">
      <div v-if="$slots.default" class="main">
        <slot />
      </div>
      <div v-if="$slots.left" class="left">
        <slot name="left" class="left" />
      </div>
      <div v-if="$slots.right" class="right">
        <slot name="right" class="right" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'PDataBox',
  props: {
    title: {
      type: String,
      default: '数据列表'
    },
    titleIcon: {
      type: String,
      default: 'data'
    },
    type: {
      type: String,
      default: ''
    },
    operation: {
      type: Boolean,
      default: false
    },
    isSubmit: {
      type: Boolean,
      default: false
    },
    isBack: {
      type: Boolean,
      default: false
    },
    isHandleBack: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: true
    },
    isDel: {
      type: Boolean,
      default: true
    },
    isExport: {
      type: Boolean,
      default: false
    },
    addText: {
      type: String,
      default: '新增'
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapGetters(['loading'])
  },
  watch: {
    '$store.getters.loading': (n, o) => {
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    /**
     * 新增
     */
    add() {
      this.$emit('add')
    },
    /**
     * 删除
     */
    del() {
      this.$emit('del')
    },
    /**
     * 导出
     */
    exportFile() {
      this.$emit('export')
    },
    /**
     * 保存
     */
    submit() {
      this.$emit('submit')
    },
    /**
     * 返回
     */
    back() {
      if (this.isHandleBack) {
        this.$emit('handleBack')
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.p-data-box {
  padding: 1.5rem 1.25rem;
  &.is-back {
    padding-top: 0;
  }
  .back {
    width: 100%;
    height: 2.875rem /* 46/16 */;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .operation {
    width: 100%;
    height: 3.25rem /* 52/16 */;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1.25rem;
    background: $theme-2;
    font-size: 1rem;
    color: #333;
    // padding: 10px 20px;
    // span {
    //   font-size: 14px;
    //   font-weight: bold;
    //   margin-right: 15px;
    // }
    .title {
      font-weight: bold;
      .svg-icon {
        margin-right: 0.375rem;
      }
    }
    .operation-right {
      display: flex;
      align-items: center;
      // padding-left: 1rem;
    }
  }
  .container {
    display: flex;
    width: 100%;
    min-height: 200px;
    .main {
      width: 100%;
      // padding: 20px;
    }
    .left {
      width: calc(60% - 10px);
      padding: 20px;
      border-right: 10px solid #E5EFF4;
    }
    .right {
      width: 40%;
      padding: 20px;
    }
  }
}
</style>
