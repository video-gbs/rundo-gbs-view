<template>
  <div id="mapContainerTest"></div>
</template>

<script>
import * as Run3D from '@rjgf/run3d'
export default {
  name: 'App',
  mounted() {
    this.initMap()
  },
  methods: {
    initMap() {
      console.log('Run3DRun3DRun3DRun3DRun3D', Run3D)
      let map = new Run3D.Map()
      map.createMap('', 'mapContainerTest', {})
      //创建高德在线地图图层
      let gdOnlineMap = new Run3D.UrlTemplateImageLayer({
        url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', //高德地图
        minimumLevel: 0,
        maximumLevel: 23
      })
      map.layers.addRaster(gdOnlineMap)
    }
  }
}
</script>

<style lang="scss" scoped>
#mapContainerTest{
  height: 100%;
  width: 100%;
}
</style>
