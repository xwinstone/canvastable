import CanvasTable from "../core/CanvasTable";

export class CanvasIconFont {
  constructor (private props: {src: string, table: CanvasTable}) {
    if (props.src) {
      this.loadCSS(props.src, () => {
        this._isLoaded = true;
        props.table.render();
      })
    }
  }

  private _isLoaded = false;
  get isLoaded () {
    return this._isLoaded;
  }

  timer = null;
  times = 0;
  loadCSS (url: string, callback) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;

    document.head.appendChild(link);

    link.onload =  () => {
      if (callback) {
        this.timer = setInterval(() => {
          callback(link);
          this.times ++;
          if (this.times > 5) {
            clearInterval(this.timer);
            this.timer = null
          }
        }, 30)
      }
    };
    // var img = document.createElement('img');
    // img.onerror = function () {
    //   if (callback) {
    //     setTimeout(() => {
    //       callback(link);
    //     }, 28)
    //   }
    // };
    // img.src = url;
  };

  destroy () {
    clearInterval(this.timer);
  }
}

