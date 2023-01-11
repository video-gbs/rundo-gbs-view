### 入参解析
```
  {
    controls: Array<InputControl | PasswordControl | SelectControl | DateControl>;  // 页面表单控件数组
    bottons?: Array<ButtonControl>; // 按钮控件数组
    layout?: 'vertical' | 'horizontal'; // 布局模式，默认'horizontal'
    layoutConfig?: {
      contentSpan?: number;  // 水平布局模式用，form占比 默认 18
      buttonSpan?: number; //  水平布局模式用，button占比，默认 6
      buttonAlign?: 'left' | 'center' | 'right'; // 按钮对齐方式
    }
  }

```
### CommonControl 

### InputControl 输入框
{
  label: string; // 标题
  key: string; // 控件key值，唯一标识，不用重复
  value: unKnow; // 控件值，类型根据组件来判断，大多数为string，可赋默认值
  initValue?: unknow; // 与value一样，主要用来处理点击重置操作时，默认值
  
}


### 例子
```
  {
    controls: [],
    bottons: this.data.layout === 'vertical' ?
      [
        {
          type: 'default',
          action: 'cancel',
          text: '取消',
        },
        {
          type: 'primary',
          text: '确定',
        },
      ] :
      [
        {
          icon: 'el-icon-search',
          type: 'primary',
          text: '查询',
        },
        {
          icon: 'el-icon-refresh',
          type: 'default',
          action: 'reset',
          text: '重置',
        }
      ],
    layout: 'horizontal', // 布局模式 'vertical' | 'horizontal'
    layoutConfig: {
      contentSpan: 18,
      buttonSpan: 6,
      buttonAlign: 'right'
    }
  }
 
```