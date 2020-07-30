import CanvasTable from "./CanvasTable";
import Layer from "../component/Layer";
import {isEmpty, isNotEmptyArray} from "../utils/utils";
import {IComponent} from "../typings/Component";
import IEventCollection = IComponent.IEventCollection;
import {LayerEvent} from "./LayerEvent";

export class CanvasTableEvent {
  constructor (protected props: {table: CanvasTable}) {
    this.init();
  }

  init () {
    const wrapper = this.table.wrapper;
    wrapper.onclick = event => this.eventHandler('onClick', event);
    wrapper.ondblclick = event => this.eventHandler('onDoubleClick', event);
    wrapper.oncontextmenu = event => this.eventHandler('onContextMenu', event);
    wrapper.onmousemove = event => this.moveEventHandler(event);
    wrapper.onmouseleave = event => this.onMouseLeave(event);
  }

  eventX = 0;
  eventY = 0;
  eventHandler = (type: keyof IEventCollection, event) => {
    const {left, top} = this.table.wrapper.getBoundingClientRect();
    this.eventX = event.clientX - left;
    this.eventY = event.clientY - top;  //y position within the element.
    // debugger
    const layEvt = this.eventGenerate(type);
    for (let layer of layEvt.path) {
      if (!layEvt.isPropagationStopped) {
        layer.trigger(type, layEvt);
      }
    }
  };

  private lastMoveEvent: LayerEvent = null;
  moveEventHandler = (event) => {
    const {left, top} = this.table.wrapper.getBoundingClientRect();
    this.eventX = event.clientX - left;
    this.eventY = event.clientY - top;  //y position within the element.

    // debugger
    const currEvt = this.eventGenerate('onMouseEnter');
    const lastEvt = this.lastMoveEvent ? this.lastMoveEvent.copy({type: 'onMouseLeave'}) : null;
    const currRevPath = currEvt && currEvt.path ? [...currEvt.path].reverse() : [];
    const lastRevPath = lastEvt && lastEvt.path ? [...lastEvt.path].reverse() : [];

    const length = Math.max(currRevPath.length, lastRevPath.length);

    for (let i = 0; i < length; i ++) {
      const last = lastRevPath[i];
      const curr = currRevPath[i];
      if (last !== curr) {
        if (lastEvt && !lastEvt.isPropagationStopped) {
          last && last.trigger(lastEvt.type, lastEvt);
        }

        if (!currEvt.isPropagationStopped) {
          curr && curr.trigger(currEvt.type, currEvt);

        }
      }
    }

    this.lastMoveEvent = currEvt
  };

  onMouseLeave = (event: MouseEvent) => {
    const lastEvt = this.lastMoveEvent ? this.lastMoveEvent.copy({type: 'onMouseLeave'}) : null;
    if (isEmpty(lastEvt)) {
      return;
    }

    for (let layer of lastEvt.path) {
      if (!lastEvt.isPropagationStopped) {
        layer.trigger(lastEvt.type, lastEvt);
      }
    }
    this.lastMoveEvent = null;
  };

  eventGenerate (type?: keyof IEventCollection): LayerEvent {
    return new LayerEvent({
      type,
      path: this.pathGet(),
      clientX: this.eventX,
      clientY: this.eventY,
    })
  }

  pathGet () {
    let entryLayer: Layer = null;
    if (this.eventY <= this.table.header.height) {
      // 点击事在header部分生效
      let cells = [...this.table.header.cells];
      cells.sort(((a, b) => b.zIndex - a.zIndex));
      for (let headerCell of cells) {
        const {left, top, width, height} = headerCell;
        if (headerCell.isRender
          && left < this.eventX && left + width > this.eventX
          && top < this.eventY && top + height > this.eventY
        ) {
          entryLayer = headerCell;
          break;
        }
      }
    } else {
      // 点击事在body部分生效
      for (let row of this.table.body.rows) {
        if (this.eventY > row.top && this.eventY < (row.top + row.height)) {
          entryLayer = row;
          break;
        }
      }
    }

    const clientCoordination = (layer: Layer, left = layer.left, top = layer.top) => {
      if (layer.parent) {
        return clientCoordination(layer.parent, left + layer.parent.left, top + layer.parent.top)
      } else {
        return {left, top}
      }
    };

    const pathDig = (layer: Layer, path: Layer[] = []): Layer[] => {
      path.push(layer);
      if (isNotEmptyArray(layer.children)) {
        const sortedChildren = [...layer.children].sort(((a, b) => b.zIndex - a.zIndex));

        for (let child of sortedChildren) {
          const {left, top, width, height} = child;
          // const {left, top} = clientCoordination(child);
          if (child.isRender
            && left < this.eventX && left + width > this.eventX
            && top < this.eventY && top + height > this.eventY
          ) {
            return pathDig(child, path);
          }
        }
        return path;
      } else {
        return path;
      }
    };

    return entryLayer ? pathDig(entryLayer).reverse() : [];
  }
  get table () {
    return this.props.table
  }
}