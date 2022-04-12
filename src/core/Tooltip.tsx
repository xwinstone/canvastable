/** @jsx h */

import h from "../utils/h";
import Layer from "../component/Layer";

class Tooltip {

  wrapper: HTMLElement = null

  constructor() {
    this.domInit()
  }

  show (text, layer: Layer) {
    this.wrapper.style.display = 'inline-block'
    this.wrapper.textContent = text
    const clientRect = layer.table.wrapper.getBoundingClientRect()
    const top = layer.top + clientRect.top
    const left = layer.left + clientRect.left + layer.width / 2
    this.wrapper.style.top = top + 'px'
    this.wrapper.style.left = left + 'px'
  }

  hide () {
    this.wrapper.style.display = 'none'
  }

  domInit () {
    return (
      <div ref={ref => { this.wrapper = ref }} className={'x-tooltip'}>
      </div>
    )
  }

}

export default Tooltip
