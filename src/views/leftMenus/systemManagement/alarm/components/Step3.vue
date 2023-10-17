<template>
  <div class="step1-content" v-if="isShow">
    <div class="search">
      <el-form
        ref="query"
        class="search-form"
        :inline="true"
        label-width="100px"
      >
        <el-form-item label="预按名称:">
          <h3>基本信息</h3>
          <el-input
            v-model="templateName"
            placeholder="请输入"
            clearable
            style="width: 240px"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getTemplateAlarmEventLists,
  addTemplateAlarmEvent,
  editTemplateAlarmEvent,
  deleteTemplateAlarmEvent
} from '@/api/method/alarm'
export default {
  name: '',
  components: {},
  props: [
    'treeList',
    'manufacturerTypeOptions',
    'transportProtocolTypeOptions'
  ],
  data() {
    return {
      templateName:''
    }
  },
  mounted() {
    // this.getAllGatewayLists()
  },
  methods: {
    async getAllGatewayLists() {
      await getAllGatewayLists().then((res) => {
        if (res.data.code === 0) {
          res.data.data.map((item) => {
            let obj = {}
            obj.label = item.name
            obj.value = item.id
            obj.protocol = item.protocol
            this.allNorthTypeOptions.push(obj)
          })
        }
      })
    },
    next() {
      if (this.active++ > 2) this.active = 0
    },
    goback() {
      this.$emit('changeIsShow', false)
    }
  }
}
</script>


<style lang="scss" scoped>

  .search {
    width: calc(100% - 40px);
    height: 80px;
    margin: 20px;
    background: #ffffff;
    box-shadow: 0px 1px 2px 1px rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    .search-form {
      padding-top: 25px;
   }
  }

</style>
