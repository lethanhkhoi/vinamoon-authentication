require("dotenv").config();

const loggerConstant = {
  LOG_DIR: "logs",
  DATE_PATTERN: "YYYY-MM-DD",
  MAX_FILES: "14d",
};

const config = {
  PORT: process.env.PORT || 3002,
  LOG_TOKEN: process.env.LOG_TOKEN,
};

const database = {
  BUS: process.env.DB_BUS,
  LOG: process.env.DB_LOG,
};

module.exports = {
  loggerConstant,
  config,
  database,
};
