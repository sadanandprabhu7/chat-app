async function login(event) {
  event.preventDefault();
  const email = event.target.email.value;
  const password = event.target.password.value;
  if (email == "" || password == "") {
    return alert("please fill the details");
  }
  const obj = { email, password };
  const res = await axios.post(`http://localhost:3000/user/login`, obj);
  // console.log()
  alert(`${res.data.msg}`);
}
