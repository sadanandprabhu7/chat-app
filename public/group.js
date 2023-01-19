const API = `http://localhost:3000`;
//const API = `http://13.115.230.29:3000`;
const token = localStorage.getItem("token");
//gobal variable
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await axios.get(`${API}/user/allGroups`, {
      headers: { Authorization: token },
    });
    const tb = document.getElementById("tbofGroup");
    res.data.data.forEach((group) => {
      const tr = `<tr><td><button onclick="openGroup('${group.id}','${group.name}')">${group.name}</button></td></tr>`;
      tb.innerHTML = tb.innerHTML + tr;
    });

    document.getElementById("myform").style.display = "none";
  } catch (e) {
    console.log(e);
  }
});

//after getting passing group id and name to open function
async function openGroup(groupId, groupName) {
  try {
    document.getElementById("myform").style.display = "block";
    document.getElementById("groupId").value = groupId;

    //setInterval(async () => {
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
    //}, 1000);
  } catch (e) {
    console.log(e);
  }
}
async function showChats(loggedInUser, groupId, groupName) {
  try {
    const chat = localStorage["message"];
    const newchat = JSON.parse(chat);

    const sortable = newchat.chatData.sort(function (a, b) {
      return a.id - b.id;
    });

    const title = document.getElementById("nameofgroup");
    title.innerHTML = groupName;
    const tb = document.getElementById("groupstable");
    tb.innerHTML = "";
    sortable.forEach((group) => {
      if (loggedInUser === group.user.id) {
        let tr;
        if (!group.image) {
          tr = `<tr><th >${"You"}</th></tr>
          <tr><td>${group.chat}</td></tr>`;
        } else {
          tr = `<tr><th >${"You"}</th></tr>
          <tr><td>${group.chat}</td></tr>
          <tr><td ><img src="${
            group.image
          }" alt="image" width="100" height="100"></td></tr>`;
        }
        /// after clicking on particular group name displaying all chats of a group
        tb.innerHTML = tb.innerHTML + tr;
      } else if (loggedInUser !== group.user.id) {
        let tr;
        if (!group.image) {
          tr = `<tr><th >${group.user.name}</th></tr>
          <tr><td>${group.chat}</td></tr>`;
        } else {
          tr = `<tr><th >${"You"}</th></tr>
          <tr><td>${group.chat}</td></tr>
          <tr><td ><img src="${
            group.image
          }" alt="image" width="100" height="100"></td></tr>`;
        }
        /// after clicking on particular group name displaying all chats of a group
        tb.innerHTML = tb.innerHTML + tr;
      }
    });
  } catch (e) {
    console.log(e);
  }
}

async function message(event) {
  try {
    event.preventDefault();
    const message = event.target.chat.value;
    const groupId = event.target.groupId.value;
    const obj = {
      message,
      groupId,
    };
    const res = await axios.post(`${API}/user/groupMsg`, obj, {
      headers: {
        Authorization: token,
      },
    });
    event.target.chat.value = "";
  } catch (e) {
    console.log(e);
  }
}
async function imageSend(event) {
  try {
    event.preventDefault();
    const groupId = document.getElementById("groupId").value;
    const file = document.getElementById("image").files[0];
    const formData = new FormData();
    formData.append("pic", file);
    formData.append("id", groupId);
    const res = await axios.post(`${API}/user/imageSend`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token,
      },
    });
    document.getElementById("image").value = "";
  } catch (e) {
    console.log(e);
  }
}
async function participants(groupId) {
  try {
    const res = await axios.post(
      `${API}/user/participants`,
      { groupId },
      {
        headers: { Authorization: token },
      }
    );

    const namesNode = document.getElementById("participants");
    namesNode.innerHTML = "";
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
  } catch (e) {
    console.log(e);
  }
}
async function removeFromGroup(userId, groupId) {
  try {
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
  } catch (e) {
    console.log(e);
  }
}
async function makeAdmin(userId, groupId) {
  try {
    const res = await axios.post(
      `${API}/user/makeAdmin`,
      { userId, groupId },
      {
        headers: { Authorization: token },
      }
    );
    alert(`${res.data.msg}`);
  } catch (e) {
    console.log(e);
  }
}
async function showcontacts(groupId) {
  try {
    const contacts = await axios.post(
      `${API}/user/contacts`,
      { groupId },
      {
        headers: { Authorization: token },
      }
    );
    if (contacts.status == 200 && contacts.data.data.length === 0) {
      const con = document.getElementById("contacts");
      con.innerHTML = "";
      con.innerHTML += `<tr><td>contact list is empty or already present in group </td></tr>`;
      return;
    }
    const con = document.getElementById("contacts");
    con.innerHTML = "";
    contacts.data.data.forEach((user) => {
      const li = `<tr id=${user.id}><td>${user.name}</td><td> <button onclick="addToGroup('${groupId}','${user.id}')">Add</button></td> </tr>`;
      con.innerHTML += li;
    });
  } catch (e) {
    console.log(e);
  }
}

async function addToGroup(groupId, userId) {
  try {
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

    if (res.data.success === true) {
      document.getElementById(`${userId}`).remove();
    }
    alert(`${res.data.msg}`);
  } catch (e) {
    console.log(e);
  }
}

async function groupExit(userId, groupId) {
  try {
    const res = await axios.post(
      `${API}/user/groupExit`,
      { userId, groupId },
      {
        headers: { Authorization: token },
      }
    );
    alert(`${res.data.msg}`);
  } catch (e) {
    console.log(e);
  }
}
