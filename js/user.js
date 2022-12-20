localStorage.clear();

function circleHover() {
  const circles = document.querySelectorAll(".page-detail-image div");

  circles.forEach((circle) => {
    circle.addEventListener("mouseover", () => {
      const tr = document.querySelectorAll(
        `[data-id="${circle.dataset.id}"]`
      )[1];
      tr.classList.add("hovered");
    });
    circle.addEventListener("mouseout", () => {
      const tr = document.querySelectorAll(
        `[data-id="${circle.dataset.id}"]`
      )[1];
      tr.classList.remove("hovered");
    });
  });
}

function drawProduct(data, circle) {
  const flyDiv = document.createElement("div");

  flyDiv.addEventListener("click", (e) => {
    e.stopPropagation();
  });
  flyDiv.className = "fly-div";

  document.onclick = function (e) {
    if (circle.classList[0] !== e.target.classList[0]) {
      flyDiv.remove();
      circle.classList.remove("active");
    }
  };

  flyDiv.innerHTML = `
	<div class="inner">
		<a href="#link">
			<div class="img">
				<img src="${data?.data?.img}" alt="product" />
			</div>
			<div class="title">
				${data?.data?.title}
			</div>
			<div class="price">${data?.data?.price} руб</div>
			<div class="status ${
        data?.data?.status ? "status-347 fa fa-check" : "status-348 fa fa-times"
      }">${data?.data?.status ? "В наличии" : "Нет в наличии"}</div>
			<div class="article">
				<span>Артикул:</span>
				${data?.data?.article}
			</div>
		</a>
		<a href="#${data?.data?.status ? "basket" : "bell"}" class="${
    data?.data?.status ? "buy fa fa-shopping-cart" : "bell fa fa-bell"
  }"></a>
	</div>
    
  `;

  circle.appendChild(flyDiv);

  const y = flyDiv.getBoundingClientRect().top + window.scrollY;
  window.scroll({
    top: y,
    behavior: "smooth",
  });
}

async function start() {
  const pageDetailImageBlock = document.querySelector(".page-detail-image");
  const pageDetailImage = pageDetailImageBlock.querySelector("img");
  const tbody = document.querySelector("tbody");

  const res = await fetch("/data/data.json");
  const data = await res.json();

  tbody.innerHTML = "";
  data.forEach((coord) => {
    const circle = document.createElement("div");
    circle.setAttribute("data-id", coord.id);
    circle.style.width = coord.circle + "px";
    circle.style.height = coord.circle + "px";
    circle.style.left = coord.left + "%";
    circle.style.top = coord.top + "%";

    tbody.innerHTML += `
			<tr
          data-left="${coord.left}"
          data-top="${coord.top}"
          data-circle="${coord.circle}"
          data-id="${coord.id}"
      >
        <td>${coord.id}</td>
        <td>
          <a
            target="_blank"
            href="#"
            title="Подробнее"
            >${coord.data.title}</a
          >
        </td>
        <td>${coord.data.price} ₽</td>
      </tr>
		`;

    const trList = tbody.querySelectorAll("tr");
    trList.forEach((tr) => {
      tr.addEventListener("mouseover", () => {
        const circle = document.querySelector(`[data-id="${tr.dataset.id}"]`);
        circle.classList.add("hovered");
      });
      tr.addEventListener("mouseout", () => {
        const circle = document.querySelector(`[data-id="${tr.dataset.id}"]`);
        circle.classList.remove("hovered");
      });
    });

    circle.addEventListener("click", (e) => {
      circle.classList.toggle("active");

      const actives = document.querySelectorAll(".active");
      actives.forEach((active) => {
        if (active.dataset.id != e.target.dataset.id) {
          active.classList.remove("active");
          active.firstChild.remove();
        }
      });
      if (circle.classList[0] == "active") {
        drawProduct(coord, circle);
      } else {
        circle.querySelector(".fly-div").remove();
        e.target.classList.remove("active");
      }
    });

    pageDetailImageBlock.appendChild(circle);
    circleHover();
  });
}

start();
