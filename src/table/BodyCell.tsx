import LayerText from "../component/Text";
import {ICanvasTable} from "../typings/CanvasTable";
import {isEmpty, isFunction, toBlank} from "../utils/utils";
import Layer from "../component/Layer";
import {IComponent} from "../typings/Component";
import {LayerEvent} from "../core/LayerEvent";

type IBodyCellProps = ICanvasTable.IBodyCellProps;
type IEventCollection = IComponent.IEventCollection;

export class BodyCell extends LayerText {
  constructor(protected props: IBodyCellProps) {
    super(props);
    this.style.backgroundColor = 'white';
    this.on('onClick', () => {
      if (!(this.customRendered instanceof Layer)) {
        this.showSelection()
      }
    });
    this.on('onMouseEnter', () => {
      if (this.textEllipsis.length !== this.text.length && this.textEllipsis !== this.text) {
        this.table.tooltip.show(this.text, this)
      }
    });
    this.on('onMouseLeave', () => {
      this.table.tooltip.hide()
    })
  }

  showSelection () {
    const selectionCell = this.table.selectionCell;
    // const {padding} = this.table.style;
    selectionCell.classList.remove('show');
    setTimeout(() => {
      selectionCell.value = this.text;
      selectionCell.style.top = `${this.top + this.table.scroller.top + 1}px`;
      selectionCell.style.left = `${this.left + this.table.scroller.left}px`;

      // let width = this.ctx.measureText(this.text).width + padding * 2 + 2;
      // if (this.left + width > this.table.width || width < this.width) {
      //   width = this.width
      // }
      selectionCell.style.width = `${this.width}px`;
      selectionCell.classList.add('show');
      selectionCell.select();
    }, 10)
  }
  update() {
    this._textEllipsis = '';
    this.customRendered = null;
    this.children = []
  }
  get top () {
    return this.row.top
  }
  get left () {
    return this.column.left
  }
  get width () {
    return this.column.width
  }
  get column () {
    return this.props.column
  }
  get height () {
    return this.row.height
  }
  get align() {
    return this.column.align
  }
  get row () {
    return this.props.row
  }
  get table () {
    return this.column.table
  }
  get isRender () {
    return this.column.isRender && this.row.isRender;
  }
  get fixed () {
    return this.column.fixed
  }
  get text () {
    return toBlank(typeof this.customRendered === 'string' ? this.customRendered : this.data)
  }
  get name () {
    return this.column.name
  }
  get data() {
    return this.row.data && this.row.data[this.name]
  }

  get zIndex () {
    return this.fixed === 'left' || this.fixed === 'right' ? 1 : 0
  }

  trigger (type: keyof IEventCollection, event: LayerEvent) {
    super.trigger(type, event);

    if (isFunction(this.column.onCell)) {
      let collection = this.column.onCell(this.row.data, this.column.index);
      if (collection) {
        const handler = collection[type];
        if (isFunction(handler)) {
          handler(event)
        }
      }
    }
  }

  private customRendered: string | Layer = null;
  render () {
    if (isFunction(this.column.customRender)) {
      if (isEmpty(this.children)) {
        this.customRendered = this.column.customRender(this.data, this.row.data);
        if (this.customRendered instanceof Layer) {
          this.customRendered.parent = this;
          this.children = [this.customRendered];
        }
      }

      if (typeof this.customRendered === 'string') {
        super.render();
      }

    } else {
      super.render();
    }
  }
}
