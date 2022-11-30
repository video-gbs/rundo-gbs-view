<template>
  <div class="detail-container">
    <el-card class="box-card1">
      <div slot="header" class="clearfix">
        <LineFont :line-title="lineTitle" :text-style="textStyle" :line-blue-style="lineBlueStyle" />
      </div>
      <div class="text item">
        <el-form ref="form" :model="form" label-width="120px">
          <el-form-item label="补充内容：">
            <span
              class="span-text"
            >根据广西壮族自治区实施的《中华人民共和国老年人权益保障法》办法中的只要是独生子女都可以享受每年累计不超过15天带薪陪护假。但现在事实上单位（参公）并没有依法实施，不给本单位独生子女提供以上所述假期，导致家里老人住院无法陪护，请问梧州市是否能依法出一份通知，让各级单位依法执行该假期！谢谢。</span>
          </el-form-item>
          <el-form-item label="提交时间：">
            <span class="span-text">2022-06-30 12:00:56</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card2">
      <div slot="header" class="clearfix">
        <LineFont :line-title="lineTitle1" :text-style="textStyle" :line-blue-style="lineBlueStyle" />
      </div>
      <div class="text item">
        <el-form v-if="oneData" ref="form" :model="form" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="留言对象：">
                <span class="span-text">{{ oneData.deptName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="分类：">
                <span class="span-text">{{ $dict.type[oneData.type] }}</span>
              </el-form-item></el-col>
            <el-col :span="8">
              <el-form-item label="领域：">
                <span class="span-text">{{ $dict.domain[oneData.domain] }}</span>
              </el-form-item></el-col>
          </el-row>
          <el-form-item label="标题：">
            <span
              class="span-text"
            >{{ one.title }}</span>
          </el-form-item>
          <el-form-item label="内容：">
            <span
              class="span-text"
            >{{ oneData.content }}</span>
          </el-form-item>
          <el-form-item label="附件补充：">
            <span class="span-text">图片</span>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card3">
      <div slot="header" class="clearfix">
        <LineFont :line-title="lineTitle2" :text-style="textStyle" :line-blue-style="lineBlueStyle" />
      </div>
      <div class="text item">
        <el-form v-if="one" ref="form" :model="form" label-width="120px">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="提问人：">
                <span class="span-text">{{ one.username }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="真实姓名：">
                <span class="span-text">{{ one.realName||'-' }}</span>
              </el-form-item></el-col>
            <el-col :span="12">
              <el-form-item label="提交时间：">
                <span class="span-text">{{ one.updateTime||'-' }}</span>
              </el-form-item></el-col>
            <el-col :span="12">
              <el-form-item label="联系方式：">
                <span class="span-text">{{ one.phone||'-' }}</span>
              </el-form-item></el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from '@/components/LineFont'
import { getAffairsMoreByOne } from '@/api/method/affairsMore'
export default {
  name: '',
  components: {
    LineFont
  },
  props: {
    one: {
      type: Object,
      default: () => {

      }
    }
  },
  data() {
    return {
      textStyle: {
        fontSize: '20px',
        fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
        fontWeight: 'bold',
        color: '#333333'
      },
      lineBlueStyle: {
        background: 'rgba(30, 86, 160, 1)',
        borderRadius: '0px 4px 4px 0px'
      },
      form: {
        content: '',
        content1: ''
      },
      lineTitle: {
        title: '补充说明',
        notShowSmallTitle: false
      },
      lineTitle1: {
        title: '问政信息',
        notShowSmallTitle: false
      },
      lineTitle2: {
        title: '发布账号',
        notShowSmallTitle: false
      },
      oneData: null,
      moreData: null
    }
  },
  watch: {
    one: {
      handler: function(n) {
        console.log('nnmnmnmnm', n)
        this.oneData = n
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    if (this.$route.params.id) {
      this.getMore(this.$route.params.id)
    }
  },
  mounted() {
    setTimeout(() => { console.log('this.one', this.one) }, 0)
  },
  methods: {
    getOne() {
      // 获取单挑问政基本信息
    },
    getMore(v) {
      // 获取补充说明
      getAffairsMoreByOne(v).then(res => {
        if (res.code === 10000) {
          this.moreData = res.data
        }
      })
    }
  }
}
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
</style>
