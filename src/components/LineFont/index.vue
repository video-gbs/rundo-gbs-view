<template>
  <div class="line-title-box" :style="{height:height +'px',lineHeight:lineHeight + 'px'}">
    <div class="title-left">
      <span class="line-blue" />
      <span class="line-text">{{ lineTitle.title }}</span>
    </div>
    <div class="title-right">
      <span v-if="!lineTitle.notShowSmallTitle" class="font-gray">{{ lineTitle.smallTitle ? lineTitle.smallTitle : '' }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LineTitle',
  props: {
    lineTitle: {
      type: Object,
      default: function() {
        return {}
      }
    },
    height: {
      type: Number,
      default: 57
    },
    lineHeight: {
      type: Number,
      default: 56
    }

  },
  methods: {
  },
  created() {
    // document.title = this.lineTitle.title
  }
}
</script>
<style lang="scss" scoped>
.line-title-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 57px;
  line-height: 56px;
  // border-bottom: 1px solid #dfdfdf;
  .title-left {
    display: flex;
    align-items: center;
    .line-blue {
      display: inline-block;
      width: 4px;
      height: 16px;
      margin-right: 12px;
      background: #0376f7;
    }
    .title-text {
      font-size: 18px;
      font-weight: 500;
      color: #333333;
    }
  }
  .title-right {
    .font-gray {
      margin-left: 20px;
      font-size: 14px;
      color: #666666;
      cursor: pointer;
    }
  }
}
</style>
