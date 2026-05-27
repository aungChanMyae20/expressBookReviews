const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({message:'Username and password are required'});
  }
  if (!isValid(username)) {
    return res.status(400).json({message:'Invalid username'});
  }
  if (users.some(user => user.username === username)) {
    return res.status(409).json({message:'User already exists'});
  }
  users.push({username, password});
  return res.status(201).json({message:'User successfully registered'});
});

public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }
  return res.status(404).json({message:'Book not found'});
});
  
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const matched = Object.entries(books)
    .filter(([, book]) => book.author.toLowerCase().includes(author))
    .map(([isbn, book]) => ({isbn, ...book}));
  if (matched.length) {
    return res.status(200).json(matched);
  }
  return res.status(404).json({message:'No books found by author'});
});

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const matched = Object.entries(books)
    .filter(([, book]) => book.title.toLowerCase().includes(title))
    .map(([isbn, book]) => ({isbn, ...book}));
  if (matched.length) {
    return res.status(200).json(matched);
  }
  return res.status(404).json({message:'No books found by title'});
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message:'Book not found'});
});

module.exports.general = public_users;
