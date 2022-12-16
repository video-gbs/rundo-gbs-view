<!--联系我们-->
<template>
  <div class="m20 bg-w f fd-c ai-s module-panel">
    <div class="panel-header-box f jc-sb ai-c">
      <div class="title-css">联系我们</div>
      <el-button size="mini" type="primary">更新信息</el-button>
    </div>
    <div class="content-box f1 p10">
      <PEditorVue :height="'auto'" @onChange="getContent" />
    </div>
  </div>
</template>
<script>
import PEditorVue from "@/components/PEditorVue";
export default {
  name: "",
  components: { PEditorVue },
  data() {
    return {
      params: {
        content: "",
      },
    };
  },
  methods: {
    getContent(v) {
      this.params.content = v;
    },
  },
};
</script>
<style lang="scss" scoped>
.module-panel {
  > div {
    width: 100%;
  }
  .content-box {
    overflow-y: auto;
  }
}
</style>
