<template>
  <div id="tags-view-container" class="tags-view-container">
    <scroll-pane
      ref="scrollPane"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <el-tabs
        v-model="activeTabsName"
        type="card"
        closable
        @tab-remove="removeTab"
        @tab-click="tabClick"
      >
        <el-tab-pane
          v-for="item in tabList"
          :key="item.path"
          :label="item.name"
          :name="item.name"
        >
        </el-tab-pane>
      </el-tabs>
    </scroll-pane>
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">刷新</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        关闭
      </li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags(selectedTag)">关闭所有</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "./ScrollPane";
import path from "path";

export default {
  components: { ScrollPane },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      affixTags: [],
      isScrollBar: false
    };
  },
  computed: {
    tabList() {
      return this.$store.state.tabs.tabList;
    },
    activeTabsName: {
      get() {

        return this.$store.state.tabs.activeTabsName;
      },
      set(val) {
        console.log(1111111,val)
        this.$store.commit("activeTabsName", val);
      }
    },
    activeIndex() {
      let temIndex = null;
      this.tabList.forEach((item, index) => {
        if (item.name === this.activeTabsName) {
          temIndex = index;
        }
      });
      return temIndex;
    }
  },
  watch: {},
  mounted() {
    window.addEventListener("resize", () => {
      this.$nextTick(() => {
        this.isScrollBar = this.$refs.scrollPane.isScrollBar();
      });
    });
  },
  methods: {
    removeTab(targetName) {
      const tabs = this.tabList;
      let activeName = this.activeTabsName;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            const nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
        this.$store.commit("activeTabsName", activeName);
        this.$store.commit("tabList",
          tabs.filter(tab => tab.name !== targetName)
        );
        this.tabClick();
      } else {
        this.$store.commit("tabList",
          tabs.filter(tab => tab.name !== targetName)
        );
      }
    },
    tabClick() {
      const { path } = this.tabList[this.activeIndex];
      if (this.$route.path !== path) this.$router.push(path);
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);
            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("tagsView/updateVisitedView", this.$route);
            }
            break;
          }
        }
      });
    },
    refreshSelectedTag(view) {
      this.$store.dispatch("tagsView/delCachedView", view).then(() => {
        const { fullPath } = view;
        this.$nextTick(() => {
          this.$router.replace({
            path: "/redirect" + fullPath
          });
        });
      });
    },
    closeSelectedTag(view) {
      this.$store
        .dispatch("tagsView/delView", view)
        .then(({ visitedViews }) => {
          if (this.isActive(view)) {
            this.toLastView(visitedViews, view);
          }
        });
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store
        .dispatch("tagsView/delOthersViews", this.selectedTag)
        .then(() => {
          this.moveToCurrentTag();
        });
    },
    closeAllTags(view) {
      this.$store.dispatch("tagsView/delAllViews").then(({ visitedViews }) => {
        if (this.affixTags.some(tag => tag.path === view.path)) {
          return;
        }
        this.toLastView(visitedViews, view);
      });
    },
    toLastView(visitedViews, view) {
      const latestView = visitedViews.slice(-1)[0];
      if (latestView) {
        this.$router.push(latestView.fullPath);
      } else {
        // 现在默认是在没有标签视图的情况下重定向到主页，
        // 你可以根据自己的需要进行调整。
        if (view.name === "Dashboard") {
          // 重新加载主页
          this.$router.replace({ path: "/redirect" + view.fullPath });
        } else {
          this.$router.push("/");
        }
      }
    },
    openMenu(tag, e) {
      console.log(tag, e);
      const menuMinWidth = 105;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 15; // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }

      this.top = e.clientY;
      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    handleScroll() {
      this.closeMenu();
    },
    /**
     * @description: 手动触发滚轮滑动方法
     * @param type -1: 左滑动； 1：右滑动
     * @return {*}
     */
    toScrollPane(type) {
      const wheelDelta = 270;
      const deltaY = -225;
      this.$refs.scrollPane.handleScroll({
        wheelDelta: wheelDelta * type,
        deltaY: deltaY * type
      });
    },
    /**
     * @description: 手动切换左右标签页
     * @param {*} type -1：左标签； 1：右标签
     * @return {*}
     */
    toScrollView(type) {
      const tags = this.$refs.tag;
      const currentIndex = tags.findIndex(tag => {
        return tag.to.path === this.$route.path;
      });
      if (type === 1) {
        if (currentIndex + 1 < tags.length) {
          this.$router.push(tags[currentIndex + 1].to);
        }
      } else {
        if (currentIndex > 0) {
          this.$router.push(tags[currentIndex - 1].to);
        }
      }
    }
  }
};
</script>
