const jwt = require('jsonwebtoken');

// Our Own Middleware
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Bearer token
    // invalid token - synchronous
    // try {
    //   var decoded = jwt.verify(token, 'secret_this_should_be_longer');
    // } catch(err) {
    //   // err
    // }
    jwt.verify(token, 'secret_this_should_be_longer');
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token Auth Failed!'});
  }
};
