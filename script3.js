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
let divPool = []
let STRING = "";

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
    const track = Math.floor(Math.random() * tracks);
    const speed = speedSet[Math.floor(Math.random() * speedSet.length)]
    let bullet = {
        id: Math.random().toString(36).substring(2, 15),
        str: STRING,
        x: frameRight + 10,
        y: track * 16,
        ms: speed.ms,
        px: speed.px,
    }
    divPool.push(bullet)
    let newDiv = document.createElement("div");
    newDiv.classList.add("bullet");
    newDiv.setAttribute("id", bullet.id);
    newDiv.innerHTML = bullet.str;
    newDiv.setAttribute("style", `position:absolute; left:${bullet.x}px; display:inline-block; background:blue; width:fit-content; width:-moz-fit-content; height:fit-content; height:-moz-fit-content;`);
    newDiv.style.top = bullet.y + 'px'

    drawDiv(newDiv);
};

const drawDiv = (div) => {
    panel.appendChild(div);
    let theDiv = div;
    const theID = div.id;
    let rectX = theDiv.getBoundingClientRect().x;
    moveDiv(rectX, theID);
};

const moveDiv = (currentX, id) => {
    let divThen = document.getElementById(id);
    let theWidth = divThen.clientWidth;

    let theBullet = divPool.find(({ id }) => id === id)

    if (currentX < frameLeft - theWidth) return divThen.remove();
    setTimeout(() => {
        theBullet.x = currentX;
        console.log(divPool)
        divThen.style.left = currentX + "px";
        moveDiv(currentX - theBullet.px, id);
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
