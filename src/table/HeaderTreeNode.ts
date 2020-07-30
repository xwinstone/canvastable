import {ICanvasTable} from "../typings/CanvasTable";
import IHeaderNodeProps = ICanvasTable.IHeaderNodeProps;
import {treeGetDeep, treeGetLeaf} from "../utils/tree";
import {isEmpty} from "../utils/utils";
import LayerText from "../component/Text";
import Layer from "../component/Layer";
import {drawLine} from "../utils/draw";

class HeaderTreeNode extends LayerText {
  constructor(protected props: IHeaderNodeProps) {
    super(props);
    this.style.backgroundColor = this.table.style.headerBackColor;
    this.style.fontWeight = 'bold';

    this.parentCell = props.parent;

    // 把自身添加到父元素的children中
    if (this.parentCell) {
      this.parentCell.childrenCell.push(this)
    }
  }

  parentCell: HeaderTreeNode = null;
  childrenCell: HeaderTreeNode[] = [];

  get table() {
    return this.props.table
  }

  get header() {
    return this.table.header
  }

  get fixed() {
    return this.props.colProps.fixed
  }

  private _width = null;
  get width() {
    if (this._width === null) {
      this._width = treeGetLeaf(this, 'childrenCell')
        .reduce((pre, curr) => pre + (curr.props.colProps.width || this.table.style.columnWidth), 0)
    }
    return this._width
  }

  private _height: number = null;
  get height() {
    if (this._height === null) {
      if (isEmpty(this.childrenCell)) {
        let space = this.table.header.deep - (this.treeHeight - 1 + treeGetDeep(this.props.colProps) - 1);
        this._height = space * this.table.style.headerRowHeight
      } else {
        this._height = this.table.style.headerRowHeight
      }
    }
    return this._height
  }

  private _left: number = null;
  get left() {
    if (this._left === null) {
      let left = 0;
      const siblings = this.siblings;
      if (isEmpty(this.parentCell)) {
        switch (this.fixed) {
          case 'left':
            for (let i = 0, cell: HeaderTreeNode = null; i < siblings.length; i++) {
              cell = siblings[i];
              if (cell.fixed !== 'left') {
                break
              }
              if (cell === this) {
                break
              }
              left += cell.width
            }
            break;
          case 'right':
            for (let i = siblings.length - 1, cell: HeaderTreeNode = null; i >= 0; i--) {
              cell = siblings[i];
              if (cell.fixed !== 'right') {
                break
              }
              left += cell.width;
              if (cell === this) {
                break
              }
            }
            left = this.table.style.width - left;
            break;
          default:
            for (let i = 0, cell: HeaderTreeNode = null; i < siblings.length; i++) {
              cell = siblings[i];
              if (cell === this) {
                break
              }
              left += cell.width;
            }
        }
      } else {
        for (let i = 0, cell: HeaderTreeNode = null; i < siblings.length; i++) {
          cell = siblings[i];
          if (cell === this) {
            break
          }
          left += cell.width;
        }
        left += this.parentCell.left
      }

      this._left = left;
    }

    if (this.fixed !== 'left' && this.fixed !== 'right') {
      return this._left - this.table.scroller.left;
    }
    return this._left
  }

  private _top: number = null;
  get top() {
    if (this._top === null) {
      this._top = (this.treeHeight - 1) * this.table.style.headerRowHeight - 1
    }
    return this._top
  }

  // get isRender() {
  //   let vertical = !(this.left + this.width < 0 || this.left > this.table.style.width);
  //   let horizontal = !(this.top + this.height < 0 || this.top > this.table.style.height);
  //   return vertical && horizontal
  // }

  get align () {
    return this.props.colProps.align || (isEmpty(this.props.colProps.children) ? 'left' : 'center')
  }

  get text () {
    return this.props.colProps.title + ''
  }

  // 获取树的高度
  get treeHeight () {
    // 获取当前节点深度
    let height = 0;
    let current:HeaderTreeNode = this;
    while (current) {
      height ++;
      // 防止死循环
      if (height > 10000) {
        return 10000
      }
      current = current.parentCell
    }
    return height;
  }

  get siblings () {
    if (this.parentCell) {
      return [...this.parentCell.childrenCell]
    } else {
      return [...this.header.rootCells]
    }
  }

  borderRect() {
    const {left, top, width, height} = this;
    // border-bottom
    const borderTop = top + height;
    drawLine(this.ctx, left, borderTop, left + width, borderTop);
    // border-right
    if(this.header.deep > 1) {
      drawLine(this.ctx,left + width - 1, top - 1, left + width - 1, top + height - 1);
    }
  }

  get zIndex(): number {
    return this.fixed === 'left' || this.fixed === 'right' ? 1 : 0
  }

  customRendered: Layer = null;
  render () {
    if(!this.isRender){
      return
    }

    this.borderRect();
    if (typeof this.props.colProps.title === 'function') {
      if (this.customRendered === null) {
        this.customRendered = this.props.colProps.title();
        if (this.customRendered instanceof Layer) {
          this.customRendered.parent = this;
          this.children = [this.customRendered];
        }
      }

      if (typeof this.customRendered === 'string') {
        super.render(this.customRendered);
      }

    } else {
      super.render();
    }
  }
}

export default HeaderTreeNode
