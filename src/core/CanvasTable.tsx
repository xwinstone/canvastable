/** @jsx h */

import {DEFAULT_STYLE, PIXEL_RATIO} from "../style/style";
import {ICanvasTable} from "../typings/CanvasTable";
import {BodySection} from "../table/Body";
import Scroller, {SCROLLBAR_WIDTH} from "./Scroller";
import {debounce, isFunction, isNotEmptyArray, percentCalc} from "../utils/utils";
import h from "../utils/h";
import {HeaderTree} from "../table/HeaderTree";
import {CanvasTableEvent} from "./TableEvent";
import {obj} from "../typings/common";
import Button from "../component/Button";
import Layer from "../component/Layer";
import Text from "../component/Text";
import Svg from "../component/Svg";
import Tooltip from './Tooltip';

type ITableStyle = ICanvasTable.ITableStyle;
type ICanvasTableProps = ICanvasTable.ICanvasTableProps;

const WRAPPER_PADDING = 0;

class CanvasTable {
  static Button = Button
  static Layer = Layer
  static Text = Text
  static Svg = Svg

  style: ITableStyle = null;

  constructor(public props: ICanvasTableProps) {
    this.init()
  }
  outerHeight: number = 0;
  outerWidth: number = 0;
  ctx: CanvasRenderingContext2D = null;
  event: CanvasTableEvent = null;
  tooltip: Tooltip = null;

  init (isFirstTime = true) {
    const {container, style} = this.props;
    this.styleCalc();
    this.domInit();
    if (isFirstTime) {
      this.event = new CanvasTableEvent({table: this});
      if (container) {
        container.appendChild(this.wrapper);
      }
    }
    this.ctxInit();
    this.componentsInit();

    if (isFirstTime) {
      if (typeof style.height === 'string' || typeof style.width === 'string') {
        window.addEventListener('resize', this.onWindowResizeHandler)
      }
    }
  }
  onWindowResizeHandler = debounce(() => {
    this.resize();
  }, 300);

  styleCalc () {
    this.props.style = {...DEFAULT_STYLE, ...(this.props.style || {})};
    const {height, width, ...style} = this.props.style;
    this.style = style;

    this.outerWidth = percentCalc(width, () => this.props.container.clientWidth);
    this.outerHeight = percentCalc(height, () => this.props.container.clientHeight);

    this.style.width = this.outerWidth - SCROLLBAR_WIDTH - WRAPPER_PADDING * 2;
    this.style.height = this.outerHeight - SCROLLBAR_WIDTH - WRAPPER_PADDING * 2;
  }

