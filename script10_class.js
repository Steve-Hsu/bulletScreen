// Class test
const panel = document.querySelector(".panel");
const input = document.querySelector("#input_01");
const btn = document.querySelector(".input_btn");

class BulletScreen {
  // @ Introcude:
  // @ Attribute:
  //      panel : div, The frame of the bulletScreen, in practice, it should be the screen of vedio.
  //      input : the input to enter the string for the user
  //      btn : For user to send out the meg
  // @ Usage:
  // ".start()" : After declare a instance for the class, call this function to start the addEventListener for input and btn.
  // ".shootSTRING("the String here")" : You can shoot any string directly by this function, the attribute it takes is the string you enter.

  constructor(panel, input, btn, tracks) {
    this.panel = panel;
    this.input = input;
    this.btn = btn;
    this.panel_rect = this.panel.getBoundingClientRect;
    this.frameRight = this.panel_rect.right;
    this.frameLeft = this.panel_rect.left;
    this.frameWidth = this.panel_rect.width;
    this.frameY = this.panel_rect.y;
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
  }

  setSTRING = (str) => {
    this.STRING = str;
  };
  setInput = (str) => {
    this.input.value = str;
  };

  start = () => {
    this.inputListener();
    this.btnListener();
  };

  //@ Set Event
  inputListener = () => {
    this.input.addEventListener("change", (e) => {
      this.setSTRING(e.target.value);
    });

    this.input.addEventListener("keyup", (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        this.btn.click();
      }
    });
  };
  btnListener = () => {
    this.btn.addEventListener("click", () => {
      if (this.STRING !== "") {
        this.shootSTRING(this.STRING);
        this.setInput("");
        this.setSTRING("");
      }
    });
  };
  selectTrack = (tracks, pool) => {
    // console.log("this.pool", this.pool);
    console.log("the pool", pool);
    let firstLayerTrack = Math.floor(Math.random() * tracks);
    let num = 0;
    let theIndexOfshortenTrack = 0;

    if (pool[firstLayerTrack].length > 2) {
      pool.map((i, idx) => {
        if (idx === 0) {
          num = i.length;
        }
        if (num < i.length) {
          num = i.length;
          theIndexOfshortenTrack = idx;
        }
      });
    } else {
      theIndexOfshortenTrack = firstLayerTrack;
    }
    return theIndexOfshortenTrack;
  };

  addNewStrAndPushToPool = (str) => {
    // const tracks = this.TRACKS; // Get start from 0 to TRACKS - 1.
    // let pool = this.divPool;
    let track = this.selectTrack(this.tracks, this.divPool);
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
      x: this.frameRight + 10,
      y: this.frameY + track * 28 + 2,
      width: 0,
      tail: this.frameRight + widthOfStr,
      ms: speed.ms,
      px: speed.px,
      timeWait: 0,
      PSId: PSId,
      collision: false,
      fontSize: fontSize,
      fontColor: fontColor,
    };
    //   const trackIndex = track - 1;

    this.divPool[track].push(bullet);
    console.log(bullet);
    return bullet;
  };

  shootSTRING = (STRING) => {
    let bullet = this.addNewStrAndPushToPool(STRING);
    this.rect_panel = this.panel.getBoundingClientRect();
    this.frameRight = this.rect_panel.right;
    this.frameLeft = this.rect_panel.left;
    this.frameWidth = this.rect_panel.width;
    this.frameY = this.rect_panel.y;

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
    `
    );
    //    font-size: ${fontSizeSet[Math.floor(Math.random() * fontSizeSet)]}px`
    newDiv.style.top = bullet.y + "px";

    setTimeout(() => {
      this.drawDiv(newDiv, bullet);
    }, bullet.timeWait);
  };

  drawDiv = (div, bullet) => {
    this.panel.appendChild(div);
    const theDiv = div;
    const theID = theDiv.id;
    const rectX = theDiv.getBoundingClientRect().x;
    this.moveDiv(rectX, theID, bullet);
  };

  moveDiv = (currentX, id, bullet) => {
    let rect_panel = this.panel.getBoundingClientRect();
    let current_left = rect_panel.left;
    let targetDiv = document.getElementById(id);
    let theWidth = targetDiv.clientWidth;
    let currentTrack = bullet.track;
    let bulletId = bullet.id;
    let bulletMs = bullet.ms;
    //If the div run into the left side of the frame
    if (currentX < current_left - theWidth) {
      this.divPool[currentTrack] = this.divPool[currentTrack].filter(
        (i) => i.id !== bulletId
      );
      console.log(this.divPool);
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
            // if the currentStr accidentally run ahead the previous str, then slow it down
            bulletPx = 1;
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
        }
      });

      targetDiv.style.left = currentX + "px";
      this.moveDiv(newPosition - bulletPx, id, bullet);
    }, bulletMs);
  };
}

// Test
let bulletScreen = new BulletScreen(panel, input, btn, 4);
bulletScreen.start();
