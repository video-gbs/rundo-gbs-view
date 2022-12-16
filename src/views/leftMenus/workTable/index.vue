<template>
  <div class="page-container">
    <div class="container-left f fd-c ai-c">
      <div class="container-left-top">
        <Overview v-if="overviewShow" :home-lists="homeLists" />
      </div>
      <div class="container-left-top-bottom f1">
        <TodoList v-if="todoListShow" :home-lists="homeLists" />
      </div>
    </div>
    <div class="container-right">
      <Weather v-if="weatherListShow" :weather-list="weatherList" />
      <NoticeList
        v-if="notificationShow"
        style="margin: 5px 0 20px 0"
        :notification="notification"
      />
      <Statistical v-if="statisticalShow" :statistical-data="statisticalData" />
    </div>
  </div>
</template>

<script>
import Overview from "./components/overview.vue";
import TodoList from "./components/todoList.vue";
import Weather from "./components/Weather.vue";
import Statistical from "./components/statistical.vue";
import NoticeList from "./components/noticeList.vue";

import { areaWeather, editAfficheWork } from "@/api/method/weather";
import { homeLists } from "@/api/method/home";
import { Local } from "@/utils/storage";
export default {
  components: {
    Overview,
    TodoList,
    Weather,
    NoticeList,
    Statistical,
    // PCard
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
      headers: {
        Authorization: Local.getToken(),
      },
      statisticalData: [],
    };
  },
  watch: {},
  created() {
    this.getWeather();
  },
  mounted() {
    this.getHomeLists();
    this.editAfficheWork();
    // this.getAfficheList();
  },
  methods: {
    getHomeLists() {
      homeLists(this.params).then((res) => {
        if (res.code === 10000) {
          this.homeLists = res.data;
          this.notification = res.data.notification;
          this.notificationShow = true;
          this.todoListShow = true;
          this.overviewShow = true;
        }
      });
    },
    editAfficheWork() {
      editAfficheWork().then((res) => {
        if (res.code === 10000) {
          this.statisticalData = res.data;
          this.statisticalShow = true;
        }
      });
    },
    getWeather() {
      const weatherParams = {
        area: "梧州",
        from: "5",
        needIndex: "1",
      };
      areaWeather(weatherParams).then((res) => {
        if (res.code === 10000) {
          this.weatherList = res.data.showapi_res_body;
          this.weatherListShow = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  background: #f2f2f2;
  // min-height: calc(100vh - 98px);
  padding: 20px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  overflow-y: auto;
  .container-left {
    height: 835px;
    > div {
      width: 100%;
    }
    width: 1070px;
    margin-right: 20px;
  }
  .container-left-top-bottom {
    // height: calc(100% - 152px);
  }
  .container-right {
    min-width: 343px;
    width: calc(100% - 1070px);
  }
}
</style>
