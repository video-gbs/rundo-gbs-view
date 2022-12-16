<!--联系我们-->
<template>
  <div class="m20 bg-w f fd-c ai-s contacUs-panel">
    <div class="panel-header-box f jc-sb ai-c">
      <div class="title-css">联系我们</div>
      <el-button size="mini" type="primary">更新信息</el-button>
    </div>
    <div class="content-box f1 p10">
      <PEditorVue />
    </div>
  </div>
</template>
<script>
import PEditorVue from "@/components/PEditorVue";
export default {
  name: "",
  components: { PEditorVue },
};
</script>
<style lang="scss" scoped>
.contacUs-panel {
  > div {
    width: 100%;
  }
  .content-box {
    overflow-y: auto;
  }
}
</style>
