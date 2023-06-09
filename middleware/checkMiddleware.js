const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1] ||
  req.cookies.accessToken;
  
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({
      message: 'Forbidden',
    });
  }
};
