const express = require("express");

const sequelize = require("./util/database");

const bodyParser = require("body-parser");

const cors = require("cors");

const userRoutes = require("./routes/user");
const User = require("./models/user");

const Chat = require("./models/chat");
const chatRoutes = require("./routes/chat");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/user", userRoutes);
app.use("/user", chatRoutes);

User.hasMany(Chat);
Chat.belongsTo(User);
sequelize
  //.sync({ force: true })
  .sync()
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
