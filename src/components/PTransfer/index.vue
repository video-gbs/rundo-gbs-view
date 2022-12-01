<template>
  <div class="transfer-container">
    <el-transfer
      filterable
      :filter-method="filterMethod"
      filter-placeholder="输入进行筛选"
      v-model="value"
      :titles="['待选列表', '已选列表']"
      :data="data.options">
    </el-transfer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: []
    };
  },
  props: {
    data: {
      type: Object,
      default: {
        options: [],
        value: [],
      },
    },
  },
  created() {
    this.value = JSON.parse(JSON.stringify(this.data.value));

    this.data.getData = () => {
      return this.value;
    }
  },
  methods: {
    filterMethod(keyword, item) {
      return item.label.includes(keyword);
    }
  }
};
</script>

<style lang="scss" scoped></style>
