// Class test
const panel = document.querySelector(".panel");
const input = document.querySelector("#input_01");
const btn = document.querySelector(".input_btn");

// Class test
class BulletScreen {
  // @ Attribute:
  //      tracks : Defines how many track of bullet you want the screen have.
  //      panel : div, The frame of the bulletScreen, in practice, it should be the screen of vedio.
  //      input : The input to enter the string for the user
  //      btn : For user to send out the meg

  // @ Usage:
  // ".start()" : Function, For local user test.
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
        this._setInput("");
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
  _selectTrack(tracks) {
    let firstLayerTrack = Math.floor(Math.random() * tracks);
    let theIndexOfshortenTrack = 0;

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

    this._setSTRING("");

    return bullet;
  }

  shootSTRING(bullet, panel) {
    // 1 str in chinese is about 16 px, number and str in english are about 8px. Here take the central value 12.
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

const lyric = [
  "早知結果如此何必當初曾相逢",
  "相逢之後何須再問分手的理由",
  "沒有月的星空",
  "是我自己的星空",
  "我飛也可以 跳也可以",
  "不感到寂寞 有流星陪伴我",
  "當然也許妳會感到一絲絲愧疚",
  "諾言本身不會後悔出口的理由",
  "沒有妳的影蹤",
  "有我自己的影蹤",
  "我哭也可以 笑也可以",
  "天長或地久 是愛情的盡頭",
  "下著雨的夜晚最美",
  "將所有景物拋在半空之間",
  "有妳的笑我無法成眠",
  "無法成眠",
  "怎又回到了起點",
  "快讓我沒有力氣",
  "快讓我沒有力氣",
  "去想念妳",
  "讓我可以隨著落在窗外的小雨消失在茫茫大地",
  "讓我飛～讓我飛～在夜空",
  "夜空裡才會讓我的心和懦弱那頭離得比較遠",
  "飛翔時傷悲是一種奢侈的行為",
  "我怎麼突然有一種莫名的喜悅當我穿梭在黑暗裡面",
  "讓我飛～讓我飛～在夜空",
  "夜空裡才會讓我的心和懦弱那頭離得比較遠",
  "飛翔時傷悲是一種奢侈的行為",
  "我變成一朵放縱的輕煙和小雨纏綿在冷冷北風裡面…",
];

const lyric2 = [
  "たとえば",
  "どうにかして君の中 ああ入っていって",
  "その瞳から僕をのぞいたら",
  "いろんなことちょっとはわかるかも",
  "愛すれば",
  "愛するほど",
  "霧の中迷いこんで",
  "手をつないだら行ってみよう",
  "燃えるような月の輝く丘に",
  "迎えにゆくからそこにいてよ",
  "かけらでもいい",
  "君の気持ち知るまで",
  "今夜僕は寝ないよ",
  "痛いこと",
  "気持ちいいこと",
  "それはみんな人それぞれで",
  "ちょっとした違いにつまづいて",
  "またしても僕は派手にころんだ",
  "傷ついて",
  "やっとわかる",
  "それでもいい",
  "遅くはない",
  "手をつないだら行ってみよう",
  "あやしい星の潜む丘に 茂みの奥へと進んでゆこう",
  "怪我してもいい",
  "はじけるような笑顔の",
  "向こう側をみたいよ",
  "手をつないだら行ってみよう",
  "まんまるい月の輝く丘に",
  "誰もがみんな照らしだされて",
  "心の模様が空に映ってる",
  "いつでもそうやって",
  "笑ってないで",
  "かけらでもいい",
  "君の気持ち知るまで",
  "今夜は一緒にいたいよ",
];

const lyric3 = [
  "On the first page of our story",
  "The future seemed so bright",
  "Then this thing turned out so evil",
  "I don't know why I'm still surprised",
  "Even angels have their wicked schemes",
  "And you take that to new extremes",
  "But you'll always be my hero",
  "Even though you've lost your mind",
  "Just gonna stand there and watch me burn",
  "Well that's alright because I like the way it hurts",
  "Just gonna stand there and hear me cry",
  "Well that's alright because I love the way you lie",
  "Now there's gravel in our voices",
  "Glasses shattered from the fight",
  "In this tug of war you always win",
  "Even when I'm right",
  "Cuz you feed me fables from your head",
  "With violent words and empty threats",
  "And it's sick that all these battlesAre what keeps me satisfied",
  "Just gonna stand there and watch me burn",
  "Well that's alright because I like the way it hurts",
  "Just gonna stand there and hear me cry",
  "Well that's alright because I love the way you lie",
  "I love the way you lieI love the way you lie",
  "So maybe I'm a masochist",
  "I try to run but I don't wanna ever leave",
  "Till the walls are going up",
  "I love the way you lie",
  "I love the way you lie",
];

let lyric4 = [];
let repeatTime = 10;

for (let t = 0; t < repeatTime; t++) {
  [lyric, lyric2, lyric3].map((arr) => {
    arr.map((i) => {
      lyric4.push(i);
    });
  });
}

let time = 0;
console.log(lyric4);

const t0 = performance.now();

const checkTime = lyric4.map((i) => {
  new Promise((resolve) => {
    time = time + 300;
    setTimeout(() => {
      bulletScreen.shootSTRING(bulletScreen.newBullet(i), bulletScreen.panel);
    }, time);
    resolve();
  });
});

Promise.all(checkTime).then(() => {
  const t1 = performance.now();
  console.log("Call the map lyrics takes" + (t1 - t0) + " milliseonds");
});
