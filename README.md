# canvas-table
a table component got the highest performance that works on canvas! 🚀

14.7kb gizped, no dependency!

80 columns & 100,000 rows data:

![100000*80](./assets/100000*80.gif)

## Feature
* high performance works on canvas. 🚀
* event support. such as click, mouseenter, mouseleave, etc. ✨
* custom style config. 💄
* custom icon support. 👍
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
* render icon component: [demo](https://codepen.io/xwinstone/pen/ExKwzvY)

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
| `container` | Container element for table | `HTMLElement` | - |
| `columns` | Columns of table | `IColumnProps[]` | - |
| `source` | Data record array to be displayed | `object[]` | - |
| `style` | Style for table | `ITableStyleProps` | see ITableStyleProps
| `onScrollLoad` | Callback executed when table scroll to bottom(scrollLoadHeight) | `() => Promise<any>` | - |
| `scrollLoadHeight` | distance to trigger onScrollLoad | `number` | 150 |
| `onRow` | Set event props on per row	 | `ITableEventHandler` | - |
| `iconUrl` | icon font css address | `string` | - |
| `iconFontName` | font family | `string` | - |

### IColumn
One of the Table columns prop for describing the table's columns.

| Property | Description | Type | Default 
| :----: | :----: | :----: | :----: |
| `dataIndex` | Display field of the data record | `object[]` | -
| `title` | Title of this column | `string` | - 
| `align` | The specify which way that column is aligned | 'left'&#124;'right' &#124; 'center' | 'left'
| `popTitle` | tooltip for table header cell | `string` | -
| `width` | Width of this column | `number` | 150 
| `children` | Group table head | `IColumn[]` | -
| `fixed` | Set column to be fixed | 'left' &#124; 'right' | - 
| `render` | custom render | (value, record) => string &#124; Layer | - 
| `onCell` | Set event props on per cell | `ITableEventHandler` | - 

### ITableStyleProps
You can custom your table style use this prop

| Property | Description | Type | Default 
| :----: | :----: | :----: | :----: |
| `width` | width of table | number &#124; string | `100%` 
| `height` | height of table | number &#124; string | `100%` 
| `rowHeight` | height of each row | `number` | `55` 
| `columnWidth` | default width of all columns | `number` | `150` 
| `borderColor` | color of border | `string` | `'#e8e8e8'` 
| `textColor` | color of text | `string` | `'rgba(0,0,0,0.65)'` 
| `fontSize` | font size | `string` | `14px` 
| `fontFamily` | font family | `string` | - 
| `padding` | both left and right padding of table cell | `number` | `16` 
| `headerBackColor` | background color of header cell | `string` | `'#fafafa'` 
| `headerRowHeight` | height of header cell | `number` | `55` 

### onRow usage
Event binding, same as `onRow` and `onCell`
```ts
interface ITableEventHandler {
    (record: object, rowIndex: number): {
        onClick?: (event) => void,       // onClick Event
        onDoubleClick?: (event) => void, // Double Click
        onContextMenu?: (event) => void, // Right click Event
        onMouseEnter?: (event) => void,  // Mouse Enter
        onMouseLeave?: (event) => void,  // Mouse Leave
    }
}
```
```js
// Example:
new CanvasTable({
    onRow: (record, rowIndex) => {
        onClick: () => { alert(`${rowIndex} row clicked`) }
    }
})
```

### Layer Component
it's the basic component in canvas table. you can think it as a div in HTML,
it usually used on `render` property of `IColumn` interface.
you can use it to build a complex component to render.

let's see what we can do.

| Property | Description | Type | Default 
| :----: | :----: | :----: | :----: |
| `style` | style of layer | `ILayerStyleProps` | -
| `event` | event on layer | `IEventCollection` | - 
| `popTitle` | set title attribute a canvas element | `string` | -
| `children` | children of layer | `Layer[]` | -

#### ILayerStyleProps
if you know css, you will know how to use it immediately.
```ts
interface ILayerStyleProps {
  top?: number // assume it's top attribute and when position: absolute
  left?: number // assume it's left attribute and when position: absolute
  width?: number | string // number for px, string for percentage of parent
  height?: number | string  // number for px, string for percentage of parent
  padding?: number | number[]  // same as css
  color?: string               // same as css
  backgroundColor?: string;    // same as css
  border?: string | string[]   // same as css
  fontFamily?: string          // same as css
  fontSize?: string            // same as css
  fontWeight?: 'normal' | 'bold' 
  zIndex?: number              // same as css
  align?: 'left' | 'center' | 'right'
  overflow?: 'hidden' | 'ellipsis'
}
```

> example creating complex render: [demo](https://codepen.io/xwinstone/pen/Rwajgqe)

> the following components is all derived from Layer.

### Icon Component

it's provide `iconUrl` and `iconFontName` two props and Icon component to support rendering css font icon,
`iconUrl` indicates a css url, `iconFontName` means the icon font family.

#### How to use?

step 1: import Icon component
```js
const { Icon } = CanvasTable
```
step 2: use render property in columns 
```js
const columns = [
  {
    title: 'Action',
    render: () => {
      return new Icon({
        content: 'f000', // icon class's attribute content
        style: { fontSize: '1.5em', top: 0, left: 0, width: 50, color: '#1890ff'},
        event: {
          onClick: () => {
            alert('button click')
          }
        }
      })
    }
  }
]
```

step 3: set `iconFontName` and `iconUrl`.
let's take font-awesome:
```css
@font-face {
  font-family: 'FontAwesome'; // THIS IS iconFontName
  src: url('../fonts/fontawesome-webfont.eot?v=4.7.0');
  font-weight: normal;
  font-style: normal;
}
.fa-glass:before {
  content: "\f000"; // THIS IS content property of Icon Component
}
```

```js
new CanvasTable({
  iconUrl: '//stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.css',
  iconFontName: 'FontAwesome'
})
```

> full example: [demo](https://codepen.io/xwinstone/pen/ExKwzvY)

### Text Component

| Property | Description | Type | Default 
| :----: | :----: | :----: | :----: |
| `text` | text to show | `string` | -
