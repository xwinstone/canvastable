import Layer from "./Layer";
import {IComponent} from "../typings/Component";
import ILayerProps = IComponent.ILayerProps;
import {obj} from "../typings/common";

interface ISvgProps extends ILayerProps{
  path: string;
}

class Svg extends Layer {
  constructor(protected props: ISvgProps) {
    // this.ctx
    super(props)
    // if (isEmpty(props && props.style && props.style.padding)) {
    //   this.style.padding = [0, 8, 0, 8];
    // }
    //
    this.init()
  }

  init () {
    const {path, style: { color }} = this.props
    svgInit(path, color || '')
      .then(img => {
        img && img.addEventListener('load', () => {
          this.table.render()
        }, {once: true})
      })
  }

  render() {
    const {path, style: { color }} = this.props
    const key = imgKey(path, color)
    const img = imgCache[key]
    if (img && img.complete) {
      this.ctx.drawImage(img, this.left , this.top, this.width, this.height)
    }
  }
}

const imgCache:obj<HTMLImageElement> = {}
const originSvgCache:obj<string> = {}
const loadingSvg: obj<boolean> = {}

async function svgInit (path, color) {
  const key = imgKey(path, color)
  if (imgCache[key]) {
    return null
  }
  if (loadingSvg[path]) {
    return null
  }
  const svgString = await svgLoad(path)
  if (svgString) {
    imgCache[key] = svg2img(svgString, color)
  }
  return imgCache[key]
}

function imgKey (path:string, color:string) { return path + '__' + color}

async function svgLoad (path)  {
  if (originSvgCache[path]) {
    return null
  }
  loadingSvg[path] = true
  const [res, err] = await fetch(path).then(res => [res, null], err => [null, err])
  if (err) {
    console.warn(err)
    return null
  }
  originSvgCache[path] = await res.text()
  delete loadingSvg[path]
  return originSvgCache[path]
}

function svg2img (svg: string, color: string) {
  svg = svg.replace('<svg ', `<svg fill="${color}" `)
  const blob = new Blob([svg], {type: 'image/svg+xml'});
  const url = URL.createObjectURL(blob);
  const image = document.createElement('img');
  image.addEventListener('load', () => {
    URL.revokeObjectURL(url)
  }, {once: true})
  image.src = url;
  return image
}


export default Svg
