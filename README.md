# canvas-table
a table component got the highest performance that works on canvas. 🚀

80 columns & 100,000 rows data
![100000*80](./assets/100000*80.gif)

## Feature
* high performance works on canvas. 🚀 
* event support. such as click, mouseenter, mouseleave, etc. ✨
* custom style config. 💄
* custom icon support. 🌚
* tooltip for every component. 🔎
* you can even create your own component to display!!! 💖

>! it's just like a table implement on dom!

## Examples
* basic usage: [click](https://codepen.io/xwinstone/pen/dyMWLgN)
* display 100000 records: [demo](https://codepen.io/xwinstone/pen/abNWrpp)
* load remote data with scroll: [demo](https://codepen.io/xwinstone/pen/MWymdBe)
* fixed header (setting by default, can't change yet)
* fixed columns: [demo](https://codepen.io/xwinstone/pen/XWdRwog)
* grouping table head: [demo](https://codepen.io/xwinstone/pen/yLOXRJd)
* custom style: [demo](https://codepen.io/xwinstone/pen/NWNgOjo)

## Usage
### import
1. use npm
```shell script
npm i x-canvas-table
```

2. use cdn
```html
<script src="https://unpkg.com/x-canvas-table/umd/canvastable.min.js"></script>
```

### basic usage
```html
<div id="container"></div>
```

```js
import CanvasTable from "x-canvas-table";

const columns = [
  {title: 'avatar', dataIndex: 'avatar'},
  {title: 'name',dataIndex: 'name'},
  {title: 'age', dataIndex: 'age'},
  {title: 'address', dataIndex: 'address'}
]
const dataSource = [
  {avatar: '🎅🏻',name: 'chuanJianGuo', age: 74, address: 'America'},
  {avatar: '👵🏻', name: 'caiEnglish', age: 63, address: 'China Taiwan'},
  {avatar: '-',name: 'trump', age: 74, address: 'America'},
  {avatar: '-',name: 'johnson', age: 70, address: 'England'}
]
const ct = new CanvasTable({
  container: document.getElementById('container'),
  columns: columns,
  style: { height: 500, width: '100%' }
})

ct.source = dataSource;
```
result:
![basic usage](./assets/basic-usage.png)

online demo: [click](https://codepen.io/xwinstone/pen/dyMWLgN)

## API
### Table
| Property | Description | Type | Default 
| :----: | :----: | :----: | :----: |
| `container` | Container element for table | `IColumnProps[]` | - |
| `columns` | Columns of table | `IColumnProps[]` | - |
| `source` | Data record array to be displayed | `object[]` | - |
| `style` | Style for table | `ITableStyleProps` | see ITableStyleProps
| `onScrollLoad` | Callback executed when table scroll to bottom(scrollLoadHeight) | `() => Promise<any>` | - |
| `scrollLoadHeight` | distance to trigger onScrollLoad | `number` | 150 |
| `onRow` | Set event props on per row	 | `(record: obj, rowIndex: number) => IEventCollection` | - |
| `iconfont` | iconfont css address | `string` | - |

### IColumn
One of the Table columns prop for describing the table's columns.

| Property | Description | Type | Default 
| :----: | :----: | :----: | :----: |
| `dataIndex` | Display field of the data record | `object[]` | -
| `title` | Title of this column | `string` | - 
| `align` | The specify which way that column is aligned | 'left'&#124;'right' &#124; 'center' | 'left'
| `popTitle` | tooltip for table header cell | `string` | -
| `width` | Width of this column | `number` | 150 | 否
| `children` | Group table head | `IColumn[]` | -
| `fixed` | Set column to be fixed | 'left' &#124; 'right' | - 
| `render` | custom render | (value, record) => string &#124; Layer | - 
| `onCell` | Set event props on per cell | `(record: obj, rowIndex: number) => IEventCollection` | - 
