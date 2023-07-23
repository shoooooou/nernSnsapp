const express = require("express");
const app = express();
const PORT = 3000;
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");
const mongoose = require("mongoose");
require("dotenv").config();

//DB接続
mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("DBと接続中・・");
  })
  .catch(() => {
    console.error("DB接続エラー");
  });

//ミドルウェア
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postsRoute);

app.get("/", (req, res) => {
  res.send("hello express");
});

app.listen(PORT, () => console.log("サーバーが起動しました"));
