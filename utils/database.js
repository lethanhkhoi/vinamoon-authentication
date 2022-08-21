const { MongoClient } = require("mongodb");
const config = require("../config/constant");

let _userModel = null;
let _requestModel = null;
async function connectDatabase(cb, next) {
  const client = new MongoClient(config.database.BUS);
  try {
    await client.connect();
    let db = client.db("bus");

    // Authentication
    _userModel = db.collection("user");
    _requestModel = db.collection("request");

    cb();
  } catch (e) {
    next(e);
  }
}
// Authentication

const userModel = function () {
  if (_userModel == null) {
    throw new ErrorHandler(500, "log user table is null or undefined");
  } else {
    return _userModel;
  }
};

const requestModel = function () {
  if (_requestModel == null) {
    throw new ErrorHandler(500, "log request table is null or undefined");
  } else {
    return _requestModel;
  }
};

module.exports = {
  userModel,
  requestModel,
  connectDatabase,
};
