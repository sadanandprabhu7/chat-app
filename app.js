const express = require("express");

const sequelize = require("./util/database");

const bodyParser = require("body-parser");

const cors = require("cors");

const userRoutes = require("./routes/user");

const app = express();
app.use(cors());
app.use(bodyParser.json());
// app.post("/user/save", (req, res, next) => {
//   console.log(req.body.name);
// });
app.use("/user", userRoutes);

sequelize
  .sync()
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
