<template>
  <div class="detail-container">
    <el-card v-if="moreData" class="box-card1">
      <div slot="header" class="clearfix">
        <LineFont
          :line-title="lineTitle"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="补充内容：">
            <span class="span-text">{{
              moreData ? moreData.content || "暂无" : "暂无"
            }}</span>
          </el-form-item>
          <el-form-item label="提交时间：">
            <span class="span-text">{{
              moreData ? moreData.createTime || "暂无" : "暂无"
            }}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card2">
      <div slot="header" class="clearfix f jc-sb ai-c">
        <LineFont
          class="f1"
          :line-title="lineTitle1"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
        <div style="max-width: 350px" class="mr10">
          <el-tag effect="plain" class="mr10">
            {{ $dict.status[one.status] }}
          </el-tag>
          <el-tag effect="plain" class="mr10" type="warning">
            {{ one.isShow ? "已隐藏" : "已显示" }}
          </el-tag>
          <el-tag effect="plain" type="warning">
            {{ one.isReview ? "关闭评论" : "开启评论" }}
          </el-tag>
        </div>
      </div>
      <div class="text item">
        <el-form v-if="one" ref="form" :model="form" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="留言对象：">
                <span class="span-text">{{ one.deptName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分类：">
                <span class="span-text">{{ $dict.type[one.type] }}</span>
              </el-form-item></el-col
            >
            <el-col :span="8">
              <el-form-item label="领域：">
                <span class="span-text">{{ $dict.domain[one.domain] }}</span>
              </el-form-item></el-col
            >
          </el-row>
          <el-form-item label="标题：">
            <span class="span-text">{{ one.title }}</span>
          </el-form-item>
          <el-form-item label="内容：">
            <span class="span-text">{{ one.content }}</span>
          </el-form-item>
          <el-form-item label="附件补充：">
            <template v-if="one.photoUrl">
              <div v-for="i in one.photoUrl.split(',')" :key="i">
                <img class="annex-css" :src="i" />
              </div>
            </template>
            <template v-else> 暂无附件 </template>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card3">
      <div slot="header" class="clearfix">
        <LineFont
          :line-title="lineTitle2"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="提问人：">
                <span class="span-text">{{ one.username }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="真实姓名：">
                <span class="span-text">{{ one.realName || "-" }}</span>
              </el-form-item></el-col
            >
            <el-col :span="12">
              <el-form-item label="提交时间：">
                <span class="span-text">{{ one.createTime || "-" }}</span>
              </el-form-item></el-col
            >
            <el-col :span="12">
              <el-form-item label="联系方式：">
                <span class="span-text">{{ one.phone || "-" }}</span>
              </el-form-item></el-col
            >
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from "@/components/LineFont";
import { getAffairsMoreByOne } from "@/api/method/affairsMore";

import { affairsInfoSearch } from "@/api/method/politicalList";
export default {
  name: "",
  components: {
    LineFont,
  },

  props: {
    affairsId: {
      type: String,
    },
  },
  data() {
    return {
      textStyle: {
        fontSize: "20px",
        fontFamily: "Microsoft YaHei-Bold, Microsoft YaHei",
        fontWeight: "bold",
        color: "#333333",
      },
      lineBlueStyle: {
        background: "rgba(30, 86, 160, 1)",
        borderRadius: "0px 4px 4px 0px",
      },
      form: {
        content: "",
        content1: "",
      },
      lineTitle: {
        title: "补充说明",
        notShowSmallTitle: false,
      },
      lineTitle1: {
        title: "问政信息",
        notShowSmallTitle: false,
      },
      lineTitle2: {
        title: "发布账号",
        notShowSmallTitle: false,
      },
      one: null,
      moreData: null,
    };
  },
  watch: {
    // one: {
    //   handler: function(n) {
    //     console.log('nnmnmnmnm', n)
    //     this.one = n
    //   },
    //   // immediate: true,
    //   deep: true
    // }
  },
  created() {},
  mounted() {
    console.log("this.$route.params.id2", this.$route.params);
    if (this.$route.params.id2) {
      this.getOne();
    }
  },
  methods: {
    getOne(v) {
      // 获取单条问政信息
      // affairsId
      affairsInfoSearch(this.$route.params.id2).then((res) => {
        if (res.code === 10000) {
          this.one = Object.assign({}, res.data);
        }
      });

      this.getMore(this.$route.params.id2);
    },
    getMore(v) {
      // 获取补充说明
      getAffairsMoreByOne(v).then((res) => {
        if (res.code === 10000) {
          this.moreData = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item {
  margin-bottom: 0;
}
::v-deep .el-card__header {
  padding: 0;
}
::v-deep .el-form-item__label {
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #8b8b8b;
}

.detail-container {
  height: 100%;
  .box-card {
    height: 100%;
  }
  .box-card2 {
    margin: 20px 0;
  }
  .span-text {
    font-size: 14px;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    font-weight: 400;
    color: #333333;
  }
}

.annex-css {
  max-width: 100%;
  height: auto;
}
</style>
