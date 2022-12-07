<!--编辑或添加广告图-->
<template>
  <div class="router_container2 m20 bg-w">
    <div class="panel-header-box f jc-sb ai-c">
      <div class="title-css">{{ title }}</div>
      <div class="f ai-c">
        <el-button size="mini" type="primary" @click="submitFn">保存</el-button>
        <el-button size="mini" @click="$router.push('/advertisementPicture')"
          >返回</el-button
        >
      </div>
    </div>
    <div class="p30">
      <el-form
        ref="form"
        :model="params"
        label-width="100px"
        label-position="left"
        :rules="rules"
      >
        <el-form-item label="展示标题">
          <el-input
            v-model="params.title"
            clearable
            size="mini"
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="广告图图片">
          <div>
            <el-row>
              <el-col :span="params.photoUrl ? 14 : 24">
                <el-upload
                  ref="uploadRef"
                  size="mini"
                  drag
                  action=""
                  :http-request="uploadFn"
                  :on-remove="onRemove"
                  :limit="1"
                >
                  <i class="el-icon-upload" />
                  <div class="el-upload__text">
                    将文件拖到此处，或<em>点击上传</em>
                  </div>
                  <div slot="tip" class="el-upload__tip">
                    {{
                      `① 只能上传一张图片图片,格式："*.jpg"、"*.jpeg"、"*.png"； ② 大小不超过50M；`
                    }}
                  </div>
                </el-upload></el-col
              >
              <el-col v-if="params.photoUrl" :span="10">
                <div class="ml20">当前广告图</div>
                <div class="ml20 f ai-c jc-c round-img-box">
                  <i class="el-icon-delete" @click="clickIconRemove" />
                  <img :src="params.photoUrl || ''" />
                </div>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="显示顺序">
          <el-input-number
            v-model="params.orderValue"
            size="mini"
            :min="1"
            :max="10000"
            label="描述文字"
            @change="handleChange"
          />
        </el-form-item>
        <el-form-item label="关联外部链接">
          <el-row>
            <el-col :span="24">
              <el-radio v-model="params.related" size="mini" :label="0"
                >否</el-radio
              >
              <el-radio v-model="params.related" size="mini" :label="1"
                >是</el-radio
              >
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="params.related" label="链接地址">
          <el-input
            v-model="params.pageUrl"
            size="mini"
            placeholder="请输入外链地址"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  addAdvertising,
  editAdvertising,
  getAdvertisingOne,
} from "@/api/method/advertising";
import { uploadImg } from "@/api/method/files";
export default {
  name: "RoundChartManage",
  data() {
    return {
      action: "add",
      title: "新增广告图",
      params: {
        createTime: "",
        photoUrl: "",
        id: 0,
        isShow: 0,
        orderValue: 4,
        pageUrl: "",
        related: 0,
        title: "",
      },
      copyParams: {},
      rules: {
        content: [
          { required: true, message: "请输入提交的内容", trigger: "blur" },
        ],
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
        pageUrl: [
          { required: true, message: "请输入连接地址", trigger: "blur" },
          {
            min: 10,
            max: 200,
            message: "长度在 10 到 200 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    if (this.$route.params.id !== "add") {
      this.action = "edit";
      this.title = "编辑广告图";
      this.getNoticeById(this.$route.params.id);
    }
  },
  methods: {
    handleChange() {},
    contentChange(v) {
      // 监听富文本内容变化并赋值
      this.params.content = v;
    },
    getNoticeById(v) {
      // 获取单个公告数据
      getAdvertisingOne(v).then((res) => {
        if (res.code === 10000) {
          Object.assign(this.params, res.data);
          this.copyParams = res.data;
        }
      });

      console.log("this.params", this.params);
    },
    onRemove(file, fileList) {
      !fileList.length && (this.params.photoUrl = "");
    },
    clickIconRemove() {
      this.$refs["uploadRef"].clearFiles();
      this.params.photoUrl = "";
    },
    submitFn() {
      if (this.params.photoUrl === "") {
        // 不更换新的图片
        this.params.photoUrl = this.copyParams.photoUrl;
      }
      this.$refs["form"].validate((v) => {
        if (v) {
          const fn =
            this.action === "add"
              ? addAdvertising(this.params)
              : editAdvertising(this.params.id, this.params);
          fn.then((res) => {
            res.code === 10000 &&
              (this.$message.success("添加成功"),
              this.$router.push("/advertisementPicture"));
          });
          return;
        }
      });
    },
    uploadFn(file) {
      console.log("file自定定义上传", file);
      const ft = ["image/png", "image/jpeg"];

      if (file.file.size / 1024 / 1024 > 50) {
        this.$refs["uploadRef"].clearFiles();
        this.$message.warning("图片体积大于50M");
        return;
      }
      if (!ft.includes(file.file.type)) {
        this.$refs["uploadRef"].clearFiles();
        this.$message.warning("只能上传jpg/jpeg/png格式的图片");
        return;
      }
      console.log("sdf", file.raw);
      const obj = new FormData();
      obj.append("files", file.file);
      uploadImg(obj)
        .then((res) => {
          res.code === 10000 && (this.params.photoUrl = res.data[0].url);

          res.code !== 10000 && this.$refs["uploadRef"].clearFiles();
        })
        .catch(() => {
          this.$refs["uploadRef"].clearFiles();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-input {
  width: 50%;
}

::v-deep .el-form-item__content {
  display: flex;
  align-items: center;

  .el-row {
    width: 100%;
  }
}
.round-img-box {
  position: relative;
  > i {
    background-color: #fff;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    z-index: 10;
    top: 50%;
    left: 50%;
    transform: translateY(-50%);
    transform: translateX(-50%);
    cursor: pointer;
    &:hover {
      background-color: #eee;
    }
  }
  > img {
    width: 100%;
    height: auto;
  }
}
</style>
