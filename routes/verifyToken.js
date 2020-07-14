const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("auth-token");
  // Check if auth token exists
  if (!token) return res.status(401).send("Access denied");
  else {
    // Verify auth token
    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      next();
    } catch (err) {
      res.status(400).send(err);
    }
  }
};
