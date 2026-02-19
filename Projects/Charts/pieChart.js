(() => {
    let list = [
        { name: "this", number: 4, color: "#be5fc9" },
        { name: "is", number: 10, color: "#db4040" },
        { name: "test", number: 6, color: "#60d369" },
    ]

    const pieChart = (chart, list) => {
        const canvas = document.querySelector(chart);
        const ctx = canvas.getContext("2d");

        let maxRadius = 160;
        let sizeInput = document.querySelector(".panel3 .controls #size").value;
        const sizeMultiplier = sizeInput > 1 && sizeInput < 50 ? sizeInput / 10 : 1 / 10;
        maxRadius = maxRadius + maxRadius * sizeMultiplier;

        canvas.width = (maxRadius * 2 + 40 * 2) + 150;
        canvas.height = (maxRadius * 2 + 40 * 2);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2 - 80;
        const centerY = canvas.height / 2;

        let maxNumber = list?.reduce((acc, item) => acc + item.number, 0) ?? 0;
        let prev = 0;

        list.forEach((item, i) => {
            const percentage = item.number / maxNumber;
            const angle = 2 * Math.PI * percentage;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, maxRadius, prev, prev + angle);
            ctx.closePath();
            ctx.fillStyle = item.color;
            ctx.fill();

            const midAngle = prev + angle / 2;

            const textRadius = maxRadius / 1.5;
            const textX = centerX + Math.cos(midAngle) * textRadius;
            const textY = centerY + Math.sin(midAngle) * textRadius;

            ctx.fillStyle = "rgba(0, 0, 0, 1)";
            ctx.font = "16px Rubik";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(`${Math.round(percentage * 100)}%`, textX, textY);

            prev += angle;

            const cx = centerX + maxRadius + 50;
            const cy = (centerY - maxRadius + 50) + i * 30;

            ctx.beginPath();
            ctx.fillStyle = item.color;
            ctx.fillRect(cx, cy, 20, 20);

            ctx.strokeStyle = "#000000ff";
            ctx.lineWidth = 2;
            ctx.strokeRect(cx, cy, 20, 20);

            ctx.fillStyle = "#000";
            ctx.font = "16px Rubik";
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillText(item.name, cx + 30, cy + 10);
        });

    }

    function addList(item) {
        const container = document.createElement("div");
        container.className = "valueChart";

        const label = document.createElement("button");
        label.textContent = item.name;

        const numInput = document.createElement("input");
        numInput.type = "number";
        numInput.value = item.number;

        const colorInput = document.createElement("input");
        colorInput.type = "color";
        colorInput.value = item.color;

        label.addEventListener("click", () => {
            const index = list.findIndex(s => s.name === item.name && s.number === item.number);
            if (index !== -1) {
                list.splice(index, 1);
            }
            container.remove();
            pieChart(".panel3 .chart", list)
        });

        numInput.addEventListener("input", () => {
            item.number = parseInt(numInput.value) >= 0 ? parseInt(numInput.value) : 0;
            pieChart(".panel3 .chart", list);
        });

        colorInput.addEventListener("input", () => {
            item.color = colorInput.value;
            pieChart(".panel3 .chart", list);
        });

        const control = document.querySelector(".panel3 .controls .btns");

        container.appendChild(label);
        container.appendChild(colorInput);
        container.appendChild(numInput);
        control.appendChild(container);

        pieChart(".panel3 .chart", list);
    }

    list.forEach(item => {
        addList(item)
    });

    form = document.querySelector(".panel3 .insert")
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        function color() {
            const asdf = '0123456789ABCDEF';
            let c = '#';
            for (let i = 0; i < 6; i++) {
                c += asdf[Math.floor(Math.random() * 16)];
            }
            return c;
        }

        const input = document.querySelector(".panel3 .controls #string");
        const insert = { name: input.value, number: 5, color: color() };

        list.push(insert);
        addList(insert);
        form.reset();
    })

    document.querySelector(".panel3 .controls #size").addEventListener("input", () => {
        pieChart(".panel3 .chart", list);
    });
})();