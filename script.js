let messagesToBePrinted = [];
let username;

function getMessages() {
  let response = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");

  response.then((messages) => {
    messagesToBePrinted = messages.data;
    printMessages();
  });
}

function printMessages() {

  const ulChat = document.querySelector("ul");
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
    } else 
    ulChat.innerHTML += `
      <li class="message reserved">
        <p class="time">(${message.time})</p>
        <strong class="sender">${message.from}</strong>
        <p>reservadamente para </p> 
        <strong class="receiver">${message.to}:</strong>
        <p class="text">${message.text}</p>
      </li>
    `
  })

  ulChat.lastElementChild.scrollIntoView();
}

function enterRoomErrors(error) {
  const statusCode = error.response.status;
  
  if(statusCode === 400) {
    alert("Já há um usuário online com esse nome! Por favor insira outro nome");
    enterRoom();
  }
}

function enterRoom() {
  username = prompt("Informe seu lindo nome: ");

  const objRequest =  {
    name: username
  }

  axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/participants", objRequest).then(getMessages).catch(enterRoomErrors);
}

function keepUserLoggedIn() {
  const objRequest = {
    name: username
  }

  axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/status", objRequest).then(console.log("usuário ainda ta logado!!!")).catch((erro) => {
    console.log(erro.message);
  });
}

function sendMessage() {
  const messageText = document.querySelector(".message-text").value;
  
  const objRequest = {
    from: username,
    to: "Todos",
    text: messageText,
    type: "message"
  }

  axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages", objRequest).then(getMessages).catch(() => {
    window.location.reload();
  })
}

function showSideMenu() {
  document.querySelector(".hidden-menu").classList.toggle("show-menu");
}

document.addEventListener("keypress", (e) => {

  if(e.key === "Enter") {
    const sendBtn = document.querySelector(".send-btn");

    sendBtn.click();
    document.querySelector(".message-text").value = "";
  }
})



enterRoom();

keepUserLoggedIn();
setInterval(keepUserLoggedIn, 5000);
setInterval(getMessages, 3000);