const express = require("express");
const path = require('path');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

require("dotenv").config({ path: __dirname + "/config/.env" }); 

const app = express();
const port = process.env.PORT;

const indexRouter = require("./routes/index.route.js");
const loginRouter = require("./routes/login.route.js");
const logoutRouter = require("./routes/logout.route.js");
const forgotRouter = require("./routes/forgot.route.js");
const singupRouter = require("./routes/singup.route.js");
const userRouter = require("./routes/user.route.js");
const adminRouter = require("./routes/admin.route.js");
const wargameRouter = require("./routes/wargame.route.js");
const downloadRouter = require("./routes/download.route.js");
const errorRouter = require("./routes/error.route.js");

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../public/views'));

app.use(cookieParser(process.env.SECRET_key));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json({ limit: '10000mb' }));
app.use(express.urlencoded({ limit: '10000mb', extended: true }));

app.use("/", indexRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/forgot", forgotRouter);
app.use("/signup", singupRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/wargame", wargameRouter);
app.use("/download", downloadRouter);
app.use("/error", errorRouter);

app.use((req, res, next) => {
  res.status(404).send("<h1>404 Not Found</h1>");
});

app.use((req, res, next) => {
  res.status(500).send("<h1>500 Internal Server Error</h1>");
}); 

app.use((req, res, next) => {
  res.status(403).send("<h1>403 Forbidden</h1>");
});

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log(`server running success`);
});

