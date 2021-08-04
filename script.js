let messagesToBePrinted = [];

function getMessages() {
  let response = axios.get("https://mock-api.bootcamp.respondeai.com.br/api/v3/uol/messages");

  response.then((messages) => {
    messagesToBePrinted = messages.data;
    printMessages();
  });
}

function printMessages() {

  const ulChat = document.querySelector("ul");
  ulChat.innerHTML += "";

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

getMessages();

setInterval(getMessages, 3000);