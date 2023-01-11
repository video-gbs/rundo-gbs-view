<!--展示信息管理- 1问政简介 2提问流程 3相关规定 4注意事项 5联系我们 -->
<template>
  <div class="m20 bg-w f fd-c ai-s module-panel">
    <div class="panel-header-box f jc-sb ai-c">
      <div class="title-css">{{ title }}</div>
      <el-button
        v-loading="btnLoading"
        size="mini"
        type="primary"
        @click="setFn"
        >更新信息</el-button
      >
    </div>
    <div class="content-box f1 p10">
      <PEditorVue
        :height="'auto'"
        :value="params.content"
        @input="getContent"
      />
    </div>
  </div>
</template>
<script>
import PEditorVue from '@/components/PEditorVue'
import { getInfo, editInfo } from '@/api/method/informationManagement'

export default {
  name: '',
  components: { PEditorVue },
  props: {
    title: {
      type: String
    },
    dataType: {
      type: Number
    }
  },
  data() {
    return {
      btnLoading: false,
      params: {
        content: ''
      }
    }
  },
  mounted() {
    this.getFn()
  },
  methods: {
    getContent(v) {
      this.params.content = v
    },
    getFn() {
      getInfo(this.dataType).then((res) => {
        if (res.code === 10000) {
          this.params.id = res.data.id
          this.params.content = res.data.content
        }
      })
    },
    setFn() {
      this.btnLoading = !this.btnLoading

      editInfo(this.params)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success('编辑成功')
          }
        })
        .finally(() => {
          this.btnLoading = !this.btnLoading
        })
    }
  }
}
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
