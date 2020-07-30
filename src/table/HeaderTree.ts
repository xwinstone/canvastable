import {Component} from "../component/Component";
import {ICanvasTable} from "../typings/CanvasTable";
import ITableHeaderProps = ICanvasTable.ITableHeaderProps;
import HeaderTreeNode from "./HeaderTreeNode";
import IColumn = ICanvasTable.IColumn;
import {isEmpty} from "../utils/utils";
import {treeBFEach, treeEach, treeGetLeaf} from "../utils/tree";
import {Column} from "./Column";
import {drawLine, drawRect} from "../utils/draw";

export class HeaderTree extends Component {
  constructor(private props: ITableHeaderProps) {
    super();
    const columnsProps = columnsPropsRearrange(props.colProps);
    this.columnsInit(columnsProps);
    this.cellNodesInit(columnsProps)
  }
  // 列配置的叶子节点是控制列的关键(除了锁列属性之外), 所以这四条属性都是叶子节点对应的列
  columns: Column[] = [];
  leftColumns: Column[] = [];
  rightColumns: Column[] = [];
  notFixedColumns: Column[] = [];
  /*
   * 列处理规则:
   * 1. title属性每层都生效
   * 2. fixed字段只能在第一层设置, 子节点会自动继承
   * 3. align都可以设置, 没设置会继承父节点
   * 4. 其他所有属性只有在叶子节点设置才会生效
   */
  columnsInit ({fixedLeft, notFixed, fixedRight}: {[key:string]: IColumn[]}) {
    // 初始化列
    let colIndex = 0;
    const propsArr = [fixedLeft, notFixed, fixedRight];
    const colArr = [this.leftColumns, this.notFixedColumns, this.rightColumns];
    // 所有表头单元格继承第一层的fixed属性
    [...fixedLeft, ...fixedRight, ...notFixed].forEach(rootCol => {
      treeEach(rootCol, (colProps) => {
        colProps.fixed = rootCol.fixed
      })
    });
    propsArr.forEach((colProps, i) => {
      treeGetLeaf(colProps).forEach(prop => {
        colArr[i].push(
          new Column({
            ...prop,
            table: this.props.table,
            index: colIndex++
          })
        )
      })
    });
    this.columns = [...this.leftColumns, ...this.notFixedColumns, ...this.rightColumns];
  }

  deep: number = 1; // 深度
  rootCells: HeaderTreeNode[] = []; // 第一层的cells
  leafCells: HeaderTreeNode[] = []; // 叶子层的cells
  cellNodesInit({fixedLeft, notFixed, fixedRight}: {[key:string]: IColumn[]}) {
    const propsQueue = [...fixedLeft, ...notFixed, ...fixedRight];
    const PARENT_KEY = '__PARENT__';
    let node: HeaderTreeNode = null;
    const table = this.table;

    while (propsQueue[0]) {
      const currProps = propsQueue.shift();
      node = new HeaderTreeNode({
        colProps: currProps,
        popTitle: currProps.popTitle,
        parent: currProps[PARENT_KEY],
        table: table,
        ctx: table.ctx,
        style: {
          padding: [0, table.style.padding]
        }
      });
      if (isEmpty(currProps[PARENT_KEY])) {
        this.rootCells.push(node)
      }
      delete currProps[PARENT_KEY];

      if (Array.isArray(currProps.children)) {
        propsQueue.push(...currProps.children.map(child => {
          return {
            [PARENT_KEY]: node,
            ...child
          }
        }));
      }
    }

    if (node) {
      this.deep = node.treeHeight
    }
    this.leafCells = treeGetLeaf(this.rootCells, 'childrenCell');
  }

  get cells () {
    let cells: HeaderTreeNode[] = [];
    treeBFEach(this.rootCells, cell => cells.push(cell), 'childrenCell');
    return cells;
  }

  top: number = 0;
  get width () {
    return this.table.width
  }
  get height () {
    return this.deep * this.table.style.headerRowHeight
  };
  get table () {
    return this.props.table
  }

  render () {
    if (isEmpty(this.rootCells)) {
      return
    }
    const ctx = this.table.ctx;

    drawRect(ctx,0, 0, this.table.style.width, this.height, this.table.style.headerBackColor);
    drawLine(ctx, 0, this.height - 1, this.table.style.width, this.height - 1);
    const fixLeftCells = this.rootCells.filter(cell => cell.fixed === 'left');
    const fixRightCells = this.rootCells.filter(cell => cell.fixed === 'right');
    const notFixedCells = this.rootCells.filter(cell => cell.fixed !== 'left' && cell.fixed !== 'right');
    ctx.save();
    ctx.beginPath();

    let leftWidth = fixLeftCells.reduce((pre, curr) => pre + curr.width, 0);
    let centerWidth = notFixedCells.reduce((pre, curr) => pre + curr.width, 0);
    // let rightWidth = notFixedCells.reduce((pre, curr) => pre + curr.width, 0);
    ctx.rect(leftWidth, 0, centerWidth, this.height);
    ctx.clip();
    treeBFEach(notFixedCells, cell => cell.innerRender(), 'childrenCell');
    ctx.restore();

    treeBFEach(fixLeftCells, cell => cell.innerRender(), 'childrenCell');
    treeBFEach(fixRightCells, cell => cell.innerRender(), 'childrenCell');
  }
}

function columnsPropsRearrange (colProps: IColumn[]) {
  // 根据锁列的配置整理列的顺序
  const fixedLeft = colProps
    .filter(col => col.fixed === 'left')
    .map((col, i) => {
      return {...col, fixedIndex: i}
    });
  const fixedRight = colProps
    .filter(col => col.fixed === 'right')
    .map((col, i) => {
      return {...col, fixedIndex: i}
    });
  const notFixed = colProps.filter(col => !['left', 'right'].includes(col.fixed));

  return {fixedLeft, notFixed, fixedRight}
}
