import {ICanvasTable} from "../typings/CanvasTable";

type IColumnProps = ICanvasTable.IColumnProps;

export class Column {
  constructor(private props: IColumnProps) {
  }

  get align () {
    return this.props.align || 'left'
  }

  get width () {
    return this.props.width || this.table.style.columnWidth
  }

  get left () {
    return this.table.header.leafCells[this.index].left
  }

  get index () {
    return this.props.index
  }

  get fixedIndex () {
    return this.props.fixedIndex
  }

  get name () {
    return this.props.dataIndex || this.props.key
  }
  get title () {
    return this.props.title
  }
  get key () {
    return this.props.key || this.props.dataIndex
  }
  get table () {
    return this.props.table
  }

  get fixed () {
    return this.props.fixed
  }

  get isRender () {
    return !(this.left + this.width < 0 || this.left > this.table.style.width)
  }

  get customRender () {
    return this.props.render
  }

  get onCell () {
    return this.props.onCell
  }

}
