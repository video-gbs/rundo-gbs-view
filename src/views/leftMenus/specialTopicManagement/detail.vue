<!--专题详细-->
<template>
  <div class="bg-w p10 f">
    <div v-if="one" class="f1 f fd-c jc-c">
      <div class="p10 bg-w user-panel-action-box f ai-c jc-sb">
        <div class="title-css">专题详情</div>
        <div class="f1 f ai-c jc-e fw-w">
          <el-button
            v-loading="setShowLoading"
            size="mini"
            type="primary"
            @click="setShow"
            >{{ `设为${one.isShow ? "隐藏" : "可见"}` }}</el-button
          >
          <el-button size="mini" type="primary" @click="editItem"
            >编辑</el-button
          >
          <div class="mh10" style="height: inherit; width: 1px; color: #ddd">
            |
          </div>
          <el-button size="mini" type="danger" @click="deleteItem"
            >删除</el-button
          >
          <el-button size="mini" @click="goBack">返回</el-button>
        </div>
      </div>
      <div class="f1 content-box">
        <el-form ref="form" class="mt20" label-width="100px">
          <el-form-item label="专题封面">
            <el-image
              style="max-width: 100px"
              :src="one.photoUrl"
              fit="cover"
            />
          </el-form-item>
          <el-form-item label="专题描述">
            <div>{{ one.description }}</div>
          </el-form-item>
          <el-form-item label="专题内容">
            <div v-html="one.content" />
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div v-else class="empty-box f fd-c jc-c ai-c">
      <div class="mb10 title-c-3">找不到对应的专题信息</div>
      <el-button type="primary" size="mini" @click="goBack">返回</el-button>
    </div>
  </div>
</template>
<script>
import { deleteItem, setItemShow, getOne } from "@/api/method/specialTopic";

export default {
  name: "",
  data() {
    return {
      one: {},
      setShowLoading: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.$route.params.id) {
        this.getOneFn();
      }
    },
    getOneFn() {
      getOne(this.$route.params.id).then((res) => {
        if (res.code === 10000) {
          this.one = res.data || null;
        }
      });
    },
    setShow() {
      this.setShowLoading = true;
      setItemShow(this.one.id)
        .then((res) => {
          if (res.code === 10000) {
            this.$message.success("修改成功");
            this.getOneFn();
          }
        })
        .finally(() => {
          this.setShowLoading = false;
        });
    },
    editItem() {
      this.$router.push(`/specialTopic/${this.one.id || null}`);
    },
    deleteItem() {
      // deleteItem
      this.$alert(`确定要删除 '${this.one.title}' 吗?`, "删除操作", {
        dangerouslyUseHTMLString: true,
        showCancelButton: true,
      }).then((action) => {
        deleteItem({ ids: [this.one.id] }).then((res) => {
          if (res.code === 10000) {
            this.$message.success("删除成功。");
            this.goBack();
          }
        });
      });
    },
    goBack() {
      this.$router.push("/specialTopicManagementIndex");
    },
  },
};
</script>
<style lang="scss" scoped>
.empty-box {
  width: 100%;
  height: 100%;
}
.content-box {
  overflow-y: auto;
  border-top: 1px solid #eee;
}
</style>
