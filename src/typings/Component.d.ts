import Layer from "../component/Layer";

export declare module IComponent {
  interface ILayerEventProps {
    type?: keyof IEventCollection
    clientX?: number
    clientY?: number
    path?: Layer[]
  }

  interface IEventCollection {
    onClick?: (...any) => void,
    onDoubleClick?: (...any) => void,
    onContextMenu?: (...any) => void,
    onMouseEnter?: (...any) => void, // 鼠标移入行
    onMouseLeave?: (...any) => void,
  }

  interface ILayerProps{
    ctx?: CanvasRenderingContext2D
    size?: string;
    style?: ILayerStyleProps
    hover?: ILayerStyleProps
    event?: IEventCollection
    popTitle?: string
    children?: Layer[]
  }

  interface ILayerTextProps extends ILayerProps {
    text?: string | number | boolean
  }

  interface ILayerStyleProps {
    top?: number
    left?: number
    width?: number | string
    height?: number | string
    padding?: number | number[]
    color?: string
    backgroundColor?: string;
    border?: string | string[]
    fontFamily?: string
    fontSize?: string
    fontWeight?: 'normal' | 'bold'
    zIndex?: number
    align?: 'left' | 'center' | 'right'
    overflow?: 'hidden' | 'ellipsis'
  }

  interface ILayerBorderStyle {
    width:number
    color:string
  }

  interface ILayerStyle {
    top?: number
    left?: number
    width?: number | string
    height?: number | string
    padding?: number[]
    color?: string
    backgroundColor?: string
    border?: ILayerBorderStyle[]
    fontFamily?: string
    fontSize?: string
    fontWeight?: 'normal' | 'bold'
    zIndex?: number
    align?: 'left' | 'center' | 'right'
    overflow?: 'hidden' | 'ellipsis'
  }

  interface ILayerButtonProps extends ILayerProps {
    icon?: string
    iconSize?: string
    text?: object
    type?: 'primary' | 'link' | 'default'
  }

  interface ILayerIconProps extends ILayerProps {
    icon?: string
  }
}
