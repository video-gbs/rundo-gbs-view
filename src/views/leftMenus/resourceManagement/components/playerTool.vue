<template>
  <div class="player-tool" @click.stop @dblclick.stop>
    <div class="left-tool">
      <el-tooltip
        effect="dark"
        :content="isShowStream ? '隐藏码流信息' : '显示码流信息'"
        placement="top"
      >
        <i
          :class="`iconfont icon-xianshimaliuxinxi ${
            isShowStream ? 'active' : ''
          }`"
          @click.stop="onShowStream"
        />
      </el-tooltip>
    </div>
    <el-tooltip
      effect="dark"
      :content="showControl ? '关闭云台控制器' : '打开云台控制器'"
      placement="top"
    >
      <span
        :class="`icon-control-tool ${showControl ? 'show' : ''}`"
        @click.stop="onOpenControl"
      ></span>
    </el-tooltip>
    <el-tooltip effect="dark" content="截屏" placement="top">
      <i class="iconfont icon-jieping" @click.stop="jieping"></i>
    </el-tooltip>
    <el-tooltip
      effect="dark"
      :content="hasVoice ? '关闭声音' : '开启声音'"
      placement="top"
    >
      <i
        :class="`iconfont ${hasVoice ? 'icon-wuyinliang' : 'icon-yinliang'}`"
        @click.stop="onVoice"
      ></i>
    </el-tooltip>
    <!--    <i :class="`iconfont icon-zhiboluzhi ${recordIng ? 'recording' : ''}`" @click="record"></i>-->
    <el-tooltip effect="dark" content="放大" placement="top">
      <i
        class="iconfont icon-fangda"
        @mousedown.stop="ptzCamera('zoomin')"
        @mouseup.stop="ptzCamera('stop')"
      >
      </i>
    </el-tooltip>
    <el-tooltip effect="dark" content="缩小" placement="top">
      <i
        class="iconfont icon-suoxiao"
        @mousedown.stop="ptzCamera('zoomout')"
        @mouseup.stop="ptzCamera('stop')"
      >
      </i>
    </el-tooltip>
    <!-- <i class="iconfont icon-xianshimaliuxinxi"></i> -->
    <!-- <span @click="jieping">截屏</span> -->
    <!-- <span @click="record">开始录像</span>
    <span @click="endRecord">停止录像</span> -->
  </div>
</template>

<script>
export default {
  name: 'playerTool',
  data() {
    return {
      jessibuca: null,
      hasVoice: true, //播放声音
      recordIng: false, //正在录像
      data: {}
    }
  },
  props: [
    'idx',
    'player',
    'deviceData',
    'onOpenControl',
    'showControl',
    'onShowStream',
    'isShowStream',
    'hasAudio'
  ],

  mounted() {
    this.data = this.deviceData
    this.video = document.getElementById(this.idx)
    this.canvas = document.createElement('canvas')
    this.img = document.createElement('img')
    this.img.crossOrigin = ''
    this.ctx = this.canvas.getContext('2d')
    this.video.muted = this.hasVoice = this.hasAudio
  },
  watch: {
    hasAudio(newVal) {
      this.video.muted = this.hasVoice = newVal
    }
  },
  methods: {
    // 截图
    jieping() {
      this.getNowDate()
      const { channelName } = this.data
      console.info('点击了截屏', this.deviceData)
      console.info('this.video222', this.video)
      this.canvas.width = this.video.videoWidth
      this.canvas.height = this.video.videoHeight
      this.ctx.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      )
      this.img.src = this.canvas.toDataURL()
      // document.body.append(this.img);

      // 实现下载功能
      const link = document.createElement('a')
      document.body.appendChild(link)
      link.style.display = 'none'
      link.href = this.canvas.toDataURL()
      link.setAttribute('download', `${channelName}_pic_${this.getNowDate()}`)

      link.click()
      document.body.removeChild(link)
    },
    getNowDate() {
      const toDay = new Date()
      const year = toDay.getFullYear() //年
      const month =
        toDay.getMonth() + 1 < 10
          ? '0' + (toDay.getMonth() + 1)
          : toDay.getMonth() + 1 //月
      const data =
        toDay.getDate() < 10 ? '0' + toDay.getDate() : toDay.getDate() //日
      const hour =
        toDay.getHours() < 10 ? '0' + toDay.getHours() : toDay.getHours() //时
      const minute =
        toDay.getMinutes() < 10 ? '0' + toDay.getMinutes() : toDay.getMinutes() //分
      const second =
        toDay.getSeconds() < 10 ? '0' + toDay.getSeconds() : toDay.getSeconds() //秒
      // const today = year + '年' + month + '月' + data + '日' + hour + '时' + minute + '分' + second + '秒';
      const today =
        year +
        '-' +
        month +
        '-' +
        data +
        '_' +
        hour +
        ':' +
        minute +
        ':' +
        second
      console.info('today', today)
      return today
    },
    // 录像
    record() {
      const { channelName } = this.data
      console.info('点击了录像', channelName)
      if (this.recordIng) {
        this.player.endRecord(channelName)
      } else {
        this.player.startRecord()
      }
      this.recordIng = !this.recordIng
    },
    // endRecord() {
    //   this.recordIng = false;
    //   this.player.endRecord();
    // },
    // 云台控制
    ptzCamera(type) {
      this.$bus.$emit('ptzCamera', type)
    },
    // 点击声音
    onVoice() {
      this.hasVoice = !this.hasVoice
      this.video.muted = this.hasVoice
    }
  },
  destroyed() {
    if (this.jessibuca) {
      this.jessibuca.destroy()
    }
    this.playing = false
    this.loaded = false
    this.performance = ''
  }
}
</script>

<style lang="scss" scoped>
/* 视频工具栏 */
.player-tool {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: right;
  opacity: 0;
  align-items: center;

  .left-tool {
    width: 100%;

    i {
      float: left;
      margin-left: 16px;
    }
  }

  .icon-control-tool {
    background: url('../../../../assets/imgs/icon_player_tool_control.png')
      no-repeat;
    background-size: cover;
    display: inline-block;
    width: 20px;
    flex: none;
    height: 20px;
    cursor: pointer;
    margin-right: 16px;

    &.show {
      background: url('../../../../assets/imgs/icon_control_tool_show.png')
        no-repeat;
      background-size: cover;
    }
  }

  i {
    margin-right: 16px;
    font-size: 20px;
    cursor: pointer;
    color: rgba(255, 255, 255, 0.85);

    &.active {
      color: #1890ff;
    }
  }

  .recording {
    color: #f00;
  }
}
.player-box:hover .player-tool {
  display: flex;
}
</style>
