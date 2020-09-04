import CanvasTable from "./CanvasTable";

export default class CssIcon {
  constructor (private props: {src: string, fontName: string, table: CanvasTable}) {
    if (props.src) {
      this.loadCSS(props.src, props.fontName, () => {
        // this.isLoaded = true;
        props.table.render();
      })
    }
  }
  // private isLoaded = false;
  // timer = null;
  // times = 0;
  loadCSS (url: string, fontName: string, callback) {
    const link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    link.onload = () => {
      checkFontReady(`12px ${fontName}`, callback)
    }
  };

  // destroy () {
  //   // clearInterval(this.timer);
  // }
}

function checkFontReady(font, callback) {
  requestAnimationFrame(() => {
    typeof callback === 'function' && callback()
    // @ts-ignore
    const loaded = document.fonts.check(font)
    if (!loaded) {
      checkFontReady(font, callback)
    }
  })
}
