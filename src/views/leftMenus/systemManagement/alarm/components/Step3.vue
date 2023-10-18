<template>
  <div class="step3-content">
    <div class="init-img" v-show="isShowImg">
      <img
        src="../../../../../assets/imgs/addgjsj.png"
        alt=""
        @click="showContent"
      />
    </div>

    <div class="init-main" v-show="!isShowImg">
      <div class="tag-group">
        <span class="tag-group__title">选择事件</span>
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
          size="medium"
          class="tag-btn"
        >
          {{ tag }}
        </el-tag>
        <div class="button-new-tag">+ 添加事件</div>
      </div>

      <div class="tag-group-content">
        <el-card v-for="tag in dynamicTags" :key="tag" class="box-card">
          <div slot="header" class="clearfix">
            <LineFont
              :line-title="{
                title: tag,
                notShowSmallTitle: false
              }"
              :text-style="textStyle"
              :line-blue-style="lineBlueStyle"
            />
          </div>
          <div v-for="o in 4" :key="o" class="text item">
            {{ '列表内容 ' + o }}
          </div>
        </el-card>
      </div>
    </div>

    <el-dialog
      v-if="dialog.show"
      :title="dialog.title"
      :visible.sync="dialog.show"
      width="720px"
      :before-close="handleClose"
    >
      <el-input
        placeholder="请输入搜索关键字"
        suffix-icon="el-icon-search"
        class="search-input"
        style="width: 580px"
        v-model="filterText"
        clearable
      ></el-input>
      <div class="allIncident-div">
        <el-checkbox-group
          v-model="checkeLists"
          class="allIncident-checkbox-group"
        >
          <el-checkbox
            v-for="incident in allIncident"
            :label="incident"
            :key="incident"
            class="allIncident-checkbox"
            >{{ incident }}</el-checkbox
          >
        </el-checkbox-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="submit('accountForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTemplateAlarmEventLists,
  addTemplateAlarmEvent,
  editTemplateAlarmEvent,
  deleteTemplateAlarmEvent
} from '@/api/method/alarm'
import LineFont from '@/components/LineFont'
export default {
  name: '',
  components: { LineFont },
  props: [],
  data() {
    return {
      templateName: '',
      isShowImg: true,
      dialog: {
        show: false,
        title: '事件清单',
        params: {
          templateName: '',
          timePeriodList: []
        }
      },
      allIncident: [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
      checkeLists: [],
      dynamicTags: ['标签一', '标签二', '标签三','标签三2','标签三2'],
      inputVisible: false,
      inputValue: '',
      textStyle: {
        fontSize: '14px',
        fontFamily: 'Microsoft YaHei-Bold, Microsoft YaHei',
        fontWeight: 'bold',
        color: '#333333'
      }
    }
  },
  mounted() {},
  methods: {
    // getTitle(name){
    //   re
    // },
    showContent() {
      this.isShowImg = false
      this.dialog.show = !this.dialog.show
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  text-align: center;
}
.step3-content {
  position: relative;
  height: 100%;
  .init-img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    cursor: pointer;
  }
  .allIncident-div {
    margin-top: 20px;
    .allIncident-checkbox-group {
      display: flex;
      flex-wrap: wrap;
      .allIncident-checkbox {
        flex-basis: calc(25% - 10px); /* 每个元素占据容器的25%宽度，减去间距 */
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }
  .init-main {
    margin: 20px;
    .tag-group {
      .tag-group__title {
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #606266;
        display: inline;
        margin-right: 20px;
      }
      .tag-btn {
      }
      .button-new-tag {
        display: inline-block;
        width: 96px;
        height: 32px;
        background: #ffffff;
        border-radius: 4px 4px 4px 4px;
        border: 1px dashed #0270ff;
        font-size: 14px;
        font-family: Microsoft YaHei-Regular, Microsoft YaHei;
        font-weight: 400;
        color: #0270ff;
        text-align: center;
        cursor: pointer;
      }
    }
    .tag-group-content {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      .box-card {
        flex-basis: calc(25% - 52px);
        // min-width: 504px;
        height: 450px;
        background: #fefefe;
        box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.1);
        border-radius: 4px 4px 4px 4px;
        border: 1px solid rgba(0, 73, 168, 0);
        margin-right: 52px;
        margin-bottom: 20px;
      }
    }
  }
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
