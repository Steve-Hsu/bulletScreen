let btn = document.createElement("button");
let theDiv = document.querySelector("#trigger");

btn.setAttribute("style", "width:100px; height:100px; background:black;");
theDiv.setAttribute("style", "width: 100%; height: 100%;");
theDiv.appendChild(btn);
let fps = 12;
let fpsInterval, startTime, now, then, elapsed;

let swicher = false;
let anime;
btn.addEventListener("click", () => {
  fpsInterval = 1000 / fps;
  then = Date.now();
  startTime = then;

  swicher = !swicher;
  if (swicher) {
    // testFunc();
    // Or
    anima = requestAnimationFrame(testFunc);
    console.log("true", swicher);
  } else {
    cancelAnimationFrame(anima);
    console.log("false", swicher);
  }
});

const testFunc = () => {
  anima = requestAnimationFrame(testFunc);
  now = Date.now();
  elapsed = now - then;
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    console.log("yes");
  }
};
