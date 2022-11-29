<template>
  <div class="router_container2 m20 bg-w">
    <div class="panel-header-box">
      <div class="title-css">问政转移审核列表</div>
    </div>
    <div class="p20">
      <PControlGroup v-if="queryControlData" :data="queryControlData" @onBtnClick="queryData"></PControlGroup>
    </div>
  </div>
</template>

<script>
import PControlGroup from '@/components/PControlGroup';

export default {
  data() {
    return {
      queryControlData: null,
    };
  },
  components: {
    PControlGroup
  },
  created() {
    this.initQueryControl();
  },
  methods: {
    initQueryControl() {
      this.queryControlData = {
        controls: [
          {
            label: '标题',
            type: 'input',
            key: 'f1',
            span: 6,
            value: '',
          },
          {
            label: '分类',
            type: 'input',
            key: 'f2',
            span: 6,
            value: '',
          },
          {
            label: '领域',
            type: 'select',
            key: 'f3',
            span: 6,
            value: '',
            options: [
              { label: 'xxxx', value: '1' },
              { label: 'xxxx', value: '2' },
            ],
          },
          {
            label: '留言对象',
            type: 'select',
            key: 'f4',
            span: 6,
            value: '',
            options: [
              { label: 'xxxx', value: '1' },
              { label: 'xxxx', value: '2' },
            ],
          },
          {
            label: '申请单位',
            type: 'select',
            key: 'f5',
            span: 6,
            value: '',
            options: [
              { label: 'xxxx', value: '1' },
              { label: 'xxxx', value: '2' },
            ],
          },
          {
            label: '发布账号',
            type: 'input',
            key: 'f6',
            span: 6,
            value: '',
          },
          {
            label: '电话',
            type: 'input',
            key: 'f7',
            span: 6,
            value: '',
          },
          {
            label: '提交时间',
            type: 'date',
            dateType: 'daterange',
            key: 'f8',
            span: 6,
            value: '',
          },
        ],
        layoutConfig: {
          contentSpan: 20,
          buttonSpan: 4,
        }
      };
    },
    queryData(data) {
      console.log(data);
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
