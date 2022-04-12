/** @jsx h */

import h, {createRef} from "../utils/h";
import {ICanvasTable} from "../typings/CanvasTable";
type ITableScrollerProps = ICanvasTable.ITableScrollerProps;

export const SCROLLBAR_WIDTH = 10;
export const BAR_WIDTH = 10;

export default class Scroller {
  static hasStyle = false;
  constructor(private props: ITableScrollerProps) {
    this.wrapper = this.domInit();
    if (!Scroller.hasStyle) {
      document.head.appendChild(
        <style>
          {`.x-canvas-table .x-canvas-scroll .x-canvas-scroll-inner::-webkit-scrollbar {width: ${BAR_WIDTH}px;height: ${BAR_WIDTH}px;}`}
        </style>
      );
      Scroller.hasStyle = true
    }
  }

  scrollTo(left: number, top: number) {
    this.scrollRef.current.scrollTo({
      left, top, behavior: 'auto'
    })
  }
  private fixedLeftWidth = 0;
  private fixedRightWidth = 0;
  scrollWidth = 0;
  scrollHeight = 0;

  /**
   * 更新滚动的一些属性
   * @param left - 显示宽度
   * @param top  - 显示高度
   * @param dataWidth - 真实宽度
   * @param dataHeight - 真实高度
   */
  update(left: number, top: number, dataWidth: number, dataHeight: number ) {
    this.scrollWidth = left;
    this.scrollHeight = top;
    // this.scrollHeight = top + SCROLLBAR_WIDTH;
    // this.scrollEndRef.current.style.top = `${top - (dataWidth <= left ? 3 : SCROLLBAR_WIDTH) + 1}px`;
    // this.scrollEndRef.current.s
    // let endLeft = (dataHeight <= top ? dataWidth : left - BAR_WIDTH) - 1;
    this.scrollEndRef.current.style.top = `${top - BAR_WIDTH - 4}px`;
    this.scrollEndRef.current.style.left = `${left - 1}px`;


    this.fixedLeftWidth = this.props.fixedLeftWidth();
    this.fixedRightWidth = this.props.fixedRightWidth();
    this.shadowLeftRef.current.style.width = `${this.fixedLeftWidth}px`;
    this.shadowRightRef.current.style.width = `${this.fixedRightWidth}px`;

    let shadowHeight = Math.min(dataHeight, this.props.height - SCROLLBAR_WIDTH);
    this.shadowLeftRef.current.style.height = `${shadowHeight}px`;
    this.shadowRightRef.current.style.height = `${shadowHeight}px`;
    this.shadowRender();
  }

  direction: string;
  top: number = 0;
  left: number = 0;
  scrollHandler = () => {
    // const table = this.props.table;
    // const ctx = table.ctx;
    const currentTop = this.scrollRef.current.scrollTop;
    const currentLeft = this.scrollRef.current.scrollLeft;
    const offsetTop = currentTop - this.top;
    const offsetLeft = currentLeft - this.left;

    if (offsetLeft > 0) {
      this.direction = 'right'
    } else if (offsetLeft < 0) {
      this.direction = 'left'
    } else if (offsetTop > 0) {
      this.direction = 'down'
    } else if (offsetTop < 0) {
      this.direction = 'up'
    }
    this.top = currentTop;
    this.left = currentLeft;

    // console.log(this.scrollRef.current.scrollLeft, this.scrollRef.current.scrollWidth, this.scrollWidth )
    // console.log(this.scrollRef.current.scrollTop, this.scrollRef.current.scrollHeight, this.scrollHeight )
    // console.log(top, left)

    this.shadowRender();
    if (typeof this.props.onScroll === 'function') {
      this.props.onScroll(this.left, this.top, this.direction);
    }
  };

  // scrollHandler = () => {
  //   // const table = this.props.table;
  //   // const ctx = table.ctx;
  //   console.log(this.scrollRef.current.scrollLeft, this.scrollWidth, this.props.width);
  //   let top = Math.min(this.scrollRef.current.scrollTop, this.scrollHeight - this.props.height );
  //   let left = Math.min(this.scrollRef.current.scrollLeft, this.scrollWidth - this.props.width );
  //
  //   if (this.left !== left || this.top !== top) {
  //     this.left = left;
  //     this.top = top;
  //
  //     this.shadowRender();
  //
  //     if ( typeof this.props.onScroll === 'function' ) {
  //       this.props.onScroll(this.left, this.top);
  //     }
  //   }
  // };
  // get table() {
  //   return this.props.table
  // }
  // get direction() {
  //   const directionDetail = this.directionDetail;
  //   if (directionDetail === 'up' || directionDetail === 'down' ) {
  //     return 'v'
  //   } else {
  //     return 'h'
  //   }
  // }

  // get verticalRect() {
  //   return {
  //     x: 0,
  //     y: this.table.header.height,
  //     w: this.table.style.width,
  //     h: this.table.style.height
  //   };
  // }
  // get horizontalRect() {
  //   const table = this.table;
  //   const x = table.leftColumns.length * table.style.columnWidth;
  //   return {
  //     x: x,
  //     y: 0,
  //     w: table.style.width - table.rightColumns.length * table.style.columnWidth - x,
  //     h: table.style.height
  //   };
  // }

  shadowDraw(type: 'left' | 'right' | 'both' | 'none') {
    const shadowLeft = this.shadowLeftRef.current;
    const shadowRight = this.shadowRightRef.current;
    switch (type) {
      case "both":
        shadowLeft.classList.add('show');
        shadowRight.classList.add('show');
        break;
      case "left":
        shadowLeft.classList.add('show');
        shadowRight.classList.remove('show');
        break;
      case "right":
        shadowLeft.classList.remove('show');
        shadowRight.classList.add('show');
        break;
      case "none":
      default:
        shadowLeft.classList.remove('show');
        shadowRight.classList.remove('show');
    }
  }
  //
  shadowRender () {
    let {scrollWidth, scrollLeft, clientWidth} = this.scrollRef.current;
    if (scrollLeft === 0) {
      this.shadowDraw('right')
    } else if (scrollWidth - scrollLeft === clientWidth) {
      this.shadowDraw('left')
    } else {
      this.shadowDraw('both')
    }
  }


  wrapper: HTMLElement = null;
  scrollRef = createRef<HTMLDivElement>();
  scrollEndRef = createRef<HTMLDivElement>();
  shadowLeftRef = createRef<HTMLDivElement>();
  shadowRightRef = createRef<HTMLDivElement>();
  domInit() {
    return (
      <div
        className={'x-canvas-scroll'}
        style={{width: `${this.props.width}px`, height: `${this.props.height}px`}}
      >
        <div
          ref={this.shadowLeftRef}
          className={'x-scroll-shadow-left'}
        />
        <div
          ref={this.shadowRightRef}
          className={'x-scroll-shadow-right'}
          style={{right: `${SCROLLBAR_WIDTH}px`}}
        />
        <div
          className={'x-canvas-scroll-inner'}
          ref={this.scrollRef}
          onscroll={this.scrollHandler}
          style={{width: `${this.props.width}px`, height: `${this.props.height}px`}}
        >
          <div
            ref={this.scrollEndRef}
            className={'x-canvas-scroll-end'}
          />
          {
            this.props.children
          }
        </div>
      </div>
    )
  }
}
