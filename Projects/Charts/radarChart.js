(() => {
    const list = [];
    const elements = [];
    canvas = document.querySelector(".panel2 .chart");
    ctx = canvas.getContext("2d");

    const radarChart = (chart, list) => {


        let maxRadius = 160;
        let sizeInput = document.querySelector(".panel2 .controls #size").value;
        const sizeMultiplier = sizeInput > 1 && sizeInput < 50 ? sizeInput / 10 : 1 / 10;
        maxRadius = maxRadius + maxRadius * sizeMultiplier;

        canvas.width = maxRadius * 2 + 40 * 2;
        canvas.height = maxRadius * 2 + 40 * 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        let RowInput = document.querySelector(".panel2 .controls #numberRow").value;
        const density = RowInput >= 3 && RowInput < 500 ? RowInput : 3;
        const angleStep = (2 * Math.PI) / list.length;
        const maxValue = density * 10;

        for (let level = 1; level <= density; level++) {
            const radius = (maxRadius / density) * level;
            ctx.beginPath();
            for (let i = 0; i < list.length; i++) {
                const angle = i * angleStep - Math.PI / 2;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.strokeStyle = "#b8b8b8ff";
            ctx.stroke();

            ctx.fillStyle = "rgba(82, 82, 82, 1)"
            ctx.font = "12px Rubik";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(level * 10, centerX, centerY - radius);
        }

        list.forEach((item, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const labelOffset = 20;
            const lineX = centerX + maxRadius * Math.cos(angle);
            const lineY = centerY + maxRadius * Math.sin(angle);

            const labelX = centerX + (maxRadius + labelOffset) * Math.cos(angle);
            const labelY = centerY + (maxRadius + labelOffset) * Math.sin(angle);


            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(lineX, lineY);
            ctx.strokeStyle = "#b8b8b8ff";
            ctx.stroke();

            ctx.fillStyle = "#3d1242";
            ctx.font = "14px Rubik";
            ctx.textAlign = "center";
            ctx.fillText(item.name, labelX, labelY);
        });

        elements.forEach((insert) => {
            const points = list.map((item, i) => {
                const angle = i * angleStep - Math.PI / 2;
                const value = insert.points[item.name] || 0;
                const clampedValue = Math.min(value, maxValue);
                const radius = (clampedValue / maxValue) * maxRadius;
                const x = centerX + radius * Math.cos(angle);
                const y = centerY + radius * Math.sin(angle);
                return { x, y };
            });

            ctx.beginPath();
            points.forEach((point, i) => {
                if (i === 0) {
                    ctx.moveTo(point.x, point.y);
                } else {
                    ctx.lineTo(point.x, point.y);
                }
            });
            ctx.closePath();
            ctx.strokeStyle = insert.color;
            ctx.fillStyle = insert.color + "55";
            ctx.stroke();
            ctx.fill();

            points.forEach((point) => {
                ctx.beginPath();
                ctx.arc(point.x, point.y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = insert.color;
                ctx.fill();
            });
        });
    };

    function syncElementsWithList() {
        elements.forEach((insert) => {
            Object.keys(insert.points).forEach((key) => {
                const stillExists = list.some(item => item.name === key);
                if (!stillExists && insert._inputs && insert._inputs[key]) {
                    insert._inputs[key].wrapper.remove();
                    delete insert.points[key];
                    delete insert._inputs[key];
                }
            });
        });
    }

    function trackListItem(item) {
        elements.forEach((insert) => {
            if (insert._inputs && insert._inputs[item.name]) return;

            const container = insert.container;

            const wrapper = document.createElement("div");
            wrapper.className = "attribute-input";

            const label = document.createElement("label");
            label.textContent = item.name;

            const input = document.createElement("input");
            input.type = "number";
            input.value = insert.points[item.name] || 0;

            wrapper.appendChild(label);
            wrapper.appendChild(input);
            container.appendChild(wrapper);

            insert.points[item.name] = insert.points[item.name] || 0;

            input.addEventListener("input", () => {
                const number = parseInt(input.value);
                insert.points[item.name] = isNaN(number) || number < 0 ? 0 : number;
                radarChart(".panel2 .chart", list);
            });

            if (!insert._inputs) insert._inputs = {};
            insert._inputs[item.name] = { wrapper, label, input };
        });
    }

    function addList(item) {
        const container = document.querySelector(".panel2 .controls .valueChart");

        const label = document.createElement("button");
        label.textContent = item.name;

        label.addEventListener("click", () => {
            const index = list.findIndex(s => s.name === item.name && s.number === item.number);
            if (index !== -1) {
                list.splice(index, 1);
            }
            label.remove();
            radarChart(".panel2 .chart", list);
            syncElementsWithList();
        });

        container.appendChild(label);
        radarChart(".panel2 .chart", list);
        trackListItem(item);
    }

    function addElement(element) {
        const insert = {
            name: element,
            color: "#be5fc9",
            points: element === "test"
                ? {
                    Speed: 20,
                    OOP: 13,
                    Libraries: 15,
                    Easy: 20,
                    Typing: 30
                }
                : {}
        };
        const container = document.createElement("div");
        container.className = "element";

        const header = document.createElement("div");
        header.className = "element-header";

        const label = document.createElement("button");
        label.textContent = element;

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = "#be5fc9";

        header.appendChild(label);
        header.appendChild(colorInput);

        const body = document.createElement("div");
        body.className = "element-body";

        container.appendChild(header);
        container.appendChild(body);

        const control = document.querySelector(".panel2 .elementsInsert");
        control.appendChild(container);

        colorInput.addEventListener("input", () => {
            insert.color = colorInput.value;
            radarChart(".panel2 .chart", list);
        });

        label.addEventListener("click", () => {
            const index = elements.indexOf(insert);
            if (index !== -1) {
                elements.splice(index, 1);
            }
            container.remove();
            radarChart(".panel2 .chart", list);
        });

        insert.container = body;
        elements.push(insert);

        list.forEach(trackListItem);
        radarChart(".panel2 .chart", list);
    }

    document.querySelector(".panel2 .insert").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.querySelector(".panel2 .insert #string");
        const insert = { name: input.value, number: 0 };

        list.push(insert);
        addList(insert);
        e.target.reset();
    });

    document.querySelector(".panel2 .left .elementsInsert .insert").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.querySelector(".panel2 .left .elementsInsert .insert #string");
        addElement(input.value);
        e.target.reset();
    });

    document.querySelector(".panel2 .controls #numberRow").addEventListener("input", () => {
        radarChart(".panel2 .chart", list);
    });

    document.querySelector(".panel2 .controls #size").addEventListener("input", () => {
        radarChart(".panel2 .chart", list);
    });

    const start = [
        { name: "Speed" },
        { name: "OOP" },
        { name: "Libraries" },
        { name: "Easy" },
        { name: "Typing" },
    ];

    start.forEach((item) => {
        list.push(item);
        addList(item);
    });

    radarChart(".panel2 .chart", list);
    addElement("test");
})();
