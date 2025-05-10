const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"] || global.userToken;

  if (!token) {
    res.locals.role="guest";
    //return res.status(403).send("A token is required for authentication");
    return next();
  }
  try {
    const decoded = jwt.verify(token, process.env.BEARER_TOKEN);
    req.user = decoded;
    res.locals.user_id=req.user.id;
    res.locals.role=req.user.role;
    res.locals.name=req.user.name;
    return next();
  } 
  catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;