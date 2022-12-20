async function save(event) {
  event.preventDefault();
  const name = event.target.name.value;
  const email = event.target.email.value;
  const phone = event.target.number.value;
  const password = event.target.password.value;
  if (name == "" || email == "" || phone == "" || password == "") {
    alert("please fill details");
  }
  const obj = { name, email, phone, password };
  const response = await axios.post(`http://localhost:3000/user/save`, obj);
  alert(`${response.data.msg}`);
  event.target.name.value = "";
  event.target.email.value = "";
  event.target.number.value = "";
  event.target.password.value = "";

  console.log(response.data.msg);
}
