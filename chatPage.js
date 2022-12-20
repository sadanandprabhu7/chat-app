const API = `http://localhost:3000`;
const token = localStorage.getItem("token");
//global varibale

window.addEventListener("DOMContentLoaded", async () => {
  const chat = await axios.get(`${API}/user/chats`, {
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
  const message = event.target.chat.value;
  const obj = {
    message,
  };
  const res = await axios.post(`${API}/user/msg`, obj, {
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

async function CreateGroup(event) {
  event.preventDefault();
  console.log("hi");
  const name = event.target.name.value;
  if (name == "") {
    alert("please enter group name");
  }
  const res = await axios.post(
    `${API}/user/createGroup`,
    {
      name,
    },
    { headers: { Authorization: token } }
  );
  alert(`${res.data.msg}`);
}

// async function getLink(groupId) {
//   const a = document.createElement("a");
//   let linkName = document.createTextNode("CopyInvitationLink");
//   a.appendChild(linkName);
//   // a.title = "copy invitation link";
//   a.href = `${groupId}`;
//   const link = document.getElementById("links");
//   link.append(a);
// }
