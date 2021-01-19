require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

// Router

const adminRouter = require("./api/admin/admin.router");

app.use("/api", adminRouter);

app.listen(process.env.APP_PORT, () => {
  console.log("server up and running on port: ", process.env.APP_PORT);
});
