<template>
  <div class="sup-video-player">
    <div :class="['video-list', 'video-split-' + splitNum]">
      <div
        v-for="n in 9"
        :key="n"
        @click="videoItemClick(n)"
        :class="[
          'video-item',
          'split-' + splitNum,
          'video-item-' + n,
          { active: active == n },
        ]"
      >
        <vue-player
          :ref="'player' + n"
          :id="'tc-player' + n"
        ></vue-player>
      </div>
    </div>
    <div class="video-tools">
      <ul>
        <li>
          <el-tooltip placement="top">
            <div slot="content">保存视图</div>
            <svg-icon icon-class="vt_save_scene" @click="saveScene"/>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip placement="top">
            <div slot="content">关闭所有</div>
            <svg-icon icon-class="vt_close_all" @click="closeAll"/>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip placement="top">
            <div slot="content">关闭选中单元格</div>
            <svg-icon icon-class="vt_close" @click="closeCurCell"/>
          </el-tooltip>
        </li>
        <li v-if="false">
          <el-tooltip placement="top">
            <div slot="content">全屏</div>
            <svg-icon icon-class="vt_fullscreen" @click="fullscreen"/>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip placement="top">
            <div slot="content">抓拍</div>
            <svg-icon icon-class="vt_screenshot" @click="capture"/>
          </el-tooltip>
        </li>
        <slot name="extend-tools"></slot>
        <li style="margin-left: auto">
          <el-tooltip placement="top">
            <div slot="content">9分屏</div>
            <svg-icon icon-class="vt_split_9" @click="splitScreen(9)"/>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip placement="top">
            <div slot="content">6分屏</div>
            <svg-icon icon-class="vt_split_6" @click="splitScreen(6)"/>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip placement="top">
            <div slot="content">4分屏</div>
            <svg-icon icon-class="vt_split_4" @click="splitScreen(4)"/>
          </el-tooltip>
        </li>
        <li>
          <el-tooltip placement="top">
            <div slot="content">1分屏</div>
            <svg-icon icon-class="vt_split_1" @click="splitScreen(1)"/>
          </el-tooltip>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
//引入播放组件
import VuePlayer from "./VuePlayer";
export default {
  name: "",
  data() {
    return {
      splitNum: this.split,
      active: this.activeIndex,
      recorder: null,
      talkbackData: null,
      dataList: []
    };
  },
  created() {},
  components: { VuePlayer },
  props: {
    split: {
      type: Number,
      default: 4,
    },
    activeIndex: {
      type: Number,
      default: 1,
    },
    talkback: {
      type: Boolean,
      default: false,
    },
    activeName:String
  },
  computed: {
    currPlayer() {
      var p = this.$refs["player" + this.active];
      if (p) return p[0];
      return null;
    },
  },
  methods: {
    videoItemClick(n) {
      this.active = n;
      console.log(n);
      // this.talkbackData = this.currPlayer.data;
    },
    closeAll() {
      for (var i = 1; i <= 9; i++) {
        let players = this.$refs["player" + i];
        if (players && players.length > 0) {
          players[0].close();
        }
      }
      this.active = 1;
      this.dataList = [];
    },
    closeCurCell() {
      if (this.currPlayer) {
        this.currPlayer.close();
        this.dataList[this.active] = null;
      }
    },
    splitScreen(n) {
      console.log(n);
      this.splitNum = n;
      this.active = 1;
    },
    play(url, data) {
      // this.dataList[this.active] = data;
      this.currPlayer.load('http://xard-gbs-test.runjian.com:2280/rtp/LIVE_193.live.flv');
      var n = (this.active + 1) % (this.splitNum + 1);
      this.active = n == 0 ? 1 : n;
    },
    playAtIndex(index, url, data) {
      this.dataList[index] = data;
      let players = this.$refs["player" + index];
      if (players && players.length > 0) {
        players[0].load('http://xard-gbs-test.runjian.com:2280/rtp/LIVE_193.live.flv', data);
      }
    },
    capture() {
      if (this.currPlayer) {
        this.currPlayer.screenShot();
      }
    },
    detail() {
      console.log(this.currPlayer.data);
    },
    fullscreen() {
      if (this.currPlayer) {
        this.currPlayer.fullscreen();
      }
    },
    ptzCtrl(cmd, param) {
      // 判断是否正在播放视频
      if (!this.currPlayer.status()) {
        console.warn('没有选中正在播放的设备视频!');
        return;
      }
      let params = {
        avObjName: "",
        id: this.dataList[this.active].objId,
        cmd: cmd,
        param: param
      };
      this.$api.controlPtz(params).then((response) => {
        if (!response.success) {
          this.$message({
            message: response.info,
            type: 'error'
          })
        }
      })
    },
    saveScene() {
      // 判断是否有视频正在播放
      let isPlaying = false;
      for (var i = 1; i <= this.splitNum; i++) {
        let players = this.$refs["player" + i];
        if (players && players.length > 0 && players[0].status()) {
          isPlaying = true;
          break;
        }
      }
      if (!isPlaying) {
        this.$message({
          message: "没有正在播放的视频",
          type: "warning",
          duration: 2000
        });
        return;
      }
      // 弹出输入框输入视图名称
      this.$prompt('请输入视图名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (value) {
          let details = [];
          for (var i = 1; i <= this.splitNum; i++) {
            if (this.dataList[i]) {
              details.push({
                index: i,
                objId: this.dataList[i].objId,
                flvUrl: ''
              });
            }
          }
          let param = {
            name: value,
            viewInfo: {
              cut: this.splitNum,
              viewInfoDetails: details
            }
          };
          this.$api.createUVView(param).then((response) => {
            if (response.success) {
              this.$message({
                type: 'success',
                message: '保存成功'
              });
              this.$emit('saveSceneSuccess');
            }
          });
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        });
      });
    }
  },
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++;
    },
  },
};
</script>

<style lang="scss" scoped>
.sup-video-player {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: calc(100% - 48px) 48px;
  height: 100%;
  .video-list {
    flex: 1 1 auto;
    background: #98a5a5;
    display: grid;

    .video-item {
      background: black;
      border: 1px solid #052524;
      cursor: pointer;
      position: relative;
    }

    .video-item.active {
      border: 1px solid #009586;
      box-shadow: inset 0 0 2px 2px #ffba00;
    }

    &.video-split-6 {
      grid-template-columns: 33.33% 33.33% 33.33%;
      grid-template-rows: 33.33% 33.33% 33.33%;
    }

    .video-item.split-6.video-item-1 {
      grid-column-start: 1;
      grid-column-end: 3;
      grid-row-start: 1;
      grid-row-end: 3;
    }

    &.video-split-1 {
      grid-template-columns: 100%;
      grid-template-rows: 100%;
    }

    &.video-split-4 {
      grid-template-columns: 50% 50%;
      grid-template-rows: 50% 50%;
    }

    &.video-split-9 {
      grid-template-columns: 33.33% 33.33% 33.33%;
      grid-template-rows: 33.33% 33.33% 33.33%;
    }
  }

  .video-tools {
    // height: 48px;
    background: #95a0a0;

    ul {
      display: flex;
      list-style: none;
      padding: 0 10px;
      margin: 0;
      line-height: 48px;

      .icon {
        cursor: pointer;
      }
      li {
        margin: 0 8px;
      }
      .iconfont {
        font-size: 24px;
      }
    }
  }
}
</style>
