import Layer from './Layer';
import {IComponent} from '../typings/Component';
import ILayerIconProps = IComponent.ILayerIconProps;
import {isEmpty} from "../utils/utils";

export default class LayerIcon extends Layer {

  constructor(protected props: ILayerIconProps) {
    super(props);
    this.props = {...(this.props || {})};
    this.style.fontFamily = 'iconfont';
    if (isEmpty(props && props.style && props.style.padding)) {
      this.style.padding = [0, 8, 0, 8];
    }

    if (isEmpty(props && props.style && props.style.align)) {
      this.style.align = 'center';
    }

    this.on('onMouseEnter', () => {
      this.ctx.canvas.parentElement.style.cursor = 'pointer';
    });
    this.on('onMouseLeave', () => {
      this.ctx.canvas.parentElement.style.cursor = 'auto';
    })
  }

  render() {
    const {icon} = this.props;

    if (icon) {
      const hex = '0' + icon.slice(2, -1);
      this.drawText(String.fromCharCode(parseInt(hex)));
    }
  }

}