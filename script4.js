const panel = document.querySelector(".panel");
const input = document.querySelector("#input_01");
const btn = document.querySelector(".input_btn");
const rect_panel = panel.getBoundingClientRect();
const frameRight = rect_panel.right;
const frameLeft = rect_panel.left;
const speedSet = [
  { ms: 16, px: 0.5 },
  { ms: 16, px: 1 },
  { ms: 16, px: 2 },
  { ms: 16, px: 3 },
  { ms: 16, px: 4 },
];
const TRACKS = 5;
let divPool = Array.from(Array(TRACKS).keys()).map((i) => []);

let STRING = "";

panel.addEventListener("click", (e) => {});

input.addEventListener("change", (e) => {
  STRING = e.target.value;
});

input.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    event.preventDefault();
    btn.click();
  }
});

btn.addEventListener("click", (e) => {
  if (STRING !== "") shootString(TRACKS - 1, STRING);

  input.value = "";
  STRING = "";
});

const shootString = (tracks, STRING) => {
  const track = Math.floor(Math.random() * tracks);

  const speed = speedSet[Math.floor(Math.random() * speedSet.length)];
  let bullet = {
    id: Math.random().toString(36).substring(2, 15),
    str: STRING,
    x: frameRight + 10,
    y: track * 20,
    ms: speed.ms,
    px: speed.px,
    getX: (x) => {
      this.x = x;
    },
  };

  divPool[track].push(bullet);
  let newDiv = document.createElement("div");
  newDiv.classList.add("bullet");
  newDiv.setAttribute("id", bullet.id);
  newDiv.innerHTML = bullet.str;
  newDiv.setAttribute(
    "style",
    `position:absolute; left:${bullet.x}px; display:inline-block; background:blue; width:fit-content; width:-moz-fit-content; height:fit-content; height:-moz-fit-content;`
  );
  newDiv.style.top = bullet.y + "px";

  drawDiv(newDiv, track);
};

const drawDiv = (div, track) => {
  panel.appendChild(div);
  let theDiv = div;
  const theID = div.id;
  let rectX = theDiv.getBoundingClientRect().x;
  moveDiv(rectX, theID, track);
};

const moveDiv = (currentX, id, track) => {
  let divThen = document.getElementById(id);
  let theWidth = divThen.clientWidth;
  let theBullet = divPool[track].find(({ id }) => id === id);
  console.log("the bullet x", theBullet.x);
  console.log(divPool);
  if (currentX < frameLeft - theWidth) {
    console.log(divPool);
    divPool[track] = divPool[track].filter((i) => i.id !== id);
    return divThen.remove();
  }

  //   console.log(divPool);
  setTimeout(() => {
    divPool[track].map((i, idx) => {
      if (i.id === id) {
        i.x = currentX;
      }
    });

    divThen.style.left = currentX + "px";
    moveDiv(currentX - theBullet.px, id, track);
  }, theBullet.ms);
};

// const startAnimation = (fps, id) => {
//   const theId = new String(id);
//   console.log("id in startAnimation", theId);
//   fpsInterval = 1000 / fps;
//   then = Date.now();
//   startTime = then;
//   animate(theId);
// };

// const

// const animate = () => {
//   requestAnimationFrame(animate);
//   now = Date.now();
//   let theDiv = document.getElementById(id);
//   elapsed = now - then;

//   if (elapsed > fpsInterval) {
//     then = now - (elapsed % fpsInterval);
//     //   console.log("the test", test);
//     //   console.log("the div", theDiv);
//   }
// };
