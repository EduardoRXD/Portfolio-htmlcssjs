const btn = document.querySelector(".imagetop");
const emojis = ["🍿", "💥", "✨", "🔥", "🎉", "🌟", "⚡", "🎈", "😀", "😎", "🥳"];

btn.addEventListener("click", function (e) {
  for (let i = 0; i < 4; i++) {
    const icon = document.createElement("div");
    icon.classList.add("click-icon");
    icon.innerText = emojis[Math.floor(Math.random() * emojis.length)];

    icon.style.left = `${e.pageX - 17}px`;
    icon.style.top = `${e.pageY - 17}px`;
    icon.style.position = "absolute";

    const direction = Math.random() < 0.5 ? Math.random() * -1 : Math.random();
    const offsetX = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 80;
    const offsetY = (Math.random() < 0.5 ? -1 : 1) * Math.random() * 80;
    const rotate = Math.floor(Math.random() * 360);

    icon.style.setProperty('--offset-x', `${offsetX}px`);
    icon.style.setProperty('--offset-y', `${offsetY}px`);
    icon.style.setProperty('--rotate', `${rotate}deg`);

    const duration = Math.floor(Math.random() * 2000 + 1000);
    setTimeout(() => {
      icon.remove();
    }, duration);

    document.body.appendChild(icon);
  }
});
