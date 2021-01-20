const canvas = document.getElementById("canvas1");
const input = document.querySelector("#input_01");
const btn = document.querySelector(".input_btn");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;
let STRING = "";

// panel.addEventListener("click", (e) => {});

input.addEventListener("change", (e) => {
  STRING = e.target.value;
  div.str = e.target.value;
  console.log(STRING);
});

input.addEventListener("keyup", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    btn.click();
  }
});

btn.addEventListener("click", (e) => {
  if (STRING !== "") startAnimation(30);

  input.value = "";
  STRING = "";
});

const div = {
  x: canvas.width,
  y: 300,
  width: 40,
  height: 40,
  speed: 9,
  str: "",
};

const moveDiv = () => {
  div.x -= div.speed;
  console.log(div);
};

const drawDiv = (str) => {
  console.log("the str", str);
  ctx.fillStyle = "rgb(200,0,0)";
  ctx.font = "48px serif";

  ctx.fillText(str, div.x, div.y);
};

const startAnimation = (fps) => {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;
  animate();
};

const animate = () => {
  requestAnimationFrame(animate);

  now = Date.now();

  elapsed = now - then;

  if (elapsed > fpsInterval) {
    if (div.x > 0 - div.width) {
      then = now - (elapsed % fpsInterval);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      moveDiv();
      drawDiv(div.str);
      console.log("string in animate", STRING);
    }
  }
};
