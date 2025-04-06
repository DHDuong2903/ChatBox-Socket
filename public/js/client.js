const ip_room = document.getElementById("room");
const btn_join = document.getElementById("btn_join");

const ip_message = document.getElementById("ip_message");
const btn_send = document.getElementById("btn_send");

const ul_message = document.getElementById("ul_message");

let socket = io.connect();

let my_name = localStorage.getItem("username");

const emotions = [
  {
    id: 1,
    emotion: '<i class="fa-solid fa-heart" style="color: #ff0000"></i>',
  },
  {
    id: 2,
    emotion: '<i class="fa-solid fa-face-laugh-squint" style="color: #ffd43b"></i>',
  },
  {
    id: 3,
    emotion: '<i class="fa-solid fa-face-surprise" style="color: #ffd43b"></i>',
  },
  {
    id: 4,
    emotion: '<i class="fa-solid fa-face-sad-tear" style="color: #ffd43b"></i>',
  },
  {
    id: 5,
    emotion: '<i class="fa-solid fa-face-angry" style="color: #ffd43b"></i>',
  },
];

socket.on("connect", (data) => {
  console.log(data);
});

btn_join.addEventListener("click", () => {
  const room = ip_room.value;
  if (my_name && room) {
    socket.emit("join", room);
    alert(`${my_name} have joined room ${room}`);
  } else {
    alert("Please enter name and room");
  }
});

const sendMessage = () => {
  const message = ip_message.value.trim();
  const imageFile = ip_image?.files[0];
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += Math.floor(Math.random() * 10);
  }

  // Nếu có ảnh → gửi ảnh
  if (imageFile) {
    const formData = new FormData();
    formData.append("img", imageFile);
    fetch("/api/uploads", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((json) => {
        const obj = {
          id: +id,
          name: my_name,
          message: json.url, // là link ảnh
        };

        socket.emit("message", JSON.stringify(obj));
        img_message.style.display = "none";
        ip_image.value = ""; // Reset input file
      })
      .catch((error) => {
        console.log("call api loi", error);
      });
  }

  // Nếu có text → gửi text
  if (message !== "") {
    const obj = {
      id: +id + 1, // đảm bảo id khác với ảnh (tránh đụng nhau)
      name: my_name,
      message: message,
    };

    socket.emit("message", JSON.stringify(obj));
    ip_message.value = "";
    ip_message.focus();
  }
};

// Bắt sự kiện click nút gửi
btn_send.addEventListener("click", sendMessage);

// Bắt sự kiện nhấn phím Enter
ip_message.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

socket.on("thread", (data) => {
  const obj = JSON.parse(data);

  const li = document.createElement("li");
  li.innerHTML = `
    <span id=${obj.id}>
      ${
        obj.message.startsWith("https")
          ? `<p class="image-message"><img width="200px" padding=0px src="${obj.message}"></p>`
          : `<p class="text-message">${obj.message}</p>`
      }
    </span>
    <i onclick="show(event, ${obj.id})" class="choose_emotion fa-regular fa-face-smile"> </i>
  `;

  if (obj.name === my_name) {
    li.classList.add("right");
  }

  ul_message.appendChild(li);

  ul_message.scrollTop = ul_message.scrollHeight;
});

const show = (e, id) => {
  if (e.target.classList.contains("choose_emotion")) {
    if (e.target.innerHTML.toString().trim().length === 0) {
      e.target.innerHTML = `
    <div class="emotions">
      <i onclick="choose(event, ${id}, 1)" class="fa-solid fa-heart" style="color: #ff0000"></i>
      <i onclick="choose(event, ${id}, 2)" class="fa-solid fa-face-laugh-squint" style="color: #ffd43b"></i>
      <i onclick="choose(event, ${id}, 3)" class="fa-solid fa-face-surprise" style="color: #ffd43b"></i>
      <i onclick="choose(event, ${id}, 4)" class="fa-solid fa-face-sad-tear" style="color: #ffd43b"></i>
      <i onclick="choose(event, ${id}, 5)" class="fa-solid fa-face-angry" style="color: #ffd43b"></i>
    </div>
  `;
    }
  } else {
    e.target.innerHTML = "";
  }
};

const choose = (e, id, id_emotion) => {
  const span_message = document.getElementById(id + ""); // Bien tu number ve string

  span_message.style.position = "relative";

  const emotion = e.target;

  if (!emotion.classList.contains("fa-heart")) {
    emotion.style.backgroundColor = "#333";
  } else {
    emotion.style.backgroundColor = "transparent"; // Để nền trong suốt
  }

  emotion.style.position = "absolute";
  emotion.style.bottom = "-6px";
  emotion.style.right = "0px";
  emotion.style.borderRadius = "50%";

  span_message.appendChild(emotion);

  const obj = {
    id: id,
    emotion: id_emotion,
  };

  socket.emit("emotion", JSON.stringify(obj));
};

socket.on("emotion", (data) => {
  const obj = JSON.parse(data);
  const span_message = document.getElementById(obj.id + ""); // Bien tu number ve string

  span_message.style.position = "relative";

  let emotion = emotions[obj.emotion - 1].emotion;
  const div = document.createElement("div");
  div.innerHTML = emotion;
  emotion = div.firstChild;

  if (!emotion.classList.contains("fa-heart")) {
    emotion.style.backgroundColor = "#333";
  } else {
    emotion.style.backgroundColor = "transparent"; // Để nền trong suốt
  }

  emotion.style.position = "absolute";
  emotion.style.bottom = "-6px";
  emotion.style.right = "0px";
  emotion.style.borderRadius = "50%";

  span_message.appendChild(emotion);
});

const ip_image = document.getElementById("ip_image");
const img_message = document.getElementById("img_message");

document.getElementById("send_file_icon").addEventListener("click", () => {
  ip_image.click();
});

ip_image.addEventListener("change", () => {
  img_message.src = URL.createObjectURL(ip_image.files[0]);
  img_message.style.display = "block";
});
