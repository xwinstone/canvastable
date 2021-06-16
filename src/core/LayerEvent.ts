import {IComponent} from "../typings/Component";
import Layer from "../component/Layer";

type ILayerEventProps = IComponent.ILayerEventProps;
type IEventCollection = IComponent.IEventCollection;

export class LayerEvent {
  constructor(props: ILayerEventProps = {})  {
    this.clientX = props.clientX;
    this.clientY = props.clientY;
    this.path = props.path || [];
    this.target = this.path[0] || null;
    this.type = props.type;
  }

  clientX: number;
  clientY: number;
  path: Layer[];
  target: Layer = null;
  type: keyof IEventCollection;

  private _isPropagationStopped = false;
  get isPropagationStopped () {
    return this._isPropagationStopped;
  }
  stopPropagation () {
    this._isPropagationStopped = true
  };

  copy (changes: ILayerEventProps = {}) {
    const {clientX, clientY, path, type} = this;

    return new LayerEvent({
      clientX,
      clientY,
      path: [...(path || [])],
      type,
      ...changes
    })
  }
}
