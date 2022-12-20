const API = `http://localhost:3000`;
async function login(event) {
  try {
    event.preventDefault();
    const email = event.target.email.value;
    const password = event.target.password.value;
    if (email == "" || password == "") {
      return alert("please fill the details");
    }
    const obj = { email, password };
    const res = await axios.post(`${API}/user/login`, obj);
    localStorage.setItem("token", res.data.token);
    alert(`${res.data.msg}`);
    window.location.replace("chatPage.html");
  } catch (e) {
    alert(`${e.response.data.msg}`);
  }
}
