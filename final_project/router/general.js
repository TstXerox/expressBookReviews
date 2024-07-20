const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const userswithSameUsernam = users.filter(user => user.username === usernama);
    if (userswithSameUsernam.length > 0) {
        return res.status(409).json({ message: "Username already exists" });
    } else {
        users.push({"username": username, "password": password});
        return res.status(200).json({ message: "User successfully registered. Now you can login" });
    }


});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    
    if (book) {
        res.send(book);
    } else {
        res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const isbns = Object.keys(books);
    let booksByAuthor = [];

    isbns.forEach(isbn => {
        if (books[isbn].author === author) {
            booksByAuthor.push(books[isbn]);
        }
    });

    if (booksByAuthor.length > 0) {
        res.send(JSON.stringify(booksByAuthor));
    } else {
        res.status(404).json({message: `No books found by author ${author}`});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const isbns = Object.keys(books);
    let booksByTitle = [];

    isbns.forEach(isbn => {
        if (books[isbn].title === title) {
            booksByTitle.push(books[isbn]);
        }
    });

    if (booksByTitle.length > 0) {
        res.send(JSON.stringify(booksByTitle));
    } else {
        res.status(404).json({message: `No books found by title ${title}`});
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.send(book.reviews);
    } else {
        res.status(404).json({message: `Book with ISBN ${isbn} not found`});
    }
});

module.exports.general = public_users;
