const API = `http://13.115.230.29:3000`;
const token = localStorage.getItem("token");
//global varibale
const username = localStorage.getItem("name");
const h1 = document.getElementById("h1");
h1.innerHTML = username;
async function CreateGroup(event) {
  try {
    event.preventDefault();

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
  } catch (e) {
    console.log(e);
  }
}
