import Layer from "./Layer";
import {text2Ellipsis} from "../utils/draw";
import {IComponent} from "../typings/Component";
import {toBlank} from "../utils/utils";

type ILayerTextProps = IComponent.ILayerTextProps;

export default class LayerText extends Layer {
  constructor(protected props: ILayerTextProps) {
    super(props)
  }

  get text () {
    return toBlank(this.props.text)
  }

  protected _textEllipsis = '';
  get textEllipsis () {
    if (!this._textEllipsis) {
      this._textEllipsis = text2Ellipsis(this.ctx, this.text, this.innerWidth)
    }
    return this._textEllipsis
  }

  render (text = this.textEllipsis) {
    this.drawText(text)
  }
}
