const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => username && username.trim().length > 0;

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

regd_users.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message:'Username and password are required'});
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({message:'Invalid credentials'});
  }
  const accessToken = jwt.sign({username}, 'access', {expiresIn:'1h'});
  req.session.authorization = {accessToken, username};
  return res.status(200).json({message:'User successfully logged in', token:accessToken});
});

regd_users.put('/auth/review/:isbn', (req, res) => {
  const username = req.user && req.user.username;
  const isbn = req.params.isbn;
  const review = req.body.review;
  if (!username) {
    return res.status(401).json({message:'User not authenticated'});
  }
  if (!isbn || !review) {
    return res.status(400).json({message:'ISBN and review are required'});
  }
  if (!books[isbn]) {
    return res.status(404).json({message:'Book not found'});
  }
  books[isbn].reviews[username] = review;
  return res.status(200).json({message:'Review added/updated', reviews:books[isbn].reviews});
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const username = req.user && req.user.username;
  const isbn = req.params.isbn;
  if (!username) {
    return res.status(401).json({message:'User not authenticated'});
  }
  if (!books[isbn]) {
    return res.status(404).json({message:'Book not found'});
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({message:'Review not found'});
  }
  delete books[isbn].reviews[username];
  return res.status(200).json({message:'Review deleted', reviews:books[isbn].reviews});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
