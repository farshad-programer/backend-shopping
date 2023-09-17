import jwt from "jsonwebtoken";

const verifyJWT = (req, res, next) => {
 
  const authHeader = req.headers.Authorization || req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.sendStatus(401).json({ message: "Unauthorized" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);

    req.user = decoded.userInfo.email;
    req.roles = decoded.userInfo.roles;

    next();
  });
};

export default verifyJWT;
