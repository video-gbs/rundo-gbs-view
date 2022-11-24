<template>
  <div class="com-seach">
    <div class="seach-content">
      <el-form ref="query" class="seach-form" :inline="true" :model="query" label-width="123px">
        <el-form-item
          v-for="(item, i) in FormList"
          :key="i + '-' + FormList.length"
          :prop="item.poro"
          class="filter-item"
          :label="!item.isLabel ? item.label : ''"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input'"
            v-model="query[item.poro]"
            clearable
            :size="item.size"
            tooltip-effect="dark"
            :placeholder="item.placeholder||'请输入'"
            :style="{ width: item.width || '272px' }"
          />
          <!-- 下拉框 -->
          <el-select
            v-if="item.type === 'select'"
            v-model="query[item.poro]"
            :placeholder="'请选择'"
            clearable
            :size="item.size"
            :style="{ width: item.width || '272px' }"
          >
            <el-option
              v-for="obj in item.optionsList"
              :key="obj.value + FormList.length"
              :label="obj.label"
              :value="obj.value"
            ></el-option>
          </el-select>
          <el-radio-group
            v-if="item.type === 'radio'"
            v-model="query[item.poro]"
            :style="{ width: item.width || '272px' }"
          >
            <el-radio
              v-for="option in item.optionsList"
              :label="option.value"
              :key="option.value + FormList.length"
            >{{ option.label }}</el-radio>
          </el-radio-group>
          <!-- 多选框 {field, label, type, options{value，label} } -->
          <el-checkbox-group
            v-if="item.type === 'checkbox'"
            v-model="query[item.poro]"
            :placeholder="'请选择' + item.label"
            :style="{ width: item.width || '644px' }"
          >
            <el-checkbox
              v-for="(option, i) in item.optionsList"
              :label="option.value || option"
              :name="item.poro"
              :key="i + FormList.length"
            >{{ option.label || option }}</el-checkbox>
          </el-checkbox-group>
          <!-- 级联单选 -->
          <!-- showAll 是否展示路径 optionsList选项内容  checkStrictly是否强链接父子关系  props-->
          <el-cascader
            v-if="item.type === 'cascader'"
            v-model="query[item.poro]"
            :show-all-levels="item.showAll"
            :props="item.propConfig"
            :options="item.options"
            :placeholder="'请选择' + item.label"
          ></el-cascader>
          <!-- 日期时间选择 yyyy-MM-dd-->
          <el-date-picker
            v-if="item.type === 'datePicker'"
            v-model="query[item.poro]"
            :type="item.dateType || 'date'"
            :style="{ width: item.width || '272px' }"
            :placeholder="'请选择'"
            :format="item.fromat || 'yyyy-MM-dd'"
            :value-format="item.valueFromat || 'yyyy-MM-dd'"
            :default-time="item.default"
          ></el-date-picker>

          <!-- 日期时间选择 yyyy-MM-dd-->
          <el-date-picker
            v-if="item.type === 'datePicker1'"
            v-model="query[item.poro]"
            type="date"
            :style="{ width: item.width || '272px' }"
            :placeholder="item.placeholder"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :default-time="item.default"
          ></el-date-picker>
          <!-- 日期时间选择 2022-->
          <el-date-picker
            v-if="item.type === 'dateYearPicker'"
            v-model="query[item.poro]"
            type="year"
            :style="{ width: item.width || '272px' }"
            :placeholder="item.placeholder"
            format="yyyy"
            value-format="yyyy"
            :default-time="item.default"
          ></el-date-picker>
          <!-- 日期时间选择 2021-10-22 00:00:00-->
          <el-date-picker
            v-if="item.type === 'dateTimePicker'"
            v-model="query[item.poro]"
            type="datetime"
            :style="{ width: item.width || '272px' }"
            :placeholder="item.placeholder"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="item.default"
          ></el-date-picker>
          <!-- 时间段选择 -->
          <el-date-picker
            v-if="item.type === 'dateRange'"
            v-model="query[item.poro]"
            type="daterange"
            clearable
            range-separator="-"
            :start-placeholder="item.startPlaceholder"
            :end-placeholder="item.endPlaceholder"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            :style="{ width: item.width || '272px' }"
          ></el-date-picker>
          <!-- 地区选中 -->
          <el-cascader
            v-if="item.type === 'addressCascader'"
            v-model="query[item.poro]"
            :options="item.optionsList"
            clearable
            :size="item.size"
            :disabled="item.disabled"
            :style="{ width: item.width || '272px' }"
            :props="{ ...item.propsConfig }"
            :placeholder="item.placeholder||''"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </div>

    <div class="search-btn" v-if="isSearch">
      <el-button class="cz-btn" @click="submitReset" size="small">重置</el-button>
      <el-button class="cx-btn save_btn" @click="submitSearch" size="small">查询</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "EcologySeach",
  props: {
    // 搜索框
    FormList: {
      // poro字段名字  type类型 width宽度  placeholder提示语  default数据类型
      type: Array,
      default: () => []
    },
    // 表单
    query: {
      type: Object,
      default: () => {}
    },
    isSearch: {
      typeof: Boolean,
      default: () => true
    },
    isMore: {
      typeof: Boolean,
      default: () => false
    }
  },
  data() {
    // 这里存放数据
    return {
      isShow: false,
      arealist: [],
      cityValue: "",
      visible: false,
      curStartYear: "",
      curEndYear: "",
      startPickerOptions: {},
      endPickerOptions: {},
      defaultValue: ""
    };
  },
  computed: {}, // 监听属性 类似于data概念
  watch: {}, // 监控data中的数据变化

  methods: {
    submitSearch() {
      this.$emit("submitSearch", this.query);
    },
    submitReset() {
      this.$nextTick(() => {
        this.$refs.query.resetFields();
      });
      this.$emit("submitReset", this.query);
    },
    areaChange(val) {
      this.query.code = val;
    },
    changeSeach(val) {
      val = !val;
      this.$emit("changeSeach", val);
    },
    changeItem(val) {}
  }
};
</script>
<style lang="scss" scoped>
.com-seach {
  position: relative;
}
.filter-item {
  line-height: 40px;
  font-size: 16px;
  font-family: "SourceHanSansCN-Normal";
  color: rgba(0, 0, 0, 0.65);
  // margin-right: 126px;
  // &:last-child {
  //   margin-right: 0;
  // }
  // &:nth-child(4) {
  //   margin-right: 0;
  // }
  // &:nth-child(7) {
  //   margin-right: 0;
  // }
}
.seach-content {
  overflow: hidden;
}
.search-btn {
  // width: 200px;
  // display: inline-block;
  // width: 100%;
  // padding-right: 40px;
  position: absolute;
  right: 0;
  bottom: 20px;
  text-align: right;
  .span-btn {
    display: inline-block;
    padding-right: 20px;
    cursor: pointer;
    &:hover {
      color: #3a8ee6;
    }
  }
}
// .date-item {
//   height: 42px;
// }
.input-with-select {
  width: 400px;
  .navigation-select {
    width: 100px;
  }
}
</style>
