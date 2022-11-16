<template>
  <!-- <div class="noticeList-container"> -->
  <el-card class="box-card">
    <div class="notice-box" @click="showNoticeDiaog">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="tzgg" class="tzgg_svg"/>
        <span>通知公告</span>
      </div>
      <vue-seamless-scroll :data="noticeList" :class-option="defaultOption">
        <ul class="ul-scoll">
          <li v-for="(item, index) in noticeList" :key="index">
            <div class="row">
              <span class="title" :data-index="index">{{ item.title }}</span>
              <span class="date" :data-index="index">{{ item.date }}</span>
            </div>
            <div class="type" :data-index="index">{{ item.type }}</div>
          </li>
        </ul>
      </vue-seamless-scroll>
    </div>

    <!-- 查看公文弹窗 start -->
    <!-- <el-dialog
      :visible.sync="newsPopup.isShow"
      class="new-dialog"
      top="5vh"
      width="80vw"
      style="height: 90vh;"
    >
      <NoticeDetail :data="newsPopup.data" />
    </el-dialog> -->
    <!-- 查看公文弹窗 end -->

      </el-card>
  <!-- </div> -->
</template>

<script>
import LineFont from '@/components/LineFont'

import vueSeamlessScroll from 'vue-seamless-scroll'
// import NoticeDetail from '@/components/NoticeDetail/index.vue'
import { Local } from '@/utils/storage'
import { parseTime } from '@/utils'

export default {
  name: 'NoticeList',
  components: {
    vueSeamlessScroll,
    LineFont
    // NoticeDetail
  },
  data() {
    return {
      lineTitle:{
        title:'通知公告',
        notShowSmallTitle:false
      },
      noticeList: [
        {
          title:'1111',
          date:'1111',
          type:2222
        },
        {
          title:'1111',
          date:'1111',
          type:2222
        },
        {
          title:'1111',
          date:'1111',
          type:2222
        }
      ],
      newsPopup: {
        isShow: false,
        data: null
      }
    }
  },
  computed: {
    defaultOption() {
      return {
        step: 1, // 数值越大速度滚动越快
        limitMoveNum: 7, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: 38 * 5, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 2000 // 单步运动停止的时间(默认值1000ms)
      }
    }

  },
  created() {
    // this.getNews()
  },
  mounted() {

  },
  methods: {
    getNews() {
      this.$api.notice.all({
        currentDatetime: parseTime(new Date())
      }).then(res => {
        this.noticeList = res.data.data
        this.noticeList && this.noticeList.forEach(item => {
          item.date = item.createTime.split(' ')[0]
          item.type = this.$dict('notice.type:' + item.newsTag)
        })
      })
    },
    // vue-seamless内部滚动点击失效，从外部点击再获取index匹配
    showNoticeDiaog(e) {
      if (e.target.dataset.index !== undefined) {
        this.newsPopup.data = this.noticeList[e.target.dataset.index]
        this.newsPopup.isShow = true
        this.newsDialogVisible = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .noticeList-container {
    width: 100%;
    height: 50%;
    padding: 8px;
    border:1px solid #ccc;
    border-radius:4px;
    margin:10px 0px;
    background-color:#fff;
    .notice-box {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .clearfix{
      height:80px;
      line-height:80px;
      .tzgg_svg{
        width:1.5rem;
        height:1.5rem;
        position:relative;
        top:5px;
        left:-3px;
      }
  }
  }
  .ul-scoll {
    padding: 0 16px;
    height: 100%;
    li {
      // line-height: 38px;
      padding: 10px 0;
      cursor: pointer;
      &:hover {
        font-weight: bold;
      }
      .row {
        display: flex;
        white-space: nowrap;
        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          width: 80%;
          margin-right: 10px;
        }
        .date {
          font-size: 14px;
          color: #999;
        }
      }
      .type {
        font-size: 14px;
        color: #999;
        margin-top: 8px;
      }
    }
  }
  .news-header {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin-top: -20px;
    border-bottom: solid 1px #Ccc;

    .news-title {
      flex: 1;
      font-size: 25px;
      line-height: 30px;
      font-weight: bold;
      text-align: center;
    }
    .row {
      display: flex;
      justify-content: center;
      padding: 16px;
      width: 100%;
      white-space: nowrap;
      div {
        margin: 4px 18px;
      }
    }
  }
</style>
