const ip_name = document.getElementById("name");
const ip_room = document.getElementById("room");
const btn_join = document.getElementById("btn_join");

const ip_message = document.getElementById("ip_message");
const btn_send = document.getElementById("btn_send");

const ul_message = document.getElementById("ul_message");

let socket = io.connect();

let my_name = "";
socket.on("connect", (data) => {
  console.log(data);
});

btn_join.addEventListener("click", () => {
  my_name = ip_name.value;
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
  if (message !== "") {
    const obj = {
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
  li.innerHTML = obj.message;

  if (obj.name === my_name) {
    li.classList.add("right");
  }

  ul_message.appendChild(li);

  ul_message.scrollTop = ul_message.scrollHeight;
});
