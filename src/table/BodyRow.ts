import {ICanvasTable} from "../typings/CanvasTable";
import IRowProps = ICanvasTable.IRowProps;
import {BodyCell} from "./BodyCell";
import {isEmpty, isFunction, isNotEmpty} from "../utils/utils";
import Layer from "../component/Layer";
import {IComponent} from "../typings/Component";
import IEventCollection = IComponent.IEventCollection;
import {LayerEvent} from "../core/LayerEvent";

export class BodyRow extends Layer {
  constructor(protected props: IRowProps) {
    super({
      ...props,
      style: {
        backgroundColor: 'white',
        border: [null, null, `1px`, null]
      }
    });
    this.on('onMouseEnter', () => {
      this.highlight(true)
    });
    this.on('onMouseLeave', () => {
      this.highlight(false)
    });
  }
  index = this.props.index;
  get data () {
    return this.table.source[this.index]
  }
  // get fixLeftCells (): BodyCell[] {
  //   let cells = [];
  //   let colLen = this.cells.length;
  //   for (let i = 0; i < colLen; i++) {
  //     if ( this.cells[i].fixed !== "left") {
  //       break;
  //     }
  //     cells.push(this.cells[i])
  //   }
  //   return cells;
  // }
  //
  // get fixRightCells (): BodyCell[] {
  //   let cells = [];
  //   let colLen = this.cells.length;
  //   for (let i = colLen - 1; i >= 0; i--) {
  //     if ( this.cells[i].fixed !== "right") {
  //       break;
  //     }
  //     cells.push(this.cells[i])
  //   }
  //   return cells;
  // }
  //
  // get notFixedCells (): BodyCell[] {
  //   return this.cells.filter(cell => !['left', 'right'].includes(cell.fixed))
  // }
  get cells(): BodyCell[] {
    return <BodyCell[]>this.children;
  }
  cellsCreate() {
    this.children = this.table.header.columns.map(column => new BodyCell({
      ctx: this.table.ctx,
      row: this,
      column: column,
      style: {
        padding: [0, this.table.style.padding],
        zIndex: column.fixed ? 1 : 0
      }
    }));
  }

  get left() {
    return 0
  }
  get width () {
    return this.table.style.width
  }
  get top () {
    let table = this.table;
    return table.header.height + this.index * table.style.rowHeight - table.scroller.top - 1;
  }

  get isRender() {
    return !(this.top + this.height < this.table.header.height || this.top > this.table.style.height)
  }

  get height() {
    return this.table.style.rowHeight
  }
  get table() {
    return this.props.table
  }
  update() {
    if (isNotEmpty(this.cells)) {
      this.cells.forEach((cell => cell.update()))
    }
  }
  //
  trigger (type: keyof IEventCollection, event: LayerEvent) {
    super.trigger(type, event);

    if (isFunction(this.table.props.onRow)) {
      let collection = this.table.props.onRow(this.data, this.index);
      if (collection) {
        const handler = collection[type];
        if (isFunction(handler)) {
          handler(event)
        }
      }
    }
  }

  highlight(flag: boolean) {
    this.cells.forEach(cell => cell.style.backgroundColor = flag ? '#e6f7ff' : '#ffffff');
    this.style.backgroundColor = flag ? '#e6f7ff' : '#ffffff';
    this.table.render()
  }

  get ctx () {
    return this.table.ctx;
  }

  render() {
    if (isEmpty(this.cells)) {
      this.cellsCreate();
    }
  }
}
