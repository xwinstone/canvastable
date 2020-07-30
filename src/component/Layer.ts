import {Component} from "./Component";
import {cssParser, isEmpty, isNotEmpty, isNotEmptyArray, percentCalc} from "../utils/utils";
import {treeBackFind, treeInherit} from "../utils/tree";
import {drawLine, drawRect} from "../utils/draw";
import {IComponent} from "../typings/Component";
import ILayerStyleProps = IComponent.ILayerStyleProps;
import ILayerProps = IComponent.ILayerProps;
import IEventCollection = IComponent.IEventCollection;
import {LayerEvent} from "../core/LayerEvent";
import ILayerStyle = IComponent.ILayerStyle;
import CanvasTable from "../core/CanvasTable";
import {BodyCell} from "../table/BodyCell";
import {obj} from "../typings/common";

export default class Layer extends Component {
  static defaultStyle: ILayerStyleProps = {
    top: 0,
    left: 0,
    width:'100%',
    height: '100%',
    padding: 0,
    // color:
    // font: string
    // fontSize: number
    zIndex: 0,
    align: 'left',
    overflow: 'ellipsis'
  };
  constructor(protected props: ILayerProps) {
    super();
    this._ctx = props.ctx;
    this.styleInit();
    this.children = [...(props.children || [])];
    this.children.forEach(child => {
      child.parent = this
    });
    if (isNotEmpty(props.event)) {
      for (let key in props.event) {
        this.on(key, props.event[key])
      }
    }
    if (props.popTitle) {
      this.on('onMouseEnter', () => {
        this.table.wrapper.title = props.popTitle;
      });
      this.on('onMouseLeave', () => {
        this.table.wrapper.title = '';
      })
    }
  }
  _ctx: CanvasRenderingContext2D = null;
  get ctx (): CanvasRenderingContext2D {
    return treeInherit(this, '_ctx')
  }

  get table(): CanvasTable {
    let cell:BodyCell = <any>treeBackFind(this, layer => !layer.parent);
    return cell.table
  }
  parent: Layer = null;
  children: Layer[] = [];

  style: ILayerStyle = {};
  styleInit () {
    let {
      padding,
      border,
      ...style
    } = <ILayerStyleProps>{...Layer.defaultStyle, ...(this.props.style || {})};

    if (isNotEmpty(padding)) {
      this.style.padding = cssParser.multiValue(padding);
    } else {
      this.style.padding = [0, 0, 0, 0];
    }
    if (isNotEmpty(border)) {
      this.style.border = cssParser.multiValue(border).map(b => cssParser.border(b));
    }
    this.style = {...this.style, ...style}
    // this.style.top =
    // this.style.
  }
  get isRender () {
    let vertical = !(this.left + this.width < 0 || this.left > this.ctx.canvas.width);
    let horizontal = !(this.top + this.height < 0 || this.top > this.ctx.canvas.height);
    return vertical && horizontal
  }

  get left () {
    let parentLeft = this.parent ? this.parent.left + this.parent.padding.left: 0;
    return parentLeft + this.style.left
  }

  get top () {
    let parentTop = this.parent ? this.parent.top + this.parent.padding.top: 0;
    return parentTop + this.style.top
  }

  get innerWidth () {
    return this.width - this.padding.right - this.padding.left
  }

  get width ():number {
    let parentInnerWidth = this.parent ? this.parent.innerWidth : 0;
    return percentCalc(this.style.width, () => this.parent ? parentInnerWidth : 0);
  }

  get innerHeight () {
    return this.height - this.padding.top - this.padding.bottom
  }

  get height (): number {
    let parentInnerHeight = this.parent ? this.parent.innerHeight : 0;
    return percentCalc(this.style.height, () => this.parent ? parentInnerHeight : 0);
  }

  // set padding () {
  //   this.style.padding = cssParser.multiValue(this.style.padding);
  // }
  get padding() {
    const [top, right, bottom, left] = <number[]>this.style.padding;
    return {top, right, bottom, left}
  }

  get border () {
    const [top, right, bottom, left] = <number[]>this.style.padding;
    return {top, right, bottom, left}
  }

  get align () {
    return this.style.align
  }
  get zIndex () {
    return this.style.zIndex
  }

  clear () {
    const {left, top, height, width} = this;
    this.ctx.clearRect(left, top, width, height);
  }

  childrenRender () {
    const children = [...(this.children || [])];
    if (isEmpty(children)) {
      return
    }

    children.sort((a, b) => a.zIndex - b.zIndex)
      .forEach((child) => {
        child.innerRender()
      })
  }

  baseRender() {
    const {backgroundColor, border} = this.style;
    const {left, top, width, height} = this;

    if (backgroundColor) {
      drawRect(this.ctx, left, top + 1 , width, height - 1, backgroundColor)
    }
    if (isNotEmptyArray(border)) {
      const [topB, rightB, bottomB, leftB] = border;
      if (topB) {
        drawLine(this.ctx, left, top, left + width, top, topB.color)
      }
      if (rightB) {
        drawLine(this.ctx, left + width, top, left + width, top + height, rightB.color)
      }
      if (bottomB) {
        drawLine(this.ctx, left, top + height, left + width, top + height, bottomB.color)
      }
      if (leftB) {
        drawLine(this.ctx, left, top, left, top + height, leftB.color)
      }
    }
  }

  render () {
  }

  innerRender () {
    if(this.isRender) {
      // this.clear();
      this.baseRender();
      this.render();
      this.childrenRender();
    }
  }

  drawText (str: string) {
    let ctx = this.ctx;
    let {left, top, height, width} = this;
    let x = 0;
    let y = top + height / 2;

    ctx.save();
    switch (this.align) {
      case "center":
        x = left + width / 2;
        ctx.textAlign = 'center';
        break;
      case "right":
        x = left + width - this.padding.right;
        ctx.textAlign = 'right';
        break;
      case "left":
      default:
        x = left + this.padding.left;
        ctx.textAlign = 'left';
    }



    if (this.style.color) {
      ctx.fillStyle = this.style.color;
    }

    let fontSize = this.table.style.fontSize;
    let fontFamily = this.table.style.fontFamily;
    let fontWeight = 'normal';

    if (this.style.fontWeight) {
      fontWeight = this.style.fontWeight;
    }
    if (this.style.fontSize) {
      fontSize = this.style.fontSize
    }
    if (this.style.fontFamily) {
      fontFamily = this.style.fontFamily
    }
    ctx.font = [fontWeight, fontSize, fontFamily].join(' ');
    // console.log(left, this.column.width, top , this.row.height)
    ctx.fillText(str, x, y + this.padding.top);
    ctx.restore();
  }

  protected eventHandlers: obj<Function[]> = {};

  on (name: string, handler: Function) {
    if(!this.eventHandlers[name]){
      this.eventHandlers[name] = []
    }
    this.eventHandlers[name].push(handler);
  }
  off (name: string, handler?: Function){
    const handlers = this.eventHandlers[name];
    if (handlers) {
      if (typeof handler === 'function') {
        const delIndex = handlers.indexOf(handler);
        if (~delIndex) {
          handlers.splice(delIndex, 1);
        }
      } else {
        delete this.eventHandlers[name];
      }
    }
  }

  trigger (type: keyof IEventCollection, event: LayerEvent) {
    const handlers = this.eventHandlers[type];
    handlers && handlers.forEach((handler) => {
      typeof handler === 'function' && handler(event);
    });
  }
}
