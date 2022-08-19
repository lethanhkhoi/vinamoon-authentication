const userCol = require("../dataModel/userCol");
const database = require("../utils/database");
const jwt = require("../utils/token");
const bcrypt = require("bcrypt");
const moment = require("moment");
const saltRounds = 10;
const { ErrorHandler } = require("../middlewares/errorHandler");

async function getAll(req, res) {
  const data = await userCol.getAll();
  return res.json({ errorCode: null, data });
}
async function login(req, res, next) {
  try {
    const user = await database.userModel().findOne({ phone: req.body.phone });
    if (!user) {
      throw new ErrorHandler(401, "Account not found");
    }
    const checkPass = await bcrypt.compare(req.body.password, user.password);
    if (!checkPass) {
      throw new ErrorHandler(401, "Incorrect username or password");
    }
    if (!user.token) {
      const newToken = await jwt.createSecretKey({ phone: req.body.phone });
      user.refreshToken = newToken.refreshToken;
      await userCol.update(user.phone, user);
      user.token = newToken.token;
    }
    return res.json({ errorCode: null, data: user });
  } catch (err) {
    next(err);
  }
}
async function register(req, res) {
  const user = await database.userModel().findOne({ phone: req.body.phone });
  if (user) {
    return res.status(200).send({
      errorCode: true,
      exitCode: 1,
      data: "Account already exist",
    });
  }
  const checkPass = req.body.password == req.body.confirmPassword;
  if (!checkPass) {
    return res.status(200).send({
      errorCode: true,
      exitCode: 1,
      data: "Password not match",
    });
    // return res.json({ errorCode: true, data: "Confirm password sai" });
  }
  const password = await bcrypt.hash(req.body.password, saltRounds);
  const data = {
    password: password,
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
    gender: req.body.gender,
    birthday: req.body.birthday
      ? moment(req.body.birthday, "DD/MM/YYYY").utc().toDate()
      : null,
    refreshToken: null,
    role: req.body.role ? req.body.role : "user",
    vehicle:
      req.body.role === "driver"
        ? {
            id: req.body.vehicle?.id,
            no: req.body.vehicle?.number,
          }
        : null,
    createdAt: new Date(),
  };
  await userCol.create(data);
  if (!data.token) {
    const newToken = await jwt.createSecretKey({ phone: req.body.phone });
    data.token = newToken.token;
    data.refreshToken = newToken.refreshToken;
  }
  return res.json({ errorCode: null, data: data });
}

async function verify(req, res, next) {
  try {
    let token = req.headers["token"];
    if (!token) {
      throw new ErrorHandler(401, "Authentication fail. No token.");
    }

    try {
      var payload = await jwt.decodeToken(token);
    } catch (e) {
      return res.json({ errorCode: true, data: "Authen fail" });
    }
    if (!payload || !payload.phone) {
      throw new ErrorHandler(401, "Authentication fail. No payload/phone.");
    }

    let account = [];
    account = await database
      .userModel()
      .find({ phone: payload.phone })
      .toArray();

    if (account.length == 0 || account.length > 1) {
      throw new ErrorHandler(401, "Account not exist.");
    }
    account[0].token = token;

    return res.json({
      errCode: null,
      data: account[0],
    });
  } catch (error) {
    next(error);
  }
}

async function refreshToken(req, res, next) {
  try {
    let { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ErrorHandler(401, "No refresh token.");
    }
    var payload = await jwt.decodeRefreshToken(refreshToken);

    if (!payload || !payload.phone) {
      throw new ErrorHandler(401, "Authentication fail. No payload/phone.");
    }
    // if refresh token exists
    let account = [];
    account = await database
      .userModel()
      .find({ phone: payload.phone })
      .toArray();

    if (account.length == 0 || account.length > 1) {
      throw new ErrorHandler(401, "Account not exist.");
    }
    const newToken = await jwt.createSecretKey(
      { phone: account[0].phone },
      refreshToken
    );
    account[0].token = newToken.token;
    // update the token in the list
    return res.json({
      errCode: null,
      data: account[0],
    });
  } catch (e) {
    next(e);
  }
}

async function userAuthentication(req, res, next) {
  let token = req.headers["token"];

  if (!token) {
    throw new ErrorHandler(401, "Authentication fail. No token.");
  }

  try {
    var payload = await jwt.decodeToken(token);
  } catch (e) {
    next(e);
  }

  if (!payload) {
    throw new ErrorHandler(401, "Authentication fail. No payload.");
  }

  let account = [];
  account = await database.userModel().find({ email: payload }).toArray();

  if (account.length == 0 || account.length > 1) {
    throw new ErrorHandler(401, "Account not exist.");
  }

  req.user = (({ _id, email, firstName, lastName }) => ({
    _id,
    email,
    firstName,
    lastName,
  }))(account[0]);

  return next();
}
async function update(req, res) {
  try {
    const phone = req.params.code
    const data = req.body
    const result = await userCol.update(phone, data)
    if(!result){
      return res.json({errorCode: true, data: 'Update fail'}) 
    }
    return res.json({errorCode: null, data: result.value}) 
  } catch (error) {
    return res.json({errorCode: true, data: 'system error'}) 
  }
}
async function changePass(req, res) {
  try {
    const phone = req.params.code
    let data = req.body
    const password = await bcrypt.hash(req.body.password, saltRounds);
    data.password = password
    const result = await userCol.update(phone, data)
    if(!result){
      return res.json({errorCode: true, data: 'Update fail'}) 
    }
    return res.json({errorCode: null, data: result.value}) 
  } catch (error) {
    return res.json({errorCode: true, data: 'system error'}) 
  }
}
module.exports = {
  getAll,
  login,
  verify,
  register,
  refreshToken,
  userAuthentication,
  update,
  changePass
};
