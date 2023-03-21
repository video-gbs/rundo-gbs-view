<template>
  <div class="transfer-container">
    <el-transfer
      v-model="value"
      filterable
      :filter-method="filterMethod"
      :right-default-checked="data.rightDefaultChecked || []"
      filter-placeholder="输入进行筛选"
      :titles="data.titles || ['待选列表', '已选列表']"
      :data="data.options"
    />
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: {
        options: [],
        value: []
      }
    }
  },
  data() {
    return {
      value: []
    }
  },
  created() {
    this.value = JSON.parse(JSON.stringify(this.data.value))

    this.data.getData = () => {
      return this.value
    }
  },
  methods: {
    filterMethod(keyword, item) {
      return item.label.includes(keyword)
    }
  }
}
</script>

<style lang="scss" scoped></style>
