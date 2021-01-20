//@ Default variables-----------------------------------------------------------------------
const panel = document.querySelector(".panel");
const input = document.querySelector("#input_01");
const btn = document.querySelector(".input_btn");
const rect_panel = panel.getBoundingClientRect();
const frameRight = rect_panel.right;
const frameLeft = rect_panel.left;
const frameWidth = rect_panel.width;
const frameY = rect_panel.y;
const speedSet = [
  // { ms: 16, px: 0.5 },
  // { ms: 16, px: 1 },
  { ms: 16, px: 4 },
  { ms: 16, px: 5 },
  { ms: 16, px: 6 },
];
const TRACKS = 5;
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
  if (STRING !== "") shootString(STRING);
  input.value = "";
  STRING = "";
});

//@ functions-----------------------------------------------------------------------
const getWaitTime = (id, track, pool, ms, px, widthOfframe) => {
  const trackIndex = track - 1;
  console.log(id);
  if (pool[trackIndex].length === 0) return 0;
  let firstStr = pool[trackIndex][0];
  let previousStr = pool[trackIndex][pool[trackIndex].length - 1];
  //   let FtTail = firstStr.tail;
  //   let FtMs = firstStr.ms;
  //   let FtPx = firstStr.px;
  let PSTail = previousStr.tail;
  let PSMs = previousStr.ms;
  let PSpx = previousStr.px;
  //   console.log("the pool track", pool[track]);
  let PSTimeWaits = 0;
  pool[trackIndex].map((i) => {
    if (i.id !== id) {
      let theRuningTime;
      let distance = i.tail - frameLeft;
      theRuningTime = (distance / i.px) * i.ms;
      PSTimeWaits += theRuningTime;
      //   console.log("the item.timeWait", x.runingTime);
    }
  });
  console.log("the PSTIMEWait", PSTimeWaits);
  //   let positionOfPS = previousStr.x;
  //   let myRuningTime = (widthOfframe / px) * ms;
  //   let firstItemGap =
  //     ((frameRight - FtTail) / FtPx) * FtMs !== 0
  //       ? ((frameRight - FtTail) / FtPx) * FtMs
  //       : 0;
  let previousGap =
    ((frameRight - PSTail) / PSpx) * PSMs !== 0
      ? ((frameRight - PSTail) / PSpx) * PSMs
      : 0;

  console.log("PSpx", PSpx);
  //   console.log("the gap", (frameRight - PSTail) / PSpx);
  console.log("the PSTTail", PSTail);
  console.log("the frameRight", frameRight);
  console.log("the previousGap", previousGap);
  //   let waitTime = PSTimeWaits - (positionOfPS / PSpx) * PSMs + myRuningTime;
  let waitTime = PSTimeWaits - previousGap;
  //   let waitTime = (positionOfPS / PSpx) * PSMs - myRuningTime;

  return waitTime;
};

const runingTime = (ms, px, widthOfframe) => {
  let myRuningTime = (widthOfframe / px) * ms;
  return myRuningTime;
};

const addNewStrAndPushToPool = (str) => {
  //random Track
  const tracks = TRACKS; // Get start from 0 to TRACKS - 1.
  const track = Math.floor(Math.random() * tracks);
  console.log("the track", track);
  //   const speed = speedSet[0];
  const speed = speedSet[Math.floor(Math.random() * speedSet.length)];
  //   const myRunningTime = (speed.ms / speed.px)

  const newId = Math.random().toString(36).substring(2, 15);
  let bullet = {
    id: newId,
    str,
    track,
    x: frameRight + 10,
    y: frameY + track * 20,
    width: 0,
    tail: frameRight + 20,
    ms: speed.ms,
    px: speed.px,
    getX: (x) => {
      this.x = x;
    },
    runingTime: runingTime(speed.ms, speed.px, frameWidth),
    timeWait: getWaitTime(
      newId,
      track,
      divPool,
      frameWidth,
      speed.ms,
      speed.px,
      frameWidth
    ),
  };
  const trackIndex = track - 1;

  divPool[trackIndex].push(bullet);
  console.log(bullet);
  return bullet;
};

const shootString = (STRING) => {
  let bullet = addNewStrAndPushToPool(STRING);

  let newDiv = document.createElement("div");
  newDiv.classList.add("bullet");
  newDiv.setAttribute("id", bullet.id);
  newDiv.setAttribute("class", "bullet");
  newDiv.innerHTML = bullet.str;
  newDiv.setAttribute(
    "style",
    `position:absolute; left:${bullet.x}px; display:inline-block;  width:fit-content; width:-moz-fit-content; height:fit-content; height:-moz-fit-content;`
  );
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
  let divThen = document.getElementById(id);
  let theWidth = divThen.clientWidth;
  const currentTracck = bullet.track;
  const trackIndex = currentTracck - 1;
  const bulletId = bullet.id;
  const bulletPx = bullet.px;
  const bulletMs = bullet.ms;

  if (currentX < frameLeft - theWidth) {
    // console.log(divPool);
    divPool[currentTracck] = divPool[currentTracck].filter(
      (i) => i.id !== bulletId
    );
    return divThen.remove();
  }

  //   console.log(divPool);
  setTimeout(() => {
    divPool[trackIndex].map((i, idx) => {
      if (i.id === bulletId) {
        i.x = currentX;
        i.width = theWidth;
        i.tail = currentX + theWidth;
      }
    });

    divThen.style.left = currentX + "px";
    moveDiv(currentX - bulletPx, id, bullet);
  }, bulletMs);
};
