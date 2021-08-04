let messagesToBePrinted = [];

function getMessages() {
  
  const response = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");

  response.then((messages) => {
    messagesToBePrinted = messages.data;
    printMessages();
  });
}

function printMessages() {

  const ulChat = document.querySelector("ul");
  ulChat.innerHTML = ""

  messagesToBePrinted.forEach((message) => {
    if (message.type === "status") {
      ulChat.innerHTML += `
        <li class="message in-out">
          ${message.text};
        </li>
      `
    } else if (message.type === "message") {
      ulChat.innerHTML += `
        <li class="message">
          ${message.text};
        </li>
    `
    } else 
    ulChat.innerHTML += `
      <li class="message reserved">
        ${message.text};
      </li>
    `
  })
}

getMessages();