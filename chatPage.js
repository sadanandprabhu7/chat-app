window.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const chat = await axios.get(`http://localhost:3000/user/chats`, {
    headers: { Authorization: token },
  });

  showData(chat.data.data, chat.data.name);
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

function showData(chat, name) {
  let tb = document.getElementById("tb");
  chat.forEach((val) => {
    name.forEach((name) => {
      if (val.userId == name.id) {
        let newtr = `<tr><th>${name.name}</th></tr>
        <tr><td>${val.chat}</td></tr>`;
        tb.innerHTML = tb.innerHTML + newtr;
      }
    });
  });
}
