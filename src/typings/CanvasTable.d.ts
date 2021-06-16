import CanvasTable from "../core/CanvasTable";
import {Column} from "../table/Column";
import HeaderTreeNode from "../table/HeaderTreeNode";
import {BodyRow} from "../table/BodyRow";
import Layer from "../component/Layer";
import {IComponent} from "./Component";
import {obj} from "./common";

export declare module ICanvasTable {
  type ILayerProps = IComponent.ILayerProps;
  type IEventCollection = IComponent.IEventCollection;

  interface ITableStyle {
    width?: number
    height?: number
    rowHeight?: number
    columnWidth?: number
    borderColor?: string
    textColor?: string
    fontSize?: string
    fontFamily?: string
    headerBackColor? : string
    headerRowHeight? : number
    padding?: number  // left and right padding of table's cell
  }

  interface ITableStyleProps {
    width?: number | string
    height?: number | string
    rowHeight?: number
    columnWidth?: number
    borderColor?: string
    textColor?: string
    fontSize?: string
    fontFamily?: string
    headerBackColor? : string
    headerRowHeight? : number
    padding?: number  // left and right padding of table's cell
  }

  interface ITableEventHandler {
    (record: obj, rowIndex: number): IEventCollection
  }

  // interface ITableEventCollection {
  //   onClick?: (record, rowIndex) => void, // 点击行
  //   onDoubleClick?: (record, rowIndex) => void,
  //   onContextMenu?: (record, rowIndex) => void,
  //   onMouseEnter?: (record, rowIndex) => void, // 鼠标移入行
  //   onMouseLeave?: (record, rowIndex) => void,
  // }

  interface IColumn {
    dataIndex: string
    key?: string
    title?: string | (() => Layer)
    popTitle?: string
    width?: number
    align?: 'left' | 'right' | 'center'
    children?: IColumn[]
    fixed?: 'left' | 'right'
    render?: (value, record) => 'string' | Layer
    onCell?: ITableEventHandler
  }

  interface IColumnProps extends IColumn{
    table: CanvasTable
    index: number
    fixedIndex?: number
  }

  interface ISectionProps {
    table: CanvasTable
  }

  interface ITableHeaderProps {
    table: CanvasTable
    colProps: IColumn[]
  }

  interface IRowProps extends ILayerProps {
    table: CanvasTable
    index: number
    onRow?: ITableEventHandler
  }

  interface IHeaderNodeProps{
    colProps: IColumn
    parent?: HeaderTreeNode
    table: CanvasTable
  }

  interface IBaseCellProps {
  }

  // interface IHeaderCellProps extends IBaseCellProps{
  //   row: HeaderRow
  //   colProps: IColumn
  //   index: number
  //   fixedIndex?: number
  // }
  interface ITableScrollerProps {
    fixedLeftWidth(): number
    fixedRightWidth(): number
    height: number
    width: number
    onScroll?: (left: number, top: number, direction: string) => void
    ref?
    children?: any[]
  }
  interface ICanvasTableProps {
    container: HTMLElement
    columns: IColumn[]
    style?: ITableStyleProps
    onScrollTop?: () => void
    // onScrollBottom?: () => void
    onScrollLoad?: () => Promise<any>
    scrollLoadHeight?: number
    onRow?: ITableEventHandler
  }

  interface IBodyCellProps extends ILayerProps {
    row: BodyRow,
    column: Column
    // event?: ITableEventCollection
  }

  interface IHeaderNodeProps extends ILayerProps {
    colProps: IColumn
    parent?: HeaderTreeNode
    table: CanvasTable
  }
}
