const database = require("../utils/database");
async function getAll() {
  return await database.userModel().find().toArray();
}
async function create(data) {
  return await database.userModel().insertOne(data);
}
async function update(phone, data) {
  return await database.userModel().findOneAndUpdate({ phone },{ $set: data });
}
module.exports = {
  getAll,
  create,
  update,
};
