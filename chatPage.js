window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  const chat = await axios.get(`http://localhost:3000/user/chats`, {
    headers: { Authorization: token },
  });

  const myName = chat.data.addName;
  console.log(myName);
  const chatData = chat.data.data;
  const userData = chat.data.name;
  const chatObj = { chatData };
  const userObj = { userData };
  localStorage.setItem("chat", JSON.stringify(chatObj));
  localStorage.setItem("names", JSON.stringify(userObj));

  setInterval(() => {
    fromlocal(myName);
  }, 1000);
});

async function message(event) {
  event.preventDefault();

  const token = localStorage.getItem("token");
  const message = event.target.chat.value;
  const obj = {
    message,
  };
  const res = await axios.post(`http://localhost:3000/user/msg`, obj, {
    headers: { Authorization: token },
  });
  let tb = document.getElementById("tb");
  tb.innerHTML += `<tr><th>${res.data.name}</th></tr>
        <tr><td>${res.data.data.chat}</td></tr>`;
  event.target.chat.value = "";
}

function fromlocal(myName) {
  const chat = localStorage["chat"];
  const name = localStorage["names"];
  const newchat = JSON.parse(chat);
  const newNames = JSON.parse(name);

  const sortable = newchat.chatData.sort(function (a, b) {
    return a.id - b.id;
  });

  let tb = document.getElementById("tb");
  tb.innerHTML = "";
  sortable.forEach((val) => {
    newNames.userData.forEach((name) => {
      if (val.userId == name.id) {
        let newtr = `<tr><th id="changeMe">${name.name}</th></tr>
          <tr><td>${val.chat}</td></tr>`;
        tb.innerHTML = tb.innerHTML + newtr;
      }
    });
  });
}
