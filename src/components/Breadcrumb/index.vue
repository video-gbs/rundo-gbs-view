<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="item in levelList" :key="item.path">
        <a @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      )
      const first = matched[0]
      this.levelList = matched.filter(
        (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
      if (this.$route.query.key === 'edit') {
        this.levelList[1].meta.title = '编辑角色'
      } else if (this.$route.query.key === 'add') {
        this.levelList[1].meta.title = '新建角色'
      } else {
        this.levelList[1].meta.title = this.levelList[1].meta.title
      }
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'workTable'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-breadcrumb__item {
  float: '';
}
::v-deep .el-breadcrumb__inner {
  font-size: 14px;
  font-family: Microsoft YaHei-Regular, Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
  margin: 10px 5px 0 0;
  padding: 0 10px;
}
// ::v-deep  .no-redirect{
//     color:#fff;
//   }
// ::v-deep .el-breadcrumb__separator {
//   display: none;
// }
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  text-align: center;
  padding-left: 8px;
  background: #ffffff;
  box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  // border: 1px solid #eaeaea;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
