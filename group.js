const API = `http://localhost:3000`;
const token = localStorage.getItem("token");
//gobal variable
window.addEventListener("DOMContentLoaded", async () => {
  const res = await axios.get(`${API}/user/allGroups`, {
    headers: { Authorization: token },
  });
  const tb = document.getElementById("tbofGroup");
  res.data.data.forEach((group) => {
    const tr = `<tr><td><button onclick="openGroup('${group.id}','${group.name}')">${group.name}</button></td></tr>`;
    tb.innerHTML = tb.innerHTML + tr;
  });

  document.getElementById("myform").style.display = "none";
});

//after getting passing group id and name to open function
async function openGroup(groupId, groupName) {
  document.getElementById("myform").style.display = "block";
  document.getElementById("groupId").value = groupId;
  const res = await axios.post(
    `${API}/user/openGroup`,
    { groupId },
    {
      headers: { Authorization: token },
    }
  );
  const loggedInUser = res.data.userId;
  const chatData = res.data.data;
  const chatObj = { chatData };
  localStorage.setItem("message", JSON.stringify(chatObj));

  showChats(loggedInUser, groupId, groupName);
  participants(groupId);
  showcontacts(groupId);
}
async function showChats(loggedInUser, groupId, groupName) {
  const chat = localStorage["message"];
  const newchat = JSON.parse(chat);

  const sortable = newchat.chatData.sort(function (a, b) {
    return a.id - b.id;
  });

  const title = document.getElementById("nameofgroup");
  title.innerHTML = groupName;
  const tb = document.getElementById("groupstable");
  sortable.forEach((group) => {
    if (loggedInUser === group.user.id) {
      const tr = `<tr><th >${"You"}</th></tr>
          <tr><td>${group.chat}</td></tr>`; /// after clicking on particular group name displaying all chats of a group
      tb.innerHTML = tb.innerHTML + tr;
    } else if (loggedInUser !== group.user.id) {
      const tr = `<tr><th >${group.user.name}</th></tr>
          <tr><td>${group.chat}</td></tr>`; /// after clicking on particular group name displaying all chats of a group
      tb.innerHTML = tb.innerHTML + tr;
    }
  });
}
async function message(event) {
  event.preventDefault();
  const message = event.target.chat.value;
  const groupId = event.target.id.value;
  const obj = {
    message,
    groupId,
  };
  const res = await axios.post(`${API}/user/msg`, obj, {
    headers: { Authorization: token },
  });
  // let tb = document.getElementById("tb");
  // tb.innerHTML += `<tr><th>${res.data.name}</th></tr>
  //       <tr><td>${res.data.data.chat}</td></tr>`;
  event.target.chat.value = "";
}
async function participants(groupId) {
  const res = await axios.post(
    `${API}/user/participants`,
    { groupId },
    {
      headers: { Authorization: token },
    }
  );

  const namesNode = document.getElementById("participants");
  res.data.data.forEach((name) => {
    res.data.admin.forEach((admin) => {
      if (name.id == admin.userId) {
        if (res.data.userId == name.id && admin.isAdmin == true) {
          const adminTitle = document.getElementById("groupExit");
          adminTitle.innerHTML = `<tr><td>${"Admin"} - ${
            name.name
          }</td><td><button onclick="groupExit('${
            name.id
          }','${groupId}')">Exit</button></td></tr>`;
        } else if (res.data.userId == name.id) {
          const member = document.getElementById("groupExit");
          member.innerHTML = `<tr><td>${name.name}</td><td><button onclick="groupExit('${name.id}','${groupId}')">Exit</button></td></tr>`;
        } else if (admin.isAdmin == true && res.data.userId !== name.id) {
          let tr = `<tr><td>${name.name}</td><td><button>Admin</button></td><td><button onclick="removeFromGroup('${name.id}','${groupId}')">Remove</button></td></tr>`;
          namesNode.innerHTML += tr;
        } else {
          let tr = `<tr><td>${name.name}</td><td><button onclick="removeFromGroup('${name.id}','${groupId}')">Remove</button></td><td><button onclick="makeAdmin('${name.id}','${groupId}')">MakeAdmin</button></td></tr>`;
          namesNode.innerHTML += tr;
        }
      }
    });
  });
}
async function removeFromGroup(userId, groupId) {
  const res = await axios.post(
    `${API}/user/removeFromGroup`,
    { groupId, userId },
    {
      headers: { Authorization: token },
    }
  );
  if (res.status == 200) {
    alert(`${res.data.msg}`);
  }
}
async function makeAdmin(userId, groupId) {
  const res = await axios.post(
    `${API}/user/makeAdmin`,
    { userId, groupId },
    {
      headers: { Authorization: token },
    }
  );
  alert(`${res.data.msg}`);
}
async function showcontacts(groupId) {
  const contacts = await axios.post(
    `${API}/user/contacts`,
    { groupId },
    {
      headers: { Authorization: token },
    }
  );
  if (contacts.status == 200 && contacts.data.data.length === 0) {
    const con = document.getElementById("contacts");
    con.innerHTML += `<tr><td>contact list is empty or already present in group </td></tr>`;
    return;
  }
  const con = document.getElementById("contacts");
  contacts.data.data.forEach((user) => {
    const li = `<tr><td>${user.name}</td><td> <button onclick="addToGroup('${groupId}','${user.id}')">Add</button></td> </tr>`;
    con.innerHTML += li;
  });
}

async function addToGroup(groupId, userId) {
  const res = await axios.post(
    `${API}/user/addToGroup`,
    {
      groupId,
      userId,
    },
    {
      headers: { Authorization: token },
    }
  );
  alert(`${res.data.msg}`);
}

async function groupExit(userId, groupId) {
  const res = await axios.post(
    `${API}/user/groupExit`,
    { userId, groupId },
    {
      headers: { Authorization: token },
    }
  );
  alert(`${res.data.msg}`);
}
