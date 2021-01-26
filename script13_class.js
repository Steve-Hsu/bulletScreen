// Class test
const panel = document.querySelector(".panel");
const input = document.querySelector("#input_01");
const btn = document.querySelector(".input_btn");

// Class test
class BulletScreen {
  // @ Introcude:
  // @ Attribute:
  //      panel : div, The frame of the bulletScreen, in practice, it should be the screen of vedio.
  //      input : The input to enter the string for the user
  //      btn : For user to send out the meg
  //      tracks : Defines how many track of bullet you want the screen have.
  // @ Usage:
  // ".start()" : Funtion, For local user test.
  // ".STRING" : String, The variable for hold string of bullet, you can enter string to bullet with this variable.
  // ".newBullet("str")" : Function,  Create a new bullet object, which contains all information how the bullet dispalys on screen
  // ".shootSTRING(bullet)" : Function, You can shoot any string directly by this function, the attribute it takes is the object that genereated by ".newBullet()".

  constructor(tracks, panel, input, btn) {
    this.panel = panel || {};
    this.input = input || {};
    this.btn = btn || {};
    this.panel_rect = panel ? this.panel.getBoundingClientRect() : {};
    this.frameRight = this.panel_rect.right || 0;
    this.frameLeft = this.panel_rect.left || 0;
    this.frameWidth = this.panel_rect.width || 0;
    this.frameY = this.panel_rect.y || 0;
    this.speedSet = [
      { ms: 16, px: 2 },
      { ms: 16, px: 5 },
      { ms: 16, px: 8 },
    ];
    this.fontSizeSet = [18, 22, 28];
    this.tracks = tracks; // Define how may track the bulletScreen has;
    this.colorRange = 220; // Value from 0 - 255 for RGB;
    this.divPool = Array.from(Array(this.tracks).keys()).map(() => []);
    this.STRING = "";
    this.topPadding = 20;
  }

  _setSTRING(str) {
    this.STRING = str;
  }
  _setInput(str) {
    this.input.value = str;
  }

  start() {
    this._inputListener();
    this._btnListener();
  }