  ctxInit () {
    this.ctx = this.canvas.getContext('2d', { alpha: false });
    this.ctx.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);
    this.ctx.fillStyle = this.style.textColor;
    this.ctx.font = this.style.fontSize + ' ' + this.style.fontFamily;
    this.ctx.textBaseline = 'middle';
    this.ctx.strokeStyle = this.style.borderColor;
  }

  header: HeaderTree;
  body: BodySection;
  componentsInit() {
    this.header = new HeaderTree({
      colProps: this.props.columns,
      table: this
    });
    this.body = new BodySection({
      table: this
    });
  }

  private _source: obj[] = [];
  set source(data: obj[]) {
    const newSource = isNotEmptyArray(data) ? [...data] : [];
    this.body.rows = this.body.diff(newSource);
    // const newLength = newSource.length;
    // const oldLength = this.source.length;
    // for (let i = 0; i < newLength; i ++) {
    //   const newData = newSource[i];
    //   const oldData = this.source[i];
    //   // diff
    //   if (newData && !oldData) { // 新增
    //     this.body.rows.push(
    //       new BodyRow({
    //         ctx: this.ctx,
    //         table: this,
    //         index: i,
    //         onRow: this.props.onRow
    //       })
    //     )
    //   } else if (oldData && newData) { // 更新
    //     this.body.rows[i].update()
    //   }
    // }
    // // 删除
    // if (oldLength > newLength) {
    //   this.body.rows.splice(newLength, oldLength - newLength);
    // }

    this._source = [...newSource];
    this.sizeCalc();
    this.scroller.update(this.width, this.height, this.dataWidth, this.dataHeight);
    this.render()
    // this.body.rows
  }
  get source () {
    return this._source
  }

  height: number = 0; // 表格数据高度
  width: number = 0;  // 表格数据宽度
  dataHeight: number = 0; // 表格数据真实高度
  dataWidth: number = 0; // 表格数据真实宽度

  sizeCalc () {
    this.dataHeight = this.header.height + this.source.length * this.style.rowHeight;
    this.dataWidth = this.header.columns.reduce(((pre, col) => pre + col.width), 0);
    this.height = Math.max(this.style.height, this.dataHeight);
    this.width = Math.max(this.style.width, this.dataWidth);
  }

  isFirstRender = true;
  render () {
    this.ctx.clearRect(0, 0, this.style.width, this.style.height);
    this.body.render();
    this.header.render();
    if (this.isFirstRender) {
      this.isFirstRender = false;
      setTimeout(() => {
        this.render();
      }, 30)
    }
  }

  // scrollPosition = {scrollLeft: 0, scrollTop: 0};
  // onScrollHandler = (left: number, top: number, direction: string) => {
  //   this.render();
  //   if (direction === 'up' && top === 0) {
  //     isFunction(this.props.onScrollTop) && this.props.onScrollTop()
  //   }
  //
  //   let {scrollHeight, scrollTop, scrollLeft, clientHeight} = this.scroller.scrollRef.current;
  //   if (direction === 'down' && scrollHeight - scrollTop === clientHeight) {
  //     isFunction(this.props.onScrollBottom) && this.props.onScrollBottom()
  //   }
  //
  //   this.scrollPosition = {scrollLeft, scrollTop};
  //   this.selectionCell.classList.remove('show')
  // };

  isScrollLoading = false;
  scrollMask: HTMLElement = <div className={'x-canvas-table-mask'} />;
  scrollPosition = {scrollLeft: 0, scrollTop: 0};
  onScrollHandler = (left: number, top: number, direction: string) => {
    this.render();
    if (direction === 'up' && top === 0) {
      isFunction(this.props.onScrollTop) && this.props.onScrollTop()
    }

    const {scrollHeight, scrollTop, scrollLeft, clientHeight} = this.scroller.scrollRef.current;
    const triggerHeight = this.props.scrollLoadHeight || 150;
    if (direction === 'down' && scrollHeight - scrollTop - triggerHeight <= clientHeight) {
      if (!this.isScrollLoading && isFunction(this.props.onScrollLoad)) {
        const start = () => {
          const scrollEl = this.wrapper;
          scrollEl.appendChild(this.scrollMask);
          this.isScrollLoading = true;
        };
        const end = () => {
          const scrollEl = this.wrapper;
          if (scrollEl.isSameNode(this.scrollMask.parentElement)) {
            scrollEl.removeChild(this.scrollMask);
          }
          this.isScrollLoading = false
        };

        start();
        const promise = this.props.onScrollLoad();
        if (promise && promise.then) {
          promise.then(() => {end()}).catch(() => {end()});
        } else {
          end()
        }
      }
    }

    // if (direction === 'down' && scrollHeight - scrollTop === clientHeight) {
    //   isFunction(this.props.onScrollBottom) && this.props.onScrollBottom()
    // }

    this.scrollPosition = {scrollLeft, scrollTop};
    this.selectionCell && this.selectionCell.classList.remove('show')
    this.tooltip && this.tooltip.hide()
  };

  resize () {
    // this.iconFont && this.iconFont.destroy();
    this.init(false);
    this.sizeCalc();
    this.scroller && this.scroller.update(this.width, this.height, this.dataWidth, this.dataHeight);
    this.render();
    this.scroller && this.scroller.scrollTo(this.scrollPosition.scrollLeft, this.scrollPosition.scrollTop)
  }

  canvas: HTMLCanvasElement;
  scroller: Scroller;
  selectionCell: HTMLInputElement;

  _wrapper: HTMLElement = null;
  get wrapper () {
    if (this._wrapper === null) {
      this._wrapper = (
        <div
          className={'x-canvas-table'}
          style={{padding: `${WRAPPER_PADDING}px`}}
        />
      )
    }
    return this._wrapper;
  }
  domInit() {
    this.wrapper.innerHTML = '';
    const {height, width, rowHeight, padding, fontFamily, fontSize, textColor} = this.style;
    const {outerHeight, outerWidth} = this;
    this.wrapper.style.width = `${outerWidth}px`;
    this.wrapper.style.height = `${outerHeight}px`;
    this.wrapper.appendChild(
      <canvas
        width={width * PIXEL_RATIO}
        height={height * PIXEL_RATIO}
        style={{height: `${height}px`, width: `${width}px`}}
        ref={ref => {this.canvas = ref}}
      />
    );

    const scroll = (
      <Scroller
        ref={ref => {this.scroller = ref}}
        fixedLeftWidth={() => this.header.leftColumns.reduce((pre, val) => pre + val.width, 0)}
        fixedRightWidth={() => this.header.rightColumns.reduce((pre, val) => pre + val.width, 0)}
        height={outerHeight}
        width={outerWidth}
        onScroll={this.onScrollHandler}
      >
        <input
          readOnly
          ref={ref => {this.selectionCell = ref}}
          className={'x-canvas-table-selection-cell'}
          style={{
            height: `${rowHeight - 1}px`,
            lineHeight: `${rowHeight - 1}px`,
            padding: `0 ${padding}px`,
            fontSize: fontSize,
            fontFamily: fontFamily,
            color: textColor
          }}
          onclick={(e) => {e.preventDefault(); e.stopPropagation()}}
          onblur={() => this.selectionCell.classList.remove('show')}
        />
      </Scroller>
    );
    this.wrapper.appendChild(scroll.wrapper);

    this.tooltip = <Tooltip />
    this.wrapper.appendChild(this.tooltip.wrapper);
  }

  destroy () {
    window.removeEventListener('resize', this.onWindowResizeHandler);
  }
}

export default CanvasTable
