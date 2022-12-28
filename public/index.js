const API = `http://localhost:3000`;
//const API = `http://13.115.230.29:3000`;
async function login(event) {
  try {
    event.preventDefault();
    console.log("hi");
    const email = event.target.email.value;
    const password = event.target.password.value;
    if (email == "" || password == "") {
      return alert("please fill the details");
    }
    const obj = { email, password };
    const res = await axios.post(`${API}/user/login`, obj);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("name", res.data.name);
    alert(`${res.data.msg}`);
    window.location.replace("home.html");
  } catch (e) {
    alert(`${e.response.data.msg}`);
  }
}