  //@ Set Event
  _inputListener() {
    this.input.addEventListener("change", (e) => {
      this._setSTRING(e.target.value);
    });

    this.input.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.btn.click();
      }
    });
  }
  _btnListener() {
    this.btn.addEventListener("click", () => {
      if (this.STRING !== "") {
        this.shootSTRING(this.newBullet(this.STRING), this.panel);
      }
    });
  }
  _selectTrack(tracks, pool) {
    // console.log("this.pool", this.pool);
    // console.log("the pool", pool);
    let firstLayerTrack = Math.floor(Math.random() * tracks);
    let num = 0;
    let theIndexOfshortenTrack = 0;

    // if (pool[firstLayerTrack].length > 4) {
    //   pool.map((i, idx) => {
    //     if (idx === 0) {
    //       num = i.length;
    //     }
    //     if (num < i.length) {
    //       num = i.length;
    //       theIndexOfshortenTrack = idx;
    //     }
    //   });
    // } else {
    //   theIndexOfshortenTrack = firstLayerTrack;
    // }
    theIndexOfshortenTrack = firstLayerTrack;
    return theIndexOfshortenTrack;
  }

  newBullet(str) {
    let track = this._selectTrack(this.tracks, this.divPool);
    let speed = this.speedSet[Math.floor(Math.random() * this.speedSet.length)];
    let newId = Math.random().toString(36).substring(2, 15);
    let fontSize = this.fontSizeSet[
      Math.floor(Math.random() * this.fontSizeSet.length)
    ];
    let fontColor = `rgb(${Math.floor(
      Math.random() * this.colorRange
    )},${Math.floor(Math.random() * this.colorRange)},${Math.floor(
      Math.random() * this.colorRange
    )})`;
    let PSId = this.divPool[track][this.divPool[track].length - 1]
      ? this.divPool[track][this.divPool[track].length - 1].id
      : "noPS";
    // 1 str in chinese is about 16 px, number and str in english are about 8px. Here take the central value 12.
    let widthOfStr = str.length * 12;

    let bullet = {
      id: newId,
      str,
      track,
      x: 0,
      y: 0,
      width: 0,
      tail: 0,
      ms: speed.ms,
      px: speed.px,
      timeWait: 0,
      PSId: PSId,
      collision: false,
      fontSize: fontSize,
      fontColor: fontColor,
    };
    this._setInput("");
    this._setSTRING("");
    // console.log("the bullet", bullet);
    return bullet;
  }

  shootSTRING(bullet, panel) {
    let widthOfStr = bullet.str.length * 12;
    this.divPool[bullet.track].push(bullet);
    this.rect_panel = panel.getBoundingClientRect();

    this.frameRight = this.rect_panel.right;
    this.frameLeft = this.rect_panel.left;
    this.frameWidth = this.rect_panel.width;
    this.frameY = this.rect_panel.y;
    // default bullet by the user screen
    bullet.tail = this.frameRight + widthOfStr;
    bullet.x = this.frameRight + 10;
    bullet.y =
      this.frameY +
      bullet.track * this.fontSizeSet[this.fontSizeSet.length - 1] +
      this.topPadding; // 20 is padding of top,;

    // let bullet = this.addNewStrAndPushToPool(STRING);
    let newDiv = document.createElement("div");
    newDiv.classList.add("bullet");
    newDiv.setAttribute("id", bullet.id);

    newDiv.innerHTML = bullet.str;
    newDiv.setAttribute(
      "style",
      `position:absolute; 
    left:${bullet.x}px; 
    display:inline-block;  
    width:fit-content; 
    width:-moz-fit-content; 
    height:fit-content; 
    height:-moz-fit-content;
    font-size: ${bullet.fontSize}px;
    color:${bullet.fontColor};
    visibility:hidden;
    `
    );
    //    font-size: ${fontSizeSet[Math.floor(Math.random() * fontSizeSet)]}px`
    newDiv.style.top = bullet.y + "px";

    setTimeout(() => {
      this._drawDiv(newDiv, bullet);
    }, bullet.timeWait);
  }

  _drawDiv(div, bullet) {
    this.panel.appendChild(div);
    const theDiv = div;
    const theID = theDiv.id;
    const rectX = theDiv.getBoundingClientRect().x;
    this._moveDiv(rectX, theID, bullet);
  }

  _moveDiv(currentX, id, bullet) {
    let rect_panel = this.panel.getBoundingClientRect();
    let current_left = rect_panel.left;
    let current_right = rect_panel.right;
    let targetDiv = document.getElementById(id);
    let theWidth = targetDiv.clientWidth;
    let currentTrack = bullet.track;
    let bulletId = bullet.id;
    let bulletMs = bullet.ms;
    let disappearPoint = 0.8;

    //If the div's body (disappearPoint) run into the left side of the frame
    if (currentX + theWidth * disappearPoint < current_left) {
      let disappearSpeed = Number("0.8" + bulletMs);
      let newFontSize =
        Number(targetDiv.style.fontSize.slice(0, -2)) * disappearSpeed;

      targetDiv.style.fontSize = newFontSize + "px";
    }
    //If the div run into the left side of the frame
    if (currentX < current_left - theWidth / disappearPoint) {
      this.divPool[currentTrack] = this.divPool[currentTrack].filter(
        (i) => i.id !== bulletId
      );
      // console.log(this.divPool);
      return targetDiv.remove();
    }

    let PS = this.divPool[currentTrack].find(({ id }) => id === bullet.PSId);
    let PStail = PS ? PS.tail : 0;
    let bulletPx = bullet.px;
    let newPosition = currentX;

    setTimeout(() => {
      this.divPool[currentTrack].map((i, idx) => {
        if (i.id === bulletId) {
          i.x = currentX;
          i.width = theWidth;
          i.tail = currentX + theWidth;
          i.y = rect_panel.y + i.track * 28 + 2;
          if (PS && currentX < PStail) {
            // targetDiv.style.color = "black";

            // if the currentStr accidentally run ahead the previous str, then slow it down
            bulletPx = 0;
          } else if (PS && currentX < 5 + PStail) {
            bulletPx = 2;
          } else if (PS && currentX < 30 + PStail) {
            bulletPx = 2.5;
          } else if (PS && currentX < 60 + PStail) {
            bulletPx = 3.5;
          } else if (PS && currentX < 90 + PStail) {
            bulletPx = 3.8;
          } else if (PS && currentX < 120 + PStail) {
            bulletPx = 4;
          } else if (PS && currentX < 160 + PStail) {
            bulletPx = bulletPx * 0.952;
          }
          // Display the bullet only when the bullet start to run, if it is wating then don't show it.
          if ((currentX > current_right && bulletPx > 0) || !PS) {
            targetDiv.style.visibility = "visible";
          }
        }
      });

      targetDiv.style.left = currentX + "px";
      this._moveDiv(newPosition - bulletPx, id, bullet);
    }, bulletMs);
  }
}

// Test
let bulletScreen = new BulletScreen(10, panel, input, btn);
bulletScreen.start();
