const API = `http://localhost:3000`;
const token = localStorage.getItem("token");
//gobal variable
window.addEventListener("DOMContentLoaded", async () => {
  const res = await axios.get(`${API}/user/allGroups`, {
    headers: { Authorization: token },
  });
  const tb = document.getElementById("tbofGroup");
  res.data.data.forEach((group) => {
    const tr = `<tr><td><button onclick=openGroup("${group.id}","${group.name}")>${group.name}</button></td></tr>`;
    tb.innerHTML = tb.innerHTML + tr;
  });
});

//after getting passing group id and name to open function
async function openGroup(groupId, groupName) {
  const res = await axios.post(
    `${API}/user/openGroup`,
    { groupId },
    {
      headers: { Authorization: token },
    }
  );

  const title = document.getElementById("nameofgroup");
  title.innerHTML = groupName;
  const tb = document.getElementById("groupstable");

  res.data.data.forEach((group) => {
    const tr = `<tr><th >${group.user.name}</th></tr>
          <tr><td>${group.chat}</td></tr>`; /// after clicking on particular group name displaying all chats of a group
    tb.innerHTML = tb.innerHTML + tr;
  });
  participants(groupId);
  showcontacts(groupId);
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
    let tr = `<tr><td>${name.name}</td></tr>`;
    namesNode.innerHTML += tr;
  });
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
  }
  const con = document.getElementById("contacts");
  contacts.data.data.forEach((user) => {
    const li = `<tr><td>${user.name}</td><td> <button onclick=addToGroup("${groupId}","${user.id}")>AddToGroup</button></td> </tr>`;
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
