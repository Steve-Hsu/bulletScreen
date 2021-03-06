//@ Default variables-----------------------------------------------------------------------
const panel = document.querySelector(".panel");
const input = document.querySelector("#input_01");
const btn = document.querySelector(".input_btn");
let rect_panel = panel.getBoundingClientRect();
let frameRight = rect_panel.right;
let frameLeft = rect_panel.left;
let frameWidth = rect_panel.width;
let frameY = rect_panel.y;
const speedSet = [
  { ms: 16, px: 2 },
  { ms: 16, px: 5 },
  { ms: 16, px: 8 },
];
const fontSizeSet = [18, 22, 28];
const TRACKS = 8;
const colorRange = 220; // Value from 0 - 255 for RGB;

let divPool = Array.from(Array(TRACKS).keys()).map((i) => []);
let STRING = "";
//@ Event trigger-----------------------------------------------------------------------
input.addEventListener("change", (e) => {
  STRING = e.target.value;
});

input.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    btn.click();
  }
});

btn.addEventListener("click", () => {
  if (STRING !== "") {
    shootString(STRING);
    input.value = "";
    STRING = "";
  }
});

//@ functions-----------------------------------------------------------------------
const selectTrack = (tracks, pool) => {
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

const addNewStrAndPushToPool = (str) => {
  //random Track
  const tracks = TRACKS; // Get start from 0 to TRACKS - 1.
  const track = selectTrack(tracks, divPool);
  const speed = speedSet[Math.floor(Math.random() * speedSet.length)];
  const newId = Math.random().toString(36).substring(2, 15);
  const fontSize = fontSizeSet[Math.floor(Math.random() * fontSizeSet.length)];
  const fontColor = `rgb(${Math.floor(Math.random() * colorRange)},${Math.floor(
    Math.random() * colorRange
  )},${Math.floor(Math.random() * colorRange)})`;
  const PSId = divPool[track][divPool[track].length - 1]
    ? divPool[track][divPool[track].length - 1].id
    : "noPS";

  // 1 str in chinese is about 16 px, number and str in english are about 8px. Here take the central value 12.
  const widthOfStr = str.length * 12;
  let bullet = {
    id: newId,
    str,
    track,
    x: frameRight + 10,
    y: frameY + track * 28 + 2,
    width: 0,
    tail: frameRight + widthOfStr,
    ms: speed.ms,
    px: speed.px,
    timeWait: 0,
    PSId: PSId,
    collision: false,
    fontSize: fontSize,
    fontColor: fontColor,
  };
  //   const trackIndex = track - 1;

  divPool[track].push(bullet);
  console.log(bullet);
  return bullet;
};

const shootString = (STRING) => {
  // Renew the width of the panel to prevent not match the size if user change the width of the window;
  rect_panel = panel.getBoundingClientRect();
  frameRight = rect_panel.right;
  frameLeft = rect_panel.left;
  frameWidth = rect_panel.width;
  frameY = rect_panel.y;

  let bullet = addNewStrAndPushToPool(STRING);

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
    drawDiv(newDiv, bullet);
  }, bullet.timeWait);
};

const drawDiv = (div, bullet) => {
  panel.appendChild(div);
  let theDiv = div;
  const theID = div.id;
  let rectX = theDiv.getBoundingClientRect().x;
  moveDiv(rectX, theID, bullet);
};

const moveDiv = (currentX, id, bullet) => {
  // Renew the width of the panel to prevent not match the size if user change the width of the window;
  rect_panel = panel.getBoundingClientRect();
  let current_left = rect_panel.left;
  let divThen = document.getElementById(id);
  let theWidth = divThen.clientWidth;
  const currentTrack = bullet.track;

  const bulletId = bullet.id;

  const bulletMs = bullet.ms;

  //If the div run into the left side of the frame
  if (currentX < current_left - theWidth) {
    divPool[currentTrack] = divPool[currentTrack].filter(
      (i) => i.id !== bulletId
    );
    console.log(divPool);
    return divThen.remove();
  }
  //user change the width of the screen delete the current div

  const PS = divPool[currentTrack].find(({ id }) => id === bullet.PSId);
  const PStail = PS ? PS.tail : 0;
  let bulletPx = bullet.px;
  let newPosition = currentX;

  setTimeout(() => {
    divPool[currentTrack].map((i, idx) => {
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

    divThen.style.left = currentX + "px";
    moveDiv(newPosition - bulletPx, id, bullet);
  }, bulletMs);
};
