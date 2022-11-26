<template>
  <div class="page-container">
    <div class="container-left">
      <div class="container-left-top">
        <Overview :homeLists="homeLists" v-if="overviewShow" />
      </div>
      <div class="container-left-top-bottom">
        <TodoList :homeLists="homeLists" v-if="todoListShow" />
      </div>
    </div>
    <div class="container-right">
      <Weather :weatherList="weatherList" v-if="weatherListShow" />
      <NoticeList
        style="margin: 5px 0 20px 0"
        :notification="notification"
        v-if="notificationShow"
      />
      <Statistical :statisticalData="statisticalData" />
    </div>
  </div>
</template>

<script>
import Overview from "./components/overview.vue";
import TodoList from "./components/todoList.vue";
import Weather from "./components/Weather.vue";
import Statistical from "./components/statistical.vue";
import NoticeList from "./components/noticeList.vue";

import { editAffiche } from "@/api/method/appraise";
import { getAfficheList } from "@/api/method/affiche";
import { areaWeather } from "@/api/method/weather";
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
      weatherList: {},
      homeLists: {},
      notification: [],
      headers: {
        Authorization: Local.getToken(),
      },
      statisticalData:[]
    };
  },
  watch: {},
  created() {
    this.getWeather();
  },
  mounted() {
    this.getHomeLists();
    this.editAffiche();
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
    editAffiche() {
      editAffiche(this.params).then((res) => {
        if (res.code === 10000) {

          this.statisticalData=res.data;
        }
      });
    },
    getAfficheList() {
      getAfficheList(this.params).then((res) => {
        if (res.code === 10000) {
          console.log("res", res);
        }
      });
    },
    getWeather() {
      let weatherParams = {
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
  background: #f2f2f2;
  min-height: calc(100vh - 98px);
  padding: 1.25rem;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  .container-left {
    width: 1070px;
    margin-right: 20px;
  }
  .container-left-top-bottom {
    height: calc(100% - 152px);
  }
  .container-right {
    width: calc(100% - 1070px);
  }
}
</style>
