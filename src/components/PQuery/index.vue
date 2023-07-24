<!--
* @Author: duminquan
* @Date: 2022-03-23 11:20:30
 * @LastEditors: luojunyao
 * @LastEditTime: 2022-09-08 10:30:30
* @Description: 通用查询组件
-->
<template>
  <div class="p-query">
    <div v-if="isQueryBg" class="is-query-bg">
      <svg-icon icon-class="query-bg" />
    </div>
    <div ref="queryForm" class="condition">
      <slot />
      <div class="operation">
        <template v-for="(item, index) in btns">
          <el-button
            v-if="item == 'reset'"
            :key="'reset' + index"
            class="icon"
            size="medium"
            @click="reset"
          >
            <svg-icon icon-class="refresh" /> 重置
          </el-button>
          <el-button
            v-if="item == 'query'"
            :key="'query' + index"
            type="theme"
            class="icon"
            size="medium"
            @click="
              value.pageNum = 1
              query()
            "
          >
            <svg-icon icon-class="search" /> 查询
          </el-button>
          <el-button
            v-if="item == 'del'"
            :key="'del' + index"
            type="red"
            class="icon"
            plain
            size="medium"
            @click="del"
          >
            <svg-icon icon-class="delete" /> 删除
          </el-button>
          <slot v-if="item == 'custom'" name="custom" />
        </template>
        <slot name="operation" />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'PQuery',
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    },
    include: {
      type: [String, Array],
      default: ''
    },
    isPicker: {
      type: Boolean,
      default: false
    },
    autoQuery: {
      type: Boolean,
      default: true
    },
    isQueryBg: {
      type: Boolean,
      default: false
    },
    fixField: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      btns: ['reset', 'query'],
      fixFields: [
        'pageSize',
        'pageNum',
        'totalNum',
        'plateId',
        'pageNumber',
        'deviceType',
        'total'
      ] // 指定不会重置的字段
    }
  },
  watch: {
    '$store.getters.plateId'(n, o) {
      this.query()
    }
  },
  created() {
    if (this.include) {
      if (typeof this.include === 'string') {
        this.btns = this.include.split(',')
      } else {
        this.btns = this.include
      }
    }
    if (this.autoQuery) {
      this.query()
    }
  },
  mounted() {},
  methods: {
    /**
     * 查询，type为api/index.js里定义的接口路径
     */
    query() {
      this.$store.dispatch('app/setLoading', true)
      if (this.isPicker) {
        this.$emit('getPickerTime')
      }
      if (this.type && this.$api[this.type]) {
        const form = {}
        Object.keys(this.value).forEach((key) => {
          if (this.value[key]) {
            form[key] = this.value[key]
          }
        })
        this.$api[this.type]
          .list(form)
          .then((res) => {
            this.value.total = res.data.data.total
            this.$emit('query', res.data.data)
            this.$store.dispatch('app/setLoading', false)
          })
          .catch(() => {
            this.$store.dispatch('app/setLoading', false)
          })
      } else {
        this.$emit('query')
      }
    },
    /**
     * 重置表单
     */
    reset() {
      const form = this.value
      const fixFields = [...this.fixFields, ...this.fixField]
      Object.keys(this.value).forEach((key) => {
        if (fixFields.indexOf(key) === -1) {
          form[key] = null
        }
      })
      this.query()
      this.$emit('reset', form)
    },
    /**
     * 删除
     */
    del() {
      this.$emit('del')
    }
  }
}
</script>
<style lang="scss">
.p-query {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  // background-color: #fff;
  // border-radius: 5px;
  // box-shadow: 0px 3px 12px rgba(0, 0, 0, 0.16);
  border-bottom: 1px solid #e5e5e5;
  & .is-query-bg {
    height: 40px;
    width: 100%;
    .svg-icon {
      width: 100%;
      height: 100%;
    }
    // background: url('~@/assets/image/main-bg.png') no-repeat;
    // background-size: contain;
  }
  .operation {
    display: flex;
    flex: 1;
    align-items: center;
    .el-button + .upload-button {
      margin-left: 0.625rem;
      margin-right: 0.625rem;
    }
    .el-button {
      // .svg-icon {
      //   width: 1rem;
      //   height: 1rem;
      // }
      &:hover {
        .svg-icon {
          .cls-3 {
            fill: $theme;
          }
        }
      }
    }
  }
  .condition {
    width: 100%;
    padding: 1.5rem 0 0.875rem 1.25rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    background-color: #fff;
    & > * {
      // flex: 1;
      margin-right: 1.5rem;
      margin-bottom: 0.625rem;
      width: 320px;
      height: 40px;
      .el-input__inner {
        // border-radius: 0px;
        border-color: #cccccc;
      }
    }
    .p-select-date {
      display: flex;
      & .el-select {
        .el-input__inner {
          width: 130px;
          padding: 0 10px;
          border-right: none;
        }
      }
    }
    .p-item {
      display: flex;
      align-items: center;
      .item-title {
        margin-right: 10px;
        font-size: 0.875rem;
      }
      .item-content {
        flex: 1;
      }
    }
  }
}
</style>
