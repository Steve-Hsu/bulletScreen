const panel = document.querySelector(".panel");
const input = document.querySelector("#input_01");
const btn = document.querySelector(".input_btn");
const rect_panel = panel.getBoundingClientRect();
const frameRight = rect_panel.right;
const frameLeft = rect_panel.left;
const speedSet = [
    { ms: 16, px: 1 },
    { ms: 16, px: 2 },
    { ms: 16, px: 3 },
    { ms: 16, px: 4 },
    { ms: 16, px: 5 },
]
const TRACKS = 5;
let STRING = "";

class Bullet {
    constructor(id, str, x, y, ms, px) {
        this.id = id;
        this.str = str;
        this.x = x;
        this.y = y;
        this.ms = ms;
        this.px = px;
    }
    enterStr(str) {
        this.str = str
    }
    setSpeed(ms) {
        this.ms = ms
    }
    disPlayDiv() {
        return `<div>${str}</div>`
    }
}

panel.addEventListener("click", (e) => { });

input.addEventListener("change", (e) => {
    STRING = e.target.value;
});

btn.addEventListener("click", (e) => {
    console.log("the value of input ", input.value);
    console.log("yes", STRING);
    console.log(
        "the frameRight",
        frameRight,
        "the frameLeft",
        frameLeft,
        "the top",
        rect_panel.top
    );
    shootString(TRACKS, STRING);

    input.value = "";
    STRING = "";
});

const shootString = (tracks) => {
    let track = Math.floor(Math.random() * tracks);
    const id = Math.random().toString(36).substring(2, 15);
    let newDiv = document.createElement(Bullet);

    newDiv.classList.add("aa");
    newDiv.setAttribute("id", id);
    newDiv.innerHTML = STRING;
    newDiv.setAttribute("style", `position:absolute; left:${frameRight + 10}px; display:inline-block; background:blue; width:fit-content; width:-moz-fit-content; height:fit-content; height:-moz-fit-content;`);
    newDiv.style.top = track * 16 + 'px'

    drawDiv(newDiv);
};

const drawDiv = (div) => {
    panel.appendChild(div);
    let theDiv = div;
    const theID = div.id;
    const speed = speedSet[Math.floor(Math.random() * speedSet.length)]
    let rectX = theDiv.getBoundingClientRect().x;
    console.log("theDiv in move div", theDiv.id);
    console.log("the frameLeft of theDiv in style", rectX);
    console.log("the speed", speed)
    moveDiv(rectX, theID, speed);

};

const moveDiv = (currentX, id, speed) => {
    let divThen = document.getElementById(id);
    let theWidth = divThen.clientWidth;
    console.log("the frameLeft", frameLeft);
    console.log("the width ", divThen.clientWidth);
    console.log("the currentX", currentX);
    if (currentX < frameLeft - theWidth) return divThen.remove();
    setTimeout(() => {
        divThen.style.left = currentX + "px";
        moveDiv(currentX - speed.px, id, speed);
    }, speed.ms);
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
