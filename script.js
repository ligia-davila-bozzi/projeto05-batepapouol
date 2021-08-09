let messagesToBePrinted = [];
let usersOnline = [];
let username;
let loadingID;

function enterRoomErrors(error) {
  const statusCode = error.response.status;
  
  if(statusCode === 400) {
    alert("Nome já em uso! Por favor, insira um nome diferente");
  }
}

function enterRoom() {
  username = document.querySelector(".username").value;
  loading();

  const objRequest =  {
    name: username
  }

  axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", objRequest)
      .then(() => {     
        clearInterval(loadingID);
        document.querySelector(".loggin-screen").classList.add("hidden");
        document.querySelector("div.container").classList.remove("hidden");
        document.querySelector(".hidde-menu").classList.remove("hidden");
        getMessages();
      })
      .catch(enterRoomErrors);
}

function keepUserLoggedIn() {
  const objRequest = {
    name: username
  }

  axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", objRequest)
      .catch(windowReload);
}

function getMessages() {

  axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages")
    .then((messages) => {
    messagesToBePrinted = messages.data;
    printMessages();
  });
}

function printMessages() {

  const ulChat = document.querySelector(".chat");
  ulChat.innerHTML = "";
  
  messagesToBePrinted.forEach((message) => {
    if (message.type === "status") {
      ulChat.innerHTML += `
        <li class="message in-out">
          <p class="time">(${message.time})</p> 
          <strong class="sender">${message.from}</strong> 
          <p class="text">${message.text}</p>
        </li>
      `
    } else if (message.type === "message") {
      ulChat.innerHTML += `
        <li class="message">
          <p class="time">(${message.time})</p>
          <strong class="sender">${message.from}</strong>
          <p>para </p> 
          <strong class="receiver">${message.to}:</strong>
          <p class="text">${message.text}</p>
        </li>
    `
    } else if (message.type === "private_message" && (message.to === username || message.from === username) ) {
      ulChat.innerHTML += `
        <li class="message reserved">
          <p class="time">(${message.time})</p>
          <strong class="sender">${message.from}</strong>
          <p>reservadamente para </p> 
          <strong class="receiver">${message.to}:</strong>
          <p class="text">${message.text}</p>
        </li>
    `
    }
  })

  ulChat.lastElementChild.scrollIntoView();
}

function sendMessage() {
  const messageText = document.querySelector(".message-text").value;
  const receiver = document.querySelector(".name").innerHTML;

  let visibility = "message"
  
  if (document.querySelector(".visi").innerHTML === "(Reservado)") {
    visibility = "private_message";
  }

  const objRequest = {
    from: username,
    to: receiver,
    text: messageText,
    type: visibility
  }

  axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", objRequest)
      .then(getMessages)
      .catch(windowReload);

  document.querySelector(".message-text").value = "";
}

function showSideMenu() {
  document.querySelector(".side-menu").classList.toggle("show-menu");
  document.querySelector(".film").classList.toggle("hidden");
  getOnlineUsers();
  setInterval(getOnlineUsers, 10000);
}

function getOnlineUsers() {

  axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants")
      .then((users) => {
        usersOnline = users.data;
        printOnlineUsers()
      });
}

function printOnlineUsers() {

  const ulUsers = document.querySelector(".contacts-online");
  ulUsers.innerHTML = `
    <li class="user" onclick="selectReceiverAndVisibilityOfMessage(this)">
      <div class="left">
        <img src="./assets/persons.svg" />
        <p>Todos</p>
      </div>
      <ion-icon name="checkmark-sharp" class="checkmark hidden"></ion-icon> 
    </li>
  `;

  usersOnline.forEach((user) => {
    ulUsers.innerHTML += `
    <li class="user" onclick="selectReceiverAndVisibilityOfMessage(this)">
      <div class="left">
        <img src="./assets/usericon.svg" />
        <p class="user-field">${user.name}</p>
      </div>
      <ion-icon name="checkmark-sharp" class="checkmark hidden"></ion-icon> 
    </li>
  `
  })
}

function selectReceiverAndVisibilityOfMessage(element) {

  if(element.classList.contains("user")) {
    document.querySelectorAll(".checkmark").forEach((checkmark) => {
      checkmark.classList.add("hidden");
    });
  
    element.querySelector("ion-icon").classList.remove("hidden");

    document.querySelector(".name").innerHTML = element.querySelector("p").innerHTML;
  }

  if (element.classList.contains("visibility-option")) {
    document.querySelectorAll(".checkmark-v").forEach((checkmark) => {
      checkmark.classList.add("hidden");
    });

    element.querySelector("ion-icon").classList.remove("hidden");

    document.querySelector(".visi").innerHTML = `(${element.querySelector("p").innerHTML})`;
  }
}

setInterval(keepUserLoggedIn, 5000);
setInterval(getMessages, 3000);

/* aux functions */
function windowReload() {
  window.location.reload();
}

function loading() {
  document.querySelector(".input-area").innerHTML = `
    <div class="input-area">
      <img src="./assets/loading.png" />
      <p>Entrando...</p>
  `
}

document.addEventListener("keypress", (e) => {

  if(e.key === "Enter") {
    const sendBtn = document.querySelector(".send-btn");

    sendBtn.click();
  }
})