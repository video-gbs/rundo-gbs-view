<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px">
      <!-- 工具栏 -->
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :default-config="toolbarConfig"
        :mode="'simple'"
      />
      <!-- 编辑器 -->
      <Editor
        v-model="html"
        style="height: 400px; overflow-y: hidden"
        :default-config="editorConfig"
        @onChange="onChange"
        @onCreated="onCreated"
      />
    </div>
  </div>
</template>

<script>
import { uploadImg } from "@/api/method/files";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import API from "@/api";
import { trim } from "zrender/lib/core/util";

export default {
  name: "PEditorVue",
  components: { Editor, Toolbar },
  toolBarConfig: {
    type: Array,
    default: function () {
      return [];
    },
  },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      editor: null,
      html: "",
      toolbarConfig: {
        // toolbarKeys: [ /* 显示哪些菜单，如何排序、分组 */ ],
        // excludeKeys: [ /* 隐藏哪些菜单 */ ],
      },
      editorConfig: {
        placeholder: "请输入内容...",
        // autoFocus: false,

        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          uploadImage: {
            async customUpload(file, insertFn) {
              console.log(file, insertFn);
              var form = new FormData();
              form.append("files", file);
              uploadImg(form).then((res) => {
                res.data.forEach((i) => {
                  insertFn(i.url, i.name, i.url);
                });
                // const { url, name } = res.data
                // insertFn(url, name, url)
              });
            },
          },
          uploadVideo: {
            // 自定义上传
            // async customUpload(file: File, insertFn: InsertFnType) {  // TS 语法
            async customUpload(file, insertFn) {
              // JS 语法
              // file 即选中的文件
              var form = new FormData();
              form.append("file", file);
              // 自己实现上传，并得到视频 url poster
              API.file.upload(form).then((res) => {
                const { url, name } = res.data.data;
                // 最后插入视频
                insertFn(url, name, url);
              });
            },
          },
        },
      },
      changeStatus: false,
    };
  },
  watch: {
    value(val) {
      if (!this.changeStatus) {
        console.log("vsal", val);
        this.html = val;
      }
    },
  },
  mounted() {
    // 模拟 ajax 请求，异步渲染编辑器
    console.log("value12121212份饭", this.value);
    // console.log("Toolbar.getConfig()", Toolbar.getConfig());
    setTimeout(() => {
      this.html = this.value;
    }, 0);
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时，及时销毁 editor ，重要！！！
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor); // 【注意】一定要用 Object.seal() 否则会报错
      if (this.value) {
        this.html = this.value;
      }
    },
    onChange(editor) {
      console.log("editor.getAllMenuKeys()", editor.getAllMenuKeys());
      let html = editor.getHtml();
      html = trim(html) == "<p><br></p>" ? "" : html;
      this.changeStatus = true;
      this.$emit("input", html);
      this.$nextTick(() => {
        this.changeStatus = false;
      });

      console.log("onChange", html); // onChange 时获取编辑器最新内容
    },
    getEditorText() {
      const editor = this.editor;
      if (editor == null) return;

      console.log(editor.getText()); // 执行 editor API
    },
    printEditorHtml() {
      const editor = this.editor;
      if (editor == null) return;

      console.log(editor.getHtml()); // 执行 editor API
    },
  },
};
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
