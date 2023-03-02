<template>
  <div class="p-input-region">
    <el-select
      v-model="regionForm.province.code"
      class="p-item"
      :disabled="provinceDisabled"
      clearable
      placeholder="请选择"
      @change="provinceChange"
    >
      <el-option
        v-for="item in regionOptions.province"
        :key="item.areaCode"
        :label="item.shortName"
        :value="item.areaCode.toString()"
      />
    </el-select>
    <el-select
      v-model="regionForm.city.code"
      class="p-item"
      :disabled="cityDisabled"
      clearable
      placeholder="请选择"
      @change="cityChange"
    >
      <el-option
        v-for="item in regionOptions.city"
        :key="item.areaCode"
        :label="item.shortName"
        :value="item.areaCode.toString()"
      />
    </el-select>
    <el-select
      v-model="regionForm.district.code"
      class="p-item"
      :disabled="districtDisabled"
      clearable
      placeholder="请选择"
      @change="districtChange"
    >
      <el-option
        v-for="item in regionOptions.district"
        :key="item.areaCode"
        :label="item.shortName"
        :value="item.areaCode.toString()"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'PInputRegion',
  //   model: {
  //     prop: 'value',
  //     event: 'change'
  //   },
  props: {
    value: {
      type: Array,
      default: () => ['', '', '']
    },
    provinceDisabled: {
      type: Boolean,
      default: false
    },
    cityDisabled: {
      type: Boolean,
      default: false
    },
    districtDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      parentCode: '100000', // 全国
      regionOptions: {
        province: [
          {
            areaCode: 450000,
            childList: null,
            cityLv: '1',
            id: 2163,
            name: '广西壮族自治区',
            parentCode: '100000',
            shortName: '广西',
            telCode: ''
          }
        ],
        city: [],
        district: []
      },
      regionForm: {
        province: {
          code: '450000',
          name: '广西'
        },
        city: {
          code: '',
          name: ''
        },
        district: {
          code: '',
          name: ''
        }
      },
      changeStatus: false
    }
  },
  watch: {
    value: {
      handler(n, o) {
        if (!this.changeStatus) {
          this.initData()
        }
      },
      deep: true
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    // 默认省份为广西，不做选择
    if (!this.provinceDisabled) {
      this.getRegion(this.parentCode, 'province')
    } else if (!this.cityDisabled) {
      this.getRegion(this.regionForm.province.code, 'city')
    } else if (!this.districtDisabled) {
      this.getRegion(this.regionForm.city.code, 'district')
    }
  },
  methods: {
    initData() {
      const keys = Object.keys(this.regionForm)
      keys.forEach((key, index) => {
        this.regionForm[key].code = this.value[index]
        if (index > 0) {
          if (this.regionForm[keys[index - 1]].code) {
            this.getRegion(this.regionForm[keys[index - 1]].code, key)
          }
        }
      })
    },
    getRegion(parentCode, key) {
      const form = {
        pageNum: 1,
        pageSize: 999,
        parentCode
      }
      this.$api.areas.lazyTree(form).then((res) => {
        if (res.data.data) {
          const { rows } = res.data.data
          this.regionOptions[key] = rows
        }
      })
    },
    regionChange() {
      //   const regions = this.regionForm.map(item => {
      //     return item.code
      //   })
      const regions = []
      const regionForm = this.regionForm
      for (const key in regionForm) {
        regions.push(regionForm[key].code)
      }
      this.changeStatus = true
      this.$emit('input', regions)
      this.changeStatus = false
    },
    provinceChange(val) {
      this.setRegionName('province', val)
      if (this.regionForm.city.code) {
        this.regionForm.city.code = ''
      } else {
        this.regionChange()
      }
      this.getRegion(val, 'city')
    },
    cityChange(val) {
      this.setRegionName('city', val)
      if (this.regionForm.district.code) {
        this.regionForm.district.code = ''
      } else {
        this.regionChange()
      }

      this.getRegion(val, 'district')
    },
    districtChange(val) {
      this.setRegionName('district', val)
      this.regionChange()
    },
    setRegionName(key, code) {
      let name = ''
      if (this.regionOptions[key] && this.regionOptions[key].length > 0) {
        this.regionOptions[key].forEach((item) => {
          if (item.areaCode == code) {
            name = item.shortName
          }
        })
      }
      this.regionForm[key].name = name
    },
    getRegionName() {
      const names = []
      const regionForm = this.regionForm
      for (const key in regionForm) {
        names.push(regionForm[key].name)
      }
      return names.toString()
    }
  }
}
</script>

<style lang="scss" scoped>
.p-input-region {
  width: 100%;
  display: flex;
  align-items: center;
  .p-item {
    flex: 1;
    margin-left: 1rem;
    &:first-child {
      margin-left: 0;
    }
  }
}
</style>
