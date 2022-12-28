const express = require("express");
const sequelize = require("./util/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const userRoutes = require("./routes/user");

const groupRoutes = require("./routes/group");

//const imgRoutes = require("./routes/imgUpload");

const User = require("./models/user");
const Chat = require("./models/chat");
const Group = require("./models/group");
const UserGroup = require("./models/user-group");

const app = express();
app.use(cors());
app.use(bodyParser.json());
var CronJob = require("cron").CronJob;

var job = new CronJob(
  "5 4 * * *",
  async function () {
    var Sequelize = require("sequelize");
    try {
      await sequelize
        //.query("CREATE TABLE chatArchive as SELECT * FROM chats;", {
        .query("insert into chatArchive  SELECT * FROM chats;", {
          type: Sequelize.QueryTypes.SELECT,
        });
    } catch (e) {
      console.log(e);
    }
  },
  null,
  true,
  "America/Los_Angeles"
);

app.use("/user", userRoutes);

app.use("/user", groupRoutes);
//app.use(image);

app.use((req, res) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

User.hasMany(Chat); // one to many relation
Chat.belongsTo(User);

Group.hasMany(Chat); //one to many relation
Chat.belongsTo(User);

// user belongsTo many Groups through userGroup
// group belongsto many user through userGroup
// many to many relationship
// we can aslo write like hasMany and belongs many pretty much same thing
User.belongsToMany(Group, { through: UserGroup });
Group.belongsToMany(User, { through: UserGroup });

sequelize
  //.sync({ force: true })
  .sync()
  .then((res) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
