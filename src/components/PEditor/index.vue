<!--
* @Author: duminquan
* @Date: 2022-03-23 11:16:11
* @LastEditors: duminquan
* @LastEditTime 2022-03-23 11:16:11
* @Description: 富文本编辑器
-->
<template>
  <div :id="`p-editor-${id}`" />
</template>
<script>
import Editor from 'wangeditor'
export default {
  name: 'PEditor',
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    id: {
      type: [String, Number],
      default: '0'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editorId: '',
      editor: null
    }
  },
  watch: {
    value(n, o) {
      console.log('nnnnn', n)
      if (this.id !== this.editorId) {
        console.log('????')
        document.getElementById(this.editor.textElemId).innerHTML = n
        this.editorId = this.id
      }
    }
  },
  created() {
    this.editorId = this.id
  },
  mounted() {
    const editor = new Editor('#p-editor-' + this.id)
    editor.config.onchange = (newHtml) => {
      console.log('??!!')
      this.$emit('change', newHtml)
    }
    editor.create()
    this.editor = editor
    if (this.value) {
      document.getElementById(this.editor.textElemId).innerHTML = this.value
    }
  },
  beforeDestroy() {
    this.editor.destroy()
    this.editor = null
  }
}
</script>
