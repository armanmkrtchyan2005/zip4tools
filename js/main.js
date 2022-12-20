import { Coords, drawTable, circleHover } from "./Classes.js";

const pageDetailImageBlock = document.querySelector(".page-detail-image");
const pageDetailImage = pageDetailImageBlock.querySelector("img");

const coordinates = []

pageDetailImage.addEventListener("click", (e) => {
  const left = (e.offsetX * 100) / pageDetailImage.clientWidth;
  const top = (e.offsetY * 100) / pageDetailImage.clientHeight;

  const coords = new Coords(left - 1.6, top - 1.6, 20);

  coordinates.push(coords);
  coords.drawCircle(pageDetailImageBlock, coordinates);
  circleHover();
  drawTable(coordinates);
});
