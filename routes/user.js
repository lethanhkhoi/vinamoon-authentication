commands = [
  {
    name: "update",
    controller: "user",
    method: "patch",
    api: "/user/:code",
    middleware: [],
  },
  {
    name: "changePass",
    controller: "user",
    method: "patch",
    api: "/changepass/:code",
    middleware: [],
  },
  {
    name: "getAll",
    controller: "user",
    method: "get",
    api: "/user",
    middleware: [],
  },
  {
    name: "login",
    controller: "user",
    method: "post",
    api: "/login",
    middleware: [],
  },
  {
    name: "loginCallCenter",
    controller: "user",
    method: "post",
    api: "/login/center",
    middleware: [],
  },
  {
    name: "register",
    controller: "user",
    method: "post",
    api: "/register",
    middleware: [],
  },
  {
    name: "verify",
    controller: "user",
    method: "get",
    api: "/verify",
    middleware: [],
  },
  {
    name: "refreshToken",
    controller: "user",
    method: "post",
    api: "/token",
    middleware: [],
  },
];
module.exports = commands;
