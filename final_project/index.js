const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use('/customer', session({secret:'fingerprint_customer', resave:true, saveUninitialized:true}));

app.use('/customer/auth/*', function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  const sessionAuth = req.session.authorization;
  const token = authHeader ? authHeader.split(' ')[1] : sessionAuth ? sessionAuth.accessToken : null;
  if (!token) {
    return res.status(401).json({message:'Authorization required'});
  }
  try {
    const data = jwt.verify(token, 'access');
    req.user = data;
    next();
  } catch (error) {
    return res.status(401).json({message:'Invalid or expired token'});
  }
});
 
const PORT = 5000;

app.use('/customer', customer_routes);
app.use('/', genl_routes);

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION -', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
});

app.listen(PORT, () => console.log('Server is running on port ' + PORT));
