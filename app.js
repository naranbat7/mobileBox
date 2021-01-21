require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Router

const adminRouter = require("./api/admin/admin.router");
const userRouter = require("./api/user/user.router");

app.use("/images", express.static(__dirname + "/images"));
app.use("/api", adminRouter, userRouter);

app.listen(process.env.APP_PORT, () => {
  console.log("server up and running on port: ", process.env.APP_PORT);
});
