<template>
  <div class="page-container">
    <div class="container-top">
      <LineFont
        class="line-font"
        :line-title="lineTitle"
        :text-style="textStyle"
        :line-blue-style="lineBlueStyle"
      />
      <ul class="home-ul-top">
        <li
          v-for="(top, index) in topLists"
          :key="index"
          class="top-li"
          @click="goContentList"
        >
          <div
            class="top-li-div"
            :style="{ background: colorList[index] }"
          ></div>
          <span class="top-li-span">{{ top.name }}</span>
        </li>
      </ul>
    </div>
    <div class="container-middle">
      <div class="container-middle-left">
        <LineFont
          class="line-font"
          :line-title="lineTitle2"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
        <ul class="home-ul-top">
          <li
            v-for="(item1, index1) in topLists1"
            :key="index1"
            class="top-li"
            @click="goContentList"
          >
            <div class="top-li-div" :style="bacImage(item1, index1)"></div>
            <span class="top-li-span">{{ item1.name }}</span>
          </li>
        </ul>
      </div>
      <div class="container-middle-right">
        <LineFont
          class="line-font"
          :line-title="lineTitle3"
          :text-style="textStyle"
          :line-blue-style="lineBlueStyle"
        />
        <ul class="home-ul-top">
          <li
            v-for="(item2, index2) in topLists2"
            :key="index2"
            class="top-li"
            @click="goContentList"
          >
            <div
              class="top-li-div"
              :style="{ background: colorList2[index2] }"
            ></div>
            <span class="top-li-span">{{ item2.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="container-bottom">
      <LineFont
        class="line-font"
        :line-title="lineTitle4"
        :text-style="textStyle"
        :line-blue-style="lineBlueStyle"
      />
      <ul class="home-ul-top">
        <li
          v-for="(item3, index3) in topLists3"
          :key="index3"
          class="top-li"
          @click="goContentList"
        >
          <div class="top-li-div" :style="bacImage(item3, index3)"></div>
          <span class="top-li-span">{{ item3.name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import LineFont from '@/components/LineFont'
export default {
  components: {
    LineFont
  },
  data() {
    return {
      params: {},
      weatherListShow: false,
      notificationShow: false,
      todoListShow: false,
      overviewShow: false,
      statisticalShow: false,
      weatherList: {},
      homeLists: {},
      notification: [],
      statisticalData: [],
      colorList: [
        'linear-gradient(179deg, #00BCB6 0%, #009993 100%)',
        'linear-gradient(180deg, #F77062 0%, #FE5196 100%)',
        'linear-gradient(317deg, #4481EB 0%, #04BEFE 100%)'
      ],
      colorList1: [
        require('../../../assets/imgs/mid1.png'),
        'linear-gradient(167deg, #F77062 0%, #FE5196 100%)',
        'linear-gradient(180deg, #FFBC08 0%, #FFCC99 100%)',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF'
      ],
      colorList2: [
        'linear-gradient(180deg, #38C07C 0%, #2E7753 100%)',
        'linear-gradient(180deg, #00BCB6 0%, #009993 100%)',
        'linear-gradient(173deg, #54FFB5 0%, #259094 100%)',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF'
      ],
      colorList3: [
        // 'linear-gradient(179deg, #00BCB6 0%, #009993 100%)',
        // 'linear-gradient(180deg, #F77062 0%, #FE5196 100%)',
        require('../../../assets/imgs/bottom1.png'),
        require('../../../assets/imgs/bottom2.png'),
        'linear-gradient(147deg, #4481EB 0%, #04BEFE 100%)',
        '#FFFFFF',
        '#FFFFFF',
        '#FFFFFF'
      ],
      topLists: [
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        }
      ],
      topLists1: [
        {
          name: '实时监控'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        }
      ],
      topLists2: [
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        }
      ],
      topLists3: [
        {
          name: '组织管理'
        },
        {
          name: '合同管理'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        },
        {
          name: '功能功能'
        }
      ],
      lineTitle: {
        title: '常用',
        notShowSmallTitle: false
      },
      lineTitle2: {
        title: '应用',
        notShowSmallTitle: false
      },
      lineTitle3: {
        title: '运维',
        notShowSmallTitle: false
      },
      lineTitle4: {
        title: '配置',
        notShowSmallTitle: false
      },
      textStyle: {
        fontSize: '24px',
        fontFamily: 'Microsoft YaHei-Regular, Microsoft YaHei',
        fontWeight: 400,
        color: '#fff'
      },
      lineBlueStyle: {
        width: '4px',
        height: '17px',
        borderRadius: '2px',
        background:
          'linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0) 100%)'
      }
    }
  },
  watch: {},
  created() {
    // this.getWeather()
  },
  mounted() {
    // this.getHomeLists()
    // this.editAfficheWork()
    // this.getAfficheList();
  },
  methods: {
    bacImage(item, index) {
      if (item.name === '组织管理' || item.name === '合同管理') {
        if (index === 0) {
          return {
            background:
              'url(' + this.colorList3[index] + ') center center no-repeat'
          }
        } else if (index === 1) {
          return {
            background:
              'url(' + this.colorList3[index] + ') center center no-repeat'
          }
        } else {
          return `background:${this.colorList1[index]}`
        }
      } else {
        if (index === 0) {
          return {
            background:
              'url(' + this.colorList1[index] + ') center center no-repeat'
          }
        } else {
          return `background:${this.colorList1[index]}`
        }
      }
    },
    goContentList() {
      const { href } = this.$router.resolve({
        path: '/equipment',
        query: {}
      })
      console.log('href', href)
      window.open(href, '_blank')
      // this.$router.push({ path: "/systemManagement" });
    },
    getHomeLists() {
      homeLists(this.params).then((res) => {
        if (res.code === 10000) {
          this.homeLists = res.data
          this.notification = res.data.notification
          this.notificationShow = true
          this.todoListShow = true
          this.overviewShow = true
        }
      })
    },
    editAfficheWork() {
      editAfficheWork().then((res) => {
        if (res.code === 10000) {
          this.statisticalData = res.data
          this.statisticalShow = true
        }
      })
    },
    getWeather() {
      const weatherParams = {
        area: '梧州',
        from: '5',
        needIndex: '1'
      }
      areaWeather(weatherParams).then((res) => {
        if (res.code === 10000) {
          this.weatherList = res.data.showapi_res_body
          this.weatherListShow = true
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  // height: calc(100% + 58px);
  background: #f2f2f2;
  background-image: url('../../../assets/imgs/homebg.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  margin: 0 !important;
  // min-height: calc(100vh - 98px);
  // padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: auto;
  .container-top {
    width: 1872px;
    height: 184px;
    background: rgba(255, 255, 255, 0.35);
    border-radius: 12px;
    margin: 24px 24px 0 24px;
    .line-font {
      margin: 10px 0 0 35px;
    }
    .home-ul-top {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      .top-li {
        text-align: center;
        margin-right: 60px;
        .top-li-div {
          width: 64px;
          height: 64px;
          box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.16);
          border-radius: 4px;
          cursor: pointer;
        }
        .top-li-span {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          margin-top: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .container-middle {
    width: 1872px;
    height: 184px;
    border-radius: 12px;
    margin: 24px 24px 0 24px;
    display: flex;
    justify-content: space-between;
    .container-middle-left {
    }
    .container-middle-right {
    }
    .line-font {
      margin: 10px 0 0 35px;
    }
    .home-ul-top {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      .top-li {
        text-align: center;
        margin-right: 60px;
        .top-li-div {
          width: 64px;
          height: 64px;
          box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.16);
          border-radius: 4px;
          cursor: pointer;
          // background-repeat: 'no-repeat';
          // background-size: 'cover';
        }
        .top-li-span {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          margin-top: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .container-bottom {
    width: 1872px;
    height: 184px;
    border-radius: 12px;
    margin: 24px 24px 0 24px;
    .line-font {
      margin: 10px 0 0 35px;
    }
    .home-ul-top {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      .top-li {
        text-align: center;
        margin-right: 60px;
        .top-li-div {
          width: 64px;
          height: 64px;
          box-shadow: 0px 3px 12px 1px rgba(0, 0, 0, 0.16);
          border-radius: 4px;
          cursor: pointer;
        }
        .top-li-span {
          display: inline-block;
          font-size: 14px;
          font-family: Microsoft YaHei-Regular, Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          margin-top: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
