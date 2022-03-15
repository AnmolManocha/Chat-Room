console.log({ location: window.location.origin });
const socket = io(window.location.origin);
var audio = new Audio("notification/ting.mp3");
const form = document.getElementById("sender");
const msgIn = document.getElementById("msgIn");
const msgContainer = document.querySelector(".container");

const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message");
  messageElement.classList.add(position);
  msgContainer.append(messageElement);
  if (position == 'left') audio.play();
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = msgIn.value;
  append(`You: ${message}`, 'right');
  socket.emit("send", message);
  msgIn.value = "";
});
const name = prompt("Enter your Name");
socket.emit('user-joined', name);

socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'left');
});

socket.on('receive', data => {
  append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
  append(`${name} has left the chat.`, 'left');
});
