const passport = require('passport');

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt');
};

exports.sanitizeUser = (user) => {
  return { id: user.id, role: user.role };
};

exports.cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  //TODO : this is temporary token for testing without cookie
  // token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YjRmN2YwNGVjYWQ0ZmUxYjcxMmM2ZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNjg5NTgxNTUyfQ.ekj11AOy6omwN9c5PTGyxPOIEppzkH3384mgr47s0Kw"
  return token;
};