function* makeId(_id) {
  let id = _id;
  while (true) {
    yield id++;
  }
}


const lastCoord = 1;

const id = makeId(lastCoord);

export class Coords {
  constructor(left, top, circle) {
    this.left = left;
    this.top = top;
    this.circle = circle;
    this.id = id.next().value;
    this.data = {
      img: "",
      name: "",
      price: 0,
    };
  }
  drawCircle(block, coordinates) {
    const circle = document.createElement("div");
    circle.setAttribute("data-id", this.id);
    circle.style.width = this.circle + "px";
    circle.style.height = this.circle + "px";
    circle.style.left = this.left + "%";
    circle.style.top = this.top + "%";
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
        drawProduct(this, coordinates, circle);
      } else {
        circle.querySelector(".fly-div").remove();
        e.target.classList.add("active");
      }
    });
    block.appendChild(circle);
  }
}

export function drawProduct(data, coordinates, circle) {
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
    <div class="img-block" style="user-select": none;>
      <label for="fileUpload">
        <img src="./img/no_img.webp" class="noImg"/>
      </label>
      <input type="file" style="display: none;" class="img" placeholder="File" id="fileUpload"/>
    </div>
    <select name="product_connect" id="product_id_${data.id}"></select>
    <input type="text" class="name" placeholder="Position" id="position_id_${data.id}" />
    <input type="text" class="name" value="${data.data.name}" placeholder="Name" id="name_id_${data.id}" />
		<input type="text" class="price" value="${data.data.price}" placeholder="Price" id="price_id_${data.id}" />
    <input type="text" class="price" value="${""}" placeholder="price" placeholder="Articulate" id="articulate_id_${data.id}" />
    <select name="active" id="active_id_${data.id}"></select>
    <div class="btn-group">
      <button class="edit" id="edit_product" id-data-edit="${data.id}">Edit</button>
      <button class="delete">Delete</button>
    </div>
  `;

  const imgInp = flyDiv.querySelector(".img");
  const nameInp = flyDiv.querySelector(".name");
  const priceInp = flyDiv.querySelector(".price");
  const editBtn = flyDiv.querySelector(".edit");
  const deleteBtn = flyDiv.querySelector(".delete");

  let file = "";

  nameInp.addEventListener("change", (e) => {
    data.data.name = e.target.value;
  });

  priceInp.addEventListener("change", (e) => {
    data.data.price = e.target.value;
  });

  editBtn.addEventListener("click", () => {
    data.data.name = nameInp.value;
    data.data.price = priceInp.value;
    const formData = new FormData();
    formData.append("img", file);
    data.data.img = formData;
    drawTable(coordinates);

  });

  imgInp.addEventListener("change", (ev) => {
    if (ev.target.files && ev.target.files[0]) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        const img = flyDiv.querySelector("img");
        img.src = e.target.result;
      };
      fileReader.readAsDataURL(ev.target.files[0]);
    }
  });

  deleteBtn.addEventListener("click", () => {
    const index = coordinates.findIndex((val) => val.id == data.id);
    coordinates.splice(index, 1);
    circle.remove();

    drawTable(coordinates);
  });

  circle.appendChild(flyDiv);

  const y = flyDiv.getBoundingClientRect().top + window.scrollY;
  window.scroll({
    top: y,
    behavior: "smooth",
  });
}

export function drawTable(coordinates) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";
  coordinates.forEach((coord) => {
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
            >${coord.data.name}</a
          >
        </td>
        <td>${coord.data.price} ₽</td>
      </tr>
    `;
  });
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
}

export function circleHover() {
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