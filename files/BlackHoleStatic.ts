import 'easter-eggs.css'

export default class BlackHoleStatic {
  static run(text): void {
    new BlackHole(text);
  }

}

class BlackHole {

  constructor(message:String) {
    if (message && message.indexOf('keyword') > -1)
      this.start();
  }

  start() {
    let imgs = document.querySelectorAll("img");
    let imgArray = Array.prototype.slice.call(imgs);
    let delay = 800;
    let hole = this.createBlackHole();
    imgArray.forEach(img => {
      if (!this.isHidden(img) && img.src && img.src.indexOf('blackhole') == -1) {
        let point = this.getAbsPoint(img);
        if (point.y > -400 && point.y < 1200) {
          img.style.visibility = 'hidden';
          this.startFlit(img, point, delay);
          delay += 1000 / imgArray.length;
        }
      }
    });

    window.setTimeout(() => {
      imgArray.forEach(img => {
        img.style.visibility = 'visible';
      });
      document.body.removeChild(hole);
    }, 4000);
  }

  createBlackHole() {
    let div = document.createElement('div');
    div.className = 'blackhole-container';
    document.body.appendChild(div);
    let hole = document.createElement('img');
    hole.src = 'static/uploadsys/images/common/blackhole.png';
    hole.className = "rotate";
    div.appendChild(hole);
    return div;
  }

  isHidden(element) {
    if (element.style.display === 'none' || element.style.visibility === 'hidden')
      return true;
    if (element.parentNode && (element.parentNode.style.display === 'none' 
      || element.parentNode.style.visibility === 'hidden'))
      return true;
    return false;
  }

  startFlit(imgOrigin, point, delay) {
    let img = document.createElement('img');
    img.src = imgOrigin.src;
    img.className = 'blackhole-flit';
    img.style.width = imgOrigin.width + 'px';
    img.style.height = imgOrigin.height + 'px';
    img.style.top = point.y + 'px';
    img.style.left = point.x + 'px';
    document.body.appendChild(img);
    let clientWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let clientHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    img.animate(
      [
        { top: img.style.top, left: img.style.left, width: img.style.width, height: img.style.height, opacity: 1 },
        { top: `${clientHeight / 2}px`, left: `${clientWidth / 2}px`, width: `${imgOrigin.width / 2}px`, height: `${imgOrigin.height / 2}px`, opacity: 0 }
      ],
      {
        duration: 2500 - delay,
        delay,
      }
    ).onfinish = function() {
      document.body.removeChild(img);
    };
  }


  getAbsPoint(obj) {
    var x, y;
    var oRect = obj.getBoundingClientRect();
    x = oRect.left;
    y = oRect.top;
    return { x: x, y: y };
  }

}

