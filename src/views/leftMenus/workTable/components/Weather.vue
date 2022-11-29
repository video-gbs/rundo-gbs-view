<template>
  <div class="weather-container">
    <div class="main">
      <div>
        <svg-icon icon-class="location1" class="loaction_svg" /><span
          class="main-text"
          >南宁市良庆区良庆大道</span
        >
      </div>
      <h2>
        {{
          $moment(new Date())
            .add("year", 0)
            .format("YYYY-MM-DD")
        }}
        {{ week }}
      </h2>
      <div class="main-weather">
        {{ resWeatherList.now.weather }}
        {{ resWeatherList.f1.night_air_temperature }}℃~{{
          resWeatherList.f1.day_air_temperature
        }}℃ {{ resWeatherList.now.wind_direction }}
        {{ resWeatherList.now.wind_power }}
      </div>
    </div>
    <img :src="resWeatherList.now.weather_pic" class="weather_svg" />
  </div>
</template>

<script>
export default {
  name: "",
  props: {
    weatherList: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      week: "",
      resWeatherList: this.weatherList
    };
  },
  watch: {
    weatherList(newValue, oldValue) {
      this.resWeatherList = newValue;
    },
    deep: true,
    immediate: true
  },
  created() {},
  mounted() {
    this.getdataTime();
  },
  methods: {
    // getImg(val) {
    //   switch (val) {
    //     case value:
    //       return: require('../../../../assets/imgs/中雪.png')
    //       break;
    //     case value:
    //       break;
    //     case value:
    //       break;
    //     case value:
    //       break;

    //     default:
    //       break;
    //   }
    // },
    getdataTime() {
      let wk = new Date().getDay();
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let weeks = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六"
      ];
      this.week = weeks[wk];
      this.date_show = yy + "年" + mm + "月" + dd + "日";
    }
  }
};
</script>

<style lang="scss" scoped>
.weather-container {
  height: 135px;
  margin-bottom: 22px;
  background: #ffffff;
  box-shadow: 0px 3px 6px 1px rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  position: relative;
  .main {
    padding-top: 20px;
    height: 100%;
    font-family: Microsoft YaHei-Regular, Microsoft YaHei;
    .loaction_svg {
      width: 1rem;
      height: 1rem;
      margin: 0 0.5rem;
    }
    .main-text {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
    }
    h2 {
      font-size: 14px;
      font-weight: 400;
      color: #8b8b8b;
      margin-left: 2rem;
    }
    .main-weather {
      font-size: 16px;
      font-weight: bold;
      color: #333333;
      padding: 20px 0 0 2rem;
    }
  }
  .weather_svg {
    position: absolute;
    width: 121px;
    height: 93px;
    right: 0;
    top: 50%;
    transform: translate(0%, -50%);
  }
}
</style>
