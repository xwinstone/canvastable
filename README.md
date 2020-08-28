# canvas-table
a table component got the highest performance that works on canvas. 🚀

80 columns & 100,000 rows data
![100000*80](./assets/100000*80.gif)

## Feature
* high performance works on canvas. 🚀 
* event support. such as click, mouseenter, mousemove, etc. ✨
* custom style config. 💄
* custom icon support. 🌚
* tooltip for every component. 🔎
* you can even create your own component to display!!! 💖

>! it's just like a table implement on dom!
>
## Usage
### import
```shell script
npm i x-canvas-table
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
  {avatar: '👵🏻', name: 'caiyinwen', age: 63, address: 'China Taiwan'},
  {avatar: '🎅🏻',name: 'chuanjianguo', age: 74, address: 'America'},
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

## Document

