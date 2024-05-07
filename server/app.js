const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const Connection = require("./database/db.js");

const userRegister = require("./route/UserRoute.js");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

Connection(MONGO_URL);

app.use(cors());
app.use(express.json());
app.use("/user", userRegister);

app.listen(PORT, () => {
  console.log("listening to PORT: ", PORT);
});
