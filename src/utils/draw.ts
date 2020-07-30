export const drawLine = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color?: string
) => {
  if (color) {
    ctx.save();
    ctx.strokeStyle = color;
  }
  ctx.beginPath();
  ctx.moveTo(startX + 0.5, startY + 0.5);
  ctx.lineTo(endX + 0.5, endY + 0.5);
  ctx.closePath();
  ctx.stroke();

  if (color) {
    ctx.restore()
  }
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  width: number,
  height: number,
  color?: string
) => {
  if (color) {
    ctx.save();
    ctx.fillStyle = color;
  }
  ctx.fillRect(startX, startY, width, height);

  if (color) {
    ctx.restore();
  }
};

export const text2Ellipsis = (
  ctx: CanvasRenderingContext2D,
  str: string,
  maxWidth: number,
  ellipsis = '…'
) => {
  if (typeof str !== 'string') {
    return str;
  }
  const len = str.length;
  if (len === 0) {
    return str;
  }

  let ellipsisWidth = ctx.measureText(ellipsis).width;
  let maxStr = '';
  let maxStrWidth = 0;
  let i = 0;
  do {
    i ++;
    maxStr = str.substring(0, i);
    maxStrWidth = ctx.measureText(maxStr).width;
  } while (maxStrWidth < maxWidth && i < len);

  if (i === len && (maxStrWidth <= maxWidth || maxStrWidth <= ellipsisWidth)) {
    return maxStr;
  } else {
    while (maxStrWidth + ellipsisWidth >= maxWidth && i > 0) {
      maxStr = maxStr.substring(0, i);
      maxStrWidth = ctx.measureText(maxStr).width;
      i --;
    }
    return maxStr.substring(0, i) + ellipsis;
  }
};

export const noData = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  originW = 140
) => {
  let originH = originW + originW * 0.4;
  let centerX = x + w / 2;
  let centerY = y + h / 2 - (originH - originW);
  ctx.save();
  ctx.fillStyle = '#ebebeb';
  ctx.beginPath();
  ctx.arc(centerX, centerY, originW / 2, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = originW / 20;
  ctx.beginPath();
  let rectWidth = originW / 3;
  let degree = 30;
  let radians = Math.PI / (180 / degree);
  let cosWidth = Math.cos(radians) * rectWidth;
  let sinWidth = Math.sin(radians) * rectWidth;
  ctx.save();
  ctx.beginPath();
  ctx.lineTo(centerX, centerY - sinWidth * 2); // top
  ctx.lineTo(centerX + cosWidth, centerY - sinWidth); // right-top
  ctx.lineTo(centerX + cosWidth, centerY - sinWidth + rectWidth); // right-bottom
  ctx.lineTo(centerX, centerY + rectWidth); // bottom
  ctx.lineTo(centerX - cosWidth, centerY - sinWidth + rectWidth); // left-bottom
  ctx.lineTo(centerX - cosWidth, centerY - sinWidth); // left-top
  ctx.closePath();
  ctx.stroke();

  // center to left-top
  ctx.beginPath();
  ctx.lineTo(centerX, centerY);
  ctx.lineTo(centerX - cosWidth, centerY - sinWidth);
  ctx.stroke();

  // center to right-top
  ctx.beginPath();
  ctx.lineTo(centerX, centerY);
  ctx.lineTo(centerX + cosWidth, centerY - sinWidth); // right-top
  ctx.stroke();

  // center to bottom
  ctx.beginPath();
  ctx.lineTo(centerX, centerY);
  ctx.lineTo(centerX, centerY + rectWidth);
  ctx.stroke();

  // top line
  ctx.beginPath();
  ctx.lineTo(centerX + cosWidth / 2, centerY - sinWidth / 2);
  ctx.lineTo(centerX - cosWidth / 2, centerY - 3 * sinWidth / 2);
  ctx.stroke();
  ctx.restore();

  let fontSize = originW * 0.2;
  ctx.fillStyle = '#cecece';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = fontSize + 'px -apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei","Helvetica Neue",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"';
  ctx.fillText('暂无数据', centerX, centerY + originW / 2 + (originH - originW) / 2);
  ctx.restore();
};

// export const drawSvg = (
//   ctx: CanvasRenderingContext2D,
//   svg: SVGElement,
//   x: number, y: number
// ) => {
//   if (svg && ctx) {
//     const img = document.createElement('img');
//     // get svg data
//     const xml = new XMLSerializer().serializeToString(svg);
//
//     // make it base64
//     const svg64 = btoa(xml);
//     const b64Start = 'data:image/svg+xml;base64,';
//
//     // prepend a "header"
//     const image64 = b64Start + svg64;
//
//     // set it as the source of the img element
//     img.onload = function () {
//       // draw the image onto the canvas
//       // ctx.drawSvg(img, x, y);
//       ctx.drawImage(img, x, y, 10, 10)
//     };
//     img.src = image64;
//
//     // document.body.appendChild(svg)
//
//     // canvg(ctx.canvas, '<svg id="sss" class="icon svg-icon" aria-hidden="true">' +
//     //   '<use xlink:href="#icon-chuangwei"></use>' +
//     //   '</svg>', {
//     //   offsetX: x,
//     //   offsetY: y,
//     //   scaleWidth: 10,
//     //   scaleHeight: 10
//     // });
//   }
//
// };
