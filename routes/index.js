const userCommand = require("./user.js")

const event = [
    userCommand,
]
const controllers = {
    user : require("../controller/user.js"),
}

const middlewares = {
    authentication: controllers.user.userAuthentication,
}
const bindRouter =(app)=>{
    for(let i =0;i< event.length; i++){
        for(let j =0;j<event[i].length;j++){
            let {name, controller, method, api, middleware} = event[i][j]
            if (!name) {
                throw new NotImplementedException();
              }
            let _middlewares = [];
            middleware.map(e=>{
                _middlewares.push(middlewares[e])
            })
            if(typeof(controllers[controller]=="function")){
                app[method](api,..._middlewares,controllers[controller][name])
            }
        }
    }
}

module.exports={
    bindRouter,
}
