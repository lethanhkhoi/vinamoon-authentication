const express = require("express");
const fs = require("fs")
const cors = require("cors");
const routerCustom = require("./routes/index.js");
const database = require("./utils/database");
const website = fs.readFileSync("view/index.html")
const morganMiddleware = require("./middlewares/morgan");
const { handleError } = require("./middlewares/errorHandler");
const logger = require("./logger/winston.js");
const { config } = require("./config/constant.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(morganMiddleware);
app.use(handleError);
database.connectDatabase(() => {
  logger.info("Database connected");
  console.log("connect success");
});

routerCustom.bindRouter(app);
app.use(express.static("./view"));

app.get("/*",(req,res)=>{
  res.send(website)
})

app.listen(config.PORT, function () {
  logger.info("Server is running", { port: config.PORT });
  console.log("Begin listen on port %s...", 3002);
});
module.exports = app;
