const { MongoClient } = require("mongodb");
const config = require("../config/constant");

async function connectDatabase(cb, next) {
  const client = new MongoClient(config.database.LOG);
  try {
    await client.connect();
    let db = client.db("log");

    _logModel = db.collection("auth_service_log");

    cb();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  connectDatabase,
};
