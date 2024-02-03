import jwt from "jsonwebtoken";

export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // will be: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1]; //if authheader exist, then asssign it the token

  if (token == null) {
    return res.status(401).json({ error: "No Access Token" });
  }

  //user = { id: user._id }
  jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Access Token is invalid" });
    }
    req.user = user.id;
    next();
  });
};
