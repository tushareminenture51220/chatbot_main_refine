const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  let token = req.headers.authorization;
 // console.log(token);
  try {
    if (token) {
      token = token.split(" ")[1];

      let user = jwt.verify(token, process.env.SECRET_KEY);
      req.userId = user.id;
    } else {
      res.status(401).json({ messgae: "Unauthorized user" });
    }
    next();
  } catch (error) {
    res.status(401).json({ messgae: "Unauthorized user" });
  }
};

module.exports = auth;
