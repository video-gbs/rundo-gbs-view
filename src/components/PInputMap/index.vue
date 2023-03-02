<template>
  <div class="p-input-map">
    <el-input
      v-if="isInput"
      v-model="inputVal"
      :readonly="readonly"
      placeholder="请选择"
    />
    <el-button class="btn" type="theme" size="small" @click="handleClick">{{
      title
    }}</el-button>
    <PDialog ref="dialog" :title="title" :width="width" @submit="submitForm()">
      <template slot="main">
        <div :style="{ height: height }">
          <PMap
            ref="map"
            class="map"
            height="100%"
            :map-key="mapKey"
            :is-polygon="inputMapType === 'polygon'"
            :is-marker="inputMapType === 'marker'"
            :map-type="mapType"
            :controls="controls"
            @init="handleOpen"
            @onMarker="onMarker"
          />
        </div>
      </template>
    </PDialog>
  </div>
</template>
<script>
import PMap from '@/components/PMapLand'
import PDialog from '@/components/PDialog'
export default {
  name: 'PInputMap',
  components: {
    PMap,
    PDialog
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    readonly: {
      type: Boolean,
      default: true
    },
    isInput: {
      type: Boolean,
      default: true
    },
    polygonOptions: {
      type: Object,
      default: () => {}
    },
    inputMapType: {
      type: String,
      default: 'marker'
    },
    mapKey: {
      type: String,
      default: ''
    },
    mapType: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: '地图定位'
    }
  },
  data() {
    return {
      isVisible: false,
      buttonLoading: false,
      points: [],
      form: {},
      width: this.initWidth(),
      height: this.initHeight(),
      initMapStatus: false,
      controls: ['Zoom']
    }
  },
  computed: {
    inputVal() {
      return this.value
    }
  },
  watch: {
    isVisible(val) {
      if (!val) {
        this.$refs.map.delPolygon()
        // this.$refs.map.remove_overlay()
      }
    }
  },
  created() {
    // this.initData()
    window.onresize = () => {
      return (() => {
        this.width = this.initWidth()
        this.height = this.initHeight()
      })()
    }
  },
  methods: {
    /**
     * 配置弹窗宽度
     */
    initWidth() {
      this.screenWidth = document.body.clientWidth
      if (this.screenWidth < 991) {
        return '90%'
      } else if (this.screenWidth < 1400) {
        return '80%'
      } else {
        return '1200px'
      }
    },
    initHeight() {
      this.screenHeight = document.body.clientHeight
      if (this.screenHeight < 900) {
        return 'calc((100vh - 200px) * 0.9)'
      } else if (this.screenHeight < 1200) {
        return 'calc((100vh - 200px) * 0.8)'
      } else {
        return '800px'
      }
    },
    initData() {
      if (this.value) {
        this.points = JSON.parse(this.value)
      }
    },
    submitForm() {
      if (this.inputMapType === 'polygon') {
        this.points = this.$refs.map.getPoints()
      }
      // this.form = {
      //   fench: this.points
      // }
      this.$emit('change', JSON.stringify(this.points))
      // this.isVisible = false;
      this.$refs.dialog.hide()
    },
    handleClick() {
      if (this.value) {
        this.points = JSON.parse(this.value)
      }
      // this.isVisible = true
      this.$refs.dialog.show()
      if (this.initMapStatus) {
        if (this.points && this.points.length > 0) {
          // this.$refs.map.initPolygon(this.points)

          switch (this.inputMapType) {
            case 'marker':
              if (this.isInput) {
                this.$refs.map.addOverLay(this.points[0], this.points[1])
              } else {
                this.$refs.map.addMarker({
                  lng: this.points[0],
                  lat: this.points[1]
                })
              }
              break
            case 'polygon':
              if (this.isInput) {
                this.$refs.map.initPolygon(this.points)
              } else {
                this.$refs.map.addPolygon(this.points)
              }
              break
            default:
              break
          }
          this.setCenter(this.points)
        }
      }
    },
    handleOpen() {
      if (this.points && this.points.length > 0) {
        switch (this.inputMapType) {
          case 'marker':
            if (this.isInput) {
              this.$refs.map.addOverLay(this.points[0], this.points[1])
            } else {
              this.$refs.map.addMarker({
                lng: this.points[0],
                lat: this.points[1]
              })
            }
            break
          case 'polygon':
            if (this.isInput) {
              this.$refs.map.initPolygon(this.points)
            } else {
              this.$refs.map.addPolygon(this.points)
            }
            break
          default:
            break
        }
        this.setCenter(this.points)
      }
      this.initMapStatus = true
    },
    onMarker({ lng, lat }) {
      this.points = [lng, lat]
    },
    getCenterPoint(data) {
      var lng = 0.0
      var lat = 0.0
      for (var i = 0; i < data.length; i++) {
        lng = lng + parseFloat(data[i]['lng'])
        lat = lat + parseFloat(data[i]['lat'])
      }
      lng = lng / data.length
      lat = lat / data.length
      return {
        lng: lng,
        lat: lat
      }
    },
    setCenter(data, zoom = 18) {
      let lng, lat
      switch (this.inputMapType) {
        case 'marker':
          lng = data[0]
          lat = data[1]
          break
        case 'polygon':
          lng = this.getCenterPoint(data).lng
          lat = this.getCenterPoint(data).lat
          break
        default:
          break
      }
      const center = { lng, lat }
      this.$refs.map.centerAndZoom({ center, zoom })
    }
  }
}
</script>
<style lang="scss" scoped>
.p-input-map {
  display: flex;
  align-items: center;
  .btn {
    margin-left: 12px;
    // height: 32px;
  }
  .map {
    width: 100%;
    height: 100%;
  }
}
</style>
