(() => {

  const barChart = (chart, list) => {
    const canvas = document.querySelector(chart);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const RowInput = document.querySelector(".panel1 .controls #numberRow");
    let numberRows = RowInput.value > 5 ? RowInput.value : 5;

    const padding = 40;
    const offsetX = 32;
    const offsetY = 32;

    const baseColumns = 10;
    const extraColumns = list.length > 5 ? (list.length - 5) * 2 : 0;
    const totalColumns = baseColumns + extraColumns;

    canvas.width = padding * 2 + offsetX * totalColumns;
    canvas.height = padding * 2 + offsetY * numberRows;

    //VERTICAL
    for (let i = 1; i < totalColumns + 1; i++) {
      ctx.beginPath();
      ctx.moveTo(padding + i * offsetX, padding);
      ctx.lineTo(padding + i * offsetX, canvas.height - padding);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(190, 95, 201, 0.14)";

      ctx.stroke();
    };
    //HORIZONTAL
    for (let i = 0; i < numberRows; i++) {
      ctx.beginPath();
      ctx.moveTo(padding, padding + i * offsetY);
      ctx.lineTo(canvas.width - padding, padding + i * offsetY);
      ctx.strokeStyle = "rgba(190, 95, 201, 0.14)";
      ctx.stroke();

      const y = padding + i * offsetY;
      const x = padding - 15;
    }

    const numbers = list.map(item => item.number);
    const max = Math.max(...numbers);

    let maxInput = document.querySelector(".panel1 .controls #maxNumber").value ? document.querySelector(".panel1 .controls #maxNumber").value : 0;
    if (maxInput < max) {
      maxInput = max;
    }
    list.forEach((value, i) => {
      ctx.fillStyle = "rgba(190, 95, 201, 1)";
      ctx.fillRect(offsetX * (i * 2) + padding, canvas.height - padding, offsetX, -(numberRows * 32 / maxInput * value.number));

      const y = canvas.height - padding + 15;
      const x = (offsetX * (i * 2) + padding) + offsetX / 2;

      const maxCharsPerLine = 10;
      const lines = value.name.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g'));

      ctx.fillStyle = "#3d1242";
      ctx.font = "12px Rubik";
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      lines.forEach((line, j) => {
        const lineY = y + j * 14;
        ctx.fillText(line, x, lineY);
      });

      const yLinha = canvas.height - padding - (value.number * ((numberRows * 32) / maxInput));

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.moveTo(padding - 10, yLinha);
      ctx.lineTo(padding, yLinha);
      ctx.strokeStyle = "rgba(61, 18, 66, 1)";
      ctx.stroke();

      ctx.fillStyle = "#3d1242";
      ctx.font = "12px Rubik";
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      ctx.fillText(value.number, padding - 15, yLinha);
    })

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.strokeStyle = "rgba(61, 18, 66, 1)"
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(padding - 10, padding);
    ctx.lineTo(padding, padding);
    ctx.moveTo(padding - 10, canvas.height - padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.strokeStyle = "rgba(61, 18, 66, 1)"
    ctx.stroke()

    ctx.font = "12px Rubik";
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillText(0, padding - 15, canvas.height - padding);
    ctx.fillText(maxInput, padding - 15, padding);
  }

  let list = [
    { name: "this", number: 1 },
    { name: "is", number: 10 },
    { name: "test", number: 1 },
  ];

  function addList(item) {
    const container = document.createElement("div");
    container.className = "valueChart";

    const label = document.createElement("button");
    label.textContent = item.name;

    const numInput = document.createElement("input");
    numInput.type = "number";
    numInput.value = item.number;

    label.addEventListener("click", () => {
      const index = list.findIndex(s => s.name === item.name && s.number === item.number);
      if (index !== -1) {
        list.splice(index, 1);
      }
      container.remove();
      barChart(".panel1 .chart", list)
    });

    numInput.addEventListener("input", () => {
      item.number = parseInt(numInput.value) >= 0 ? parseInt(numInput.value) : 0;
      barChart(".panel1 .chart", list);
    });

    const control = document.querySelector(".panel1 .controls .btns");

    container.appendChild(label);
    container.appendChild(numInput);
    control.appendChild(container);

    barChart(".panel1 .chart", list);
  }

  form = document.querySelector(".panel1 .insert")
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.querySelector(".panel1 .controls #string");
    const insert = { name: input.value, number: 0 };

    list.push(insert);
    addList(insert);
    form.reset();
  })

  document.querySelector(".panel1 .controls #numberRow").addEventListener("input", () => {
    barChart(".panel1 .chart", list)
  })

  document.querySelector(".panel1 .controls #maxNumber").addEventListener("input", () => {
    barChart(".panel1 .chart", list)
  })

  list.forEach((item) => { addList(item) })

})();