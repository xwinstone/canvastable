# canvas-table

a table that display mass of data for web with fastest speed. 🚀

# Usage
## basic usage
```html
<div id="container"></div>

```
```js
const columns = [
  {title: 'avatar', dataIndex: 'avatar'},
  {title: 'name',dataIndex: 'name'},
  {title: 'age', dataIndex: 'age'},
  {title: 'address', dataIndex: 'address'}
]
const dataSource = [
  {avatar: '👵🏻', name: 'caiyinwen', age: 63, address: 'China Taiwan'},
  {avatar: '🎅🏻',name: 'chuanjianguo', age: 74, address: 'America'},
  {avatar: '-',name: 'trump', age: 74, address: 'America'},
  {avatar: '-',name: 'johnson', age: 70, address: 'England'}
]
const ct = new CanvasTable({
  container: document.getElementById('container'),
  columns: columns,
  dataSource: dataSource,
  style: { height: 500, width: '100%' }
})

ct.source = dataSource;
```

## API
### Table
| 属性名 | 描述 | 类型 | 默认值 | 必填项
| :----: | :----: | :----: | :----: | :----: |
| `columns` | 表格列的配置描述，具体项见下表 | `IColumnProps[]` | - | 是
| `dataSource` | 数据数组	 | `object[]` | - | 否
| `style` | 表格自定义样式 | `ITableStyleProps` | 见下表 | 是
| `onScrollLoad` | 滚动加载数据的函数 | `() => Promise<any>` | - | 否
| `scrollLoadHeight` | 滚动加载离底部的距离 | `number` | 150 | 否
| `onRow` | 设置行事件 | `(record: obj, rowIndex: number) => IEventCollection` | - | 否
| `iconfont` | iconfont css地址 | `string` | - | 否

### onRow
用于行的事件绑定, 同样适用于`onCell`, `onRow`。

```jsx harmony
<ReactCanvasTable
  onRow={(record, rowIndex) => {
    return {
      onClick: event => {}, // 点击行
      onDoubleClick: event => {}, // 双击行
      onContextMenu: event => {}, 
      onMouseEnter: event => {}, // 鼠标移入行
      onMouseLeave: event => {},
    };
  }}
/>
```

### IColumn
列描述数据对象，是 columns 中的一项。

| 属性名 | 描述 | 类型 | 默认值 | 必填项
| :----: | :----: | :----: | :----: | :----: |
| `dataIndex` | 列数据在数据项中对应的 key	 | `object[]` | - | 是
| `title` | 列头显示文字 | `string` | 见下表 | 是
| `align` | 设置列的对齐方式	 | 'left'&#124;'right' &#124; 'center' | 'left' | 否
| `popTitle` | 鼠标停留气泡显示列头全部文字	 | `string` | - | 否
| `width` | 列宽 | `number` | 150 | 否
| `children` | 表头分组时的下级表头 | `IColumn[]` | - | 否
| `fixed` | 列是否固定 | 'left' &#124; 'right' | - | 否
| `render` | 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据 | (value, record) => 'string' &#124; Layer | - | 否
| `onCell` | 设置单元格事件	 | `(record: obj, rowIndex: number) => IEventCollection` | - | 否

### ITableStyleProps
表格自定义样式

| 属性名 | 描述 | 类型 | 默认值 | 必填项
| :----: | :----: | :----: | :----: | :----: |
| `width` | 表格宽度, 数字或者百分比(需要设置父元素高度) | number &#124; string | `100%` | 否
| `height` | 表格高度, 数字或者百分比(需要设置父元素高度) | number &#124; string | `100%` | 否
| `rowHeight` | 行高	 | `number` | `55` | 否
| `columnWidth` | 统一列宽 | `number` | `150` | 否
| `borderColor` | 边框颜色 | `string` | `'#e8e8e8'` | 否
| `textColor` | 文字颜色 | `string` | `'rgba(0,0,0,0.65)'` | 否
| `fontSize` | 字体大小 | `string` | `14px` | 否
| `fontFamily` | 字体 | `string` | - | 否
| `padding` | 单元格左右的padding | `number` | `16` | 否
| `headerBackColor` | 表头背景颜色	 | `string` | `'#fafafa'` | 否
| `headerRowHeight` | 表头行高	 | `number` | `55` | 否
