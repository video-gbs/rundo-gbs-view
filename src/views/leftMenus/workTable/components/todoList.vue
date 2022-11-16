<template>
  <div class="todo-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <svg-icon icon-class="dbsx" class="dbsx_svg"/>
        <span>待办事项</span>
      </div>
      <div class="text item">
        <LineFont :lineTitle="lineTitle"/>
        <ul class="todo-ul-scoll">
          <li v-for="(item, index) in noticeList" :key="index">
            <LineFont :lineTitle="item.name"/>
            <div class="type" :data-index="index">{{ item.num }}</div>
          </li>
        </ul>
      </div>

      <div class="text item">
        <LineFont :lineTitle="lineTitle1"/>
        <ul class="todo-ul-scoll">
          <li v-for="(item1, index) in noticeList1" :key="index">
            <LineFont :lineTitle="item1.name"/>
            <div class="type" :data-index="index">{{ item1.num }}</div>
          </li>
        </ul>
      </div>
    </el-card>
  </div>
</template>

<script>
import LineFont from '@/components/LineFont'
export default {
  name: "",
  components: {
      LineFont
  },
  data() {
    return {
      lineTitle:{
        title:'问政待办',
        notShowSmallTitle:false
      },
      lineTitle1:{
        title:'综合处理',
        notShowSmallTitle:false
      },
      noticeList:[
        {
          name:{title:'1111',notShowSmallTitle:false},
          num:11,
        },
        {
          name:{title:'1111',notShowSmallTitle:false},
          num:11,
        },
        {
          name:{title:'1111',notShowSmallTitle:false},
          num:11,
        },
        {
          name:{title:'1111',notShowSmallTitle:false},
          num:11,
        },
        {
          name:{title:'1111',notShowSmallTitle:false},
          num:11,
        },
         {
          name:{title:'1111',notShowSmallTitle:false},
          num:11,
        }
      ],
      noticeList1:[
        {
          name:{title:'1111',notShowSmallTitle:false},
          num:11,
        },
        {
          name:{title:'1111',notShowSmallTitle:false},
          num:11,
        },
      ]
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.todo-container {
  .clearfix{
    height:80px;
    line-height:80px;
    .dbsx_svg{
      width:1.5rem;
      height:1.5rem;
      position:relative;
      top:5px;
      left:-3px;
    }
  }
  .todo-ul-scoll{
    display:flex;
    flex-wrap:wrap;
    justify-content: flex-start;
  }
  .todo-ul-scoll>li{
    width: 240px;
    margin:10px 2rem;
    height: 108px;
    background: rgba(0, 0, 0, 0.1000);
    box-shadow: 0px 1px 2px 1px rgba(0,0,0,0.1);
    .type{
      margin-left:20px;
    }
  }
}
</style>
