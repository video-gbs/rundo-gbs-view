<template>
  <div class="p-tabs">
    <div class="p-tabs__header">
      <div class="p-tabs__nav-scroll">
        <div class="p-tabs__nav">
          <template v-for="(item, index) in defaultTabs">
            <div
              :key="index"
              class="p-tabs__item"
              :class="{ 'is-active': activeIndex === index }"
              @click="onClick(index)"
            >
              {{ item.label }}
            </div>
          </template>
        </div>
      </div>
      <div class="p-tabs__operation">
        <el-button v-if="isBack" class="p-tabs__item" size="small" @click="back"
          >返回</el-button
        >
      </div>
    </div>
    <div class="p-tabs__content">
      <slot name="content" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'PTabs',
  props: {
    value: {
      type: Number,
      default: 0
    },
    tabs: {
      type: Array,
      default() {
        return []
      }
    },
    isBack: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      defaultTabs: [
        { label: '县级数据', value: '' },
        { label: '镇级数据', value: '' },
        { label: '村级数据', value: '' }
      ],
      activeIndex: 0
    }
  },
  mounted() {
    this.activeIndex = this.value
    this.defaultTabs = this.tabs
  },
  methods: {
    onClick(index) {
      this.activeIndex = index
      this.$emit('input', index)
    },
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>
.p-tabs {
  width: 100%;
  border-bottom: 1px solid #e5e5e5;
  // display: flex;
  // align-items: center;
  .p-tabs__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .p-tabs__nav-scroll {
      flex-grow: 1;
      padding: 20px 20px 0;
      .p-tabs__nav {
        width: max-content;
        border: 1px solid #cccccc;
        border-bottom: none;
        box-sizing: border-box;
        .p-tabs__item {
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          // border-right: 1px solid #CCCCCC;
          // border-top: 1px solid #CCCCCC;
          // border: 1px solid #CCCCCC;
          padding: 8px 16px;
          box-sizing: border-box;
          display: inline-block;
          border-bottom: 1px solid rgba(0, 0, 0, 0);
          border-left: 1px solid #cccccc;
          // transition: color .3s cubic-bezier(0.645, 0.045, 0.355, 1),padding .3s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
          cursor: pointer;
          &:first-child {
            border-left: none;
          }
          &:hover {
            color: $theme;
          }
          &.is-active {
            background: $theme;
            color: #fff;
            border-color: $theme;
          }
        }
      }
    }
    .p-tabs__operation {
      .p-tabs__item {
        margin-right: 20px;
      }
    }
  }
  .p-tabs__content {
    overflow: hidden;
    position: relative;
  }
}
</style>
