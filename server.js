const express = require("express");
const app = express();
const PORT = 3000;
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postsRoute = require("./routes/posts");

//ミドルウェア
app.use("/", userRoute);
app.use("/auth", authRoute);
app.use("/posts", postsRoute);

app.listen(PORT, () => console.log("サーバーが起動しました"));
