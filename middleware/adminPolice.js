const jwt = require("jsonwebtoken");
const config = require("config");
const { func } = require("joi");
const myJwt = require("../services/jwt-service");

module.exports = async function (req, res, next) {
  if (req.method == "OPTIONS") {
    next();
  }
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).json({
        message: "User not registered",
      });
    }

    console.log(authorization);
    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer != "Bearer" || !token) {
      return res.status(403).json({
        message: "User not registered (token berilmagan)",
      });
    }

    const [error, decodedToken] = await to(myJwt.verifyAccess(token));
    console.log(error);
    if (error) {
      return res.status(403).json({ message: error.message });
    }
    req.admin = decodedToken;
    console.log(decodedToken);
    if (decodedToken.is_active==true){
      next();
    }
    return res.status(500).send({
      message: "Admin aktiv emas",
    });
  } catch (e) {
    const message = e.message;
    console.log(e.message);
    return res.status(500).send({
      message: message,
    });
  }
};

async function to(promise) {
  return promise.then((response) => [null, response]).catch((error) => [error]);
}
