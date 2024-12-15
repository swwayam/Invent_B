import jwt from 'jsonwebtoken';
export var authenticateToken = function authenticateToken(req, res, next) {
  var authHeader = req.header('Authorization');
  var token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      error: 'Access denied, no token provided'
    });
  }
  try {
    var decoded = jwt.verify(token, process.env.API_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({
      error: 'Invalid token'
    });
  }
};