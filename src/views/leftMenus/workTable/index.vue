<template>
  <div class="page-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="col-left">
          <div class="col-item item-pt">
            <Overview/>
          </div>

          <!-- <el-row class="item-pt" :gutter="20">
            <el-col :span="12">
              <div class="col-item">
                <PCard title="新增公文统计" header-bg="white" padding="5px" height="300px">
                  <Search slot="operate" :option="dateOptions" :current-index="ducomentIndex" @search="onChangeDocument" />
                  <PChart id="document" slot="content" ref="document" :bar-name="'新增公文'" :serie-data="documentData" :x-data="documentXData" />
                </PCard>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="col-item">
                <PCard title="新增上报信息统计" header-bg="white" padding="5px" height="300px">
                  <Search slot="operate" :option="dateOptions" :current-index="achievementIndex" @search="onChangeAchievement" />
                  <PChart id="achievement" slot="content" ref="achievement" :bar-name="'新增上报信息'" :serie-data="achievementData" :x-data="achievementXData" />
                </PCard>
              </div>
            </el-col> -->
          <!-- </el-row> -->

          <!-- <div class="col-item">
            <PCard title="紧急公文" padding="0" height="">
              <Process v-if="renderData" slot="content" />
            </PCard>
          </div> -->

        </div>
      </el-col>
      <el-col :span="6">
        <div class="col-right">
          <div class="col-item">
            <!-- <PCard title="通知公告" icon-class="icon-menu-29" padding="0"> -->
              <!-- <NoticeList slot="content" /> -->
            <!-- </PCard> -->
          </div>
          <div class="col-item">
            <!-- <PCard title="进展动态" icon-class="icon-menu-30" padding="0">
              <Dynamic v-if="renderData" slot="content" />
            </PCard> -->
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Overview from "./components/overview.vue"
// import NoticeList from './components/noticeList.vue'
// import PCard from '@/components/pCard.vue'

export default {
  components: {
    Overview,
    // NoticeList,
    // PCard
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  background: #f2f2f2;
  min-height: calc(100vh - 98px);
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
  .left-wrap {
    width: 75%;
    padding-right: 16px;
  }
  .right-wrap {
    width: 25%;
  }
}
</style>
